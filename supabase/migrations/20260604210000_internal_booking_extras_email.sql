-- ============================================================
-- create_internal_booking: + E-Mail + Extras — 2026-06-05
-- ------------------------------------------------------------
-- Eugen-Idee: Telefon-Buchung am Board mit Zusatz-Optionen (Halbpension/Hund/…)
-- per Häkchen + automatischer Bestätigungs-Mail an den Gast.
-- Die 7-arg-Version (20260604200000) ist bereits live -> droppen + neu anlegen
-- mit zusätzlich p_guest_email + p_extras. Preis-Logik identisch zu create_booking.
-- ============================================================

DROP FUNCTION IF EXISTS public.create_internal_booking(uuid, text, text, date, date, int, text);

CREATE OR REPLACE FUNCTION public.create_internal_booking(
  p_room_id     UUID,
  p_guest_name  TEXT,
  p_guest_phone TEXT,
  p_guest_email TEXT,
  p_check_in    DATE,
  p_check_out   DATE,
  p_persons     INT  DEFAULT 1,
  p_extras      UUID[] DEFAULT '{}',
  p_notes       TEXT DEFAULT NULL
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
  v_rate            NUMERIC := 0;
  v_room_total      NUMERIC := 0;
  v_extras_total    NUMERIC := 0;
  v_total           NUMERIC := 0;
  v_id              UUID := gen_random_uuid();
  v_num             TEXT;
  v_overlap         INT;
  v_extras_resolved JSONB := '[]'::JSONB;
BEGIN
  IF p_room_id IS NULL OR p_check_in IS NULL OR p_check_out IS NULL OR p_check_in >= p_check_out THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'dates';
  END IF;
  IF COALESCE(TRIM(p_guest_name), '') = '' OR LENGTH(p_guest_name) > 120 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_name';
  END IF;
  -- E-Mail ist optional; wenn gesetzt, muss sie gültig sein.
  IF p_guest_email IS NOT NULL AND TRIM(p_guest_email) <> ''
     AND p_guest_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_email';
  END IF;

  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'room not found'; END IF;

  IF NOT (
    public.is_conexa_operator()
    OR v_room.tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  v_nights := (p_check_out - p_check_in)::INT;
  IF v_nights <= 0 OR v_nights > 60 THEN RAISE EXCEPTION 'Invalid request' USING HINT = 'nights'; END IF;
  v_persons := GREATEST(COALESCE(p_persons, 1), 1);
  IF v_persons > v_room.max_persons THEN RAISE EXCEPTION 'Invalid request' USING HINT = 'too many persons'; END IF;

  SELECT COUNT(*) INTO v_overlap FROM public.bookings
   WHERE room_id = p_room_id AND payment_status <> 'cancelled'
     AND check_in < p_check_out AND check_out > p_check_in;
  IF v_overlap > 0 THEN RAISE EXCEPTION 'Room not available' USING HINT = 'overlap'; END IF;

  IF v_persons = 1 AND v_room.single_use_price IS NOT NULL THEN v_rate := v_room.single_use_price;
  ELSIF v_room.price_per_person THEN v_rate := v_room.price_per_night * v_persons;
  ELSE v_rate := v_room.price_per_night; END IF;
  v_room_total := v_rate * v_nights;

  IF array_length(p_extras, 1) > 0 THEN
    SELECT
      COALESCE(SUM(CASE WHEN e.per_night THEN e.price * v_nights ELSE e.price END), 0),
      COALESCE(jsonb_agg(jsonb_build_object('id', e.id, 'name', e.name, 'price', e.price, 'per_night', e.per_night)), '[]'::JSONB)
    INTO v_extras_total, v_extras_resolved
    FROM public.extras e
    WHERE e.id = ANY(p_extras) AND e.active = true AND e.tenant_id = v_room.tenant_id;
  END IF;

  v_total := v_room_total + v_extras_total;
  v_num := 'LSC' || RIGHT(EXTRACT(EPOCH FROM clock_timestamp())::BIGINT::TEXT, 8);

  INSERT INTO public.bookings (
    id, tenant_id, booking_number, room_id, guest_name, guest_phone, guest_email,
    check_in, check_out, persons, total_price, extras, notes,
    booking_type, payment_status, request_status, source
  ) VALUES (
    v_id, v_room.tenant_id, v_num, p_room_id, TRIM(p_guest_name),
    NULLIF(TRIM(p_guest_phone), ''), NULLIF(TRIM(p_guest_email), ''),
    p_check_in, p_check_out, v_persons, v_total, v_extras_resolved, NULLIF(LEFT(p_notes, 2000), ''),
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
    'total_price', v_total, 'room_total', v_room_total, 'extras_total', v_extras_total,
    'nights', v_nights, 'persons', v_persons
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.create_internal_booking(UUID, TEXT, TEXT, TEXT, DATE, DATE, INT, UUID[], TEXT)
  TO authenticated;
