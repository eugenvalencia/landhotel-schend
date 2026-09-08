// Inhalt „Restaurant" je Locale. DE = EXAKT der bisherige Text. Eigenname
// „Landhaus Restaurant", Telefon, E-Mail, Adresse, Uhrzeiten bleiben unverändert.
import type { Locale } from "../index";

/**
 * ---------------------------------------------------------------------------
 * Die feste À-la-carte-Karte (Stand September 2026).
 *
 * ⚠ Gerichtname, Zusatzstoff-Nummern und Preise stehen NUR HIER — einmal für
 * alle vier Sprachen. Grund: „Preise und Zusatzstoff-Nummern sind in allen
 * Sprachen identisch" ist eine Zusicherung, die man nicht prüfen, sondern
 * bauen muss. Vier Kopien laufen irgendwann auseinander, ohne dass es jemandem
 * auffällt — hier ist das konstruktiv unmöglich.
 *
 * Gerichtnamen bleiben in JEDER Sprachfassung deutsch („Schnitzel Vulkan",
 * „Tafelspitz") — bei regionaler Küche üblich. Übersetzt werden nur
 * Abschnitts-Überschriften, Beschreibungen und Fußnoten (→ RestaurantMenuText).
 *
 * Quelle: Menuekarte_LandhausSchend_2026_09.pdf
 *       = public/speisekarte-landhaus-schend.pdf (steht als Download auf der Seite).
 * ---------------------------------------------------------------------------
 */
export interface MenuPrice {
  /** Anzeige auf der Seite, z. B. "7,50 €". */
  text: string;
  /** Maschinenlesbar — <data value> + schema.org Offer.price. */
  value: string;
  /** Nur wo ein Gericht zwei Größen hat (Pommes frites): Schlüssel des Größen-Labels. */
  size?: "gross" | "klein";
}
export interface MenuDish {
  /** Schlüssel der übersetzten Beschreibung (RestaurantMenuText.dishes). */
  key: string;
  name: string;
  /** Zusatzstoff-Nummern wie in der Karte, z. B. "3, 4, 11, 12, 20". */
  additives?: string;
  prices: MenuPrice[];
}
export interface MenuSection {
  /** Schlüssel der übersetzten Überschrift (RestaurantMenuText.sections). */
  key: string;
  dishes: MenuDish[];
  /**
   * Zuschläge, die NUR in diesem Abschnitt gelten. Im PDF stehen sie unter dem
   * jeweiligen Abschnitt — „zzgl. 3,00 € für Bratkartoffeln statt Pommes" gilt
   * eben nur dort, wo Pommes dabei sind, nicht für die ganze Karte.
   */
  extras?: { key: string; text: string; value: string }[];
}

/** Reihenfolge + Nummern der Zusatzstoff-Fußnote — sprachunabhängig. */
export const ADDITIVE_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "16", "17", "20"] as const;

export const MENU_SECTIONS: MenuSection[] = [
  {
    key: "suppen",
    dishes: [
      { key: "rinderkraftbruehe", name: "Rinderkraftbrühe", additives: "4, 20", prices: [{ text: "7,50 €", value: "7.50" }] },
      { key: "senfsueppchen", name: "Eifeler Senfsüppchen", additives: "4, 20", prices: [{ text: "6,00 €", value: "6.00" }] },
      { key: "zwiebelsuppe", name: "Zwiebelsuppe", prices: [{ text: "6,00 €", value: "6.00" }] },
      { key: "tagessuppe", name: "Tagessuppe", prices: [{ text: "5,50 €", value: "5.50" }] },
    ],
  },
  {
    key: "vorspeisen",
    dishes: [
      { key: "beilagensalat", name: "Beilagensalat", additives: "11, 12, 20", prices: [{ text: "5,00 €", value: "5.00" }] },
      { key: "tomate-mozzarella", name: "Tomate Mozzarella", additives: "20", prices: [{ text: "8,50 €", value: "8.50" }] },
      { key: "camembert", name: "Gebackener Camembert", additives: "11, 12, 20", prices: [{ text: "13,50 €", value: "13.50" }] },
    ],
  },
  {
    key: "zwischendurch",
    dishes: [
      { key: "salatteller", name: "Großer gemischter Salatteller", additives: "11, 12, 20", prices: [{ text: "13,00 €", value: "13.00" }] },
      { key: "strammer-max", name: "Strammer Max", additives: "20", prices: [{ text: "10,50 €", value: "10.50" }] },
      { key: "bratkartoffeln", name: "Bratkartoffeln", additives: "20", prices: [{ text: "12,50 €", value: "12.50" }] },
    ],
  },
  {
    key: "schnitzel",
    dishes: [
      { key: "champignonrahmschnitzel", name: "Champignonrahmschnitzel", additives: "3, 4, 11, 12, 20", prices: [{ text: "16,00 €", value: "16.00" }] },
      { key: "schnitzel-vulkan", name: "Schnitzel „Vulkan“", additives: "3, 4, 11, 12, 20", prices: [{ text: "16,50 €", value: "16.50" }] },
      { key: "zwiebelschnitzel", name: "Zwiebelschnitzel", additives: "3, 11, 12, 20", prices: [{ text: "16,00 €", value: "16.00" }] },
    ],
    extras: [
      { key: "beilagensalat", text: "5,00 €", value: "5.00" },
      { key: "bratkartoffeln", text: "3,00 €", value: "3.00" },
    ],
  },
  {
    key: "spezialitaeten",
    dishes: [
      { key: "medaillons", name: "Medaillons vom Schweinefilet", additives: "4, 20", prices: [{ text: "18,50 €", value: "18.50" }] },
      { key: "tafelspitz", name: "Tafelspitz mit Meerrettichsauce", prices: [{ text: "21,00 €", value: "21.00" }] },
      { key: "rumpsteak", name: "Rumpsteak mit Röstzwiebeln und Kräuterbutter", additives: "4, 11, 12, 20", prices: [{ text: "29,50 €", value: "29.50" }] },
      { key: "haehnchenbrust", name: "Gebratene Hähnchenbrust", additives: "11, 12", prices: [{ text: "18,50 €", value: "18.50" }] },
    ],
    extras: [{ key: "beilagensalat", text: "5,00 €", value: "5.00" }],
  },
  {
    key: "fisch",
    dishes: [
      { key: "zanderfilet", name: "Kross gebratenes Zanderfilet", additives: "11, 12, 20", prices: [{ text: "23,50 €", value: "23.50" }] },
      { key: "forelle", name: "Kradenbacher Forelle „Müllerin“", additives: "7, 11, 12, 20", prices: [{ text: "24,50 €", value: "24.50" }] },
    ],
  },
  {
    key: "vegetarisch",
    dishes: [
      { key: "serviettenknoedel", name: "Hausgemachte Serviettenknödel", prices: [{ text: "12,50 €", value: "12.50" }] },
      { key: "kartoffelroesti", name: "Eifeler Kartoffel Rösti", prices: [{ text: "14,50 €", value: "14.50" }] },
    ],
    extras: [{ key: "beilagensalat", text: "5,00 €", value: "5.00" }],
  },
  {
    key: "kinder",
    dishes: [
      {
        key: "pommes-rot-weiss",
        name: "Pommes frites, Rot-Weiß",
        additives: "1, 2, 4",
        // Einziges Gericht der Karte mit zwei Größen — deshalb zwei Preise.
        prices: [
          { text: "5,00 €", value: "5.00", size: "gross" },
          { text: "3,50 €", value: "3.50", size: "klein" },
        ],
      },
      { key: "kleines-schnitzel", name: "Kleines Schnitzel mit Pommes", additives: "1, 2, 4", prices: [{ text: "8,50 €", value: "8.50" }] },
      { key: "fischstaebchen", name: "Fischstäbchen mit Pommes", additives: "1, 2, 4", prices: [{ text: "8,50 €", value: "8.50" }] },
    ],
  },
  {
    key: "dessert",
    dishes: [
      { key: "sorbet", name: "Sorbet von schwarzen Johannisbeeren", additives: "1, 4, 5, 7", prices: [{ text: "5,50 €", value: "5.50" }] },
      { key: "gemischtes-eis", name: "Gemischtes Eis", additives: "1, 4, 7", prices: [{ text: "4,50 €", value: "4.50" }] },
      { key: "plus-sahne", name: "plus Sahne", prices: [{ text: "0,50 €", value: "0.50" }] },
      { key: "kuchen", name: "Kuchen (hausgemacht)", prices: [{ text: "3,50 €", value: "3.50" }] },
      { key: "vanille-gruetze", name: "Vanille Eis (3 Kugeln)", prices: [{ text: "6,50 €", value: "6.50" }] },
      { key: "vanille-schoko", name: "Vanille Eis (3 Kugeln)", prices: [{ text: "6,50 €", value: "6.50" }] },
      { key: "apfelstrudel", name: "Apfelstrudel", prices: [{ text: "7,00 €", value: "7.00" }] },
    ],
  },
];

/** Übersetzbarer Teil der Karte — Überschriften, Beschreibungen, Fußnoten. */
export interface RestaurantMenuText {
  eyebrow: string;
  h2: string;
  intro: string;
  /** Regionale Lieferanten (Seite 1 des PDF) — steht sonst nirgends auf der Site. */
  origin: string;
  pdfLabel: string;
  pdfMeta: string;
  additivesHint: string;
  /** Nur für Screenreader vor den Ziffern am Gericht. */
  additivesSr: string;
  additivesTitle: string;
  /** Nummer → Bezeichnung. Die Nummern kommen aus ADDITIVE_NUMBERS, nie von hier. */
  additives: Record<string, string>;
  panierNote: string;
  priceNote: string;
  /** Wort vor einem Abschnitts-Zuschlag ("zzgl."). */
  surcharge: string;
  sizes: { gross: string; klein: string };
  /** MenuSection.key → Überschrift. */
  sections: Record<string, string>;
  /** MenuDish.key → Beschreibung (fehlt, wo die Karte keine hat). */
  dishes: Record<string, string>;
  /** Extra.key → Text des Zuschlags. */
  extras: Record<string, string>;
}

export interface RestaurantContent {
  metaTitle: string;
  metaDescription: string;
  schemaDescription: string;
  heroAlt: string;
  heroH1: string;
  heroBadge: string;
  heroSubtitle: string;
  ctaReserve: string;
  ctaHotel: string;
  banner: string;
  hoursH3: string;
  hours: {
    guestsTitle: string;
    externalTitle: string;
    guests: { days: string; time: string; note: string }[];
    external: { days: string; time: string; note: string }[];
    holidayNote: string;
  };
  kitchenH3: string;
  kitchen: string[];
  kitchenNote: string;
  feastH3: string;
  feastText: string;
  feastNote: string;
  reserveEyebrow: string;
  reserveH2: string;
  phoneNote: string;
  mailSubject: string;
  mailNote: string;
  directionsEyebrow: string;
  directionsH2: string;
  regionLine: string;
  distances: string[];
  distancesNote: string;
  mapsLink: string;
  spreadAlt: string;
  spreadEyebrow: string;
  spreadH2: string;
  spreadText: string;
  spreadCta: string;
  // Hub-Spoke: kontextuelle Anker zu thematisch nahen Seiten.
  linkRooms: string;
  linkPackages: string;
  // GEO-Q&A: kurze sichtbare FAQ + FAQPage-JSON-LD (andere Formulierung als /faq).
  faqEyebrow: string;
  faqH2: string;
  faq: { q: string; a: string }[];
  // Feste À-la-carte-Karte — Struktur/Namen/Preise in MENU_SECTIONS, Text hier.
  menu: RestaurantMenuText;
}

export const restaurantContent: Record<Locale, RestaurantContent> = {
  de: {
    metaTitle: "Landhaus Restaurant — Eifeler Küche",
    metaDescription:
      "Eifeler Restaurant in Immerath/Vulkaneifel — auch für Tagesgäste. Halbpension, Festtafel für Feiern bis 70 Personen. Tisch reservieren: +49 6573 306.",
    schemaDescription:
      "Hauseigenes Eifeler Restaurant des Landhauses Schend in Immerath/Vulkaneifel. Regional-typische Küche mit wöchentlich wechselnder Speisekarte, auch für Tagesgäste offen. Halbpension, Festtafel für Hochzeiten und Familienfeiern bis 70 Personen.",
    heroAlt:
      "Gedeckter Tisch im Landhaus Restaurant Schend mit Schnitzelteller, Beilagen und einem Glas Wein",
    heroH1: "Landhaus Restaurant",
    heroBadge: "Eifeler Landküche · Anno 1856",
    heroSubtitle: "Regional. Ehrlich. Auch ohne Übernachtung.",
    ctaReserve: "Tisch reservieren →",
    ctaHotel: "Zum Hotel",
    banner: "Auch ohne Übernachtung — Einheimische und Vorbeireisende herzlich willkommen",
    hoursH3: "Öffnungszeiten",
    hours: {
      guestsTitle: "Für Übernachtungsgäste",
      externalTitle: "Für externe Gäste",
      guests: [
        { days: "Montag – Mittwoch", time: "17:30 – 20:00 Uhr", note: "Lassen Sie sich mit unserem täglich wechselnden 3-Gänge-Menü verwöhnen — Vorspeise, Hauptgang und Dessert, frisch und mit Liebe von Hand zubereitet. Besondere Wünsche? Sagen Sie uns gern Bescheid. (An diesen Tagen ohne À-la-carte.)" },
        { days: "Donnerstag – Sonntag", time: "17:30 – 20:00 Uhr", note: "Ganz nach Lust und Laune — 3-Gänge-Tagesmenü oder À-la-carte." },
        { days: "Sonntag", time: "12:00 – 14:00 Uhr", note: "Gönnen Sie sich ein gemütliches Mittagessen bei uns — wir bitten nur um eine Reservierung bis Samstag 12:00 Uhr." },
      ],
      external: [
        { days: "Montag – Mittwoch", time: "", note: "An diesen Tagen kochen wir exklusiv für unsere Übernachtungsgäste. Von Donnerstag bis Sonntag freuen wir uns aber auf Ihren Besuch!" },
        { days: "Donnerstag – Sonntag", time: "17:30 – 20:00 Uhr", note: "Schauen Sie gern vorbei — es erwartet Sie ein 3-Gänge-Tagesmenü oder die À-la-carte-Auswahl." },
        { days: "Sonntag", time: "12:00 – 14:00 Uhr", note: "Ein entspanntes Mittagessen am Sonntag — reservieren Sie einfach bis Samstag 12:00 Uhr." },
      ],
      holidayNote: "An Feiertagen ist unser Restaurant für Sie geöffnet — schauen Sie gern vorbei.",
    },
    kitchenH3: "Unsere Küche",
    kitchen: [
      "Eifeler Landküche — regional, ehrlich",
      "Frische Zutaten von Eifeler Höfen",
      "3-Gang-Menü (Halbpension auf Wunsch)",
      "Wildgerichte im Herbst, Spargel im Frühjahr",
    ],
    kitchenNote:
      "Unsere Speisekarte wechselt wöchentlich — das aktuelle Menü geben wir morgens bekannt.",
    feastH3: "Festtafel & Feiern",
    feastText:
      "Unser Festsaal verbindet historischen Charme mit gemütlicher Atmosphäre und fasst bis zu 70 Gäste — der perfekte Rahmen für Ihre Feier in stilvollem Ambiente. Hochzeiten, runde Geburtstage, Firmenessen — wir gestalten mit Ihnen individuell.",
    feastNote: "Anfrage telefonisch oder per E-Mail.",
    reserveEyebrow: "Reservieren",
    reserveH2: "Tisch sichern",
    phoneNote: "Wir sind gern persönlich für Sie da",
    mailSubject: "Tischreservierung",
    mailNote: "Antwort innerhalb von 24 Stunden",
    directionsEyebrow: "Anfahrt",
    directionsH2: "So finden Sie uns",
    regionLine: "Vulkaneifel · Rheinland-Pfalz",
    distances: ["Cochem · 25 Min", "Nürburgring · 30 Min", "Trier · 43 Min", "Köln · 94 Min"],
    distancesNote: "Fahrzeiten Richtwert, je nach Verkehr.",
    mapsLink: "In Google Maps öffnen →",
    spreadAlt:
      "Festlich eingedeckte Tafel im Landhaus Schend am Fenster mit Blick in den Garten — Rahmen für Feiern bis 70 Personen",
    spreadEyebrow: "Festsaal bis 70 Personen",
    spreadH2: "Ihre Feier in unserem Hause",
    spreadText:
      "Unser Festsaal verbindet historischen Charme mit gemütlicher Atmosphäre und bietet Platz für bis zu 70 Gäste — ein stilvoller Rahmen für Hochzeiten, runde Geburtstage oder das Firmenessen. Ob im kleinen Kreis oder mit großer Gesellschaft: Familie Beimler stellt gemeinsam mit Ihnen das passende Menü zusammen und kümmert sich liebevoll um jedes Detail — von der Tisch- und Saaldekoration über persönliche Menükarten bis zu Ihren ganz individuellen Wünschen. Erzählen Sie uns einfach von Ihrer Feier — wir freuen uns darauf.",
    spreadCta: "Anfrage besprechen",
    linkRooms: "Übernachten und am Abend hier essen? Unsere Zimmer im Landhaus",
    linkPackages: "Genießer-Pakete mit Halbpension ansehen",
    menu: {
      eyebrow: "À la carte",
      h2: "Unsere Speisekarte",
      intro:
        "Unsere feste Karte — dazu an jedem Abend ein wechselndes 3-Gänge-Tagesmenü und Saisonales wie Wild im Herbst und Spargel im Frühjahr. À la carte servieren wir von Donnerstag bis Sonntag.",
      origin:
        "Wir arbeiten ökologisch orientiert und beziehen unsere Waren hauptsächlich aus der Region: das Fleisch von den Metzgereien in Gillenfeld und von der Mosel, die Forellen von den Vulkan-Forellen in Kradenbach, Geflügel und Eier vom Geflügelhof Janshen in Ellscheid.",
      pdfLabel: "Speisekarte als PDF herunterladen",
      pdfMeta: "PDF · 1,2 MB · 6 Seiten · Stand September 2026",
      additivesHint: "Die Ziffern hinter den Gerichten verweisen auf die Zusatzstoffe unter der Karte.",
      additivesSr: "Zusatzstoffe: ",
      additivesTitle: "Zusatzstoffe",
      additives: {
        "1": "Farbstoffe",
        "2": "Konservierungsstoffe",
        "3": "Antioxidationsmittel",
        "4": "Geschmacksverstärker",
        "5": "Schwefeldioxid",
        "6": "geschwärzt",
        "7": "gewachst",
        "8": "mit Phosphat",
        "9": "Stärke",
        "10": "Milcheiweiß",
        "11": "Süßungsmittel",
        "12": "mit Zuckerart und Süßungsmittel",
        "16": "chininhaltig",
        "17": "coffeinhaltig",
        "20": "Jodsalz",
      },
      panierNote:
        "Da wir unser Paniermehl zum größten Teil selbst herstellen, könnten Körner bzw. Nussanteile beinhaltet sein.",
      priceNote: "Alle Preise in Euro, inklusive Mehrwertsteuer.",
      surcharge: "zzgl.",
      sizes: { gross: "groß", klein: "klein" },
      sections: {
        suppen: "Suppen",
        vorspeisen: "Vorspeisen",
        zwischendurch: "Für Zwischendurch",
        schnitzel: "Schnitzel",
        spezialitaeten: "Spezialitäten",
        fisch: "Fisch",
        vegetarisch: "Vegetarisch",
        kinder: "Für die kleinen Gäste",
        dessert: "Dessert",
      },
      dishes: {
        rinderkraftbruehe: "mit Einlage",
        senfsueppchen: "mit Croutons",
        "tomate-mozzarella": "mit Basilikum und Brot",
        camembert: "auf Salatnest",
        salatteller: "mit Brot",
        "strammer-max": "mit rohem Eifler Schinken und Spiegeleiern",
        bratkartoffeln: "mit Speck & Spiegelei",
        champignonrahmschnitzel: "mit Pommes frites",
        "schnitzel-vulkan": "mit gebratenen Speckscheiben und mit Käse überbacken, mit Pommes frites",
        zwiebelschnitzel: "mit Zwiebeln, Pommes frites und Kräuterbutter",
        medaillons: "auf Champignonrahmsauce, mit Kartoffelkroketten",
        tafelspitz: "mit Gemüsestreifen und Salzkartoffeln",
        rumpsteak: "mit Kartoffelrösti und Speckbohnen",
        haehnchenbrust: "auf Champignonrahmsauce, Bandnudeln mit Gemüse",
        zanderfilet: "mit Senfsauce, Salzkartoffeln",
        forelle: "mit Salzkartoffeln",
        serviettenknoedel: "auf Champignonrahmsauce",
        kartoffelroesti: "mit Apfel-Zwiebel Ragout und gemischtem Salat (vegan)",
        sorbet: "im Winzersekt",
        "gemischtes-eis": "(Vanille-, Erdbeer- und Schokoladeneis)",
        "vanille-gruetze": "mit Roter Grütze und Sahne",
        "vanille-schoko": "mit Schokoladensauce und Sahne",
        apfelstrudel: "mit 1 Kugel Vanilleeis und Sahne",
      },
      extras: {
        beilagensalat: "Gerne servieren wir Ihnen einen Beilagensalat zu allen Gerichten.",
        bratkartoffeln: "Statt Pommes frites servieren wir Ihnen gerne Bratkartoffeln.",
      },
    },
    faqEyebrow: "Gut zu wissen",
    faqH2: "Häufige Fragen zum Restaurant",
    faq: [
      {
        q: "Hat das Restaurant an Feiertagen geöffnet?",
        a: "Ja. An Feiertagen ist unser Restaurant für Sie geöffnet — auch wenn der Feiertag auf Montag bis Mittwoch fällt, also auf Tage, an denen wir sonst exklusiv für unsere Hotelgäste kochen. À-la-carte servieren wir regulär von Donnerstag bis Sonntag, 17:30 bis 20:00 Uhr, sonntags zusätzlich von 12:00 bis 14:00 Uhr.",
      },
      {
        q: "Gibt es eine feste Speisekarte?",
        a: "Unsere Speisekarte wechselt wöchentlich und folgt der Saison — Wildgerichte im Herbst, Spargel im Frühjahr. Das aktuelle Wochenmenü geben wir jeden Morgen bekannt. Auf Wunsch servieren wir ein 3-Gang-Menü, auch als Halbpension für Übernachtungsgäste.",
      },
      {
        q: "Wie viele Gäste fasst der Festsaal für eine Feier?",
        a: "Unser Festsaal fasst bis zu 70 Gäste und verbindet historischen Charme mit gemütlicher Atmosphäre — passend für Hochzeiten, runde Geburtstage oder Firmenessen. Menü oder Buffet stellen wir individuell mit Ihnen zusammen; Anfragen nehmen wir telefonisch oder per E-Mail entgegen.",
      },
    ],
  },

  en: {
    metaTitle: "Landhaus Restaurant — Eifel cuisine",
    metaDescription:
      "Eifel restaurant in Immerath/Volcanic Eifel, open to day guests too. Half board, banquet hall for up to 70. Reserve a table: +49 6573 306.",
    schemaDescription:
      "The Landhaus Schend's own Eifel restaurant in Immerath/Volcanic Eifel. Regional cuisine with a weekly changing menu, open to day guests too. Half board and a banquet hall for weddings and family celebrations of up to 70 people.",
    heroAlt:
      "Laid table at the Landhaus Schend restaurant with a schnitzel plate, sides and a glass of wine",
    heroH1: "Landhaus Restaurant",
    heroBadge: "Eifel country kitchen · Anno 1856",
    heroSubtitle: "Regional. Honest. No overnight stay required.",
    ctaReserve: "Reserve a table →",
    ctaHotel: "To the hotel",
    banner: "No overnight stay needed — locals and passing travellers warmly welcome",
    hoursH3: "Opening hours",
    hours: {
      guestsTitle: "For overnight guests",
      externalTitle: "For day guests",
      guests: [
        { days: "Monday – Wednesday", time: "5:30 – 8:00 pm", note: "Treat yourself to our daily changing three-course menu — starter, main and dessert, freshly prepared by hand with love. Any special wishes? Just let us know. (No à-la-carte on these days.)" },
        { days: "Thursday – Sunday", time: "5:30 – 8:00 pm", note: "Whatever you fancy — three-course menu of the day or à-la-carte." },
        { days: "Sunday", time: "12:00 – 2:00 pm", note: "Treat yourself to a relaxed lunch with us — we simply ask that you reserve by Saturday 12:00." },
      ],
      external: [
        { days: "Monday – Wednesday", time: "", note: "On these days we cook exclusively for our overnight guests. From Thursday to Sunday, however, we look forward to your visit!" },
        { days: "Thursday – Sunday", time: "5:30 – 8:00 pm", note: "Do drop by — a three-course menu of the day or our à-la-carte selection awaits you." },
        { days: "Sunday", time: "12:00 – 2:00 pm", note: "A relaxed Sunday lunch — simply reserve by Saturday 12:00." },
      ],
      holidayNote: "On public holidays our restaurant is open for you — do come and visit.",
    },
    kitchenH3: "Our kitchen",
    kitchen: [
      "Eifel country kitchen — regional, honest",
      "Fresh ingredients from Eifel farms",
      "Three-course menu (half board on request)",
      "Game in autumn, asparagus in spring",
    ],
    kitchenNote:
      "Our menu changes weekly — we announce the day's menu each morning.",
    feastH3: "Banquets & celebrations",
    feastText:
      "Our banquet hall combines historic charm with a cosy atmosphere and seats up to 70 guests — the perfect setting for your celebration in stylish surroundings. Weddings, milestone birthdays, company dinners — we plan it individually with you.",
    feastNote: "Enquire by phone or email.",
    reserveEyebrow: "Reserve",
    reserveH2: "Secure a table",
    phoneNote: "We're always happy to help in person",
    mailSubject: "Table reservation",
    mailNote: "Reply within 24 hours",
    directionsEyebrow: "Getting here",
    directionsH2: "How to find us",
    regionLine: "Volcanic Eifel · Rhineland-Palatinate",
    distances: ["Cochem · 25 min", "Nürburgring · 30 min", "Trier · 43 min", "Cologne · 94 min"],
    distancesNote: "Driving times are approximate and depend on traffic.",
    mapsLink: "Open in Google Maps →",
    spreadAlt:
      "Festively laid table by the window at Landhaus Schend with a view into the garden — a setting for celebrations of up to 70 people",
    spreadEyebrow: "Banquet hall for up to 70",
    spreadH2: "Your celebration at our house",
    spreadText:
      "Our banquet hall combines historic charm with a cosy atmosphere and seats up to 70 guests — a stylish setting for weddings, milestone birthdays or the company dinner. Whether a small gathering or a large party: the Beimler family puts together the right menu together with you and lovingly attends to every detail — from table and hall decoration to personal menu cards and your very own individual wishes. Just tell us about your celebration — we look forward to it.",
    spreadCta: "Discuss your enquiry",
    linkRooms: "Staying over and dining here in the evening? Our rooms at the Landhaus",
    linkPackages: "See our gourmet packages with half board",
    menu: {
      eyebrow: "À la carte",
      h2: "Our menu",
      intro:
        "Our regular menu — plus a changing three-course menu of the day every evening and seasonal dishes such as game in autumn and asparagus in spring. We serve à la carte from Thursday to Sunday.",
      origin:
        "We work with an ecological mindset and source our produce mainly from the region: the meat from the butchers in Gillenfeld and on the Moselle, the trout from the Vulkan-Forellen fish farm in Kradenbach, poultry and eggs from the Janshen poultry farm in Ellscheid.",
      pdfLabel: "Download the menu as a PDF",
      pdfMeta: "PDF · 1.2 MB · 6 pages · as of September 2026",
      additivesHint: "The numbers after each dish refer to the additives listed below the menu.",
      additivesSr: "Additives: ",
      additivesTitle: "Additives",
      additives: {
        "1": "colourings",
        "2": "preservatives",
        "3": "antioxidants",
        "4": "flavour enhancers",
        "5": "sulphur dioxide",
        "6": "blackened",
        "7": "waxed",
        "8": "with phosphate",
        "9": "starch",
        "10": "milk protein",
        "11": "sweeteners",
        "12": "with sugar and sweeteners",
        "16": "contains quinine",
        "17": "contains caffeine",
        "20": "iodised salt",
      },
      panierNote:
        "As we make most of our breadcrumbs ourselves, they may contain grains or traces of nuts.",
      priceNote: "All prices in euros, including VAT.",
      surcharge: "plus",
      sizes: { gross: "large", klein: "small" },
      sections: {
        suppen: "Soups",
        vorspeisen: "Starters",
        zwischendurch: "Light bites",
        schnitzel: "Schnitzel",
        spezialitaeten: "Specialities",
        fisch: "Fish",
        vegetarisch: "Vegetarian",
        kinder: "For our little guests",
        dessert: "Dessert",
      },
      dishes: {
        rinderkraftbruehe: "beef consommé with garnish",
        senfsueppchen: "Eifel mustard soup with croutons",
        "tomate-mozzarella": "with basil and bread",
        camembert: "baked camembert on a bed of salad",
        salatteller: "large mixed salad platter with bread",
        "strammer-max": "with raw Eifel ham and fried eggs",
        bratkartoffeln: "pan-fried potatoes with bacon & fried egg",
        champignonrahmschnitzel: "schnitzel in a creamy mushroom sauce, with chips",
        "schnitzel-vulkan": "with fried bacon slices, gratinated with cheese, with chips",
        zwiebelschnitzel: "with onions, chips and herb butter",
        medaillons: "pork fillet medallions on a creamy mushroom sauce, with potato croquettes",
        tafelspitz: "boiled beef with horseradish sauce, vegetable strips and boiled potatoes",
        rumpsteak: "with fried onions and herb butter, potato rösti and beans in bacon",
        haehnchenbrust: "pan-fried chicken breast on a creamy mushroom sauce, ribbon pasta with vegetables",
        zanderfilet: "crisply fried pikeperch fillet with mustard sauce, boiled potatoes",
        forelle: "trout from Kradenbach, meunière style, with boiled potatoes",
        serviettenknoedel: "home-made napkin dumplings on a creamy mushroom sauce",
        kartoffelroesti: "Eifel potato rösti with apple and onion ragout and mixed salad (vegan)",
        sorbet: "blackcurrant sorbet in sparkling wine",
        "gemischtes-eis": "(vanilla, strawberry and chocolate ice cream)",
        "vanille-gruetze": "with red berry compote and cream",
        "vanille-schoko": "with chocolate sauce and cream",
        apfelstrudel: "with one scoop of vanilla ice cream and cream",
      },
      extras: {
        beilagensalat: "We are happy to serve a side salad with any of these dishes.",
        bratkartoffeln: "We will gladly serve pan-fried potatoes instead of chips.",
      },
    },
    faqEyebrow: "Good to know",
    faqH2: "Frequently asked about the restaurant",
    faq: [
      {
        q: "Is the restaurant open on public holidays?",
        a: "Yes. On public holidays our restaurant is open for you — even when the holiday falls on Monday to Wednesday, the days when we otherwise cook exclusively for our hotel guests. Our regular à-la-carte hours are Thursday to Sunday from 5:30 to 8:00 pm, plus Sunday lunch from 12:00 to 2:00 pm.",
      },
      {
        q: "Is there a fixed menu?",
        a: "Our menu changes weekly and follows the season — game in autumn, asparagus in spring. We announce the current week's menu each morning. On request we serve a three-course menu, also as half board for overnight guests.",
      },
      {
        q: "How many guests does the banquet hall hold for a celebration?",
        a: "Our banquet hall seats up to 70 guests and combines historic charm with a cosy atmosphere — ideal for weddings, milestone birthdays or company dinners. We put together the menu or buffet individually with you; enquiries are welcome by phone or email.",
      },
    ],
  },

  fr: {
    metaTitle: "Restaurant du Landhaus — cuisine de l'Eifel",
    metaDescription:
      "Restaurant de l'Eifel à Immerath/Eifel volcanique, ouvert aux visiteurs d'un jour. Demi-pension, salle de fête jusqu'à 70 personnes. Réserver : +49 6573 306.",
    schemaDescription:
      "Le restaurant de l'Eifel propre au Landhaus Schend à Immerath/Eifel volcanique. Cuisine régionale avec une carte qui change chaque semaine, ouvert aussi aux visiteurs d'un jour. Demi-pension et salle des fêtes pour mariages et fêtes de famille jusqu'à 70 personnes.",
    heroAlt:
      "Table dressée au restaurant du Landhaus Schend avec escalope, garnitures et un verre de vin",
    heroH1: "Restaurant du Landhaus",
    heroBadge: "Cuisine régionale de l'Eifel · Anno 1856",
    heroSubtitle: "Régional. Authentique. Même sans nuitée.",
    ctaReserve: "Réserver une table →",
    ctaHotel: "Vers l'hôtel",
    banner: "Même sans nuitée — habitants et voyageurs de passage sont les bienvenus",
    hoursH3: "Horaires d'ouverture",
    hours: {
      guestsTitle: "Pour les hôtes en chambre",
      externalTitle: "Pour les visiteurs d'un jour",
      guests: [
        { days: "Lundi – mercredi", time: "17h30 – 20h00", note: "Laissez-vous séduire par notre menu trois plats qui change chaque jour — entrée, plat et dessert, préparés à la main, frais et avec amour. Des envies particulières ? Dites-le-nous volontiers. (Pas de carte ces jours-là.)" },
        { days: "Jeudi – dimanche", time: "17h30 – 20h00", note: "Selon votre envie — menu du jour trois plats ou à la carte." },
        { days: "Dimanche", time: "12h00 – 14h00", note: "Offrez-vous un déjeuner convivial chez nous — nous vous demandons simplement de réserver avant samedi 12h00." },
      ],
      external: [
        { days: "Lundi – mercredi", time: "", note: "Ces jours-là, nous cuisinons exclusivement pour nos hôtes en chambre. Du jeudi au dimanche, en revanche, nous nous réjouissons de votre visite !" },
        { days: "Jeudi – dimanche", time: "17h30 – 20h00", note: "Passez nous voir — un menu du jour trois plats ou la sélection à la carte vous attend." },
        { days: "Dimanche", time: "12h00 – 14h00", note: "Un déjeuner détendu le dimanche — réservez simplement avant samedi 12h00." },
      ],
      holidayNote: "Les jours fériés, notre restaurant vous accueille — passez nous voir.",
    },
    kitchenH3: "Notre cuisine",
    kitchen: [
      "Cuisine régionale de l'Eifel — authentique",
      "Produits frais des fermes de l'Eifel",
      "Menu trois plats (demi-pension sur demande)",
      "Gibier en automne, asperges au printemps",
    ],
    kitchenNote:
      "Notre carte change chaque semaine — nous annonçons le menu du jour chaque matin.",
    feastH3: "Tables de fête & célébrations",
    feastText:
      "Notre salle des fêtes allie charme historique et atmosphère chaleureuse et accueille jusqu'à 70 convives — le cadre idéal pour votre célébration dans une ambiance élégante. Mariages, anniversaires marquants, dîners d'entreprise — nous concevons tout sur mesure avec vous.",
    feastNote: "Demande par téléphone ou par e-mail.",
    reserveEyebrow: "Réserver",
    reserveH2: "Réserver une table",
    phoneNote: "Nous sommes là pour vous, en personne",
    mailSubject: "Réservation de table",
    mailNote: "Réponse sous 24 heures",
    directionsEyebrow: "Accès",
    directionsH2: "Comment nous trouver",
    regionLine: "Eifel volcanique · Rhénanie-Palatinat",
    distances: ["Cochem · 25 min", "Nürburgring · 30 min", "Trèves · 43 min", "Cologne · 94 min"],
    distancesNote: "Temps de trajet indicatifs, selon le trafic.",
    mapsLink: "Ouvrir dans Google Maps →",
    spreadAlt:
      "Table de fête dressée près de la fenêtre au Landhaus Schend avec vue sur le jardin — cadre pour des célébrations jusqu'à 70 personnes",
    spreadEyebrow: "Salle des fêtes jusqu'à 70 personnes",
    spreadH2: "Votre fête dans notre maison",
    spreadText:
      "Notre salle des fêtes allie charme historique et atmosphère chaleureuse et accueille jusqu'à 70 convives — un cadre élégant pour mariages, anniversaires marquants ou dîner d'entreprise. En petit comité ou en grande compagnie : la famille Beimler élabore avec vous le menu adapté et veille avec soin à chaque détail — de la décoration de table et de salle aux menus personnalisés, jusqu'à vos souhaits les plus particuliers. Parlez-nous simplement de votre fête — nous nous en réjouissons d'avance.",
    spreadCta: "Discuter de votre demande",
    linkRooms: "Séjourner et dîner ici le soir ? Nos chambres au Landhaus",
    linkPackages: "Voir nos forfaits gourmands en demi-pension",
    menu: {
      eyebrow: "À la carte",
      h2: "Notre carte",
      intro:
        "Notre carte fixe — à laquelle s'ajoutent chaque soir un menu du jour trois plats qui change et des plats de saison comme le gibier en automne et les asperges au printemps. Nous servons à la carte du jeudi au dimanche.",
      origin:
        "Nous travaillons dans un esprit écologique et nous approvisionnons principalement dans la région : la viande auprès des boucheries de Gillenfeld et de la Moselle, les truites de la pisciculture Vulkan-Forellen à Kradenbach, la volaille et les œufs de la ferme avicole Janshen à Ellscheid.",
      pdfLabel: "Télécharger la carte en PDF",
      pdfMeta: "PDF · 1,2 Mo · 6 pages · à jour de septembre 2026",
      additivesHint: "Les chiffres après chaque plat renvoient aux additifs indiqués sous la carte.",
      additivesSr: "Additifs : ",
      additivesTitle: "Additifs",
      additives: {
        "1": "colorants",
        "2": "conservateurs",
        "3": "antioxydants",
        "4": "exhausteurs de goût",
        "5": "dioxyde de soufre",
        "6": "noirci",
        "7": "ciré",
        "8": "avec phosphate",
        "9": "amidon",
        "10": "protéines de lait",
        "11": "édulcorants",
        "12": "avec sucre et édulcorants",
        "16": "contient de la quinine",
        "17": "contient de la caféine",
        "20": "sel iodé",
      },
      panierNote:
        "Comme nous fabriquons nous-mêmes la majeure partie de notre chapelure, elle peut contenir des céréales ou des fruits à coque.",
      priceNote: "Tous les prix en euros, TVA comprise.",
      surcharge: "en sus",
      sizes: { gross: "grande", klein: "petite" },
      sections: {
        suppen: "Potages",
        vorspeisen: "Entrées",
        zwischendurch: "Petites faims",
        schnitzel: "Escalopes",
        spezialitaeten: "Spécialités",
        fisch: "Poissons",
        vegetarisch: "Végétarien",
        kinder: "Pour les petits convives",
        dessert: "Desserts",
      },
      dishes: {
        rinderkraftbruehe: "consommé de bœuf avec garniture",
        senfsueppchen: "velouté à la moutarde de l'Eifel avec croûtons",
        "tomate-mozzarella": "avec basilic et pain",
        camembert: "camembert pané sur nid de salade",
        salatteller: "grande assiette de salades variées avec pain",
        "strammer-max": "avec jambon cru de l'Eifel et œufs au plat",
        bratkartoffeln: "pommes de terre sautées avec lard et œuf au plat",
        champignonrahmschnitzel: "escalope à la crème de champignons, avec frites",
        "schnitzel-vulkan": "avec tranches de lard poêlées, gratinée au fromage, avec frites",
        zwiebelschnitzel: "avec oignons, frites et beurre aux herbes",
        medaillons: "médaillons de filet de porc sur sauce crémeuse aux champignons, avec croquettes de pommes de terre",
        tafelspitz: "bœuf bouilli, sauce au raifort, julienne de légumes et pommes de terre à l'eau",
        rumpsteak: "avec oignons frits et beurre aux herbes, rösti de pommes de terre et haricots au lard",
        haehnchenbrust: "blanc de poulet poêlé sur sauce crémeuse aux champignons, tagliatelles aux légumes",
        zanderfilet: "filet de sandre croustillant, sauce moutarde, pommes de terre à l'eau",
        forelle: "truite de Kradenbach à la meunière, avec pommes de terre à l'eau",
        serviettenknoedel: "quenelles maison sur sauce crémeuse aux champignons",
        kartoffelroesti: "rösti de pommes de terre de l'Eifel, ragoût pomme-oignon et salade mixte (végane)",
        sorbet: "sorbet de cassis au crémant",
        "gemischtes-eis": "(glaces vanille, fraise et chocolat)",
        "vanille-gruetze": "avec compote de fruits rouges et crème chantilly",
        "vanille-schoko": "avec sauce au chocolat et crème chantilly",
        apfelstrudel: "avec 1 boule de glace vanille et crème chantilly",
      },
      extras: {
        beilagensalat: "Nous servons volontiers une petite salade d'accompagnement avec chacun de ces plats.",
        bratkartoffeln: "Nous remplaçons volontiers les frites par des pommes de terre sautées.",
      },
    },
    faqEyebrow: "Bon à savoir",
    faqH2: "Questions fréquentes sur le restaurant",
    faq: [
      {
        q: "Le restaurant est-il ouvert les jours fériés ?",
        a: "Oui. Les jours fériés, notre restaurant vous accueille — même si le jour férié tombe du lundi au mercredi, jours où nous cuisinons sinon exclusivement pour nos hôtes en chambre. Nos horaires à la carte sont du jeudi au dimanche de 17h30 à 20h00, et le dimanche également de 12h00 à 14h00.",
      },
      {
        q: "Y a-t-il une carte fixe ?",
        a: "Notre carte change chaque semaine et suit la saison — gibier en automne, asperges au printemps. Nous annonçons le menu de la semaine chaque matin. Sur demande, nous servons un menu trois plats, également en demi-pension pour les hôtes en chambre.",
      },
      {
        q: "Combien d'invités la salle des fêtes peut-elle accueillir ?",
        a: "Notre salle des fêtes accueille jusqu'à 70 convives et allie charme historique et atmosphère chaleureuse — idéale pour mariages, anniversaires marquants ou dîners d'entreprise. Nous composons le menu ou le buffet sur mesure avec vous ; demandes par téléphone ou par e-mail.",
      },
    ],
  },

  nl: {
    metaTitle: "Landhaus-restaurant — Eifeler keuken",
    metaDescription:
      "Eifeler restaurant in Immerath/Vulkaneifel — ook voor dagjesgasten. Halfpension, feesttafel voor vieringen tot 70 personen. Tafel reserveren: +49 6573 306.",
    schemaDescription:
      "Het eigen Eifeler restaurant van Landhaus Schend in Immerath/Vulkaneifel. Regionale keuken met een wekelijks wisselende kaart, ook open voor dagjesgasten. Halfpension en een feestzaal voor bruiloften en familiefeesten tot 70 personen.",
    heroAlt:
      "Gedekte tafel in het restaurant van Landhaus Schend met schnitzel, bijgerechten en een glas wijn",
    heroH1: "Landhaus-restaurant",
    heroBadge: "Eifeler streekkeuken · Anno 1856",
    heroSubtitle: "Regionaal. Eerlijk. Ook zonder overnachting.",
    ctaReserve: "Tafel reserveren →",
    ctaHotel: "Naar het hotel",
    banner: "Ook zonder overnachting — buurtbewoners en passanten van harte welkom",
    hoursH3: "Openingstijden",
    hours: {
      guestsTitle: "Voor overnachtende gasten",
      externalTitle: "Voor dagjesgasten",
      guests: [
        { days: "Maandag – woensdag", time: "17:30 – 20:00 uur", note: "Laat u verwennen met ons dagelijks wisselende driegangenmenu — voorgerecht, hoofdgerecht en dessert, vers en met liefde met de hand bereid. Bijzondere wensen? Laat het ons gerust weten. (Op deze dagen geen à la carte.)" },
        { days: "Donderdag – zondag", time: "17:30 – 20:00 uur", note: "Geheel naar wens — driegangen-dagmenu of à la carte." },
        { days: "Zondag", time: "12:00 – 14:00 uur", note: "Gun uzelf een gezellige lunch bij ons — wij vragen u alleen om uiterlijk zaterdag 12:00 uur te reserveren." },
      ],
      external: [
        { days: "Maandag – woensdag", time: "", note: "Op deze dagen koken wij exclusief voor onze overnachtende gasten. Van donderdag tot en met zondag verheugen wij ons echter op uw bezoek!" },
        { days: "Donderdag – zondag", time: "17:30 – 20:00 uur", note: "Kom gerust langs — een driegangen-dagmenu of de à-la-cartekeuze staat voor u klaar." },
        { days: "Zondag", time: "12:00 – 14:00 uur", note: "Een ontspannen lunch op zondag — reserveer eenvoudig uiterlijk zaterdag 12:00 uur." },
      ],
      holidayNote: "Op feestdagen is ons restaurant voor u geopend — kom gerust langs.",
    },
    kitchenH3: "Onze keuken",
    kitchen: [
      "Eifeler streekkeuken — regionaal, eerlijk",
      "Verse ingrediënten van Eifeler boerderijen",
      "Driegangenmenu (halfpension op verzoek)",
      "Wildgerechten in de herfst, asperges in het voorjaar",
    ],
    kitchenNote:
      "Onze kaart wisselt wekelijks — het menu van de dag maken wij 's ochtends bekend.",
    feastH3: "Feesttafel & vieringen",
    feastText:
      "Onze feestzaal combineert historische charme met een gezellige sfeer en biedt plaats aan tot 70 gasten — het perfecte kader voor uw viering in een stijlvolle ambiance. Bruiloften, ronde verjaardagen, bedrijfsdiners — wij geven er samen met u individueel vorm aan.",
    feastNote: "Aanvraag telefonisch of per e-mail.",
    reserveEyebrow: "Reserveren",
    reserveH2: "Tafel vastleggen",
    phoneNote: "Wij staan persoonlijk voor u klaar",
    mailSubject: "Tafelreservering",
    mailNote: "Antwoord binnen 24 uur",
    directionsEyebrow: "Route",
    directionsH2: "Zo vindt u ons",
    regionLine: "Vulkaneifel · Rijnland-Palts",
    distances: ["Cochem · 25 min", "Nürburgring · 30 min", "Trier · 43 min", "Keulen · 94 min"],
    distancesNote: "Reistijden bij benadering, afhankelijk van het verkeer.",
    mapsLink: "Openen in Google Maps →",
    spreadAlt:
      "Feestelijk gedekte tafel bij het raam in Landhaus Schend met uitzicht op de tuin — kader voor vieringen tot 70 personen",
    spreadEyebrow: "Feestzaal tot 70 personen",
    spreadH2: "Uw feest in ons huis",
    spreadText:
      "Onze feestzaal combineert historische charme met een gezellige sfeer en biedt plaats aan tot 70 gasten — een stijlvol kader voor bruiloften, ronde verjaardagen of het bedrijfsdiner. Of het nu in kleine kring of met groot gezelschap is: de familie Beimler stelt samen met u het passende menu samen en zorgt liefdevol voor elk detail — van de tafel- en zaaldecoratie en persoonlijke menukaarten tot uw heel eigen individuele wensen. Vertel ons gewoon over uw feest — wij verheugen ons erop.",
    spreadCta: "Aanvraag bespreken",
    linkRooms: "Overnachten en hier 's avonds dineren? Onze kamers in het Landhaus",
    linkPackages: "Bekijk onze genietersarrangementen met halfpension",
    menu: {
      eyebrow: "À la carte",
      h2: "Onze menukaart",
      intro:
        "Onze vaste kaart — daarnaast elke avond een wisselend driegangen-dagmenu en seizoensgerechten zoals wild in de herfst en asperges in het voorjaar. À la carte serveren wij van donderdag tot en met zondag.",
      origin:
        "Wij werken ecologisch bewust en betrekken onze producten hoofdzakelijk uit de regio: het vlees van de slagerijen in Gillenfeld en aan de Moezel, de forellen van de Vulkan-Forellen in Kradenbach, gevogelte en eieren van pluimveebedrijf Janshen in Ellscheid.",
      pdfLabel: "Menukaart als pdf downloaden",
      pdfMeta: "PDF · 1,2 MB · 6 pagina's · stand september 2026",
      additivesHint: "De cijfers achter de gerechten verwijzen naar de additieven onder de kaart.",
      additivesSr: "Additieven: ",
      additivesTitle: "Additieven",
      additives: {
        "1": "kleurstoffen",
        "2": "conserveermiddelen",
        "3": "antioxidanten",
        "4": "smaakversterkers",
        "5": "zwaveldioxide",
        "6": "gezwart",
        "7": "gewaxt",
        "8": "met fosfaat",
        "9": "zetmeel",
        "10": "melkeiwit",
        "11": "zoetstoffen",
        "12": "met suikersoort en zoetstof",
        "16": "bevat kinine",
        "17": "bevat cafeïne",
        "20": "jodiumzout",
      },
      panierNote:
        "Omdat wij ons paneermeel grotendeels zelf maken, kan het granen- of notenbestanddelen bevatten.",
      priceNote: "Alle prijzen in euro's, inclusief btw.",
      surcharge: "meerprijs",
      sizes: { gross: "groot", klein: "klein" },
      sections: {
        suppen: "Soepen",
        vorspeisen: "Voorgerechten",
        zwischendurch: "Voor tussendoor",
        schnitzel: "Schnitzels",
        spezialitaeten: "Specialiteiten",
        fisch: "Vis",
        vegetarisch: "Vegetarisch",
        kinder: "Voor de kleine gasten",
        dessert: "Dessert",
      },
      dishes: {
        rinderkraftbruehe: "runderbouillon met garnituur",
        senfsueppchen: "Eifeler mosterdsoepje met croutons",
        "tomate-mozzarella": "met basilicum en brood",
        camembert: "gebakken camembert op een bedje van salade",
        salatteller: "grote gemengde saladeschotel met brood",
        "strammer-max": "met rauwe Eifeler ham en spiegeleieren",
        bratkartoffeln: "gebakken aardappelen met spek & spiegelei",
        champignonrahmschnitzel: "schnitzel met champignonroomsaus, met friet",
        "schnitzel-vulkan": "met gebakken spekplakjes, gegratineerd met kaas, met friet",
        zwiebelschnitzel: "met uien, friet en kruidenboter",
        medaillons: "medaillons van varkenshaas op champignonroomsaus, met aardappelkroketten",
        tafelspitz: "gekookt rundvlees met mierikswortelsaus, groentereepjes en gekookte aardappelen",
        rumpsteak: "met gebakken uien en kruidenboter, aardappelrösti en spekboontjes",
        haehnchenbrust: "gebakken kipfilet op champignonroomsaus, lintpasta met groenten",
        zanderfilet: "krokant gebakken snoekbaarsfilet met mosterdsaus, gekookte aardappelen",
        forelle: "forel uit Kradenbach op meunière-wijze, met gekookte aardappelen",
        serviettenknoedel: "huisgemaakte servetknoedels op champignonroomsaus",
        kartoffelroesti: "Eifeler aardappelrösti met appel-uienragout en gemengde salade (vegan)",
        sorbet: "sorbet van zwarte bessen in mousserende wijn",
        "gemischtes-eis": "(vanille-, aardbeien- en chocolade-ijs)",
        "vanille-gruetze": "met rode grutten en slagroom",
        "vanille-schoko": "met chocoladesaus en slagroom",
        apfelstrudel: "met 1 bolletje vanille-ijs en slagroom",
      },
      extras: {
        beilagensalat: "Bij al deze gerechten serveren wij graag een bijgerecht-salade.",
        bratkartoffeln: "In plaats van friet serveren wij u graag gebakken aardappelen.",
      },
    },
    faqEyebrow: "Goed om te weten",
    faqH2: "Veelgestelde vragen over het restaurant",
    faq: [
      {
        q: "Is het restaurant op feestdagen geopend?",
        a: "Ja. Op feestdagen is ons restaurant voor u geopend — ook als de feestdag op maandag tot en met woensdag valt, de dagen waarop wij anders exclusief voor onze hotelgasten koken. Onze reguliere à-la-cartetijden zijn donderdag tot en met zondag van 17:30 tot 20:00 uur, en op zondag bovendien van 12:00 tot 14:00 uur.",
      },
      {
        q: "Is er een vaste kaart?",
        a: "Onze kaart wisselt wekelijks en volgt het seizoen — wildgerechten in de herfst, asperges in het voorjaar. Het menu van de week maken wij elke ochtend bekend. Op verzoek serveren wij een driegangenmenu, ook als halfpension voor overnachtende gasten.",
      },
      {
        q: "Hoeveel gasten biedt de feestzaal plaats voor een viering?",
        a: "Onze feestzaal biedt plaats aan tot 70 gasten en combineert historische charme met een gezellige sfeer — ideaal voor bruiloften, ronde verjaardagen of bedrijfsdiners. Menu of buffet stellen wij samen met u op maat samen; aanvragen graag telefonisch of per e-mail.",
      },
    ],
  },
};
