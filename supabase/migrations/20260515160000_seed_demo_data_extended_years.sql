-- ============================================================
-- Demo-Daten erweitern: 4 volle Jahre (2023, 2024, 2025) zusaetzlich.
-- Damit der Jahres-Vergleich auch wirklich Daten hat zum Vergleichen.
-- Saisonalitaet bleibt gleich, leichte Steigerung pro Jahr fuer
-- realistisches Wachstums-Muster.
-- ============================================================

DELETE FROM public.bookings WHERE booking_number LIKE 'LSC23-%' OR booking_number LIKE 'LSC24-%' OR booking_number LIKE 'LSC25-%';

DO $$
DECLARE
  v_tenant_id  UUID;
  v_guest_ids  UUID[];
  v_room       RECORD;
  v_d          DATE;
  v_year       INT;
  v_growth     NUMERIC;
  v_nights     INT;
  v_guest_idx  INT;
  v_guest_id   UUID;
  v_g_name     TEXT;
  v_g_email    TEXT;
  v_g_phone    TEXT;
  v_g_note     TEXT;
  v_check_in   DATE;
  v_check_out  DATE;
  v_total      NUMERIC;
  v_price      NUMERIC;
  v_month      INT;
  v_prob       NUMERIC;
  v_seq        INT := 1;
  v_bn         TEXT;
  v_status     TEXT;
  v_created    TIMESTAMPTZ;
  v_extras_choice INT;
  v_extras     JSONB;

  v_guest_names    TEXT[];
  v_guest_emails   TEXT[];
  v_guest_phones   TEXT[];
  v_guest_notes    TEXT[];

  v_starts DATE[] := ARRAY[DATE '2023-01-01', DATE '2024-01-01', DATE '2025-01-01'];
  v_ends   DATE[] := ARRAY[DATE '2023-12-31', DATE '2024-12-31', DATE '2025-05-31']; -- 2025-Jun wird schon vom anderen Seed abgedeckt
  v_year_growth NUMERIC[] := ARRAY[0.85, 0.92, 0.97]; -- 2023 leicht schwaecher, 2024 mittel, 2025 fast voll
  i INT;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'schend';

  -- Guest-IDs aus bestehender Tabelle laden (sind schon aus dem Haupt-Seed da)
  SELECT array_agg(id ORDER BY name) INTO v_guest_ids FROM public.guests WHERE tenant_id = v_tenant_id AND email LIKE '%@schend-demo.de';

  IF v_guest_ids IS NULL OR array_length(v_guest_ids, 1) < 10 THEN
    RAISE EXCEPTION 'Demo-Gaeste fehlen — bitte erst den Haupt-Seed laufen lassen';
  END IF;

  v_guest_names := ARRAY(SELECT name FROM public.guests WHERE tenant_id = v_tenant_id AND email LIKE '%@schend-demo.de' ORDER BY name);
  v_guest_emails := ARRAY(SELECT email FROM public.guests WHERE tenant_id = v_tenant_id AND email LIKE '%@schend-demo.de' ORDER BY name);
  v_guest_phones := ARRAY(SELECT COALESCE(phone, '') FROM public.guests WHERE tenant_id = v_tenant_id AND email LIKE '%@schend-demo.de' ORDER BY name);
  v_guest_notes  := ARRAY(SELECT COALESCE(notes, '') FROM public.guests WHERE tenant_id = v_tenant_id AND email LIKE '%@schend-demo.de' ORDER BY name);

  -- Drei Jahre durchlaufen
  FOR i IN 1..3 LOOP
    v_year := EXTRACT(YEAR FROM v_starts[i])::INT;
    v_growth := v_year_growth[i];

    FOR v_room IN SELECT id, price_per_night FROM public.rooms WHERE status='aktiv' AND tenant_id=v_tenant_id LOOP
      v_d := v_starts[i];
      v_price := v_room.price_per_night;

      WHILE v_d <= v_ends[i] LOOP
        v_month := EXTRACT(MONTH FROM v_d)::INT;

        v_prob := CASE v_month
          WHEN 1 THEN 0.20
          WHEN 2 THEN 0.25
          WHEN 3 THEN 0.30
          WHEN 4 THEN 0.40
          WHEN 5 THEN 0.50
          WHEN 6 THEN 0.55
          WHEN 7 THEN 0.65
          WHEN 8 THEN 0.65
          WHEN 9 THEN 0.50
          WHEN 10 THEN 0.45
          WHEN 11 THEN 0.25
          WHEN 12 THEN 0.40
          ELSE 0.30
        END * v_growth;

        IF EXTRACT(DOW FROM v_d) IN (5, 6) THEN v_prob := v_prob + 0.20; END IF;

        IF random() < v_prob THEN
          v_nights := CASE
            WHEN random() < 0.15 THEN 1
            WHEN random() < 0.55 THEN 2
            WHEN random() < 0.80 THEN 3
            WHEN random() < 0.92 THEN 4
            ELSE (5 + (random() * 3)::INT)
          END;

          v_check_in  := v_d;
          v_check_out := v_d + v_nights;

          v_guest_idx := 1 + (random() * (array_length(v_guest_ids, 1) - 1))::INT;
          v_guest_id := v_guest_ids[v_guest_idx];
          v_g_name   := v_guest_names[v_guest_idx];
          v_g_email  := v_guest_emails[v_guest_idx];
          v_g_phone  := v_guest_phones[v_guest_idx];
          v_g_note   := NULLIF(v_guest_notes[v_guest_idx], '');

          v_total := v_price * v_nights;

          v_extras_choice := (random() * 4)::INT;
          IF v_extras_choice = 0 THEN
            v_extras := jsonb_build_array(jsonb_build_object('name', 'Halbpension', 'price', 25, 'per_night', true, 'nights', v_nights));
            v_total := v_total + 25 * v_nights;
          ELSIF v_extras_choice = 1 THEN
            v_extras := jsonb_build_array(jsonb_build_object('name', 'Fruehstueck', 'price', 12, 'per_night', true, 'nights', v_nights));
            v_total := v_total + 12 * v_nights;
          ELSE
            v_extras := '[]'::jsonb;
          END IF;

          -- Alle vergangenen Buchungen: ueberwiegend paid
          v_status := CASE WHEN random() < 0.95 THEN 'paid' WHEN random() < 0.50 THEN 'refunded' ELSE 'cancelled' END;

          v_created := (v_check_in - (5 + (random() * 60)::INT))::timestamptz + INTERVAL '10 hours' + (random() * INTERVAL '8 hours');
          v_seq := v_seq + 1;
          v_bn := 'LSC' || RIGHT(v_year::TEXT, 2) || '-' || LPAD(v_seq::TEXT, 5, '0');

          BEGIN
            INSERT INTO public.bookings (
              id, tenant_id, booking_number, room_id, guest_id, guest_name, guest_email, guest_phone,
              check_in, check_out, total_price, extras, notes, booking_type, payment_status, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), v_tenant_id, v_bn, v_room.id, v_guest_id, v_g_name, v_g_email, v_g_phone,
              v_check_in, v_check_out, v_total, v_extras, v_g_note, 'online', v_status::payment_status, v_created, v_created
            );
          EXCEPTION WHEN OTHERS THEN
            NULL;
          END;

          v_d := v_check_out + (random() * 2)::INT;
        ELSE
          v_d := v_d + 1;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

DO $$
DECLARE
  total INT;
BEGIN
  SELECT COUNT(*) INTO total FROM public.bookings;
  RAISE NOTICE 'Buchungen insgesamt nach 4-Jahr-Seed: %', total;
END $$;
