-- ============================================================
-- Stufe A — Anfrage-Modus + Quellen-Tracking (Direkt vs OTA)
-- ------------------------------------------------------------
-- Eugen-Direktive 2026-06-04: Schends echter Schmerz ist Refund-Betrug
-- (Buchung + Online-Zahlung -> Storno -> Rückzahlung auf FREMDES Konto).
-- Lösung Stufe A: KEINE Vorab-Zahlung (Geld fließt nie vorab -> Betrug
-- strukturell unmöglich) + Buchung kommt als ANFRAGE rein, die das Hotel
-- im Dashboard bestätigt (Schend behält Verfügbarkeits-Kontrolle).
-- Plus: jede Buchung trägt eine `source` (Direkt/Booking.com/…) damit
-- Schends Provisionsfrei-Versprechen endlich belegbar wird.
--
-- Diese Migration ist rein ADDITIV + konsolidierend:
--   1. Spalten `source` + `request_status` auf bookings (mit Backfill)
--   2. create_booking() konsolidiert zu EINER korrekten Version
--      (die beiden kaputten Overloads werden vorher gedroppt)
--   3. set_booking_request_status() — Hotel bestätigt/lehnt Anfragen ab
-- ============================================================

-- ---------- 1. Neue Spalten ----------
-- source: Akquisitions-Kanal. Default 'Direkt' weil die Web-Engine
-- ausschließlich Direktbuchungen erzeugt. OTA-Importe tragen 'Booking.com' etc.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'Direkt';

-- request_status: Anfrage-Lebenszyklus, ORTHOGONAL zu payment_status (Geld).
--   angefragt  = Gast hat angefragt, Hotel hat noch nicht bestätigt
--   bestaetigt = Hotel hat die Anfrage bestätigt
--   abgelehnt  = Hotel hat abgelehnt (gibt den Kalender wieder frei)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS request_status TEXT NOT NULL DEFAULT 'angefragt'
  CHECK (request_status IN ('angefragt', 'bestaetigt', 'abgelehnt'));

-- preferred_language: in manchen DB-Ständen fehlt die Spalte (frühere Migration
-- 20260520160000 evtl. nie angewendet). Selbst-tragend nachziehen, damit
-- create_booking() sie zuverlässig füllen kann.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS preferred_language TEXT
  CHECK (preferred_language IS NULL OR preferred_language IN ('de', 'en', 'fr', 'nl'));

COMMENT ON COLUMN public.bookings.source IS
  'Akquisitions-Kanal der Buchung (Direkt, Booking.com, Airbnb, …). Treibt die Provisionsfrei-Auswertung.';
COMMENT ON COLUMN public.bookings.request_status IS
  'Anfrage-Lebenszyklus (angefragt/bestaetigt/abgelehnt) — orthogonal zu payment_status. Anfrage-Modus: jede neue Buchung startet als angefragt.';

-- Backfill: bestehende (historische) Buchungen gelten als bereits bestätigt
-- und als Direkt-Akquise — sie stammen aus der Zeit vor dem Anfrage-Flow.
UPDATE public.bookings SET request_status = 'bestaetigt' WHERE request_status = 'angefragt';

CREATE INDEX IF NOT EXISTS idx_bookings_request_status ON public.bookings(request_status);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON public.bookings(source);

-- ---------- 2. create_booking() konsolidieren ----------
-- Es existierten zwei widersprüchliche Overloads:
--   (a) multitenant_foundation: p_extras UUID[]   — korrekt, aber ohne source/lang/Anfrage
--   (b) preferred_language:     p_extras jsonb     — KAPUTT: kein tenant_id (NOT NULL!),
--       booking_type='direct' (nicht im Enum), Extras werden ignoriert, dünner Return
-- Beide werden gedroppt, danach existiert genau EINE korrekte Funktion.
DROP FUNCTION IF EXISTS public.create_booking(uuid, date, date, text, text, text, uuid[], text);
DROP FUNCTION IF EXISTS public.create_booking(uuid, date, date, text, text, text, jsonb, text, text);

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
  p_source             TEXT   DEFAULT 'Direkt'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room            public.rooms%ROWTYPE;
  v_nights          INT;
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

  -- ----- Overlap-Check (tentativer Hold: auch angefragte/pending Buchungen blocken) -----
  SELECT COUNT(*) INTO v_overlapping FROM public.bookings
   WHERE room_id = p_room_id
     AND payment_status <> 'cancelled'
     AND check_in < p_check_out
     AND check_out > p_check_in;
  IF v_overlapping > 0 THEN
    RAISE EXCEPTION 'Room not available' USING HINT = 'overlap';
  END IF;

  -- ----- Preise server-seitig neu berechnen (Anti-Manipulation) -----
  v_room_total := v_room.price_per_night * v_nights;

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

  -- ----- Insert: Anfrage-Modus -----
  --   payment_status='pending' (zahlbar vor Ort, KEINE Online-Zahlung)
  --   request_status='angefragt' (Hotel bestätigt im Dashboard)
  --   booking_type='online' (Kanal = Web-Formular; valider Enum-Wert)
  --   source (Direkt/OTA) für die Provisionsfrei-Auswertung
  INSERT INTO public.bookings (
    id, tenant_id, booking_number, room_id, guest_name, guest_email, guest_phone,
    check_in, check_out, total_price, extras, notes,
    booking_type, payment_status, request_status, source, preferred_language
  ) VALUES (
    v_booking_id, v_room.tenant_id, v_booking_number, p_room_id,
    TRIM(p_guest_name), p_guest_email, p_guest_phone,
    p_check_in, p_check_out, v_total, v_extras_resolved,
    NULLIF(LEFT(p_notes, 2000), ''),
    'online', 'pending', 'angefragt', v_source, v_lang
  );

  -- ----- Audit-Log -----
  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (
    v_room.tenant_id, NULL, 'anon',
    'booking.request', 'booking', v_booking_id,
    jsonb_build_object('booking_number', v_booking_number, 'total_price', v_total,
                       'nights', v_nights, 'source', v_source)
  );

  -- Return-Shape, den Booking.tsx erwartet (room_total/extras_total/extras inkl.)
  RETURN jsonb_build_object(
    'success',        true,
    'booking_id',     v_booking_id,
    'booking_number', v_booking_number,
    'total_price',    v_total,
    'room_total',     v_room_total,
    'extras_total',   v_extras_total,
    'nights',         v_nights,
    'extras',         v_extras_resolved,
    'request_status', 'angefragt',
    'source',         v_source,
    'preferred_language', v_lang
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.create_booking(UUID, DATE, DATE, TEXT, TEXT, TEXT, UUID[], TEXT, TEXT, TEXT)
  TO anon, authenticated;

-- ---------- 3. set_booking_request_status() ----------
-- Das Hotel bestätigt/lehnt eine Anfrage im Dashboard ab. SECURITY DEFINER
-- mit expliziter Tenant-Membership-Prüfung (kein Cross-Tenant-Zugriff).
-- Ablehnen gibt den Kalender frei (payment_status='cancelled').
CREATE OR REPLACE FUNCTION public.set_booking_request_status(
  p_booking_id UUID,
  p_status     TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant UUID;
  v_num    TEXT;
BEGIN
  IF p_status NOT IN ('angefragt', 'bestaetigt', 'abgelehnt') THEN
    RAISE EXCEPTION 'invalid status';
  END IF;

  SELECT tenant_id, booking_number INTO v_tenant, v_num
    FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking not found';
  END IF;

  -- Authz: Caller muss Mitglied des Tenants sein (oder Conexa-Operator)
  IF NOT (
    public.is_conexa_operator()
    OR v_tenant IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  UPDATE public.bookings SET request_status = p_status WHERE id = p_booking_id;

  -- Ablehnen storniert die Buchung -> Kalender wird wieder frei
  IF p_status = 'abgelehnt' THEN
    UPDATE public.bookings SET payment_status = 'cancelled' WHERE id = p_booking_id;
  END IF;

  -- Bestätigen -> verbindliche Gast-Mail über notify-schend (kind='confirmation').
  -- Async via pg_net, blockiert die Status-Änderung nicht; Fehler werden geschluckt.
  -- Setzt voraus: app.settings.supabase_url + app.settings.service_role_key
  -- sind in der Postgres-Config gesetzt (siehe 20260520150000_notify_on_booking_insert.sql).
  IF p_status = 'bestaetigt' THEN
    BEGIN
      PERFORM extensions.http_post(
        url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-schend',
        body := jsonb_build_object('booking_id', p_booking_id::text, 'kind', 'confirmation'),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        )
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'notify-schend confirmation call failed: %', sqlerrm;
    END;
  END IF;

  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (
    v_tenant, auth.uid(), 'admin',
    'booking.request_status', 'booking', p_booking_id,
    jsonb_build_object('status', p_status, 'booking_number', v_num)
  );

  RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_booking_request_status(UUID, TEXT) TO authenticated;
