// Inhalts-Modul „Über uns" (1856-Geschichte), gekeyed nach Locale.
// `de` = EXAKT der bisherige Text inkl. Inline-Markup (Jahres-Spans) → DE byte-gleich.
// Prosa als HTML-Strings (set:html im Component), damit die Hervorhebungen erhalten bleiben.
import type { Locale } from "../index";

const YEAR = (y: string) => `<span class="font-display text-primary">${y}</span>`;

export type AboutContent = {
  metaTitle: string;
  metaDescription: string;
  schemaDescription: string;
  eyebrow: string;
  h1: string;
  history: string[]; // HTML-Absätze
  altZeichnung: string;
  altHotelfront: string;
  gastgeberEyebrow: string;
  gastgeberH2: string;
  gastgeberText: string;
  timelineEyebrow: string;
  timelineH2: string; // HTML (mit Italic-Spans)
  timeline: { year: string; event: string }[];
  philoEyebrow: string;
  philoH2: string;
  philoText: string;
  values: { num: string; title: string; text: string }[];
};

export const aboutContent: Record<Locale, AboutContent> = {
  de: {
    metaTitle: "Über uns — Familienhotel seit 1856 in Immerath",
    metaDescription:
      "Die Geschichte des Landhaus Schend: 1856 als Gasthaus erbaut, heute ★★★ Superior Familienhotel in der Vulkaneifel — seit 2019 von Familie Beimler geführt.",
    schemaDescription:
      "Die Geschichte des Landhaus Schend in Immerath: seit 1856 als Gasthaus, heute ★★★ Superior Familienhotel — seit 2019 von Familie Beimler geführt.",
    eyebrow: "Über uns",
    h1: "Die Geschichte des Landhauses",
    history: [
      "Anno 1856 wurde das Grundhaus erbaut und diente bereits damals als Gasthaus und zeitweise auch als Poststelle für den Ort.",
      `${YEAR("1954")} übernahmen die Eheleute Änni und Leo Schneiders die elterliche Dorfgaststätte sowie den kleinbäuerlichen Selbstversorgungsbetrieb. ${YEAR("1970")} erweiterten sie den Betrieb um drei Gästezimmer mit fließendem Warm- und Kaltwasser und modernisierten die Dorfgaststätte.`,
      `Seit ${YEAR("1976")} arbeiteten Tochter Roswitha und Ehemann Reinhold im Betrieb mit, den die beiden ${YEAR("1993")} übernahmen. Nach dem Tod der Eltern stand das Ehepaar Schend vor der Wahl, den Betrieb aufzugeben oder zu investieren — sie entschlossen sich dafür und begannen ${YEAR("1995")} mit umfangreichen Umbaumaßnahmen: Das alte Ökonomiegebäude wurde abgerissen und ein neues Gästehaus mit 22 Betten sowie einem Speiseraum errichtet.`,
      `Zwei Jahre später, ${YEAR("1997")}, eröffneten sie das neue Gebäude unter dem Namen „Landhaus Schend". In den folgenden Jahren wuchs die Bettenzahl auf 44; ein Lift, ein moderner Speisesaal und ein gemütliches Kaminzimmer kamen hinzu. Seit ${YEAR("1999")} ist das Landhaus Schend mit 3 Sternen der Deutschen Hotelklassifizierung ausgezeichnet.`,
    ],
    altZeichnung: "Bleistift-Zeichnung des Landhaus Schend in Immerath mit Innenhof und Eingang",
    altHotelfront: "Landhaus Schend in Immerath mit Rosen vor der Fassade",
    gastgeberEyebrow: "Ihre Gastgeber",
    gastgeberH2: "Familie Beimler",
    gastgeberText:
      "Seit 2019 führt Familie Beimler das Landhaus Schend und setzt die über 170-jährige Tradition des Hauses mit Herzblut fort — herzlich, persönlich und authentisch eifelerisch.",
    timelineEyebrow: "170+ Jahre Gastfreundschaft",
    timelineH2:
      '<span class="font-display-italic font-light">Vom</span> Gasthaus 1856 <span class="font-display-italic font-light">bis</span> heute',
    timeline: [
      { year: "1856", event: "Grundhaus erbaut — Gasthaus & Poststelle" },
      { year: "1954", event: "Eheleute Schneiders übernehmen" },
      { year: "1970", event: "Erste 3 Gästezimmer mit Warmwasser" },
      { year: "1976", event: "Tochter Roswitha steigt ein" },
      { year: "1993", event: "Übernahme durch die Tochter" },
      { year: "1997", event: "Neueröffnung als „Landhaus Schend\"" },
      { year: "1999", event: "Erste 3-Sterne-Klassifizierung" },
      { year: "2019", event: "Übernahme durch Familie Beimler" },
      { year: "Heute", event: "21 Zimmer, ★★★ Superior — geführt von Familie Beimler" },
    ],
    philoEyebrow: "Was uns ausmacht",
    philoH2: "Unsere Philosophie",
    philoText:
      "Das Wohl unserer Gäste liegt uns am Herzen. Sie zu begeistern und zu verwöhnen ist die Philosophie unseres Hauses, die wir schon seit Bestehen pflegen und an unsere Mitarbeiter weitergeben — herzlich, persönlich und authentisch eifelerisch.",
    values: [
      { num: "01", title: "Herzlichkeit", text: "Persönlicher Service mit familiärer Atmosphäre — wir kennen unsere Gäste mit Namen." },
      { num: "02", title: "Qualität", text: "Regionale Eifeler Küche und liebevoll gestaltete Zimmer mit Charakter." },
      { num: "03", title: "Tradition", text: "Über 170 Jahre Gastfreundschaft an diesem Ort — bis heute mit Herz familiär geführt." },
    ],
  },
  en: {
    metaTitle: "About us — family hotel since 1856 in Immerath",
    metaDescription:
      "The story of Landhaus Schend: built as an inn in 1856, today a ★★★ Superior family hotel in the Volcanic Eifel — run by the Beimler family since 2019.",
    schemaDescription:
      "The story of Landhaus Schend in Immerath: an inn since 1856, today a ★★★ Superior family hotel — run by the Beimler family since 2019.",
    eyebrow: "About us",
    h1: "The story of the Landhaus",
    history: [
      "The original building was erected in 1856 and even then served as an inn and, at times, as the village post office.",
      `In ${YEAR("1954")}, Änni and Leo Schneiders took over the family's village tavern and the small self-sufficient farm. In ${YEAR("1970")} they expanded with three guest rooms with running hot and cold water and modernised the tavern.`,
      `From ${YEAR("1976")}, daughter Roswitha and her husband Reinhold worked in the business, which the two took over in ${YEAR("1993")}. After the parents passed away, the Schend couple faced the choice of giving up the business or investing — they chose to invest and began extensive rebuilding in ${YEAR("1995")}: the old farm building was demolished and a new guest house with 22 beds and a dining room was built.`,
      `Two years later, in ${YEAR("1997")}, they opened the new building under the name “Landhaus Schend”. Over the following years the number of beds grew to 44; a lift, a modern dining hall and a cosy fireplace lounge were added. Since ${YEAR("1999")} Landhaus Schend has held a 3-star German hotel classification.`,
    ],
    altZeichnung: "Pencil drawing of Landhaus Schend in Immerath with courtyard and entrance",
    altHotelfront: "Landhaus Schend in Immerath with roses in front of the façade",
    gastgeberEyebrow: "Your hosts",
    gastgeberH2: "The Beimler family",
    gastgeberText:
      "Since 2019 the Beimler family has run Landhaus Schend, continuing the house's 170-year tradition with heart and soul — warm, personal and authentically Eifel.",
    timelineEyebrow: "170+ years of hospitality",
    timelineH2:
      '<span class="font-display-italic font-light">From</span> the 1856 inn <span class="font-display-italic font-light">to</span> today',
    timeline: [
      { year: "1856", event: "Original building erected — inn & post office" },
      { year: "1954", event: "The Schneiders take over" },
      { year: "1970", event: "First 3 guest rooms with hot water" },
      { year: "1976", event: "Daughter Roswitha joins" },
      { year: "1993", event: "Taken over by the daughter" },
      { year: "1997", event: "Reopened as “Landhaus Schend”" },
      { year: "1999", event: "First 3-star classification" },
      { year: "2019", event: "Taken over by the Beimler family" },
      { year: "Today", event: "21 rooms, ★★★ Superior — run by the Beimler family" },
    ],
    philoEyebrow: "What defines us",
    philoH2: "Our philosophy",
    philoText:
      "The well-being of our guests is close to our hearts. Delighting and pampering them is the philosophy of our house — one we have nurtured since the very beginning and pass on to our team: warm, personal and authentically Eifel.",
    values: [
      { num: "01", title: "Warmth", text: "Personal service with a family atmosphere — we know our guests by name." },
      { num: "02", title: "Quality", text: "Regional Eifel cuisine and lovingly designed rooms with character." },
      { num: "03", title: "Tradition", text: "Over 170 years of hospitality in this spot — still run with heart as a family." },
    ],
  },
  fr: {
    metaTitle: "À propos — hôtel familial depuis 1856 à Immerath",
    metaDescription:
      "L'histoire du Landhaus Schend : construit comme auberge en 1856, aujourd'hui hôtel familial ★★★ Superior dans l'Eifel volcanique — tenu par la famille Beimler depuis 2019.",
    schemaDescription:
      "L'histoire du Landhaus Schend à Immerath : auberge depuis 1856, aujourd'hui hôtel familial ★★★ Superior — tenu par la famille Beimler depuis 2019.",
    eyebrow: "À propos",
    h1: "L'histoire du Landhaus",
    history: [
      "Le bâtiment d'origine fut érigé en 1856 et servait déjà à l'époque d'auberge et, par moments, de bureau de poste du village.",
      `En ${YEAR("1954")}, les époux Änni et Leo Schneiders reprirent l'auberge villageoise familiale ainsi que la petite exploitation agricole de subsistance. En ${YEAR("1970")}, ils ajoutèrent trois chambres d'hôtes avec eau chaude et froide courante et modernisèrent l'auberge.`,
      `À partir de ${YEAR("1976")}, la fille Roswitha et son mari Reinhold travaillèrent dans l'établissement, qu'ils reprirent en ${YEAR("1993")}. Après le décès des parents, le couple Schend dut choisir entre cesser l'activité ou investir — ils choisirent d'investir et entreprirent en ${YEAR("1995")} d'importants travaux : l'ancien bâtiment agricole fut démoli et une nouvelle maison d'hôtes de 22 lits avec une salle à manger fut construite.`,
      `Deux ans plus tard, en ${YEAR("1997")}, ils ouvrirent le nouveau bâtiment sous le nom de « Landhaus Schend ». Au fil des ans, le nombre de lits passa à 44 ; un ascenseur, une salle à manger moderne et un salon-cheminée chaleureux furent ajoutés. Depuis ${YEAR("1999")}, le Landhaus Schend est classé 3 étoiles selon la classification hôtelière allemande.`,
    ],
    altZeichnung: "Dessin au crayon du Landhaus Schend à Immerath avec cour intérieure et entrée",
    altHotelfront: "Le Landhaus Schend à Immerath avec des roses devant la façade",
    gastgeberEyebrow: "Vos hôtes",
    gastgeberH2: "La famille Beimler",
    gastgeberText:
      "Depuis 2019, la famille Beimler dirige le Landhaus Schend et perpétue avec passion la tradition plus que centenaire de la maison — chaleureuse, personnelle et authentiquement de l'Eifel.",
    timelineEyebrow: "Plus de 170 ans d'hospitalité",
    timelineH2:
      '<span class="font-display-italic font-light">De</span> l\'auberge de 1856 <span class="font-display-italic font-light">à</span> aujourd\'hui',
    timeline: [
      { year: "1856", event: "Bâtiment d'origine érigé — auberge & poste" },
      { year: "1954", event: "Les époux Schneiders reprennent" },
      { year: "1970", event: "Premières 3 chambres avec eau chaude" },
      { year: "1976", event: "La fille Roswitha rejoint l'affaire" },
      { year: "1993", event: "Reprise par la fille" },
      { year: "1997", event: "Réouverture sous « Landhaus Schend »" },
      { year: "1999", event: "Premier classement 3 étoiles" },
      { year: "2019", event: "Reprise par la famille Beimler" },
      { year: "Aujourd'hui", event: "21 chambres, ★★★ Superior — tenu par la famille Beimler" },
    ],
    philoEyebrow: "Ce qui nous définit",
    philoH2: "Notre philosophie",
    philoText:
      "Le bien-être de nos hôtes nous tient à cœur. Les enchanter et les choyer est la philosophie de notre maison, que nous cultivons depuis toujours et transmettons à notre équipe — chaleureuse, personnelle et authentiquement de l'Eifel.",
    values: [
      { num: "01", title: "Chaleur", text: "Un service personnel dans une ambiance familiale — nous connaissons nos hôtes par leur nom." },
      { num: "02", title: "Qualité", text: "Cuisine régionale de l'Eifel et chambres aménagées avec soin et caractère." },
      { num: "03", title: "Tradition", text: "Plus de 170 ans d'hospitalité en ce lieu — toujours dirigé avec cœur en famille." },
    ],
  },
  nl: {
    metaTitle: "Over ons — familiehotel sinds 1856 in Immerath",
    metaDescription:
      "Het verhaal van Landhaus Schend: in 1856 gebouwd als gasthuis, vandaag een ★★★ Superior familiehotel in de Vulkaaneifel — sinds 2019 geleid door familie Beimler.",
    schemaDescription:
      "Het verhaal van Landhaus Schend in Immerath: gasthuis sinds 1856, vandaag een ★★★ Superior familiehotel — sinds 2019 geleid door familie Beimler.",
    eyebrow: "Over ons",
    h1: "Het verhaal van het Landhaus",
    history: [
      "Het oorspronkelijke pand werd in 1856 gebouwd en deed toen al dienst als gasthuis en tijdelijk ook als postkantoor voor het dorp.",
      `In ${YEAR("1954")} namen het echtpaar Änni en Leo Schneiders de ouderlijke dorpsgaststätte en het kleine zelfvoorzienende boerenbedrijf over. In ${YEAR("1970")} breidden zij uit met drie gastenkamers met stromend warm en koud water en moderniseerden de gaststätte.`,
      `Vanaf ${YEAR("1976")} werkten dochter Roswitha en haar man Reinhold mee in het bedrijf, dat de twee in ${YEAR("1993")} overnamen. Na het overlijden van de ouders stond het echtpaar Schend voor de keuze het bedrijf op te geven of te investeren — ze kozen voor investeren en begonnen in ${YEAR("1995")} met een grote verbouwing: het oude bedrijfsgebouw werd gesloopt en een nieuw gastenhuis met 22 bedden en een eetzaal gebouwd.`,
      `Twee jaar later, in ${YEAR("1997")}, openden ze het nieuwe gebouw onder de naam „Landhaus Schend". In de jaren daarna groeide het aantal bedden naar 44; een lift, een moderne eetzaal en een gezellige haardkamer kwamen erbij. Sinds ${YEAR("1999")} draagt Landhaus Schend een 3-sterrenclassificatie van de Duitse hotelclassificatie.`,
    ],
    altZeichnung: "Potloodtekening van Landhaus Schend in Immerath met binnenplaats en ingang",
    altHotelfront: "Landhaus Schend in Immerath met rozen voor de gevel",
    gastgeberEyebrow: "Uw gastheren",
    gastgeberH2: "Familie Beimler",
    gastgeberText:
      "Sinds 2019 leidt familie Beimler Landhaus Schend en zet de ruim 170-jarige traditie van het huis met hart en ziel voort — hartelijk, persoonlijk en authentiek Eifels.",
    timelineEyebrow: "170+ jaar gastvrijheid",
    timelineH2:
      '<span class="font-display-italic font-light">Van</span> het gasthuis uit 1856 <span class="font-display-italic font-light">tot</span> vandaag',
    timeline: [
      { year: "1856", event: "Oorspronkelijk pand gebouwd — gasthuis & postkantoor" },
      { year: "1954", event: "Echtpaar Schneiders neemt over" },
      { year: "1970", event: "Eerste 3 gastenkamers met warm water" },
      { year: "1976", event: "Dochter Roswitha stapt in" },
      { year: "1993", event: "Overname door de dochter" },
      { year: "1997", event: "Heropend als „Landhaus Schend\"" },
      { year: "1999", event: "Eerste 3-sterrenclassificatie" },
      { year: "2019", event: "Overname door familie Beimler" },
      { year: "Vandaag", event: "21 kamers, ★★★ Superior — geleid door familie Beimler" },
    ],
    philoEyebrow: "Wat ons kenmerkt",
    philoH2: "Onze filosofie",
    philoText:
      "Het welzijn van onze gasten gaat ons aan het hart. Hen verrassen en verwennen is de filosofie van ons huis, die we sinds het begin koesteren en doorgeven aan ons team — hartelijk, persoonlijk en authentiek Eifels.",
    values: [
      { num: "01", title: "Hartelijkheid", text: "Persoonlijke service met een familiale sfeer — we kennen onze gasten bij naam." },
      { num: "02", title: "Kwaliteit", text: "Regionale Eifeler keuken en met zorg ingerichte kamers met karakter." },
      { num: "03", title: "Traditie", text: "Ruim 170 jaar gastvrijheid op deze plek — tot vandaag met hart als familie geleid." },
    ],
  },
};
