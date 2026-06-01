export const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

// Date-only-Strings ("YYYY-MM-DD") als LOKALES Datum parsen — sonst liest
// `new Date("2026-06-10")` als UTC-Mitternacht und verschiebt den Tag in
// negativen Zeitzonen (internationale Gaeste sehen Check-in/-out 1 Tag falsch).
// Datetime-Strings (created_at mit Zeit/Zone) bleiben unangetastet.
const parseLocal = (d: Date | string): Date => {
  if (d instanceof Date) return d;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(d);
};

export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parseLocal(d));

export const formatDateShort = (d: Date | string) =>
  new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(parseLocal(d));

export const nightsBetween = (from: Date, to: Date) => {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
};

export const toISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
