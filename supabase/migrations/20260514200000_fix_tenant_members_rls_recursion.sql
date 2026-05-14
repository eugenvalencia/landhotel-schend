-- ============================================================
-- Fix: tenant_members SELECT-Policy hat sich auf sich selbst
-- bezogen (tenant_id IN (SELECT ... FROM tenant_members)) was
-- unter RLS zu stiller Rekursion fuehrt — Resultat: kein User
-- sieht seine Memberships, also auch keinen Tenant.
--
-- Loesung: ein User darf seine eigenen Memberships immer sehen
-- (user_id = auth.uid() ist trivial, kein RLS-Lookup noetig).
-- Conexa-Operator sieht alle.
-- ============================================================

DROP POLICY IF EXISTS "Members view own tenant memberships" ON public.tenant_members;

CREATE POLICY "Users view own memberships" ON public.tenant_members FOR SELECT
  USING (
    public.is_conexa_operator()
    OR user_id = auth.uid()
  );
