import { useTenant } from "@/hooks/useTenant";
import { getFeatureState, type FeatureKey, type FeatureState } from "@/lib/tenant";

/**
 * Liefert den Feature-State für ein Modul des aktuellen Tenants.
 * Solange der Tenant lädt → "hidden" (sicheres Default).
 */
export function useFeature(key: FeatureKey): {
  state: FeatureState;
  isActive: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  loading: boolean;
  config: Record<string, unknown> | undefined;
} {
  const { tenant, loading } = useTenant();

  if (loading || !tenant) {
    return { state: "hidden", isActive: false, isDisabled: false, isHidden: true, loading, config: undefined };
  }

  const state = getFeatureState(tenant.features, key);
  return {
    state,
    isActive: state === "active",
    isDisabled: state === "disabled",
    isHidden: state === "hidden",
    loading: false,
    config: tenant.features[key] as Record<string, unknown> | undefined,
  };
}
