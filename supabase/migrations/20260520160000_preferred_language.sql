-- Sprach-Strategie Schend: 4 Sprachen DE/EN/FR/NL für Benelux + DACH
-- Diese Migration:
-- 1. Fügt bookings.preferred_language TEXT hinzu
-- 2. Erweitert create_booking RPC um optionalen p_preferred_language Parameter
-- 3. Aktualisiert die notify-schend Edge-Function-Call (in der Trigger-Function) — bleibt unverändert,
--    weil die Edge Function ohnehin den ganzen Booking-Record lädt und preferred_language dann automatisch
--    im Payload landet.

-- 1. Column anlegen mit CHECK Constraint
alter table public.bookings
  add column if not exists preferred_language text
  check (preferred_language is null or preferred_language in ('de', 'en', 'fr', 'nl'));

comment on column public.bookings.preferred_language is
  'UI-Sprache des Gastes beim Absenden der Anfrage (de/en/fr/nl). Wird vom Frontend i18n.language gesetzt. Treibt den n8n-Workflow für Auto-Reply-Sprache.';

-- 2. RPC create_booking erweitern (default-signature-erhaltend, neuer optionaler Parameter)
-- WICHTIG: bestehende Aufrufe (ohne preferred_language) bleiben kompatibel
create or replace function public.create_booking(
  p_room_id uuid,
  p_check_in date,
  p_check_out date,
  p_guest_name text,
  p_guest_email text,
  p_guest_phone text,
  p_extras jsonb default '[]'::jsonb,
  p_notes text default null,
  p_preferred_language text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room record;
  v_nights int;
  v_price_per_night numeric;
  v_extras_total numeric := 0;
  v_total numeric;
  v_extra jsonb;
  v_extra_record record;
  v_booking_number text;
  v_guest_id uuid;
  v_booking_id uuid;
  v_overlap_count int;
  v_lang text;
begin
  -- 1. Datums-Validation
  if p_check_in >= p_check_out then
    return jsonb_build_object('error', 'check_out_must_be_after_check_in');
  end if;
  if p_check_in < current_date then
    return jsonb_build_object('error', 'check_in_in_past');
  end if;

  -- 2. preferred_language normalisieren
  v_lang := lower(coalesce(p_preferred_language, ''));
  if v_lang not in ('de', 'en', 'fr', 'nl') then
    v_lang := null;  -- ungültige Werte werden zu NULL (Detection greift dann in n8n)
  end if;

  -- 3. Raum prüfen
  select * into v_room from public.rooms where id = p_room_id and status = 'aktiv';
  if not found then
    return jsonb_build_object('error', 'room_not_found_or_inactive');
  end if;

  -- 4. Overlap-Check
  select count(*) into v_overlap_count
    from public.bookings
   where room_id = p_room_id
     and payment_status not in ('cancelled')
     and not (check_out <= p_check_in or check_in >= p_check_out);
  if v_overlap_count > 0 then
    return jsonb_build_object('error', 'room_not_available');
  end if;

  -- 5. Preis-Recompute (Anti-Fraud)
  v_nights := (p_check_out - p_check_in);
  v_price_per_night := v_room.price_per_night;

  -- 6. Extras-Preis berechnen (Server-Side)
  for v_extra in select jsonb_array_elements(p_extras) loop
    select id, price, per_night into v_extra_record
      from public.extras
     where id = (v_extra->>'id')::uuid and active = true;
    if found then
      if v_extra_record.per_night then
        v_extras_total := v_extras_total + (v_extra_record.price * v_nights);
      else
        v_extras_total := v_extras_total + v_extra_record.price;
      end if;
    end if;
  end loop;

  v_total := (v_price_per_night * v_nights) + v_extras_total;

  -- 7. Booking-Number generieren
  v_booking_number := 'LSC' || lpad((floor(random() * 100000000))::text, 8, '0');

  -- 8. Guest upserten
  insert into public.guests (name, email, phone)
    values (p_guest_name, p_guest_email, p_guest_phone)
    on conflict (email) do update
      set name = excluded.name,
          phone = coalesce(excluded.phone, public.guests.phone)
    returning id into v_guest_id;

  -- 9. Booking-INSERT — preferred_language wird mitgespeichert
  insert into public.bookings (
    booking_number, room_id, guest_id, guest_name, guest_email, guest_phone,
    check_in, check_out, total_price, extras, notes, booking_type, payment_status,
    preferred_language
  )
  values (
    v_booking_number, p_room_id, v_guest_id, p_guest_name, p_guest_email, p_guest_phone,
    p_check_in, p_check_out, v_total, p_extras, p_notes, 'direct', 'pending',
    v_lang
  )
  returning id into v_booking_id;

  return jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'booking_number', v_booking_number,
    'total_price', v_total,
    'nights', v_nights,
    'preferred_language', v_lang
  );
end;
$$;
