-- ============================================================
-- Rezeptions-Board: Direktbuchung-RPC + Zimmer-Auffüllung — 2026-06-04
-- ------------------------------------------------------------
-- Eugen-Idee: Im Zimmer-Tab den Live-Status sehen und bei Anruf direkt buchen.
--
-- Direkte INSERTs in bookings sind per RLS gesperrt (die Policy "Anyone can
-- create bookings" wurde in 20260502132149 entfernt; es gibt KEINE INSERT-Policy
-- mehr). Schreiben geht nur über SECURITY-DEFINER-RPCs. Darum:
--   create_internal_booking() — vom Hotel angelegte (bestätigte) Buchung.
-- Gleiche Preis-Logik wie create_booking (pro Person / Einzelbelegung / pro Zimmer).
-- Fixt nebenbei die latente Kalender-Schnellbuchung (die direkt insertete).
--
-- Plus: Zimmer-Bestand auf die echten 21 auffüllen (16 -> 21, neue Doppelzimmer).
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_internal_booking(
  p_room_id     UUID,
  p_guest_name  TEXT,
  p_guest_phone TEXT,
  p_check_in    DATE,
  p_check_out   DATE,
  p_persons     INT  DEFAULT 1,
  p_notes       TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room       public.rooms%ROWTYPE;
  v_nights     INT;
  v_persons    INT;
  v_rate       NUMERIC := 0;
  v_total      NUMERIC := 0;
  v_id         UUID := gen_random_uuid();
  v_num        TEXT;
  v_overlap    INT;
BEGIN
  IF p_room_id IS NULL OR p_check_in IS NULL OR p_check_out IS NULL OR p_check_in >= p_check_out THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'dates';
  END IF;
  IF COALESCE(TRIM(p_guest_name), '') = '' OR LENGTH(p_guest_name) > 120 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_name';
  END IF;

  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'room not found';
  END IF;

  -- Authz: Caller muss Mitglied des Tenants sein (oder Conexa-Operator)
  IF NOT (
    public.is_conexa_operator()
    OR v_room.tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  v_nights := (p_check_out - p_check_in)::INT;
  IF v_nights <= 0 OR v_nights > 60 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'nights';
  END IF;

  v_persons := GREATEST(COALESCE(p_persons, 1), 1);
  IF v_persons > v_room.max_persons THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'too many persons';
  END IF;

  SELECT COUNT(*) INTO v_overlap FROM public.bookings
   WHERE room_id = p_room_id
     AND payment_status <> 'cancelled'
     AND check_in < p_check_out
     AND check_out > p_check_in;
  IF v_overlap > 0 THEN
    RAISE EXCEPTION 'Room not available' USING HINT = 'overlap';
  END IF;

  -- Preis nach Zimmer-Modus (identisch zu create_booking)
  IF v_persons = 1 AND v_room.single_use_price IS NOT NULL THEN
    v_rate := v_room.single_use_price;
  ELSIF v_room.price_per_person THEN
    v_rate := v_room.price_per_night * v_persons;
  ELSE
    v_rate := v_room.price_per_night;
  END IF;
  v_total := v_rate * v_nights;

  v_num := 'LSC' || RIGHT(EXTRACT(EPOCH FROM clock_timestamp())::BIGINT::TEXT, 8);

  -- Vom Hotel angelegt -> sofort bestätigt; Zahlung vor Ort (pending).
  INSERT INTO public.bookings (
    id, tenant_id, booking_number, room_id, guest_name, guest_phone,
    check_in, check_out, persons, total_price, notes,
    booking_type, payment_status, request_status, source
  ) VALUES (
    v_id, v_room.tenant_id, v_num, p_room_id, TRIM(p_guest_name), NULLIF(TRIM(p_guest_phone), ''),
    p_check_in, p_check_out, v_persons, v_total, NULLIF(LEFT(p_notes, 2000), ''),
    'intern', 'pending', 'bestaetigt', 'Direkt'
  );

  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (
    v_room.tenant_id, auth.uid(),
    CASE WHEN public.is_conexa_operator() THEN 'operator' ELSE 'admin' END,
    'booking.internal_create', 'booking', v_id,
    jsonb_build_object('booking_number', v_num, 'total_price', v_total, 'nights', v_nights, 'persons', v_persons)
  );

  RETURN jsonb_build_object(
    'success', true, 'booking_id', v_id, 'booking_number', v_num,
    'total_price', v_total, 'nights', v_nights, 'persons', v_persons
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.create_internal_booking(UUID, TEXT, TEXT, DATE, DATE, INT, TEXT)
  TO authenticated;

-- ---------- Zimmer-Bestand auf 21 auffüllen (neue Doppelzimmer 17–21) ----------
DO $$
DECLARE
  v_tenant UUID;
  v_n      INT;
BEGIN
  SELECT tenant_id INTO v_tenant FROM public.rooms ORDER BY room_number LIMIT 1;
  IF v_tenant IS NOT NULL THEN
    FOR v_n IN 17..21 LOOP
      INSERT INTO public.rooms (
        room_number, name, room_type, bed_description, max_persons,
        price_per_night, price_per_person, single_use_price, amenities, photos, status, tenant_id
      )
      SELECT v_n, 'Zimmer ' || v_n, 'Doppelzimmer', 'Doppelbett', 2,
             57, true, 80, '[]'::jsonb, '[]'::jsonb, 'aktiv', v_tenant
      WHERE NOT EXISTS (SELECT 1 FROM public.rooms WHERE room_number = v_n);
    END LOOP;
  END IF;
END $$;
