import type { ReactNode } from "react";
import { useFeature } from "@/hooks/useFeature";
import type { FeatureKey, FeatureState } from "@/lib/tenant";

interface FeatureProps {
  /** Welches Modul wir abfragen. */
  feature: FeatureKey;
  /**
   * Welche States rendern sollen. Default `["active"]` — nur live geschaltete
   * Module. Wenn du z.B. eine Disabled-Card zeigen willst: `["disabled"]`.
   */
  states?: FeatureState[];
  /** Was rendern, wenn der State nicht in `states` enthalten ist. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Render-Gate auf Basis des Tenant-Feature-State.
 *
 * Beispiele:
 *   <Feature feature="online_payments">         → nur wenn aktiv
 *   <Feature feature="channel_manager" states={["disabled"]}><AktivierenCard/></Feature>
 */
export function Feature({ feature, states = ["active"], fallback = null, children }: FeatureProps) {
  const { state, loading } = useFeature(feature);
  if (loading) return null;
  if (!states.includes(state)) return <>{fallback}</>;
  return <>{children}</>;
}
