-- ============================================================
-- Buchungs-Härtung (Audit Block 1+2) — 2026-06-04
-- ------------------------------------------------------------
-- Rein additiv/konsolidierend, KEINE Datenmigration. Behebt vier
-- Audit-Funde rund um den Anfrage-/Mail-Fluss:
--
--   1. DOPPEL-MAIL-FALLE entschärfen: Der INSERT-Trigger
--      trg_notify_schend_on_booking UND der pg_net-Block in
--      set_booking_request_status feuern notify-schend ZUSÄTZLICH
--      zum Client-Pfad (src/lib/notify-booking.ts). Aktuell inert,
--      weil die app.settings-GUCs nicht gesetzt sind — aber die alte
--      Doku riet, sie zu setzen → sofort doppelte Gast-Mails.
--      Wir entfernen die DB-Mail-Pfade vollständig. EINE Quelle = Client.
--
--   2. set_booking_request_status: Übergangs-Guard (No-Op, wenn der
--      Status schon gesetzt ist) → kein doppeltes Audit-Log / kein
--      versehentliches erneutes Bestätigen. actor_role korrekt
--      (operator vs. admin) statt hart 'admin'.
--
--   3. Rate-Limit gegen Anfrage-Spam (öffentliches create_booking ist
--      anon-aufrufbar): BEFORE-INSERT-Trigger begrenzt Web-Anfragen
--      pro Gast-E-Mail (rollierende Stunde + offene Anfragen).
--
--   4. Idempotenz-Spalte `notifications` für notify-schend (die Edge
--      Function nutzt sie, um dieselbe Mail nicht im Sekundentakt doppelt
--      zu senden — siehe supabase/functions/notify-schend/index.ts).
-- ============================================================

-- ---------- 1. Doppel-Mail-Falle: DB-Mail-Pfade entfernen ----------
DROP TRIGGER  IF EXISTS trg_notify_schend_on_booking ON public.bookings;
DROP FUNCTION IF EXISTS public.notify_schend_on_booking();

-- ---------- 4. Idempotenz-Spalte (für notify-schend) ----------
-- Map: kind -> ISO-Zeitstempel des letzten Versands. Die Edge Function
-- überspringt einen erneuten Versand desselben kind innerhalb von 120 s.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS notifications JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.bookings.notifications IS
  'Versand-Idempotenz für notify-schend: kind -> letzter Versand-Zeitstempel (ISO). Verhindert Sekundentakt-Doppel-Mails; bewusster Resend nach >120s bleibt möglich.';

-- ---------- 2. set_booking_request_status: pg_net raus + Guards ----------
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
  v_tenant  UUID;
  v_num     TEXT;
  v_current TEXT;
  v_role    TEXT;
BEGIN
  IF p_status NOT IN ('angefragt', 'bestaetigt', 'abgelehnt') THEN
    RAISE EXCEPTION 'invalid status';
  END IF;

  SELECT tenant_id, booking_number, request_status
    INTO v_tenant, v_num, v_current
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

  -- Übergangs-Guard: schon im Zielstatus → No-Op (kein doppeltes Audit,
  -- kein erneuter Mail-Trigger durch wiederholtes Klicken/Race).
  IF v_current = p_status THEN
    RETURN jsonb_build_object('success', true, 'status', p_status, 'unchanged', true);
  END IF;

  UPDATE public.bookings SET request_status = p_status WHERE id = p_booking_id;

  -- Ablehnen storniert die Buchung -> Kalender wird wieder frei
  IF p_status = 'abgelehnt' THEN
    UPDATE public.bookings SET payment_status = 'cancelled' WHERE id = p_booking_id;
  END IF;

  -- HINWEIS: Die verbindliche Bestätigungs-Mail wird AUSSCHLIESSLICH client-seitig
  -- über notify-schend ausgelöst (src/lib/notify-booking.ts). Der frühere
  -- pg_net/http_post-Block ist hier bewusst ENTFERNT (Doppel-Mail-Vermeidung).

  v_role := CASE WHEN public.is_conexa_operator() THEN 'operator' ELSE 'admin' END;

  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (
    v_tenant, auth.uid(), v_role,
    'booking.request_status', 'booking', p_booking_id,
    jsonb_build_object('status', p_status, 'from', v_current, 'booking_number', v_num)
  );

  RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_booking_request_status(UUID, TEXT) TO authenticated;

-- ---------- 3. Rate-Limit gegen Anfrage-Spam ----------
-- Greift nur für Web-Anfragen (booking_type='online'). Manuelle/interne
-- Buchungen des Hotels (booking_type='intern') sind ausgenommen.
CREATE OR REPLACE FUNCTION public.enforce_booking_request_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent INT;
  v_open   INT;
BEGIN
  IF COALESCE(NEW.booking_type, 'online') <> 'online' THEN
    RETURN NEW;
  END IF;

  -- Max. 6 Web-Anfragen pro E-Mail in der rollierenden Stunde
  SELECT COUNT(*) INTO v_recent
    FROM public.bookings
   WHERE lower(guest_email) = lower(NEW.guest_email)
     AND created_at > now() - interval '1 hour';
  IF v_recent >= 6 THEN
    RAISE EXCEPTION 'rate_limit' USING HINT = 'too many requests per hour';
  END IF;

  -- Max. 10 gleichzeitig offene (angefragte, nicht stornierte) Anfragen pro E-Mail
  SELECT COUNT(*) INTO v_open
    FROM public.bookings
   WHERE lower(guest_email) = lower(NEW.guest_email)
     AND request_status = 'angefragt'
     AND payment_status <> 'cancelled';
  IF v_open >= 10 THEN
    RAISE EXCEPTION 'rate_limit' USING HINT = 'too many open requests';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_request_rate_limit ON public.bookings;
CREATE TRIGGER trg_booking_request_rate_limit
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_booking_request_rate_limit();
