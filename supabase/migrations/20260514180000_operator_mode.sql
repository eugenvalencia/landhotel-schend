-- ============================================================
-- Operator-Mode (Phase 2)
-- ------------------------------------------------------------
-- 1. conexa_admin Enum-Value zu app_role hinzufuegen.
-- 2. Operator-RPC: get_operator_overview() — sieht alle Tenants
--    mit Counts (Mitglieder/Buchungen) ohne PII zu offenbaren.
-- 3. Operator-RPC: log_operator_access() — schreibt einen Audit-
--    Eintrag wenn Conexa-Mitarbeiter Tenant-Daten ansieht.
-- ============================================================

-- ---------- 1. Enum-Value ----------
-- ALTER TYPE ADD VALUE muss in eigener Transaktion stehen, aber alle
-- nachfolgenden Verwendungen ueber role::text = 'conexa_admin' sind
-- daher in Ordnung — kein direkter Enum-Literal.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'conexa_admin';

-- ---------- 2. Operator-Overview-RPC ----------
-- Aggregierte Sicht ueber alle Tenants: was lebt, wie viele Mitglieder,
-- wie viele Buchungen, wann zuletzt aktiv. KEIN Insight in einzelne
-- Buchungs- oder Gast-Daten — das ist nur per explizitem Access-Request.
CREATE OR REPLACE FUNCTION public.get_operator_overview()
RETURNS TABLE (
  tenant_id UUID,
  slug TEXT,
  name TEXT,
  state TEXT,
  member_count INT,
  booking_count INT,
  guest_count INT,
  last_booking_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  features_active INT,
  features_disabled INT,
  features_hidden INT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.slug,
    t.name,
    t.state,
    (SELECT COUNT(*)::INT FROM public.tenant_members tm WHERE tm.tenant_id = t.id) AS member_count,
    (SELECT COUNT(*)::INT FROM public.bookings b WHERE b.tenant_id = t.id) AS booking_count,
    (SELECT COUNT(*)::INT FROM public.guests g WHERE g.tenant_id = t.id) AS guest_count,
    (SELECT MAX(b.created_at) FROM public.bookings b WHERE b.tenant_id = t.id) AS last_booking_at,
    t.created_at,
    (SELECT COUNT(*)::INT FROM jsonb_each(t.features) e WHERE e.value->>'state' = 'active') AS features_active,
    (SELECT COUNT(*)::INT FROM jsonb_each(t.features) e WHERE e.value->>'state' = 'disabled') AS features_disabled,
    (SELECT COUNT(*)::INT FROM jsonb_each(t.features) e WHERE e.value->>'state' = 'hidden') AS features_hidden
  FROM public.tenants t
  WHERE public.is_conexa_operator()
  ORDER BY t.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_operator_overview() TO authenticated;

-- ---------- 3. Operator-Audit-Log-Schreibe-RPC ----------
-- Wenn ein Conexa-Operator einen Tenant inspiziert (z.B. Audit-Log oeffnet,
-- Booking-Details ansieht), wird das HIER explizit geloggt — mit reason-Feld.
-- Ohne diese Methode laesst sich der Operator-Zugriff nicht nachvollziehen,
-- und das ist genau das Trust-Argument fuer spaetere Enterprise-Kunden.
CREATE OR REPLACE FUNCTION public.log_operator_access(
  p_tenant_id UUID,
  p_action    TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id   UUID DEFAULT NULL,
  p_reason      TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID := gen_random_uuid();
  v_email TEXT;
BEGIN
  IF NOT public.is_conexa_operator() THEN
    RAISE EXCEPTION 'Forbidden — nur Conexa-Operator erlaubt';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.audit_log (
    id, tenant_id, actor_id, actor_email, actor_role, action,
    entity_type, entity_id, reason, created_at
  ) VALUES (
    v_id, p_tenant_id, auth.uid(), v_email, 'conexa_admin', p_action,
    p_entity_type, p_entity_id, p_reason, now()
  );

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_operator_access(UUID, TEXT, TEXT, UUID, TEXT) TO authenticated;

-- ---------- 4. Operator-Audit-View ----------
-- View fuer die UI: letzte N Audit-Eintraege pro Tenant.
-- RLS-policy der audit_log Tabelle erlaubt is_conexa_operator() sowieso alles.
-- View ist nur Convenience.
CREATE OR REPLACE VIEW public.audit_log_recent AS
  SELECT
    a.id,
    a.tenant_id,
    t.slug AS tenant_slug,
    t.name AS tenant_name,
    a.actor_id,
    a.actor_email,
    a.actor_role,
    a.action,
    a.entity_type,
    a.entity_id,
    a.reason,
    a.metadata,
    a.created_at
  FROM public.audit_log a
  LEFT JOIN public.tenants t ON t.id = a.tenant_id
  ORDER BY a.created_at DESC
  LIMIT 500;

GRANT SELECT ON public.audit_log_recent TO authenticated;
