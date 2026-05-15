import type { TenantBranding } from "@/lib/tenant";

/**
 * Übernimmt Tenant-spezifische Brand-Farben in die CSS-Custom-Properties am
 * <html>-Element. Damit kann das gleiche Dashboard für verschiedene Tenants
 * unterschiedlich aussehen, ohne Code-Forks.
 *
 * Erwartet die HSL-Werte als String "H S% L%" (Tailwind-Format), nicht als hsl(...).
 *
 * **Wichtig:** Wenn ein Tenant `primary_hsl` setzt, muss er auch
 * `primary_foreground_hsl` setzen — sonst entstehen Kontrastfehler im
 * Dark-Mode, weil der Default-Foreground nicht zum neuen Background passt.
 * Wir lassen Lücken bewusst auf den index.css-Default zurückfallen, statt
 * unsichtbaren Text zu erzeugen.
 *
 * Nicht-gesetzte Werte werden zurückgesetzt, damit Default aus index.css greift.
 */

const BRAND_MAP: Array<[keyof TenantBranding, string]> = [
  ["primary_hsl", "--primary"],
  ["primary_foreground_hsl", "--primary-foreground"],
  ["secondary_hsl", "--secondary"],
  ["secondary_foreground_hsl", "--secondary-foreground"],
  ["accent_hsl", "--accent"],
  ["accent_foreground_hsl", "--accent-foreground"],
];

export function applyTenantBranding(branding: TenantBranding | null | undefined) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  for (const [key, cssVar] of BRAND_MAP) {
    const value = (branding as Record<string, unknown> | null | undefined)?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      root.style.setProperty(cssVar, value);
    } else {
      root.style.removeProperty(cssVar);
    }
  }
}
