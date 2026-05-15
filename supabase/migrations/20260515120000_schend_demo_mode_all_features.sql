-- ============================================================
-- Demo-Mode: alle Module fuer Schend auf active mit `demo: true`-Flag.
--
-- Hintergrund: Schend ist aktuell DEMO-Tenant fuer Conexa-Verkauf. Eugen
-- soll alle Module zeigen koennen — auch wenn fuer Schend produktiv noch
-- gar nicht relevant. Das `demo: true`-Flag erlaubt dem Frontend Module
-- mit Mock-Daten + grunem Banner zu rendern, damit klar ist dass das
-- Beispieldaten sind.
--
-- Spaeter wenn Schend produktiv waechst: einzelne Module per UPDATE
-- features['x']['demo'] = false setzen.
-- ============================================================

UPDATE public.tenants
SET features = '{
  "calendar":            { "state": "active" },
  "internal_bookings":   { "state": "active" },
  "housekeeping_mobile": { "state": "active" },
  "guest_profiles":      { "state": "active", "depth": "minimal" },
  "hyperlocal_concierge":{ "state": "active", "region": "vulkaneifel" },
  "online_payments":     { "state": "active", "demo": true },
  "channel_manager":     { "state": "active", "demo": true },
  "voice_concierge":     { "state": "active", "demo": true },
  "reviews_inbox":       { "state": "active", "demo": true },
  "daily_briefing":      { "state": "active", "demo": true },
  "guest_messaging":     { "state": "active", "demo": true },
  "datev_export":        { "state": "active", "demo": true },
  "compliance_vault":    { "state": "active", "demo": true },
  "analytics_revenue":   { "state": "active", "demo": true },
  "anomaly_detection":   { "state": "active", "demo": true }
}'::jsonb
WHERE slug = 'schend';
