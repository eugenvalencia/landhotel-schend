-- Stornierung IMMER kostenlos & IMMER möglich (Eugen-Klärung mit dem Hotel, 16.06.).
--
-- Ersetzt das vorherige gestufte Modell (50/80/90 %, Hotel-Bestätigung, „nicht mehr
-- möglich"). Schend storniert grundsätzlich gebührenfrei — daher:
--   - Gast kann jede noch aktive Buchung jederzeit selbst stornieren (kostenfrei, sofort).
--   - Der einzige Nicht-Storno-Fall ist „bereits storniert".
--   - Karin/Hotel kann zusätzlich JEDE Buchung im Dashboard stornieren (hotel_cancel_booking).
--
-- Sofort-Storno setzt payment_status='cancelled' → Overlap-Check ignoriert das, der
-- Termin wird automatisch frei. Single Source: KEINE zweite Tabelle — „Stornierungen“
-- = Filter payment_status='cancelled'. Zeile bleibt erhalten (Steuer/Nachweis).

-- ---------- 1. Storno-Vorschau (Gast, token-gesichert, read-only) ----------
-- Nur noch zwei Zustände: kostenfrei sofort möglich ODER bereits storniert.
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
BEGIN
  SELECT * INTO v FROM public.bookings WHERE id = p_booking_id;
  -- Token-Pflicht: ohne korrekten notify_token kein Zugriff (IDOR-Schutz, wie notify-schend).
  IF NOT FOUND OR v.notify_token IS NULL OR v.notify_token <> COALESCE(p_token, '') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT name INTO v_room_name FROM public.rooms WHERE id = v.room_id;
  v_days := (v.check_in - current_date)::INT;

  -- Storno ist immer kostenfrei und immer möglich — außer wenn schon storniert.
  v_mode := CASE
    WHEN v.payment_status = 'cancelled' THEN 'already_cancelled'
    ELSE 'immediate'
  END;

  RETURN jsonb_build_object(
    'booking_id',      v.id,
    'booking_number',  v.booking_number,
    'guest_name',      v.guest_name,
    'room_name',       COALESCE(v_room_name, 'Zimmer'),
    'check_in',        v.check_in,
    'check_out',       v.check_out,
    'total_price',     v.total_price,
    'request_status',  v.request_status,
    'days_to_arrival', v_days,
    'mode',            v_mode,
    'fee_pct',         0,
    'reason',          NULL
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_cancellation_preview(UUID, TEXT) TO anon, authenticated;

-- ---------- 2. Storno ausführen (Gast, token-gesichert) ----------
-- Immer sofort & kostenfrei. Kein Gebühren-/Anfrage-Pfad mehr.
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
BEGIN
  SELECT * INTO v FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND OR v.notify_token IS NULL OR v.notify_token <> COALESCE(p_token, '') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF v.payment_status = 'cancelled' THEN
    RETURN jsonb_build_object('result', 'already_cancelled', 'fee_pct', 0, 'booking_number', v.booking_number);
  END IF;

  v_days := (v.check_in - current_date)::INT;

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
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_booking(UUID, TEXT, TEXT) TO anon, authenticated;

-- ---------- 3. Hotel-Storno (Karin/Operator, im Dashboard, auth-gesichert) ----------
-- Karin kann JEDE Buchung (auch eine bereits bestätigte) bei Bedarf stornieren.
-- Schutz gegen Versehen passiert im UI (Bestätigungs-Dialog); hier nur Auth + Wirkung.
-- Gibt guest_email zurück, damit der Client dem Gast die Storno-Mail schicken kann.
CREATE OR REPLACE FUNCTION public.hotel_cancel_booking(
  p_booking_id UUID,
  p_reason     TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant UUID;
  v_num    TEXT;
  v_email  TEXT;
  v_status TEXT;
  v_role   TEXT;
BEGIN
  SELECT tenant_id, booking_number, guest_email, payment_status
    INTO v_tenant, v_num, v_email, v_status
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

  IF v_status = 'cancelled' THEN
    RETURN jsonb_build_object('result', 'already_cancelled', 'booking_number', v_num, 'guest_email', v_email);
  END IF;

  UPDATE public.bookings SET
    payment_status       = 'cancelled',
    cancelled_at         = now(),
    cancelled_by         = 'hotel',
    cancellation_fee_pct = 0,
    cancellation_reason  = NULLIF(LEFT(p_reason, 500), '')
  WHERE id = p_booking_id;

  v_role := CASE WHEN public.is_conexa_operator() THEN 'operator' ELSE 'admin' END;
  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (v_tenant, auth.uid(), v_role, 'booking.cancelled', 'booking', p_booking_id,
    jsonb_build_object('booking_number', v_num, 'fee_pct', 0, 'by', 'hotel'));

  RETURN jsonb_build_object('result', 'cancelled', 'booking_number', v_num, 'guest_email', v_email);
END;
$$;

GRANT EXECUTE ON FUNCTION public.hotel_cancel_booking(UUID, TEXT) TO authenticated;
