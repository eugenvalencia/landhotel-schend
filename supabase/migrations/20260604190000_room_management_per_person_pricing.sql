-- ============================================================
-- Zimmer-Verwaltung + Pro-Person-Preise — 2026-06-04
-- ------------------------------------------------------------
-- Eugen-Direktive: Das Hotel verwaltet Zimmer (Name + Preis) selbst im SaaS,
-- jederzeit änderbar. Schends echtes Preismodell:
--   Doppelzimmer        57 € pro Person/Nacht
--   Doppelzimmer Einzel 80 € pro Nacht (Einzelbelegung)
--   Familienzimmer      170 € pro Nacht (pro Zimmer, nicht pro Person)
--
-- Dafür braucht jedes Zimmer einen PREIS-MODUS und die Buchung die PERSONEN-Zahl.
-- Rein additiv. create_booking wird konsolidiert (alte Signatur gedroppt).
-- ============================================================

-- ---------- 1. rooms: Preis-Modus ----------
-- price_per_person=true  -> price_per_night gilt PRO PERSON (z. B. Doppelzimmer 57 €)
-- price_per_person=false -> price_per_night gilt PRO ZIMMER (z. B. Familienzimmer 170 €)
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS price_per_person BOOLEAN NOT NULL DEFAULT false;

-- Optionaler Sonderpreis bei Einzelbelegung (1 Person). NULL = kein Sonderpreis.
-- Bei Doppelzimmer-Einzelnutzung z. B. 80 € (statt 1× 57 €).
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS single_use_price NUMERIC(10,2);

COMMENT ON COLUMN public.rooms.price_per_person IS
  'true: price_per_night gilt pro Person (×Personen); false: pro Zimmer (pauschal).';
COMMENT ON COLUMN public.rooms.single_use_price IS
  'Optionaler Pauschalpreis/Nacht bei Einzelbelegung (1 Person). NULL = kein Sonderpreis.';

-- ---------- 2. bookings: Personen-Zahl ----------
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS persons INT NOT NULL DEFAULT 1
  CHECK (persons >= 1 AND persons <= 20);

COMMENT ON COLUMN public.bookings.persons IS
  'Anzahl Gäste — treibt die Pro-Person-Preisberechnung und die max_persons-Prüfung.';

-- ---------- 3. create_booking() mit Personen + Preis-Modus ----------
DROP FUNCTION IF EXISTS public.create_booking(uuid, date, date, text, text, text, uuid[], text, text, text);

CREATE OR REPLACE FUNCTION public.create_booking(
  p_room_id            UUID,
  p_check_in           DATE,
  p_check_out          DATE,
  p_guest_name         TEXT,
  p_guest_email        TEXT,
  p_guest_phone        TEXT,
  p_extras             UUID[] DEFAULT '{}',
  p_notes              TEXT   DEFAULT NULL,
  p_preferred_language TEXT   DEFAULT NULL,
  p_source             TEXT   DEFAULT 'Direkt',
  p_persons            INT    DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room            public.rooms%ROWTYPE;
  v_nights          INT;
  v_persons         INT;
  v_rate_per_night  NUMERIC := 0;
  v_room_total      NUMERIC := 0;
  v_extras_total    NUMERIC := 0;
  v_total           NUMERIC := 0;
  v_booking_id      UUID := gen_random_uuid();
  v_booking_number  TEXT;
  v_extras_resolved JSONB := '[]'::JSONB;
  v_overlapping     INT;
  v_lang            TEXT;
  v_source          TEXT;
BEGIN
  -- ----- Input-Validation -----
  IF p_room_id IS NULL OR p_check_in IS NULL OR p_check_out IS NULL THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'missing required fields';
  END IF;
  IF p_check_in >= p_check_out THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'check_out must be after check_in';
  END IF;
  IF p_check_in < current_date THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'check_in in past';
  END IF;
  IF COALESCE(TRIM(p_guest_name), '') = '' OR LENGTH(p_guest_name) > 120 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_name';
  END IF;
  IF p_guest_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR LENGTH(p_guest_email) > 255 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_email';
  END IF;
  IF COALESCE(TRIM(p_guest_phone), '') = '' OR LENGTH(p_guest_phone) < 5 OR LENGTH(p_guest_phone) > 40 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_phone';
  END IF;

  v_nights := (p_check_out - p_check_in)::INT;
  IF v_nights <= 0 OR v_nights > 60 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'nights out of range';
  END IF;

  -- ----- preferred_language normalisieren -----
  v_lang := lower(COALESCE(p_preferred_language, ''));
  IF v_lang NOT IN ('de', 'en', 'fr', 'nl') THEN
    v_lang := NULL;
  END IF;

  -- ----- source normalisieren (Whitelist statt Freitext aus dem Web) -----
  v_source := COALESCE(NULLIF(TRIM(p_source), ''), 'Direkt');
  IF LENGTH(v_source) > 40 THEN
    v_source := LEFT(v_source, 40);
  END IF;

  -- ----- Room laden (inkl. tenant_id) -----
  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id;
  IF NOT FOUND OR v_room.status <> 'aktiv' THEN
    RAISE EXCEPTION 'Room not available';
  END IF;

  -- ----- Personen validieren (gegen Zimmer-Kapazität) -----
  v_persons := GREATEST(COALESCE(p_persons, 1), 1);
  IF v_persons > v_room.max_persons THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'too many persons for room';
  END IF;

  -- ----- Overlap-Check (tentativer Hold: auch angefragte/pending Buchungen blocken) -----
  SELECT COUNT(*) INTO v_overlapping FROM public.bookings
   WHERE room_id = p_room_id
     AND payment_status <> 'cancelled'
     AND check_in < p_check_out
     AND check_out > p_check_in;
  IF v_overlapping > 0 THEN
    RAISE EXCEPTION 'Room not available' USING HINT = 'overlap';
  END IF;

  -- ----- Zimmerpreis server-seitig nach Preis-Modus berechnen (Anti-Manipulation) -----
  --   1 Person + Sonderpreis Einzelbelegung -> single_use_price (pauschal/Nacht)
  --   sonst pro Person                       -> price_per_night × Personen
  --   sonst                                  -> price_per_night (pauschal/Zimmer)
  IF v_persons = 1 AND v_room.single_use_price IS NOT NULL THEN
    v_rate_per_night := v_room.single_use_price;
  ELSIF v_room.price_per_person THEN
    v_rate_per_night := v_room.price_per_night * v_persons;
  ELSE
    v_rate_per_night := v_room.price_per_night;
  END IF;
  v_room_total := v_rate_per_night * v_nights;

  IF array_length(p_extras, 1) > 0 THEN
    SELECT
      COALESCE(SUM(CASE WHEN e.per_night THEN e.price * v_nights ELSE e.price END), 0),
      COALESCE(jsonb_agg(jsonb_build_object(
        'id', e.id, 'name', e.name, 'price', e.price, 'per_night', e.per_night
      )), '[]'::JSONB)
    INTO v_extras_total, v_extras_resolved
    FROM public.extras e
    WHERE e.id = ANY(p_extras) AND e.active = true AND e.tenant_id = v_room.tenant_id;
  END IF;

  v_total := v_room_total + v_extras_total;
  v_booking_number := 'LSC' || RIGHT(EXTRACT(EPOCH FROM clock_timestamp())::BIGINT::TEXT, 8);

  INSERT INTO public.bookings (
    id, tenant_id, booking_number, room_id, guest_name, guest_email, guest_phone,
    check_in, check_out, persons, total_price, extras, notes,
    booking_type, payment_status, request_status, source, preferred_language
  ) VALUES (
    v_booking_id, v_room.tenant_id, v_booking_number, p_room_id,
    TRIM(p_guest_name), p_guest_email, p_guest_phone,
    p_check_in, p_check_out, v_persons, v_total, v_extras_resolved,
    NULLIF(LEFT(p_notes, 2000), ''),
    'online', 'pending', 'angefragt', v_source, v_lang
  );

  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (
    v_room.tenant_id, NULL, 'anon',
    'booking.request', 'booking', v_booking_id,
    jsonb_build_object('booking_number', v_booking_number, 'total_price', v_total,
                       'nights', v_nights, 'persons', v_persons, 'source', v_source)
  );

  RETURN jsonb_build_object(
    'success',        true,
    'booking_id',     v_booking_id,
    'booking_number', v_booking_number,
    'total_price',    v_total,
    'room_total',     v_room_total,
    'extras_total',   v_extras_total,
    'nights',         v_nights,
    'persons',        v_persons,
    'extras',         v_extras_resolved,
    'request_status', 'angefragt',
    'source',         v_source,
    'preferred_language', v_lang
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.create_booking(UUID, DATE, DATE, TEXT, TEXT, TEXT, UUID[], TEXT, TEXT, TEXT, INT)
  TO anon, authenticated;
