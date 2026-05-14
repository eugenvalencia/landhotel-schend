import type { TenantBranding } from "@/lib/tenant";

/**
 * Übernimmt Tenant-spezifische Brand-Farben in die CSS-Custom-Properties am
 * <html>-Element. Damit kann das gleiche Dashboard für verschiedene Tenants
 * unterschiedlich aussehen, ohne Code-Forks.
 *
 * Erwartet die HSL-Werte als String "H S% L%" (Tailwind-Format), nicht als hsl(...).
 * Beispiel:
 *   primary_hsl: "220 22% 13%"
 *
 * Nicht-gesetzte Werte bleiben unverändert (CSS-Default aus index.css).
 */
export function applyTenantBranding(branding: TenantBranding | null | undefined) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const map: Array<[keyof TenantBranding, string]> = [
    ["primary_hsl", "--primary"],
    ["secondary_hsl", "--secondary"],
    ["accent_hsl", "--accent"],
  ];

  for (const [key, cssVar] of map) {
    const value = branding?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      root.style.setProperty(cssVar, value);
    } else {
      // Entferne ggf. vorher gesetzten Override, damit Default aus index.css greift.
      root.style.removeProperty(cssVar);
    }
  }
}
