import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { FeaturesMap, Tenant, TenantBranding } from "@/lib/tenant";

type TenantsRow = {
  id: string;
  slug: string;
  name: string;
  features: FeaturesMap | null;
  branding: TenantBranding | null;
  state: Tenant["state"];
  created_at: string;
  updated_at: string;
};

/**
 * Lädt den Tenant für den eingeloggten User. Erwartet eine Zeile in
 * tenant_members, die User → Tenant verknüpft.
 *
 * Solange Conexa OS Single-Tenant pro User ist, reicht der erste Treffer.
 * Wenn später Operator-Mode kommt (mehrere Tenants pro User), erweitern wir
 * das hier um einen aktiven Tenant-Switcher.
 */
export function useTenant() {
  const { user, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setTenant(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const { data: membership, error: memErr } = await (supabase as any)
          .from("tenant_members")
          .select("tenant_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (memErr) throw memErr;
        if (!membership) {
          if (!cancelled) {
            setTenant(null);
            setLoading(false);
          }
          return;
        }

        const { data: row, error: tenantErr } = await (supabase as any)
          .from("tenants")
          .select("id, slug, name, features, branding, state, created_at, updated_at")
          .eq("id", membership.tenant_id)
          .maybeSingle();

        if (tenantErr) throw tenantErr;
        if (cancelled) return;

        if (row) {
          const r = row as TenantsRow;
          setTenant({
            id: r.id,
            slug: r.slug,
            name: r.name,
            features: r.features ?? {},
            branding: r.branding ?? {},
            state: r.state,
            created_at: r.created_at,
            updated_at: r.updated_at,
          });
        } else {
          setTenant(null);
        }
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { tenant, loading, error };
}
