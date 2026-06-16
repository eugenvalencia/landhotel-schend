-- Self-Service-Stornierung (gestuftes Modell, Eugen-Entscheidung 16.06.).
--
-- Gast klickt einen Storno-Link (mit notify_token) in der Eingangs-/Bestätigungsmail.
-- Logik nach AGB § 4 (Schend, selbst erstellt):
--   - noch nicht bestätigte Anfrage (request_status='angefragt')  → sofort kostenfrei
--   - bestätigt + Anreise ≥ 14 Tage entfernt                      → sofort kostenfrei
--   - bestätigt + 7–13 Tage vor Anreise                           → Storno-ANFRAGE, 50 %
--   - bestätigt + 1–6 Tage vor Anreise                            → Storno-ANFRAGE, 80 %
--   - Anreisetag/vorbei/bereits storniert/abgelehnt              → kein Online-Storno
--
-- Sofort-Storno setzt payment_status='cancelled' → der Overlap-Check ignoriert das,
-- der Termin wird automatisch frei. Storno-ANFRAGE hält die Buchung noch aktiv
-- (Termin bleibt blockiert), bis das Hotel im Dashboard bestätigt.
-- Single Source: KEINE zweite Tabelle — „Stornierungen" = Filter payment_status='cancelled'.
-- Nie löschen (Steuer/Nachweis): Zeile bleibt + Storno-Metadaten.

-- ---------- 1. Storno-Metadaten auf bookings ----------
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancelled_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_reason       TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_by              TEXT
    CHECK (cancelled_by IS NULL OR cancelled_by IN ('guest', 'hotel')),
  ADD COLUMN IF NOT EXISTS cancellation_fee_pct      INT
    CHECK (cancellation_fee_pct IS NULL OR cancellation_fee_pct IN (0, 50, 80, 90));

CREATE INDEX IF NOT EXISTS idx_bookings_cancellation_requested
  ON public.bookings(cancellation_requested_at)
  WHERE cancellation_requested_at IS NOT NULL;

-- ---------- 2. Storno-Vorschau (Gast, token-gesichert, read-only) ----------
-- Zeigt dem Gast auf /storno, was passiert: kostenfrei sofort, gebührenpflichtige
-- Anfrage (mit %), oder „bitte anrufen". Trifft KEINE Änderung.
CREATE OR REPLACE FUNCTION public.get_cancellation_preview(
  p_booking_id UUID,
  p_token      TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v   public.bookings%ROWTYPE;
  v_room_name TEXT;
  v_days INT;
  v_mode TEXT;
  v_fee  INT;
  v_reason TEXT := NULL;
BEGIN
  SELECT * INTO v FROM public.bookings WHERE id = p_booking_id;
  -- Token-Pflicht: ohne korrekten notify_token kein Zugriff (IDOR-Schutz, wie notify-schend).
  IF NOT FOUND OR v.notify_token IS NULL OR v.notify_token <> COALESCE(p_token, '') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT name INTO v_room_name FROM public.rooms WHERE id = v.room_id;
  v_days := (v.check_in - current_date)::INT;

  v_mode := CASE
    WHEN v.payment_status = 'cancelled'            THEN 'already_cancelled'
    WHEN v.cancellation_requested_at IS NOT NULL   THEN 'request_pending'
    WHEN v.request_status = 'abgelehnt'            THEN 'blocked'
    WHEN v.request_status = 'angefragt'           THEN 'immediate'   -- unverbindlich → frei
    WHEN v_days <= 0                               THEN 'blocked'    -- Anreisetag/vorbei
    WHEN v_days >= 14                              THEN 'immediate'  -- kostenfreies Fenster
    WHEN v_days >= 7                               THEN 'request'    -- 50 %
    ELSE                                               'request'     -- 80 %
  END;

  v_fee := CASE
    WHEN v_mode <> 'request' THEN 0
    WHEN v_days >= 7         THEN 50
    ELSE                          80
  END;

  IF v_mode = 'blocked' THEN
    v_reason := CASE
      WHEN v.request_status = 'abgelehnt' THEN 'rejected'
      ELSE 'too_late'
    END;
  END IF;

  RETURN jsonb_build_object(
    'booking_id',     v.id,
    'booking_number', v.booking_number,
    'guest_name',     v.guest_name,
    'room_name',      COALESCE(v_room_name, 'Zimmer'),
    'check_in',       v.check_in,
    'check_out',      v.check_out,
    'total_price',    v.total_price,
    'request_status', v.request_status,
    'days_to_arrival', v_days,
    'mode',           v_mode,
    'fee_pct',        v_fee,
    'reason',         v_reason
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_cancellation_preview(UUID, TEXT) TO anon, authenticated;

-- ---------- 3. Storno ausführen (Gast, token-gesichert) ----------
-- Berechnet den Modus server-seitig NEU (kein Client-Vertrauen) und handelt entsprechend.
CREATE OR REPLACE FUNCTION public.cancel_booking(
  p_booking_id UUID,
  p_token      TEXT,
  p_reason     TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v   public.bookings%ROWTYPE;
  v_days INT;
  v_mode TEXT;
  v_fee  INT;
BEGIN
  SELECT * INTO v FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND OR v.notify_token IS NULL OR v.notify_token <> COALESCE(p_token, '') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  v_days := (v.check_in - current_date)::INT;

  v_mode := CASE
    WHEN v.payment_status = 'cancelled'          THEN 'already_cancelled'
    WHEN v.cancellation_requested_at IS NOT NULL THEN 'request_pending'
    WHEN v.request_status = 'abgelehnt'          THEN 'blocked'
    WHEN v.request_status = 'angefragt'          THEN 'immediate'
    WHEN v_days <= 0                             THEN 'blocked'
    WHEN v_days >= 14                            THEN 'immediate'
    WHEN v_days >= 7                             THEN 'request'
    ELSE                                              'request'
  END;

  v_fee := CASE
    WHEN v_mode <> 'request' THEN 0
    WHEN v_days >= 7         THEN 50
    ELSE                          80
  END;

  IF v_mode = 'immediate' THEN
    UPDATE public.bookings SET
      payment_status        = 'cancelled',
      cancelled_at          = now(),
      cancelled_by          = 'guest',
      cancellation_fee_pct  = 0,
      cancellation_reason   = NULLIF(LEFT(p_reason, 500), '')
    WHERE id = v.id;

    INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
    VALUES (v.tenant_id, NULL, 'anon', 'booking.cancelled', 'booking', v.id,
      jsonb_build_object('booking_number', v.booking_number, 'fee_pct', 0, 'by', 'guest', 'days', v_days));

    RETURN jsonb_build_object('result', 'cancelled', 'fee_pct', 0, 'booking_number', v.booking_number);

  ELSIF v_mode = 'request' THEN
    UPDATE public.bookings SET
      cancellation_requested_at = now(),
      cancellation_fee_pct      = v_fee,
      cancellation_reason       = NULLIF(LEFT(p_reason, 500), '')
    WHERE id = v.id;

    INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
    VALUES (v.tenant_id, NULL, 'anon', 'booking.cancellation_requested', 'booking', v.id,
      jsonb_build_object('booking_number', v.booking_number, 'fee_pct', v_fee, 'days', v_days));

    RETURN jsonb_build_object('result', 'requested', 'fee_pct', v_fee, 'booking_number', v.booking_number);
  END IF;

  -- already_cancelled / request_pending / blocked → nichts ändern, Status zurückmelden
  RETURN jsonb_build_object('result', v_mode, 'fee_pct', v_fee, 'booking_number', v.booking_number);
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_booking(UUID, TEXT, TEXT) TO anon, authenticated;

-- ---------- 4. Storno-Anfrage bestätigen/ablehnen (Hotel, tenant-gesichert) ----------
-- Auflösung einer gebührenpflichtigen Storno-Anfrage durch das Hotel im Dashboard.
CREATE OR REPLACE FUNCTION public.confirm_cancellation(
  p_booking_id UUID,
  p_approve    BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant UUID;
  v_num    TEXT;
  v_req    TIMESTAMPTZ;
  v_fee    INT;
  v_role   TEXT;
BEGIN
  SELECT tenant_id, booking_number, cancellation_requested_at, cancellation_fee_pct
    INTO v_tenant, v_num, v_req, v_fee
    FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking not found';
  END IF;

  IF NOT (
    public.is_conexa_operator()
    OR v_tenant IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF v_req IS NULL THEN
    RETURN jsonb_build_object('success', true, 'unchanged', true);
  END IF;

  IF p_approve THEN
    UPDATE public.bookings SET
      payment_status = 'cancelled',
      cancelled_at   = now(),
      cancelled_by   = 'hotel'
    WHERE id = p_booking_id;
  ELSE
    -- abgelehnt: Storno-Anfrage zurücknehmen, Buchung bleibt aktiv
    UPDATE public.bookings SET
      cancellation_requested_at = NULL,
      cancellation_fee_pct      = NULL
    WHERE id = p_booking_id;
  END IF;

  v_role := CASE WHEN public.is_conexa_operator() THEN 'operator' ELSE 'admin' END;
  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (v_tenant, auth.uid(), v_role,
    CASE WHEN p_approve THEN 'booking.cancellation_confirmed' ELSE 'booking.cancellation_declined' END,
    'booking', p_booking_id,
    jsonb_build_object('booking_number', v_num, 'fee_pct', v_fee));

  RETURN jsonb_build_object('success', true, 'approved', p_approve, 'fee_pct', v_fee);
END;
$$;

GRANT EXECUTE ON FUNCTION public.confirm_cancellation(UUID, BOOLEAN) TO authenticated;
