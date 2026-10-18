// Weihnachtskarte 2026 — EINE Quelle für sichtbare Karte UND JSON-LD.
//
// Inhalt 1:1 von der gedruckten Weihnachtskarte des Hauses (Fotos Eugen,
// 18.10.2026). Nichts ergänzt, nichts umformuliert, nichts weggelassen.
// ⚠ Zwei Quellen für dieselbe Karte laufen auseinander — dann steht im
// JSON-LD ein anderer Preis als auf der Seite. Deshalb nur diese Datei.

/** Samstag — nachgerechnet, nicht angenommen. */
export const WEIHNACHTSFEIER = {
  /** ISO für schema.org/Event. Uhrzeit bewusst OFFEN: sie ist uns nicht
   *  genannt worden, und eine erfundene Uhrzeit wäre irreführend. */
  datumIso: "2026-12-26",
  datumLang: "Samstag, 26. Dezember 2026",
  datumKurz: "Sa, 26.12.2026",
  /** Reine Ziffernform fuer das Band im Hero — Eugens Wortlaut vom
   *  18.10.2026: „Weihnachten bei uns am 26.12.2026, Info ansehen". */
  datumZiffern: "26.12.2026",
  /** Eugen, 18.10.2026: „nur nach vorheriger Reservierung". */
  nurMitReservierung: true,
  /** Reservierungsschluss ist noch nicht bestätigt — bis dahin steht hier
   *  nichts. Lieber keine Frist als eine erfundene (§ 5 UWG). */
  reservierungsschluss: null as string | null,
} as const;

export type WeihnachtsGang = {
  key: string;
  /** Überschrift wie auf der Karte, z. B. „Menü 2: Weihnachtlicher Klassiker". */
  name: string;
  beschreibung: string;
  /** Zahl fürs JSON-LD (Punkt), Text für die Anzeige (Komma). Beides aus
   *  einer Hand, damit die Anzeige nie vom Schema abweicht. */
  preis: number;
  preisText: string;
};

export type WeihnachtsAbschnitt = {
  key: string;
  titel: string;
  gaenge: WeihnachtsGang[];
};

export const WEIHNACHTSKARTE: WeihnachtsAbschnitt[] = [
  {
    key: "auftakt",
    titel: "Für den genussvollen Auftakt",
    gaenge: [
      {
        key: "festtagssuppe",
        name: "Festtagssuppe",
        beschreibung:
          "Rinderkraftbrühe mit verschiedenen Klößchen und Gemüsestreifen",
        preis: 7.0,
        preisText: "7,00 €",
      },
      {
        key: "salat",
        name: "Salat vom Buffet",
        beschreibung: "",
        preis: 5.0,
        preisText: "5,00 €",
      },
    ],
  },
  {
    key: "menues",
    titel: "Die Weihnachtsmenüs",
    gaenge: [
      {
        key: "menue-1",
        name: "Menü 1: Vegetarischer Weihnachtsgenuss",
        beschreibung:
          "gebackener Camembert auf Apfelrotkohl, dazu Rosmarinkartoffeln und Preiselbeeren",
        preis: 15.5,
        preisText: "15,50 €",
      },
      {
        key: "menue-2",
        name: "Menü 2: Weihnachtlicher Klassiker",
        beschreibung:
          "zarte Rinderroulade mit traditionellen Klößen und aromatischem Rotkohl",
        preis: 24.5,
        preisText: "24,50 €",
      },
      {
        key: "menue-3",
        name: "Menü 3: Knuspriger Festtagsgenuss",
        beschreibung:
          "knusprig gebratenes Hähnchenschnitzel mit feiner Preiselbeersauce, Buttergemüse und goldbraunen Herzoginkartoffeln",
        preis: 19.5,
        preisText: "19,50 €",
      },
      {
        key: "menue-4",
        name: "Menü 4: Festliches aus dem Wasser",
        beschreibung:
          "auf der Haut gebratenes Zanderfilet serviert mit cremigem Rahmwirsing und Butterkartoffeln",
        preis: 26.0,
        preisText: "26,00 €",
      },
    ],
  },
  {
    key: "abschluss",
    titel: "Süßer Abschluss",
    gaenge: [
      {
        key: "dessert",
        name: "Weihnachtlicher Dessertteller",
        beschreibung: "",
        preis: 8.5,
        preisText: "8,50 €",
      },
    ],
  },
];

/** Begrüßung von der gedruckten Karte — wörtlich, nicht umgeschrieben. */
export const WEIHNACHTS_INTRO =
  "Freuen Sie sich auf festliche Köstlichkeiten, liebevoll zubereitet und serviert. Bei unseren Weihnachtsmenüs ist für jeden Geschmack etwas dabei.";

/** Günstigster Gang — für „ab"-Angaben, damit keine Zahl von Hand gepflegt
 *  wird und bei einer Preisänderung stehen bleibt. */
export const WEIHNACHT_AB_PREIS = Math.min(
  ...WEIHNACHTSKARTE.flatMap((a) => a.gaenge.map((g) => g.preis)),
);

/**
 * Steht das Goldband im Hero der Startseite?
 *   "band" — ja, über den beiden Knöpfen (Eugens Wahl vom 18.10.2026)
 *   "aus"  — nein
 *
 * ⚠ Nach dem 26.12.2026 auf "aus" stellen. Die Seite selbst darf bleiben —
 * ein abgelaufener Termin im Hero wirkt wie eine verlassene Seite.
 */
export const HERO_EINSTIEG: "band" | "aus" = "band";
