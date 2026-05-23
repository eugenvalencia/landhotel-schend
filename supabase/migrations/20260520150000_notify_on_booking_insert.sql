-- Trigger: nach erfolgreichem INSERT in bookings ruft die notify-schend Edge Function async auf.
-- Async via pg_net.http_post — kein blocking, keine Latenz für den User.
-- Setup-Voraussetzung: pg_net Extension (in Supabase per default verfügbar).

-- Sicherstellen dass pg_net da ist
create extension if not exists pg_net with schema extensions;

-- Helper-Funktion: ruft die Edge Function notify-schend mit booking_id auf
create or replace function public.notify_schend_on_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url text;
  v_payload jsonb;
begin
  -- Edge Function URL (relativ zu Supabase-Projekt)
  v_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-schend';

  v_payload := jsonb_build_object('booking_id', NEW.id::text);

  -- Async POST — wartet NICHT auf Response, blockiert den INSERT nicht
  perform extensions.http_post(
    url := v_url,
    body := v_payload,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    )
  );

  return NEW;
exception when others then
  -- Trigger-Fehler dürfen den INSERT NIE blockieren
  raise warning 'notify_schend_on_booking failed: %', sqlerrm;
  return NEW;
end;
$$;

-- Trigger anlegen (nur AFTER INSERT, keine UPDATEs)
drop trigger if exists trg_notify_schend_on_booking on public.bookings;

create trigger trg_notify_schend_on_booking
  after insert on public.bookings
  for each row
  execute function public.notify_schend_on_booking();

-- Setup-Hinweis (manuell zu konfigurieren):
-- Im Supabase Dashboard unter "Database" → "Settings" → "Custom Postgres Config" eintragen:
--   app.settings.supabase_url        = https://<projekt-ref>.supabase.co
--   app.settings.service_role_key    = <service-role-key>
--
-- Diese werden NICHT in der Migration hartcodiert (sonst Secret-Leak in Git).
