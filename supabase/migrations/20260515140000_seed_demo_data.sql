-- ============================================================
-- Demo-Daten fuer Schend — ganzes Jahr, als haette der Kunde
-- die SaaS schon 12 Monate produktiv genutzt.
--
-- Strategie:
--   1) 15 Demo-Gaeste mit realistischen Profilen
--   2) Pro Zimmer ein zufaelliger Walk durch 18 Monate (Juni 2025 - Nov 2026)
--      mit saisonal variierenden Buchungs-Wahrscheinlichkeiten
--   3) Status haengt vom Datum ab (Vergangenheit: paid/refunded/cancelled;
--      Zukunft: paid/pending)
--   4) ~10 Notizbuch-Eintraege uebers Jahr verteilt
--
-- Idempotent: Demo-Bestand (LSC26-* / INT-* / @schend-demo.de) wird vorher
-- entfernt damit Re-Runs nicht duplizieren.
-- ============================================================

DELETE FROM public.bookings WHERE booking_number LIKE 'LSC26-%' OR booking_number LIKE 'INT-%';
DELETE FROM public.guests   WHERE email LIKE '%@schend-demo.de' OR email IS NULL AND name IN ('Familie Schend', 'Wartung Spuelmaschine', 'Privat — Eugen');

DO $$
DECLARE
  v_tenant_id  UUID;
  v_guest_ids  UUID[];
  v_room       RECORD;
  v_d          DATE;
  v_today      DATE := DATE '2026-05-15';
  v_start      DATE := DATE '2025-06-01';
  v_end        DATE := DATE '2026-11-30';
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
  v_seq        INT := 1000;
  v_bn         TEXT;
  v_status     TEXT;
  v_created    TIMESTAMPTZ;
  v_extras_choice INT;
  v_extras     JSONB;

  -- Demo-Gast-IDs (fixe Auswahl damit Stammgaeste wiederkehren)
  g_berger UUID; g_wittmann UUID; g_krause UUID; g_sommerfeld UUID;
  g_reuter UUID; g_roth UUID; g_wirth UUID; g_hofmann UUID;
  g_becker UUID; g_schmitt UUID; g_lehmann UUID; g_koehler UUID;
  g_berg UUID;   g_wagner UUID; g_helmer UUID;

  -- Wiederkehrende Notizen pro Gast-Profil
  v_guest_names    TEXT[];
  v_guest_emails   TEXT[];
  v_guest_phones   TEXT[];
  v_guest_notes    TEXT[];

  v_room_ez1 UUID; v_room_dk11 UUID; v_room_ds10 UUID;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'schend';

  -- ----- Gaeste anlegen -----
  g_berger     := gen_random_uuid();
  g_wittmann   := gen_random_uuid();
  g_krause     := gen_random_uuid();
  g_sommerfeld := gen_random_uuid();
  g_reuter     := gen_random_uuid();
  g_roth       := gen_random_uuid();
  g_wirth      := gen_random_uuid();
  g_hofmann    := gen_random_uuid();
  g_becker     := gen_random_uuid();
  g_schmitt    := gen_random_uuid();
  g_lehmann    := gen_random_uuid();
  g_koehler    := gen_random_uuid();
  g_berg       := gen_random_uuid();
  g_wagner     := gen_random_uuid();
  g_helmer     := gen_random_uuid();

  INSERT INTO public.guests (id, tenant_id, name, email, phone, notes) VALUES
    (g_berger,     v_tenant_id, 'Familie Berger',          'berger.familie@schend-demo.de', '+49 162 4427891', 'Hund Bruno, allergisch gegen Erdnuesse'),
    (g_wittmann,   v_tenant_id, 'Petra Wittmann',          'p.wittmann@schend-demo.de',     '+49 178 5512033', 'Solo-Reisende, fruehe Anreise bevorzugt'),
    (g_krause,     v_tenant_id, 'Holger Krause',           'h.krause@schend-demo.de',       '+49 174 8801244', 'Geschaeftsreisender, Firmenrechnung an Krause GmbH'),
    (g_sommerfeld, v_tenant_id, 'Lisa Sommerfeld',         'l.sommerfeld@schend-demo.de',   '+49 160 7723419', null),
    (g_reuter,     v_tenant_id, 'Marcus & Carla Reuter',   'reuter.familie@schend-demo.de', '+49 151 2245761', 'Stammgaeste seit 2018, kommen jaehrlich'),
    (g_roth,       v_tenant_id, 'Sebastian Roth',          's.roth@schend-demo.de',         '+49 175 6678412', null),
    (g_wirth,      v_tenant_id, 'Familie Wirth',           'wirth.familie@schend-demo.de',  '+49 162 3398124', 'Vegetarier, 2 Kinder (4 + 7)'),
    (g_hofmann,    v_tenant_id, 'Klaus Hofmann',           'k.hofmann@schend-demo.de',      '+49 152 8841230', 'Motorradfahrer, Garage erwuenscht'),
    (g_becker,     v_tenant_id, 'Anna & Thomas Becker',    'becker@schend-demo.de',         '+49 176 4488112', 'Hochzeitsreise, Sekt aufs Zimmer'),
    (g_schmitt,    v_tenant_id, 'Julia Schmitt-Lehmann',   'j.schmitt@schend-demo.de',      '+49 171 9923144', null),
    (g_lehmann,    v_tenant_id, 'Robert Lehmann',          'r.lehmann@schend-demo.de',      '+49 163 5571208', 'Wanderer, Rucksack-Lagerung erbeten'),
    (g_koehler,    v_tenant_id, 'Sarah Koehler',           's.koehler@schend-demo.de',      '+49 178 2241099', null),
    (g_berg,       v_tenant_id, 'Michael Berg',            'm.berg@schend-demo.de',         '+49 173 7780192', 'Frueher Stammgast, lange nicht da'),
    (g_wagner,     v_tenant_id, 'Frank Wagner',            'f.wagner@schend-demo.de',       '+49 159 9912330', null),
    (g_helmer,     v_tenant_id, 'Hochzeit Helmer/Becker',  'helmer-becker@schend-demo.de',  '+49 162 6678901', 'Hochzeitsfeier 14./15.09. fuer 65 Personen — Angebot offen');

  -- Lookup-Arrays
  v_guest_ids := ARRAY[g_berger, g_wittmann, g_krause, g_sommerfeld, g_reuter, g_roth, g_wirth, g_hofmann, g_becker, g_schmitt, g_lehmann, g_koehler, g_berg, g_wagner];
  v_guest_names := ARRAY[
    'Familie Berger', 'Petra Wittmann', 'Holger Krause', 'Lisa Sommerfeld',
    'Marcus & Carla Reuter', 'Sebastian Roth', 'Familie Wirth', 'Klaus Hofmann',
    'Anna & Thomas Becker', 'Julia Schmitt-Lehmann', 'Robert Lehmann',
    'Sarah Koehler', 'Michael Berg', 'Frank Wagner'
  ];
  v_guest_emails := ARRAY[
    'berger.familie@schend-demo.de', 'p.wittmann@schend-demo.de', 'h.krause@schend-demo.de', 'l.sommerfeld@schend-demo.de',
    'reuter.familie@schend-demo.de', 's.roth@schend-demo.de', 'wirth.familie@schend-demo.de', 'k.hofmann@schend-demo.de',
    'becker@schend-demo.de', 'j.schmitt@schend-demo.de', 'r.lehmann@schend-demo.de',
    's.koehler@schend-demo.de', 'm.berg@schend-demo.de', 'f.wagner@schend-demo.de'
  ];
  v_guest_phones := ARRAY[
    '+49 162 4427891', '+49 178 5512033', '+49 174 8801244', '+49 160 7723419',
    '+49 151 2245761', '+49 175 6678412', '+49 162 3398124', '+49 152 8841230',
    '+49 176 4488112', '+49 171 9923144', '+49 163 5571208',
    '+49 178 2241099', '+49 173 7780192', '+49 159 9912330'
  ];
  v_guest_notes := ARRAY[
    'Hund Bruno, allergisch gegen Erdnuesse', '', 'Firmenrechnung an Krause GmbH', '',
    'Stammgast — Sekt zur Begruessung', '', 'Vegetarier — Speisekarte vorab', 'Motorrad in Garage',
    'Hochzeitsreise', '', 'Eifelsteig-Wanderer', '', '', ''
  ];

  -- ----- Random Walk pro Zimmer durch 18 Monate -----
  FOR v_room IN SELECT id, price_per_night FROM public.rooms WHERE status='aktiv' AND tenant_id=v_tenant_id LOOP
    v_d := v_start;
    v_price := v_room.price_per_night;

    WHILE v_d < v_end LOOP
      v_month := EXTRACT(MONTH FROM v_d)::INT;

      -- Saisonale Belegungs-Wahrscheinlichkeit (Wochen-Mitte)
      v_prob := CASE v_month
        WHEN 1 THEN 0.20  -- Jan: ruhig
        WHEN 2 THEN 0.25
        WHEN 3 THEN 0.30
        WHEN 4 THEN 0.40
        WHEN 5 THEN 0.50  -- Fruehling
        WHEN 6 THEN 0.55
        WHEN 7 THEN 0.65  -- Sommer Hochsaison
        WHEN 8 THEN 0.65
        WHEN 9 THEN 0.50  -- Wein, Herbstwanderer
        WHEN 10 THEN 0.45
        WHEN 11 THEN 0.25
        WHEN 12 THEN 0.40  -- Weihnachtsmarkt
        ELSE 0.30
      END;

      -- Wochenenden + Mai/Sep Feiertage etwas dichter
      IF EXTRACT(DOW FROM v_d) IN (5, 6) THEN v_prob := v_prob + 0.20; END IF;

      IF random() < v_prob THEN
        -- Nights: meist 2-3, manchmal 1, selten 5-7
        v_nights := CASE
          WHEN random() < 0.15 THEN 1
          WHEN random() < 0.55 THEN 2
          WHEN random() < 0.80 THEN 3
          WHEN random() < 0.92 THEN 4
          ELSE (5 + (random() * 3)::INT)
        END;

        v_check_in  := v_d;
        v_check_out := v_d + v_nights;

        -- Gast-Auswahl: leicht haeufiger Stammgaeste (Reuter, Berger, Krause)
        v_guest_idx := CASE
          WHEN random() < 0.15 THEN 5  -- Reuter
          WHEN random() < 0.10 THEN 1  -- Berger
          WHEN random() < 0.10 THEN 3  -- Krause
          ELSE (1 + (random() * 13)::INT)
        END;
        IF v_guest_idx > 14 THEN v_guest_idx := 14; END IF;

        v_guest_id := v_guest_ids[v_guest_idx];
        v_g_name   := v_guest_names[v_guest_idx];
        v_g_email  := v_guest_emails[v_guest_idx];
        v_g_phone  := v_guest_phones[v_guest_idx];
        v_g_note   := NULLIF(v_guest_notes[v_guest_idx], '');

        v_total := v_price * v_nights;

        -- Extras 25% Chance: Halbpension (+25/N), oder Fruehstueck (+12/N), oder Hund (+15)
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

        -- Status haengt vom Zeitraum ab
        IF v_check_out < v_today THEN
          v_status := CASE
            WHEN random() < 0.92 THEN 'paid'
            WHEN random() < 0.50 THEN 'refunded'
            ELSE 'cancelled'
          END;
        ELSIF v_check_in <= v_today THEN
          v_status := 'paid';
        ELSIF v_check_in <= v_today + 14 THEN
          v_status := CASE WHEN random() < 0.65 THEN 'paid' ELSE 'pending' END;
        ELSE
          v_status := CASE WHEN random() < 0.40 THEN 'paid' ELSE 'pending' END;
        END IF;

        v_created := (v_check_in - (5 + (random() * 60)::INT))::timestamptz + INTERVAL '10 hours' + (random() * INTERVAL '8 hours');
        v_seq := v_seq + 1;
        v_bn := 'LSC26-' || LPAD(v_seq::TEXT, 5, '0');

        BEGIN
          INSERT INTO public.bookings (
            id, tenant_id, booking_number, room_id, guest_id, guest_name, guest_email, guest_phone,
            check_in, check_out, total_price, extras, notes, booking_type, payment_status, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), v_tenant_id, v_bn, v_room.id, v_guest_id, v_g_name, v_g_email, v_g_phone,
            v_check_in, v_check_out, v_total, v_extras, v_g_note, 'online', v_status::payment_status, v_created, v_created
          );
        EXCEPTION WHEN OTHERS THEN
          -- Falls Overlap-Constraint o.ae. greift: skip silent
          NULL;
        END;

        -- Naechster Versuch nach Buchungs-Ende + 0-2 Tage Turnover
        v_d := v_check_out + (random() * 2)::INT;
      ELSE
        v_d := v_d + 1;
      END IF;
    END LOOP;
  END LOOP;

  -- ----- Interne Buchungen (Notizbuch) -----
  SELECT id INTO v_room_ez1  FROM public.rooms WHERE name='Zimmer 1';
  SELECT id INTO v_room_dk11 FROM public.rooms WHERE name='Zimmer 11';
  SELECT id INTO v_room_ds10 FROM public.rooms WHERE name='Zimmer 10';

  INSERT INTO public.bookings (id, tenant_id, booking_number, room_id, guest_name, check_in, check_out, total_price, extras, notes, booking_type, payment_status, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant_id, 'INT-2501', v_room_ez1,  'Familie Schend',          DATE '2025-07-12', DATE '2025-07-15',   0.00, '[]'::jsonb, 'Vater Geburtstag', 'intern', 'paid', TIMESTAMPTZ '2025-06-22 19:00:00+02', TIMESTAMPTZ '2025-06-22 19:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2502', v_room_dk11, 'Wartung Heizungsanlage',  DATE '2025-09-08', DATE '2025-09-09',   0.00, '[]'::jsonb, 'Techniker uebernachtet', 'intern', 'paid', TIMESTAMPTZ '2025-09-01 14:00:00+02', TIMESTAMPTZ '2025-09-01 14:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2503', v_room_ds10, 'Privat — Eugen',          DATE '2025-11-15', DATE '2025-11-17',   0.00, '[]'::jsonb, null, 'intern', 'paid', TIMESTAMPTZ '2025-11-01 21:00:00+02', TIMESTAMPTZ '2025-11-01 21:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2504', v_room_ez1,  'Familie Schend',          DATE '2025-12-24', DATE '2025-12-27',   0.00, '[]'::jsonb, 'Weihnachten mit Familie', 'intern', 'paid', TIMESTAMPTZ '2025-11-15 10:00:00+02', TIMESTAMPTZ '2025-11-15 10:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2505', v_room_dk11, 'Saisonpause — Renovierung', DATE '2026-01-10', DATE '2026-01-20', 0.00, '[]'::jsonb, 'Wand streichen, Boden auffrischen', 'intern', 'paid', TIMESTAMPTZ '2025-12-15 09:00:00+02', TIMESTAMPTZ '2025-12-15 09:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2601', v_room_dk11, 'Familie Schend',          DATE '2026-05-20', DATE '2026-05-22',   0.00, '[]'::jsonb, 'Geburtstag Sohn', 'intern', 'paid', TIMESTAMPTZ '2026-04-25 19:00:00+02', TIMESTAMPTZ '2026-04-25 19:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2602', v_room_ds10, 'Wartung Spuelmaschine',   DATE '2026-05-16', DATE '2026-05-17',   0.00, '[]'::jsonb, 'Techniker uebernachtet vor Ort', 'intern', 'paid', TIMESTAMPTZ '2026-05-12 10:00:00+02', TIMESTAMPTZ '2026-05-12 10:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2603', v_room_ez1,  'Privat — Eugen',          DATE '2026-06-22', DATE '2026-06-24',   0.00, '[]'::jsonb, null, 'intern', 'paid', TIMESTAMPTZ '2026-05-10 21:11:00+02', TIMESTAMPTZ '2026-05-10 21:11:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2604', v_room_dk11, 'Familie Wirth-Schend',    DATE '2026-08-04', DATE '2026-08-08',   0.00, '[]'::jsonb, 'Sommerferien — Schwiegereltern besuchen', 'intern', 'paid', TIMESTAMPTZ '2026-04-12 19:00:00+02', TIMESTAMPTZ '2026-04-12 19:00:00+02'),
    (gen_random_uuid(), v_tenant_id, 'INT-2605', v_room_ds10, 'Wartung Lueftung',        DATE '2026-10-15', DATE '2026-10-16',   0.00, '[]'::jsonb, 'Jaehrliche Wartung HKL', 'intern', 'paid', TIMESTAMPTZ '2026-08-01 10:00:00+02', TIMESTAMPTZ '2026-08-01 10:00:00+02');

END $$;

-- Ergebnis: ueberschauen
DO $$
DECLARE
  total INT; paid INT; pending INT; cancelled INT; refunded INT; intern INT;
BEGIN
  SELECT COUNT(*) INTO total      FROM public.bookings;
  SELECT COUNT(*) INTO paid       FROM public.bookings WHERE payment_status = 'paid' AND booking_type = 'online';
  SELECT COUNT(*) INTO pending    FROM public.bookings WHERE payment_status = 'pending';
  SELECT COUNT(*) INTO cancelled  FROM public.bookings WHERE payment_status = 'cancelled';
  SELECT COUNT(*) INTO refunded   FROM public.bookings WHERE payment_status = 'refunded';
  SELECT COUNT(*) INTO intern     FROM public.bookings WHERE booking_type = 'intern';

  RAISE NOTICE 'Demo-Seed: total=%, paid=%, pending=%, cancelled=%, refunded=%, intern=%', total, paid, pending, cancelled, refunded, intern;
END $$;
