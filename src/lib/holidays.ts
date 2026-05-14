/**
 * Deutsche Feiertage — bundesweit + Rheinland-Pfalz (Schend liegt in RP).
 * Ergänzbar: weitere Bundesländer als Code-Konstanten unten.
 */

export type GermanRegion = "RP" | "BY" | "BW" | "NRW" | "HE" | "SL" | "SN" | "ST" | "TH" | "BB" | "BE" | "HB" | "HH" | "MV" | "NI" | "SH";

export type Holiday = {
  name: string;
  /** undefined = bundesweit; sonst Liste der Bundesländer in denen der Tag Feiertag ist */
  regions?: GermanRegion[];
};

/** Ostern (Sonntag) nach Meeus/Jones/Butcher — gültig für alle Jahre des gregorianischen Kalenders. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const iso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

/** Liste aller relevanten Feiertage für ein Jahr (bundesweit + alle länderspezifischen). */
function holidaysForYear(year: number): Map<string, Holiday> {
  const easter = easterSunday(year);
  const map = new Map<string, Holiday>();

  // ----- Bundesweite Feiertage -----
  map.set(iso(new Date(year, 0, 1)),  { name: "Neujahr" });
  map.set(iso(addDays(easter, -2)),    { name: "Karfreitag" });
  map.set(iso(addDays(easter, 1)),     { name: "Ostermontag" });
  map.set(iso(new Date(year, 4, 1)),   { name: "Tag der Arbeit" });
  map.set(iso(addDays(easter, 39)),    { name: "Christi Himmelfahrt" });
  map.set(iso(addDays(easter, 50)),    { name: "Pfingstmontag" });
  map.set(iso(new Date(year, 9, 3)),   { name: "Tag der Deutschen Einheit" });
  map.set(iso(new Date(year, 11, 25)), { name: "1. Weihnachtsfeiertag" });
  map.set(iso(new Date(year, 11, 26)), { name: "2. Weihnachtsfeiertag" });

  // ----- Regional -----
  // Heilige Drei Könige — BW, BY, ST
  map.set(iso(new Date(year, 0, 6)),   { name: "Heilige Drei Könige", regions: ["BW", "BY", "ST"] });
  // Internationaler Frauentag — BE, MV
  map.set(iso(new Date(year, 2, 8)),   { name: "Internationaler Frauentag", regions: ["BE", "MV"] });
  // Fronleichnam — BW, BY, HE, NRW, RP, SL
  map.set(iso(addDays(easter, 60)),    { name: "Fronleichnam", regions: ["BW", "BY", "HE", "NRW", "RP", "SL"] });
  // Mariä Himmelfahrt — BY (teilweise), SL
  map.set(iso(new Date(year, 7, 15)),  { name: "Mariä Himmelfahrt", regions: ["BY", "SL"] });
  // Weltkindertag — TH
  map.set(iso(new Date(year, 8, 20)),  { name: "Weltkindertag", regions: ["TH"] });
  // Reformationstag — BB, HB, HH, MV, NI, SN, ST, SH, TH
  map.set(iso(new Date(year, 9, 31)),  { name: "Reformationstag", regions: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"] });
  // Allerheiligen — BW, BY, NRW, RP, SL
  map.set(iso(new Date(year, 10, 1)),  { name: "Allerheiligen", regions: ["BW", "BY", "NRW", "RP", "SL"] });
  // Buß- und Bettag — SN
  // Always the Wednesday before Nov 23. Skipped for simplicity (only one state).

  return map;
}

const cache = new Map<number, Map<string, Holiday>>();

/**
 * Liefert den Feiertags-Namen für ein Datum, falls es in der angegebenen Region (oder bundesweit) ein Feiertag ist.
 * `region` default RP (Schend / Vulkaneifel).
 */
export function getHoliday(date: Date | string, region: GermanRegion = "RP"): Holiday | null {
  const isoStr = typeof date === "string" ? date : iso(date);
  const year = Number(isoStr.slice(0, 4));
  let yearMap = cache.get(year);
  if (!yearMap) {
    yearMap = holidaysForYear(year);
    cache.set(year, yearMap);
  }
  const h = yearMap.get(isoStr);
  if (!h) return null;
  // Bundesweit → immer; sonst nur wenn Region passt
  if (!h.regions || h.regions.includes(region)) return h;
  return null;
}
