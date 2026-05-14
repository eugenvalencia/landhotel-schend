-- ============================================================
-- Multi-Tenant Foundation
-- ------------------------------------------------------------
-- Führt das Tenant-Konzept ein, scopiert bestehende Tabellen,
-- legt audit_log + tenant_members + Conexa-Operator-Role an.
-- Schend wird als erster Tenant gesetzt, alle bestehenden
-- Daten werden ihm zugeordnet (Backfill).
-- ============================================================

-- ---------- 1. tenants ----------
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  branding JSONB NOT NULL DEFAULT '{}'::jsonb,
  state TEXT NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Schend als ersten Tenant einfügen mit der Notizbuch-kompatiblen Config
INSERT INTO public.tenants (slug, name, features, branding) VALUES (
  'schend',
  'Landhotel Schend',
  '{
    "calendar":            { "state": "active" },
    "internal_bookings":   { "state": "active" },
    "housekeeping_mobile": { "state": "active" },
    "guest_profiles":      { "state": "active", "depth": "minimal" },
    "hyperlocal_concierge":{ "state": "active", "region": "vulkaneifel" },
    "online_payments":     { "state": "disabled" },
    "channel_manager":     { "state": "disabled" },
    "voice_concierge":     { "state": "disabled" },
    "reviews_inbox":       { "state": "disabled" },
    "daily_briefing":      { "state": "disabled" },
    "guest_messaging":     { "state": "disabled" },
    "datev_export":        { "state": "hidden" },
    "compliance_vault":    { "state": "hidden" },
    "analytics_revenue":   { "state": "hidden" },
    "anomaly_detection":   { "state": "hidden" }
  }'::jsonb,
  '{
    "primary_hsl":   "220 22% 13%",
    "secondary_hsl": "38 48% 38%",
    "accent_hsl":    "38 30% 92%",
    "logo_class":    "schend-mark"
  }'::jsonb
);

-- ---------- 2. Conexa-Operator-Role ----------
-- NOTE: 'conexa_admin' Enum-Value wird in einer SEPARATEN späteren Migration
-- hinzugefügt (ALTER TYPE ADD VALUE kann nicht in derselben Transaktion
-- erfolgen wie spätere Nutzung). Bis dahin liefert is_conexa_operator() false,
-- was korrektes Verhalten ist — niemand ist Operator solange Role nicht existiert.

-- ---------- 3. tenant_members (M:N User ↔ Tenant) ----------
CREATE TABLE public.tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff', 'housekeeping', 'concierge', 'readonly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_tenant_members_user ON public.tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant ON public.tenant_members(tenant_id);

-- Bestehende admin-User zu Schend-Mitgliedern machen
INSERT INTO public.tenant_members (tenant_id, user_id, role)
SELECT
  (SELECT id FROM public.tenants WHERE slug = 'schend'),
  ur.user_id,
  'owner'
FROM public.user_roles ur
WHERE ur.role = 'admin'
ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- ---------- 4. Helper-Funktionen ----------
-- Liefert die Tenant-Id für die aktuelle Session (erstes Membership des Users).
-- SECURITY DEFINER damit RLS-Policies sie aufrufen können ohne Rekursion.
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Prüft ob der aktuelle User Conexa-Operator ist (tenant-übergreifender Zugriff).
-- Liefert false bis das 'conexa_admin' Enum-Value in einer Folge-Migration ergänzt wird.
CREATE OR REPLACE FUNCTION public.is_conexa_operator()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'conexa_admin'
  );
$$;

-- ---------- 5. tenant_id auf bestehende Tabellen ----------
ALTER TABLE public.rooms    ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.extras   ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.bookings ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.guests   ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Backfill: alles bisher Vorhandene gehört zu Schend
UPDATE public.rooms    SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'schend') WHERE tenant_id IS NULL;
UPDATE public.extras   SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'schend') WHERE tenant_id IS NULL;
UPDATE public.bookings SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'schend') WHERE tenant_id IS NULL;
UPDATE public.guests   SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'schend') WHERE tenant_id IS NULL;

-- NOT NULL setzen jetzt wo Backfill durch ist
ALTER TABLE public.rooms    ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.extras   ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.guests   ALTER COLUMN tenant_id SET NOT NULL;

-- Performance-Indexes
CREATE INDEX idx_rooms_tenant    ON public.rooms(tenant_id);
CREATE INDEX idx_extras_tenant   ON public.extras(tenant_id);
CREATE INDEX idx_bookings_tenant ON public.bookings(tenant_id);
CREATE INDEX idx_guests_tenant   ON public.guests(tenant_id);

-- ---------- 6. RLS-Policies — Tenant-Scoping ----------
-- Bestehende "Anyone can view"-Policies bleiben für anon-Zugriff (Buchungs-Engine
-- muss Zimmer/Extras lesen können). Aber Admin-Reads werden auf den eigenen
-- Tenant beschränkt — Konzernchef von Hilton sieht nicht Schend-Daten.

-- ROOMS: anon sieht alle aktiven Räume des Tenants (für Booking.tsx der Direct-URL eines Hotels)
-- Hier behalten wir absichtlich "anyone can view" für rooms damit die Booking-Page
-- der Marketing-Domain weiterhin geht. Tenant-Scoping passiert per Domain/Slug oben drauf.

-- BOOKINGS: Tenant-Scoping für Admin-Reads
DROP POLICY IF EXISTS "Admins view all bookings" ON public.bookings;
CREATE POLICY "Tenant admins view own bookings" ON public.bookings FOR SELECT
  USING (
    public.is_conexa_operator()
    OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins update bookings" ON public.bookings;
CREATE POLICY "Tenant admins update own bookings" ON public.bookings FOR UPDATE
  USING (
    public.is_conexa_operator()
    OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins delete bookings" ON public.bookings;
CREATE POLICY "Tenant admins delete own bookings" ON public.bookings FOR DELETE
  USING (
    public.is_conexa_operator()
    OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

-- TENANTS: Member sieht nur eigenen Tenant; Conexa-Operator sieht alle
CREATE POLICY "Members view own tenant" ON public.tenants FOR SELECT
  USING (
    public.is_conexa_operator()
    OR id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

-- TENANT_MEMBERS: Member sieht nur Memberships seines Tenants; Operator alle
CREATE POLICY "Members view own tenant memberships" ON public.tenant_members FOR SELECT
  USING (
    public.is_conexa_operator()
    OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

-- ---------- 7. audit_log ----------
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id),
  actor_id UUID,                  -- auth.users.id, NULL für anon/system
  actor_email TEXT,
  actor_role TEXT,                -- "owner", "admin", "conexa_admin", "anon", "system"
  action TEXT NOT NULL,           -- "booking.create", "booking.cancel", "operator.access_grant", …
  entity_type TEXT,               -- "booking", "room", "tenant", …
  entity_id UUID,
  reason TEXT,                    -- bei Operator-Zugriff: Support-Ticket-Nr o.ä.
  metadata JSONB,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_tenant_time ON public.audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_audit_actor_time ON public.audit_log(actor_id, created_at DESC);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view own tenant audit log" ON public.audit_log FOR SELECT
  USING (
    public.is_conexa_operator()
    OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

-- Insert-Policy: jeder authentifizierte User kann in seinem Tenant Events loggen
-- (per RPC + SECURITY DEFINER würden wir das eigentlich besser steuern, aber für
-- jetzt halten wir's einfach — Client kann nur seinen eigenen Tenant referenzieren)
CREATE POLICY "Members log into own tenant audit" ON public.audit_log FOR INSERT
  WITH CHECK (
    public.is_conexa_operator()
    OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
  );

-- ---------- 8. create_booking RPC: tenant_id automatisch setzen ----------
-- Anonyme Booking-Engine kennt keinen Tenant — wir leiten ihn aus der Room ab,
-- die der Gast bucht. Damit landet jede Buchung im richtigen Tenant ohne dass
-- der Frontend-Client das selbst entscheiden muss.

CREATE OR REPLACE FUNCTION public.create_booking(
  p_room_id     UUID,
  p_check_in    DATE,
  p_check_out   DATE,
  p_guest_name  TEXT,
  p_guest_email TEXT,
  p_guest_phone TEXT,
  p_extras      UUID[] DEFAULT '{}',
  p_notes       TEXT   DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room       public.rooms%ROWTYPE;
  v_nights     INT;
  v_room_total NUMERIC := 0;
  v_extras_total NUMERIC := 0;
  v_total      NUMERIC := 0;
  v_booking_id UUID := gen_random_uuid();
  v_booking_number TEXT;
  v_extras_resolved JSONB := '[]'::JSONB;
  v_overlapping INT;
BEGIN
  -- Input validation (unchanged)
  IF p_room_id IS NULL OR p_check_in IS NULL OR p_check_out IS NULL THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'missing required fields';
  END IF;
  IF p_check_in >= p_check_out THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'check_out must be after check_in';
  END IF;
  IF COALESCE(TRIM(p_guest_name), '') = '' OR LENGTH(p_guest_name) > 120 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_name';
  END IF;
  IF p_guest_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR LENGTH(p_guest_email) > 255 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_email';
  END IF;
  IF COALESCE(TRIM(p_guest_phone), '') = '' OR LENGTH(p_guest_phone) < 5 OR LENGTH(p_guest_phone) > 40 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'guest_phone';
  END IF;

  v_nights := (p_check_out - p_check_in)::INT;
  IF v_nights <= 0 OR v_nights > 60 THEN
    RAISE EXCEPTION 'Invalid request' USING HINT = 'nights out of range';
  END IF;

  -- Room laden — inkl. tenant_id für die Buchung
  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id;
  IF NOT FOUND OR v_room.status <> 'aktiv' THEN
    RAISE EXCEPTION 'Room not available';
  END IF;

  -- Overlap-Check (scoped via Foreign Key, alle Buchungen einer Room
  -- gehören demselben Tenant, daher kein Cross-Tenant-Leak)
  SELECT COUNT(*) INTO v_overlapping FROM public.bookings
   WHERE room_id = p_room_id
     AND payment_status <> 'cancelled'
     AND check_in < p_check_out
     AND check_out > p_check_in;
  IF v_overlapping > 0 THEN
    RAISE EXCEPTION 'Room not available' USING HINT = 'overlap';
  END IF;

  v_room_total := v_room.price_per_night * v_nights;

  IF array_length(p_extras, 1) > 0 THEN
    SELECT
      COALESCE(SUM(CASE WHEN e.per_night THEN e.price * v_nights ELSE e.price END), 0),
      COALESCE(jsonb_agg(jsonb_build_object(
        'id', e.id,
        'name', e.name,
        'price', e.price,
        'per_night', e.per_night
      )), '[]'::JSONB)
    INTO v_extras_total, v_extras_resolved
    FROM public.extras e
    WHERE e.id = ANY(p_extras) AND e.active = true AND e.tenant_id = v_room.tenant_id;
  END IF;

  v_total := v_room_total + v_extras_total;

  v_booking_number := 'LSC' || RIGHT(EXTRACT(EPOCH FROM clock_timestamp())::BIGINT::TEXT, 8);

  -- Insert inklusive tenant_id (aus der Room abgeleitet)
  INSERT INTO public.bookings (
    id, tenant_id, booking_number, room_id, guest_name, guest_email, guest_phone,
    check_in, check_out, total_price, extras, notes,
    booking_type, payment_status
  ) VALUES (
    v_booking_id, v_room.tenant_id, v_booking_number, p_room_id,
    TRIM(p_guest_name), p_guest_email, p_guest_phone,
    p_check_in, p_check_out, v_total, v_extras_resolved,
    NULLIF(LEFT(p_notes, 2000), ''),
    'online', 'pending'
  );

  -- Audit-Log-Eintrag für die neue Buchung
  INSERT INTO public.audit_log (tenant_id, actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (
    v_room.tenant_id, NULL, 'anon',
    'booking.create', 'booking', v_booking_id,
    jsonb_build_object('booking_number', v_booking_number, 'total_price', v_total, 'nights', v_nights)
  );

  RETURN jsonb_build_object(
    'booking_number', v_booking_number,
    'total_price',    v_total,
    'room_total',     v_room_total,
    'extras_total',   v_extras_total,
    'nights',         v_nights,
    'extras',         v_extras_resolved
  );
END;
$$;

-- Grants bleiben wie bisher (anon + authenticated)
-- (Funktion wurde via CREATE OR REPLACE neu definiert, Grants müssen nicht neu erteilt werden)
