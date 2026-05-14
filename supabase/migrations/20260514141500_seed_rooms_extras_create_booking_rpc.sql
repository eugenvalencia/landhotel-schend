-- ============================================================
-- Seed Schend rooms + extras and add public.create_booking() RPC
-- so anonymous booking flow doesn't need an Edge Function deploy.
-- ============================================================

-- ---------- Seed rooms (UUIDs match Booking.tsx FALLBACK_ROOMS) ----------
INSERT INTO public.rooms (id, room_number, name, room_type, bed_description, max_persons, price_per_night, amenities, photos, status) VALUES
  ('d47bcebd-a254-4880-8952-72a2929d2520',  1, 'Zimmer 1',  'Einzelzimmer',              'Einzelbett',                          1,  65, '{}', '{}', 'aktiv'),
  ('6d45c8cb-d584-43b4-ad7b-4f54d7f4c8de',  2, 'Zimmer 2',  'Einzelzimmer',              'Einzelbett',                          1,  65, '{}', '{}', 'aktiv'),
  ('ade89315-160a-4211-b7ee-7dfbf4e7eeb3',  3, 'Zimmer 3',  'Einzelzimmer',              'Einzelbett',                          1,  65, '{}', '{}', 'aktiv'),
  ('8e3d91a0-0711-4cdf-a580-c2debb684d0c',  4, 'Zimmer 4',  'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('e288b28f-affb-4a18-b95e-991b28e15306',  5, 'Zimmer 5',  'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('b350d97f-8f76-4144-be97-6a2f18d69c6b',  6, 'Zimmer 6',  'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('cbdb5c64-5843-44e7-a802-da8b361ccb7a',  7, 'Zimmer 7',  'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('8ea5ebaa-2570-45c3-8340-112391ae422b',  8, 'Zimmer 8',  'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('a75e046c-6f0b-4ddc-bce6-77f5f4141644',  9, 'Zimmer 9',  'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('2f539adf-8c88-440f-8900-996ebbb764b8', 10, 'Zimmer 10', 'Doppelzimmer Standard',     'Doppelbett',                          2,  95, '{}', '{}', 'aktiv'),
  ('5af7abab-0811-4e14-9b71-923c3afafbeb', 11, 'Zimmer 11', 'Doppelzimmer Komfort',      'Doppelbett',                          2, 105, '{}', '{}', 'aktiv'),
  ('c219233b-4571-4196-a697-c49c3412d4b1', 12, 'Zimmer 12', 'Doppelzimmer Komfort',      'Doppelbett',                          2, 105, '{}', '{}', 'aktiv'),
  ('0e940352-a7a7-4d5d-890a-4db63ad9e2fc', 13, 'Zimmer 13', 'Doppelzimmer Komfort',      'Doppelbett',                          2, 105, '{}', '{}', 'aktiv'),
  ('05af9142-9a56-4583-a2de-c3e11cdd6380', 14, 'Zimmer 14', 'Doppelzimmer Komfort',      'Doppelbett',                          2, 105, '{}', '{}', 'aktiv'),
  ('dce1e187-c5fd-4649-950c-03d51236261c', 15, 'Zimmer 15', 'Doppelzimmer Komfort',      'Doppelbett',                          2, 105, '{}', '{}', 'aktiv'),
  ('e67d9828-126c-4700-b223-a3acb88ceb44', 16, 'Zimmer 16', 'Doppelzimmer Komfort',      'Doppelbett',                          2, 105, '{}', '{}', 'aktiv'),
  ('2dffe866-7b1a-42d5-8ea9-29c9f2975994', 17, 'Zimmer 17', 'Familienzimmer',            'Doppelbett und Schlafsofa',           4, 145, '{}', '{}', 'aktiv'),
  ('d1bd202f-eedf-45e9-be4c-18a43742ca12', 18, 'Zimmer 18', 'Familienzimmer',            'Doppelbett und Schlafsofa',           4, 145, '{}', '{}', 'aktiv'),
  ('ab65f06b-385c-4f6a-ad3c-5b9c4de47495', 19, 'Zimmer 19', 'Familienzimmer',            'Doppelbett und Schlafsofa',           4, 145, '{}', '{}', 'aktiv'),
  ('8460eb23-82ff-4280-a1f1-ca01f97733bd', 20, 'Junior Suite', 'Junior Suite',           'Doppelbett und Wohnbereich',          2, 165, '{}', '{}', 'aktiv'),
  ('06183ce9-3314-4f82-aab9-40e8c7d32d86', 21, 'Eifel-Suite',  'Suite',                  'Doppelbett und separater Wohnbereich',2, 195, '{}', '{}', 'aktiv')
ON CONFLICT (id) DO NOTHING;

-- ---------- Seed extras (UUIDs match Booking.tsx FALLBACK_EXTRAS) ----------
INSERT INTO public.extras (id, name, price, per_night, active, sort_order) VALUES
  ('2177e1d4-cb02-49d5-b1bb-ae995fd19d7a', 'Frühstück',      12, true,  true, 10),
  ('595b0d19-c04d-4c13-a44b-53c478baa9b3', 'Halbpension',    28, true,  true, 20),
  ('04801a2c-88db-418a-ac8a-177bf145912b', 'Fahrrad',        15, false, true, 30),
  ('3c738498-11a0-4b52-aa92-d7bfef4bdae1', 'Late Check-out', 20, false, true, 40),
  ('1d6b93b1-78aa-4fa7-8bde-a24600290d29', 'Früh Check-in',  20, false, true, 50),
  ('5744643a-c890-4195-bbe2-bd8100d64ed2', 'Haustier',       10, true,  true, 60)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- public.create_booking()
-- SECURITY DEFINER replacement for the create-booking Edge Function.
-- Validates inputs, checks room exists & is active, prevents overlap,
-- recomputes price server-side, inserts. Callable by `anon` role.
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_booking(
  p_room_id     UUID,
  p_check_in    DATE,
  p_check_out   DATE,
  p_guest_name  TEXT,
  p_guest_email TEXT,
  p_guest_phone TEXT,
  p_extras      UUID[] DEFAULT '{}',
  p_notes       TEXT   DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room       public.rooms%ROWTYPE;
  v_nights     INT;
  v_room_total NUMERIC := 0;
  v_extras_total NUMERIC := 0;
  v_total      NUMERIC := 0;
  v_booking_id UUID := gen_random_uuid();
  v_booking_number TEXT;
  v_extras_resolved JSONB := '[]'::JSONB;
  v_overlapping INT;
BEGIN
  -- ----- Input validation -----
  IF p_room_id IS NULL OR p_check_in IS NULL OR p_check_out IS NULL THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'missing required fields';
  END IF;
  IF p_check_in >= p_check_out THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'check_out must be after check_in';
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

  -- ----- Room exists + active -----
  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id;
  IF NOT FOUND OR v_room.status <> 'aktiv' THEN
    RAISE EXCEPTION 'Room not available';
  END IF;

  -- ----- Overlap check (excluding cancelled) -----
  SELECT COUNT(*) INTO v_overlapping FROM public.bookings
   WHERE room_id = p_room_id
     AND payment_status <> 'cancelled'
     AND check_in < p_check_out
     AND check_out > p_check_in;
  IF v_overlapping > 0 THEN
    RAISE EXCEPTION 'Room not available' USING HINT = 'overlap';
  END IF;

  -- ----- Recompute pricing server-side -----
  v_room_total := v_room.price_per_night * v_nights;

  IF array_length(p_extras, 1) > 0 THEN
    SELECT
      COALESCE(SUM(CASE WHEN e.per_night THEN e.price * v_nights ELSE e.price END), 0),
      COALESCE(jsonb_agg(jsonb_build_object(
        'id', e.id,
        'name', e.name,
        'price', e.price,
        'per_night', e.per_night
      )), '[]'::JSONB)
    INTO v_extras_total, v_extras_resolved
    FROM public.extras e
    WHERE e.id = ANY(p_extras) AND e.active = true;
  END IF;

  v_total := v_room_total + v_extras_total;

  -- ----- Booking number: LSC + 8 digits from timestamp -----
  v_booking_number := 'LSC' || RIGHT(EXTRACT(EPOCH FROM clock_timestamp())::BIGINT::TEXT, 8);

  -- ----- Insert -----
  INSERT INTO public.bookings (
    id, booking_number, room_id, guest_name, guest_email, guest_phone,
    check_in, check_out, total_price, extras, notes,
    booking_type, payment_status
  ) VALUES (
    v_booking_id, v_booking_number, p_room_id, TRIM(p_guest_name), p_guest_email, p_guest_phone,
    p_check_in, p_check_out, v_total, v_extras_resolved, NULLIF(LEFT(p_notes, 2000), ''),
    'online', 'pending'
  );

  RETURN jsonb_build_object(
    'booking_number', v_booking_number,
    'total_price',    v_total,
    'room_total',     v_room_total,
    'extras_total',   v_extras_total,
    'nights',         v_nights,
    'extras',         v_extras_resolved
  );
END;
$$;

-- Allow the anonymous (public) Supabase role to call the RPC.
GRANT EXECUTE ON FUNCTION public.create_booking(UUID, DATE, DATE, TEXT, TEXT, TEXT, UUID[], TEXT) TO anon, authenticated;
