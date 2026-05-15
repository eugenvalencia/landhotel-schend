-- ============================================================
-- FIX: audit_log_recent View auf SECURITY INVOKER stellen
-- ============================================================
-- Supabase-Linter meldet die View als "Security Definer View" Risk.
-- Default-Verhalten in Postgres: Views laufen als Owner -> bypassen RLS.
-- Mit security_invoker=true respektiert die View die RLS-Policies des
-- aufrufenden Users (in unserem Fall is_conexa_operator() auf audit_log).
-- Damit kann KEIN normaler Tenant-User die View abfragen und Daten
-- anderer Tenants sehen.
-- ============================================================

ALTER VIEW public.audit_log_recent SET (security_invoker = true);
