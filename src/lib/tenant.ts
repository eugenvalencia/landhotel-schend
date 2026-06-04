/**
 * Tenant + Feature-Flag Types — Single source of truth für Multi-Tenant Conexa OS.
 *
 * Eine Tenant-Zeile hält:
 *   - `features` JSONB: pro Modul ein State (active|disabled|hidden) + optionaler Config-Block
 *   - `branding` JSONB: HSL-Werte für CSS-Variablen, damit das Dashboard per-Tenant anders aussehen kann
 *
 * Diese Datei spiegelt das Datenbank-Schema in TypeScript, weil supabase/types.ts
 * (auto-generiert) die `tenants`-Tabelle noch nicht kennt. Wenn types.ts neu
 * generiert wird, bleibt diese Datei trotzdem die UI-seitige Wahrheit für Feature-Logik.
 */

export type FeatureState = "active" | "disabled" | "hidden";

export type FeatureKey =
  | "calendar"
  | "bookings"
  | "internal_bookings"
  | "housekeeping_mobile"
  | "guest_profiles"
  | "hyperlocal_concierge"
  | "online_payments"
  | "channel_manager"
  | "voice_concierge"
  | "reviews_inbox"
  | "daily_briefing"
  | "guest_messaging"
  | "datev_export"
  | "compliance_vault"
  | "analytics_revenue"
  | "anomaly_detection"
  // WOW-Roadmap Wave 1
  | "smart_pricing"
  | "folio"
  | "shift_handover"
  | "service_tickets"
  | "express_checkin"
  | "group_bookings"
  | "cash_book"
  // WOW-Roadmap Wave 2
  | "no_show_backfill"
  | "stay_length_optimizer"
  | "auto_upsell"
  | "multilingual_concierge"
  | "lost_found";

export interface FeatureConfig {
  state: FeatureState;
  [extra: string]: unknown;
}

export type FeaturesMap = Partial<Record<FeatureKey, FeatureConfig>>;

export interface TenantBranding {
  primary_hsl?: string;
  primary_foreground_hsl?: string;
  secondary_hsl?: string;
  secondary_foreground_hsl?: string;
  accent_hsl?: string;
  accent_foreground_hsl?: string;
  logo_class?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  features: FeaturesMap;
  branding: TenantBranding;
  state: "active" | "paused" | "archived";
  created_at: string;
  updated_at: string;
}

/**
 * Default-State falls ein Modul in der Tenant-Config gar nicht erwähnt wird.
 * `hidden` ist sicher: lieber unsichtbar als versehentlich exponiert.
 */
export const DEFAULT_FEATURE_STATE: FeatureState = "hidden";

export function getFeatureState(features: FeaturesMap, key: FeatureKey): FeatureState {
  return features?.[key]?.state ?? DEFAULT_FEATURE_STATE;
}

/**
 * Modul-Katalog für Sidebar + Operator-Mode. Was hier nicht steht, gibt's nicht.
 * Reihenfolge bestimmt die Reihenfolge in der Sidebar.
 */
export interface ModuleDescriptor {
  key: FeatureKey;
  label: string;
  iconName: string;
  path: string;
  group: "alltag" | "gast" | "ops" | "intelligence" | "kommerz";
  shortPitch: string;
  whyDisabled?: string;
  /** Kern-Modul: immer sichtbar + aktiv, unabhängig von den Tenant-Feature-Flags. */
  core?: boolean;
}

export const MODULE_CATALOG: ModuleDescriptor[] = [
  { key: "calendar",            label: "Kalender",           iconName: "Calendar",       path: "calendar",            group: "alltag",       shortPitch: "Wer kommt wann, welcher Raum ist frei." },
  { key: "bookings",            label: "Buchungen",          iconName: "CalendarCheck",  path: "bookings",            group: "alltag",       shortPitch: "Gast-Anfragen bestätigen, Quellen (Direkt vs OTA) sehen.", core: true },
  { key: "internal_bookings",   label: "Notizbuch",          iconName: "NotebookPen",    path: "internal-bookings",   group: "alltag",       shortPitch: "Familien- und Hausbuchungen ohne Steuer-Spur." },
  { key: "housekeeping_mobile", label: "Reinigung",          iconName: "Sparkles",       path: "housekeeping",        group: "ops",          shortPitch: "Mobile Liste für die Etage." },
  { key: "guest_profiles",      label: "Gäste",              iconName: "Users",          path: "guests",              group: "gast",         shortPitch: "Bekannte Stammgäste mit Vorlieben." },
  { key: "hyperlocal_concierge",label: "Concierge",          iconName: "Compass",        path: "concierge",           group: "gast",         shortPitch: "Vulkaneifel-Tipps statt Google-Spam." },
  { key: "guest_messaging",     label: "Nachrichten",        iconName: "MessageSquare",  path: "messaging",           group: "gast",         shortPitch: "E-Mail/WhatsApp an Gäste — Vorlagen inklusive.",
    whyDisabled: "Schend pflegt persönlichen Telefon-Kontakt. Schaltest du frei, wenn du automatisierte Pre-Stay-Mails willst." },
  { key: "reviews_inbox",       label: "Bewertungen",        iconName: "Star",           path: "reviews",             group: "gast",         shortPitch: "Google/Booking/HRS in einer Inbox + AI-Antworten.",
    whyDisabled: "Aktuell beantwortest du Reviews manuell. AI-Antworten brauchen eigene Freischaltung." },
  { key: "voice_concierge",     label: "Telefon-KI",         iconName: "PhoneCall",      path: "voice",               group: "gast",         shortPitch: "24/7 deutscher Voice-Concierge nimmt Anrufe an.",
    whyDisabled: "Pilotbetrieb: aktivieren wenn Personal abends nicht mehr ans Telefon kann." },
  { key: "channel_manager",     label: "Channel Manager",    iconName: "Globe",          path: "channels",            group: "kommerz",      shortPitch: "Booking/HRS/Expedia automatisch synchron halten.",
    whyDisabled: "Schend bucht primär direkt. Aktivieren wenn OTA-Volumen wächst." },
  { key: "online_payments",     label: "Online-Zahlungen",   iconName: "CreditCard",     path: "payments",            group: "kommerz",      shortPitch: "Stripe-Zahlung beim Online-Booking.",
    whyDisabled: "Bewusst deaktiviert — Schend rechnet vor Ort ab, um Fraud zu vermeiden." },
  { key: "daily_briefing",      label: "Daily Briefing",     iconName: "Coffee",         path: "briefing",            group: "intelligence", shortPitch: "Morgen-Übersicht: Wer kommt, was ist los, Wetter, Müllabfuhr.",
    whyDisabled: "Aktivieren wenn das Frühstücks-Whiteboard digital werden soll." },
  { key: "analytics_revenue",   label: "Revenue & Analytics",iconName: "LineChart",      path: "analytics",           group: "intelligence", shortPitch: "Auslastung, RevPAR, Channel-Mix.",
    whyDisabled: "Hidden für Schend — bewusste Entscheidung." },
  { key: "anomaly_detection",   label: "Anomalie-Watch",     iconName: "ShieldAlert",    path: "anomaly",             group: "intelligence", shortPitch: "Erkennt verdächtige Buchungs- oder Zahlungs-Muster.",
    whyDisabled: "Hidden für Schend." },
  { key: "datev_export",        label: "DATEV-Export",       iconName: "FileSpreadsheet",path: "datev",               group: "intelligence", shortPitch: "Monatlicher Steuer-Export für die Buchhaltung.",
    whyDisabled: "Hidden für Schend — kein Online-Umsatz, kein Bedarf." },
  { key: "compliance_vault",    label: "Compliance-Vault",   iconName: "ShieldCheck",    path: "compliance",          group: "intelligence", shortPitch: "AVV, TOM-Dokumente, Subprozessoren-Liste.",
    whyDisabled: "Hidden für Schend — erst relevant für Multi-Tenant-Kunden." },

  // WOW-Roadmap Wave 1 — fertig fuer Demo
  { key: "smart_pricing",       label: "Smart-Pricing",      iconName: "TrendingUp",     path: "smart-pricing",       group: "kommerz",      shortPitch: "KI-Vorschlag pro Tag: optimaler Preis aus Vorjahr, Saison, Events." },
  { key: "folio",               label: "Folio",              iconName: "Receipt",        path: "folio",               group: "alltag",       shortPitch: "Laufende Zimmerrechnung: Bar, Restaurant, Zusatzbett — alles auf einer Rechnung." },
  { key: "shift_handover",      label: "Schicht-Übergabe",   iconName: "ClipboardList",  path: "handover",            group: "ops",          shortPitch: "Was die Spätschicht wissen muss — auf Knopfdruck zum Drucken." },
  { key: "service_tickets",     label: "Service-Tickets",    iconName: "Wrench",         path: "tickets",             group: "ops",          shortPitch: "Defekte, Wartung, Inventar — Tickets fürs Personal auf dem Handy." },
  { key: "express_checkin",     label: "Express-Check-in",   iconName: "ScanLine",       path: "express-checkin",     group: "gast",         shortPitch: "QR-Code + Pre-Check-in-Link, Empfangsdame entlastet." },
  { key: "group_bookings",      label: "Gruppen-Buchungen",  iconName: "Users2",         path: "group-bookings",      group: "alltag",       shortPitch: "Hochzeit, Firma, Reisegruppe — 12 Zimmer auf einmal anlegen." },
  { key: "cash_book",           label: "Tagesabschluss",     iconName: "Banknote",       path: "cash-book",           group: "intelligence", shortPitch: "Bar, Karte, Überweisung pro Tag — Kassensturz mit einem Blick." },

  // WOW-Roadmap Wave 2 — fertig fuer Demo
  { key: "no_show_backfill",      label: "No-Show-Backfill",   iconName: "CalendarX2",     path: "no-show-backfill",    group: "kommerz",      shortPitch: "Erkennt No-Shows in Echtzeit und schlägt Walk-in- oder Last-Minute-Akquise vor." },
  { key: "stay_length_optimizer", label: "Aufenthalts-Optimum",iconName: "CalendarClock",  path: "stay-length",         group: "intelligence", shortPitch: "Erkennt Lücken zwischen Buchungen und schlägt Verlängerungen vor." },
  { key: "auto_upsell",           label: "Auto-Up-Sell",       iconName: "Gift",           path: "upsell",              group: "kommerz",      shortPitch: "Frühstück-Upgrade, Spa, Late-Check-out — Vorschläge pro Anreise auf Knopfdruck." },
  { key: "multilingual_concierge",label: "Sprach-Concierge",   iconName: "Languages",      path: "multilingual",        group: "gast",         shortPitch: "Concierge-Tipps automatisch in DE/EN/NL/FR/IT für jeden Gast." },
  { key: "lost_found",            label: "Lost & Found",       iconName: "PackageSearch",  path: "lost-found",          group: "ops",          shortPitch: "Vergessene Sachen aufnehmen, Eigentümer finden, Rückversand verfolgen." },
];

export const MODULE_GROUP_LABEL: Record<ModuleDescriptor["group"], string> = {
  alltag: "Alltag",
  gast: "Gäste",
  ops: "Operations",
  kommerz: "Kommerz",
  intelligence: "Intelligenz",
};
