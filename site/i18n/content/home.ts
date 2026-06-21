// Inhalt der Startseite je Locale. DE = EXAKT der bisherige Text. Zimmer-/Paket-
// Karten ziehen lokalisierte Daten aus content/zimmer + content/pakete (keine Dopplung).
import type { Locale } from "../index";

const Y = (y: string) => `<span class="font-display text-primary">${y}</span>`;

export interface HomeQA { q: string; a: string }
export interface HomeTimeline { year: string; event: string }
export interface HomeContent {
  metaTitle: string;
  metaDescription: string;
  schemaHotelDescription: string;
  schemaInLanguage: string;
  // Hero
  heroBadge: string;
  heroH1: string;
  heroSubtitle: string;
  statTripadvisor: string;
  statBooking: string;
  statTradition: string;
  statRooms: string;
  ctaInquire: string;
  ctaRestaurant: string;
  callPrefix: string;
  scrollLabel: string;
  // USPs
  uspsAria: string;
  usps: string[];
  // Zimmer
  roomsH2: string;
  roomsIntro: string;
  roomCardEyebrow: string;
  allRoomsCta: string;
  // Anfrage-CTA-Streifen (zwischen Zimmer und Pakete)
  ctaStripTitle: string;
  ctaStripText: string;
  ctaStripButton: string;
  // Restaurant
  banner: string;
  bannerReserve: string;
  restImgAlt: string;
  restH2: string;
  restPara1: string;
  restPara2: string;
  hoursEyebrow: string;
  hoursThuSat: string;
  hoursThuSatTime: string;
  hoursSun: string;
  hoursSunT1: string;
  hoursSunT2: string;
  hoursRuhetag: string;
  hoursRuhetagDays: string;
  hoursNote: string;
  fullRestLink: string;
  fullRestSub: string;
  kitchenH3: string;
  card1Eyebrow: string;
  card1H4: string;
  card1Text: string;
  card1Note: string;
  card2Eyebrow: string;
  card2H4: string;
  card2Text: string;
  card2Note: string;
  reserveCta: string;
  feiernAlt: string;
  feiernH2: string;
  feiernText: string;
  // Pakete
  paketeH2: string;
  paketeIntro: string;
  paketBadgeLabel: string;
  mehrErfahren: string;
  // Region
  regionH2: string;
  regionIntro: string;
  mosaicAlts: string[];
  erdgeschichteEyebrow: string;
  freizeitH3: string;
  freizeitP1: string;
  freizeitP2: string;
  dreilaendH4: string;
  dreilaendP1: string;
  dreilaendP2: string;
  mehrRegion: string;
  // Über uns
  zeichnungAlt: string;
  aboutH2: string;
  aboutP1: string;
  aboutP2Html: string;
  ganzeGeschichte: string;
  timelineEyebrow: string;
  timelineH3Html: string;
  timeline: HomeTimeline[];
  // Bewertungen
  reviewsEyebrow: string;
  reviewsH2: string;
  reviewsIntro: string;
  platformLines: string[];
  platformReviewsWord: string;
  ansehen: string;
  reviewAriaPre: string;
  reviewAriaPost: string;
  // FAQ
  faqH2: string;
  faqHome: HomeQA[];
  allFaqCta: string;
  // Section-Dots
  dotLabels: string[];
}

export const homeContent: Record<Locale, HomeContent> = {
  de: {
    metaTitle: "3-Sterne-Hotel & Kurzurlaub in der Vulkaneifel",
    metaDescription:
      "Familiengeführtes 3-Sterne-Hotel in Immerath, Vulkaneifel — 21 Zimmer, Eifeler Landküche, Halbpension. Ideal zum Wandern. Provisionsfrei direkt buchen.",
    schemaHotelDescription:
      "Familiengeführtes 3-Sterne-Superior Landhaus in Immerath / Vulkaneifel mit 21 komfortablen Zimmern, hauseigenem Eifeler Restaurant und Halbpension auf Wunsch.",
    schemaInLanguage: "de-DE",
    heroBadge: "Anno 1856 · Vulkaneifel",
    heroH1: "Willkommen im Landhaus Schend",
    heroSubtitle:
      "Familiengeführtes ★★★ Superior Landhaus in der Vulkaneifel — Eifeler Landküche, Wander- und Radwege direkt vor der Tür, gastfreundlich seit 1856.",
    statTripadvisor: "4,0/5 Tripadvisor",
    statBooking: "/10 Booking",
    statTradition: "Jahre Tradition",
    statRooms: "Komfortzimmer",
    ctaInquire: "Jetzt anfragen",
    ctaRestaurant: "Im Restaurant essen",
    callPrefix: "oder anrufen",
    scrollLabel: "Scroll",
    uspsAria: "Im Haus inbegriffen",
    usps: [
      "Kostenlose Parkplätze im Hof",
      "Motorrad-Stellplätze im Hof",
      "Halbpension auf Wunsch",
      "Hauseigenes Restaurant",
      "21 Komfortzimmer",
      "Kostenloses WLAN",
      "Großes Frühstücksbuffet",
      "Booking.com 8,7 · Nr. 1 in Immerath laut Tripadvisor",
    ],
    roomsH2: "Zu Gast im Landhaus Schend",
    roomsIntro:
      "Komfortable Doppelzimmer (auch zur Einzelnutzung) und großzügige Familienzimmer mit Blick in die Vulkaneifel. Frühstücksbuffet inklusive.",
    roomCardEyebrow: "Zimmer ansehen",
    allRoomsCta: "Alle Zimmer & Preise",
    ctaStripTitle: "Termin im Blick? Fragen Sie unverbindlich an.",
    ctaStripText: "Provisionsfrei direkt beim Haus — persönliche Antwort von Familie Beimler, meist noch am selben Tag.",
    ctaStripButton: "Unverbindlich anfragen",
    banner: "Auch ohne Übernachtung — Tagesgäste herzlich willkommen",
    bannerReserve: "Tisch reservieren: +49 6573 306 →",
    restImgAlt: "Landhaus Restaurant & Terrasse",
    restH2: "Landhaus Restaurant & Terrasse",
    restPara1:
      "Für den großen Hunger ist unser besonders gemütliches Restaurant genau die richtige Wahl — Eifeler und internationale Spezialitäten in stilvoller Atmosphäre, frisch gezapftes Bitburger und Produkte der Eifeler Landküche.",
    restPara2:
      "Wir verwenden ausschließlich qualitativ hochwertige, frische Zutaten — saisonale Spezialitäten, die selbst verwöhnte Gaumen begeistern.",
    hoursEyebrow: "Öffnungszeiten",
    hoursThuSat: "Donnerstag – Samstag",
    hoursThuSatTime: "17:30 – 20:00",
    hoursSun: "Sonntag",
    hoursSunT1: "12:00 – 14:00",
    hoursSunT2: "17:30 – 20:00",
    hoursRuhetag: "Ruhetag",
    hoursRuhetagDays: "Montag, Dienstag, Mittwoch",
    hoursNote:
      "Mo–Mi auf Vorbestellung — wir verwöhnen Sie gern mit unseren liebevoll kreierten Menüs auch ausserhalb der À-la-carte-Zeiten. An Feiertagen regulär geöffnet.",
    fullRestLink: "Volle Restaurant-Seite ansehen",
    fullRestSub: "Mit Festtafel-Anfrage und Anfahrt für Tagesgäste",
    kitchenH3: "Aus unserer Küche",
    card1Eyebrow: "Eifeler Klassiker",
    card1H4: "Halbpension nach Eifeler Art",
    card1Text: "3-Gang-Menü mit regionalen Zutaten — Wildgerichte im Herbst, Spargel im Frühjahr.",
    card1Note: "+23 €/Person/Tag — zur Übernachtung zubuchbar.",
    card2Eyebrow: "Für Gruppen",
    card2H4: "Festtafel & Feiern",
    card2Text: "Hochzeiten, runde Geburtstage, Firmenessen — der Festsaal fasst bis 70 Gäste.",
    card2Note: "Auf Anfrage, gerne mit individuellem Menü.",
    reserveCta: "Reservieren · +49 6573 306",
    feiernAlt:
      "Festsaal im Landhaus Schend, festlich dekoriert für eine Geburtstagsfeier in Schwarz-Gold mit Ballonbogen — Familien- und Firmenfeiern bis 70 Personen",
    feiernH2: "Familien- & Firmenfeiern",
    feiernText:
      "Laden Sie ein zu einem unvergesslichen Fest in ansprechendem Ambiente. Im eleganten Eichelbergzimmer speisen bis zu 70 Personen, im Kaminzimmer 35, in der Dorfgaststätte und auf der Sonnenterrasse jeweils 40. Wir stellen Ihnen ein individuelles Paket zusammen — von der Planung über die Dekoration bis zum Menü oder Büffet.",
    paketeH2: "Pauschalen für Ihre Auszeit",
    paketeIntro: "Wandern, Radfahren oder einfach durchatmen — stimmig kombiniert mit Eifeler Landküche.",
    paketBadgeLabel: "Paket",
    mehrErfahren: "Mehr erfahren",
    regionH2: "Urlaubsregion Eifel",
    regionIntro:
      "Unser Hotel schmiegt sich in die Kratermulde eines erloschenen Vulkans. Erleben Sie die Einzigartigkeit unserer Gesundheitslandschaft Vulkaneifel.",
    mosaicAlts: [
      "Pulvermaar in der Vulkaneifel — Kratersee im Wald",
      "Blick vom Dronketurm auf das Gemündener Maar bei Daun",
      "Schalkenmehrener Maar in der Vulkaneifel im Herbst",
      "Weinfelder Maar (Totenmaar) bei Daun in der Vulkaneifel",
      "Holzmaar in der Vulkaneifel mit Spiegelung im Wasser",
    ],
    erdgeschichteEyebrow: "Lebendige Erdgeschichte",
    freizeitH3: "Freizeittipps & Ausflugsziele",
    freizeitP1:
      "Immerath und das gleichnamige Maar, der Kratersee eines vor zehntausenden Jahren ausgebrochenen Vulkans, öffnen Ihnen Fenster in die Erdgeschichte. Die einstigen Dimensionen lassen sich bei Touren durch die unberührte Natur nur erahnen.",
    freizeitP2:
      "Attraktive Rad-, Wander- und Nordic-Walking-Wege bieten optimale Voraussetzungen — allen voran der Maare-Mosel-Radweg und der Premium-Wanderweg Eifelsteig.",
    dreilaendH4: "Vielfalt im Dreiländereck",
    dreilaendP1:
      "Familienfreundliche Touren führen zum Schulmuseum Immerath, zum Maarmuseum Manderscheid und zum Vulkanhaus Strohn. Weitere Eifelmaare gibt es ringsum zu entdecken.",
    dreilaendP2:
      "Besuchen Sie den Wildpark Daun, die Eifelrennstrecke Nürburgring — oder starten Sie zu Tagesausflügen an die Mosel, nach Luxemburg oder Belgien.",
    mehrRegion: "Mehr zur Urlaubsregion →",
    zeichnungAlt: "Bleistift-Zeichnung des Landhaus Schend in Immerath mit Innenhof und Eingang",
    aboutH2: "Familienhotel seit 1856",
    aboutP1: "Anno 1856 wurde das Grundhaus erbaut und diente bereits damals als Gasthaus und zeitweise als Poststelle für den Ort.",
    aboutP2Html: `Seit ${Y("1976")} arbeiteten Tochter Roswitha und Ehemann Reinhold im Betrieb mit, den sie ${Y("1993")} übernahmen. ${Y("1997")} eröffneten sie das neue Gebäude als „Landhaus Schend", seit ${Y("1999")} mit 3 Sternen ausgezeichnet. Seit 2019 führt Familie Beimler das Landhaus und pflegt die Tradition weiter.`,
    ganzeGeschichte: "Unsere ganze Geschichte →",
    timelineEyebrow: "170+ Jahre Gastfreundschaft",
    timelineH3Html: '<span class="font-display-italic font-light">Vom</span> Gasthaus 1856 <span class="font-display-italic font-light">bis</span> heute',
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
    reviewsEyebrow: "Bewertungen",
    reviewsH2: "Das sagen Gäste auf den Plattformen",
    reviewsIntro: "Lesen Sie echte Bewertungen direkt bei Booking.com, Tripadvisor, HRS und Google.",
    platformLines: ["Sehr gut", "Nr. 1 in Immerath laut Tripadvisor", "Weiterempfehlung laut HRS", "Rezensionen auf Google lesen"],
    platformReviewsWord: "Rezensionen",
    ansehen: "Ansehen",
    reviewAriaPre: "Bewertungen von ",
    reviewAriaPost: " ansehen (öffnet in neuem Tab)",
    faqH2: "Was Gäste oft fragen",
    faqHome: [
      { q: "Wo liegt das Landhaus Schend genau?", a: "In der Hauptstraße 9, 54552 Immerath, mitten in der Vulkaneifel. Cochem an der Mosel 25 Min, Nürburgring 30 Min, Köln 94 Min (Fahrzeiten ca., je nach Verkehr)." },
      { q: "Was kostet eine Übernachtung?", a: "Doppelzimmer ab 57 € pro Person/Nacht inkl. Frühstücksbuffet. Zur Einzelnutzung ab 80 €. Familienzimmer ab 170 €. Halbpension auf Wunsch +23 € pro Person/Tag." },
      { q: "Gibt es einen Stellplatz für Motorräder?", a: "Eine abschließbare Motorradgarage haben wir nicht — aber kostenlose Parkplätze und genügend Motorrad-Stellplätze direkt im Hof. Beliebt bei Fahrern rund um den Nürburgring." },
      { q: "Bieten Sie Halbpension an?", a: "Halbpension ist auf Wunsch buchbar (+23 € pro Person/Tag) — täglich frische Eifeler Landküche. Das große Frühstücksbuffet ist immer inklusive." },
      { q: "Warum direkt buchen statt über Booking.com?", a: "Bei Direktbuchung zahlen Sie provisionsfrei, ohne Aufschlag eines Buchungsportals. Außerdem sind wir bei Sonderwünschen flexibler — und Sie unterstützen direkt unser Familienunternehmen." },
      { q: "Wann hat das Hotel Saison?", a: "Unsere aktuellen Öffnungs- und Saisonzeiten erfragen Sie am besten direkt bei uns — telefonisch unter +49 6573 306 oder per E-Mail an info@landhaus-schend.de. Wir geben Ihnen gern Auskunft." },
    ],
    allFaqCta: "Alle Fragen ansehen",
    dotLabels: ["Start", "Zimmer", "Restaurant", "Pakete", "Bewertungen", "Anfahrt"],
  },

  en: {
    metaTitle: "Three-star hotel & short break in the Volcanic Eifel",
    metaDescription:
      "Family-run three-star hotel in Immerath, Volcanic Eifel — 21 rooms, Eifel country cuisine, half board. Ideal for hiking. Book direct, commission-free.",
    schemaHotelDescription:
      "Family-run 3-star superior country house in Immerath / Volcanic Eifel with 21 comfortable rooms, its own Eifel restaurant and half board on request.",
    schemaInLanguage: "en",
    heroBadge: "Anno 1856 · Volcanic Eifel",
    heroH1: "Welcome to Landhaus Schend",
    heroSubtitle:
      "A family-run ★★★ Superior country house in the Volcanic Eifel — Eifel country cuisine, hiking and cycling trails right on the doorstep, welcoming guests since 1856.",
    statTripadvisor: "4.0/5 Tripadvisor",
    statBooking: "/10 Booking",
    statTradition: "years of tradition",
    statRooms: "comfort rooms",
    ctaInquire: "Enquire now",
    ctaRestaurant: "Dine in the restaurant",
    callPrefix: "or call",
    scrollLabel: "Scroll",
    uspsAria: "Included at the hotel",
    usps: [
      "Free parking in the courtyard",
      "Motorcycle parking in the courtyard",
      "Half board on request",
      "Our own restaurant",
      "21 comfort rooms",
      "Free Wi-Fi",
      "Large breakfast buffet",
      "Booking.com 8.7 · No. 1 in Immerath on Tripadvisor",
    ],
    roomsH2: "A guest at Landhaus Schend",
    roomsIntro:
      "Comfortable double rooms (also for single occupancy) and generous family rooms with a view of the Volcanic Eifel. Breakfast buffet included.",
    roomCardEyebrow: "View room",
    allRoomsCta: "All rooms & rates",
    ctaStripTitle: "Dates in mind? Send us a no-obligation enquiry.",
    ctaStripText: "Commission-free, straight to the hotel — a personal reply from the Beimler family, usually the same day.",
    ctaStripButton: "Make a non-binding enquiry",
    banner: "No overnight stay needed — day guests warmly welcome",
    bannerReserve: "Reserve a table: +49 6573 306 →",
    restImgAlt: "Landhaus Restaurant & Terrace",
    restH2: "Landhaus Restaurant & Terrace",
    restPara1:
      "For a hearty appetite, our especially cosy restaurant is just the right choice — Eifel and international specialities in a stylish atmosphere, freshly tapped Bitburger and produce from the Eifel country kitchen.",
    restPara2:
      "We use only high-quality, fresh ingredients — seasonal specialities that delight even discerning palates.",
    hoursEyebrow: "Opening hours",
    hoursThuSat: "Thursday – Saturday",
    hoursThuSatTime: "5:30 – 8:00 pm",
    hoursSun: "Sunday",
    hoursSunT1: "12:00 – 2:00 pm",
    hoursSunT2: "5:30 – 8:00 pm",
    hoursRuhetag: "Closed",
    hoursRuhetagDays: "Monday, Tuesday, Wednesday",
    hoursNote:
      "Mon–Wed by prior arrangement — we are happy to spoil you with our lovingly created set menus even outside à-la-carte hours. Open as usual on public holidays.",
    fullRestLink: "View the full restaurant page",
    fullRestSub: "With banquet enquiries and directions for day guests",
    kitchenH3: "From our kitchen",
    card1Eyebrow: "Eifel classics",
    card1H4: "Half board, Eifel style",
    card1Text: "Three-course menu with regional ingredients — game in autumn, asparagus in spring.",
    card1Note: "+23 €/person/day — can be added to your stay.",
    card2Eyebrow: "For groups",
    card2H4: "Banquets & celebrations",
    card2Text: "Weddings, milestone birthdays, company dinners — the banquet hall seats up to 70 guests.",
    card2Note: "On request, gladly with an individual menu.",
    reserveCta: "Reserve · +49 6573 306",
    feiernAlt:
      "Banquet hall at Landhaus Schend, festively decorated for a birthday party in black and gold with a balloon arch — family and company celebrations of up to 70 people",
    feiernH2: "Family & company celebrations",
    feiernText:
      "Invite guests to an unforgettable celebration in an appealing setting. The elegant Eichelberg room seats up to 70 people, the fireside room 35, the village inn and the sun terrace 40 each. We put together an individual package for you — from planning and decoration to the menu or buffet.",
    paketeH2: "Packages for your time out",
    paketeIntro: "Hiking, cycling or simply breathing deeply — harmoniously combined with Eifel country cuisine.",
    paketBadgeLabel: "Package",
    mehrErfahren: "Find out more",
    regionH2: "Holiday region Eifel",
    regionIntro:
      "Our hotel nestles in the crater hollow of an extinct volcano. Experience the uniqueness of our health landscape, the Volcanic Eifel.",
    mosaicAlts: [
      "Pulvermaar in the Volcanic Eifel — a crater lake in the forest",
      "View from the Dronke Tower over the Gemünden Maar near Daun",
      "Schalkenmehrener Maar in the Volcanic Eifel in autumn",
      "Weinfeld Maar (Totenmaar) near Daun in the Volcanic Eifel",
      "Holzmaar in the Volcanic Eifel reflected in the water",
    ],
    erdgeschichteEyebrow: "Living geological history",
    freizeitH3: "Leisure tips & places to visit",
    freizeitP1:
      "Immerath and the maar of the same name — the crater lake of a volcano that erupted tens of thousands of years ago — open windows into the earth's history. The former dimensions can only be imagined on tours through the unspoilt countryside.",
    freizeitP2:
      "Attractive cycling, hiking and Nordic-walking routes offer ideal conditions — above all the Maare-Mosel cycle path and the premium Eifelsteig hiking trail.",
    dreilaendH4: "Variety in the tri-border region",
    dreilaendP1:
      "Family-friendly tours lead to the School Museum in Immerath, the Maar Museum in Manderscheid and the Volcano House in Strohn. More Eifel maars are waiting to be discovered all around.",
    dreilaendP2:
      "Visit the Daun wildlife park, the Nürburgring racing circuit — or set off on day trips to the Mosel, to Luxembourg or to Belgium.",
    mehrRegion: "More about the holiday region →",
    zeichnungAlt: "Pencil drawing of Landhaus Schend in Immerath with courtyard and entrance",
    aboutH2: "A family hotel since 1856",
    aboutP1: "The original house was built in 1856 and served even then as an inn and at times as the village post office.",
    aboutP2Html: `Since ${Y("1976")} daughter Roswitha and her husband Reinhold worked in the business, which they took over in ${Y("1993")}. In ${Y("1997")} they opened the new building as "Landhaus Schend", awarded 3 stars since ${Y("1999")}. Since 2019 the Beimler family has run the Landhaus and carries on the tradition.`,
    ganzeGeschichte: "Our full story →",
    timelineEyebrow: "170+ years of hospitality",
    timelineH3Html: '<span class="font-display-italic font-light">From the</span> inn of 1856 <span class="font-display-italic font-light">to</span> today',
    timeline: [
      { year: "1856", event: "Original house built — inn & post office" },
      { year: "1954", event: "The Schneiders take over" },
      { year: "1970", event: "First 3 guest rooms with hot water" },
      { year: "1976", event: "Daughter Roswitha joins" },
      { year: "1993", event: "Taken over by the daughter" },
      { year: "1997", event: 'Reopened as "Landhaus Schend"' },
      { year: "1999", event: "First 3-star classification" },
      { year: "2019", event: "Taken over by the Beimler family" },
      { year: "Today", event: "21 rooms, ★★★ Superior — run by the Beimler family" },
    ],
    reviewsEyebrow: "Reviews",
    reviewsH2: "What guests say on the platforms",
    reviewsIntro: "Read real reviews directly on Booking.com, Tripadvisor, HRS and Google.",
    platformLines: ["Very good", "No. 1 in Immerath on Tripadvisor", "Would recommend, per HRS", "Read reviews on Google"],
    platformReviewsWord: "Reviews",
    ansehen: "View",
    reviewAriaPre: "View reviews from ",
    reviewAriaPost: " (opens in a new tab)",
    faqH2: "What guests often ask",
    faqHome: [
      { q: "Where exactly is Landhaus Schend?", a: "At Hauptstraße 9, 54552 Immerath, in the heart of the Volcanic Eifel. Cochem on the Mosel 25 min, Nürburgring 30 min, Cologne 94 min (driving times approx., depending on traffic)." },
      { q: "How much is an overnight stay?", a: "Double rooms from 57 € per person/night incl. breakfast buffet. For single occupancy from 80 €. Family rooms from 170 €. Half board on request +23 € per person/day." },
      { q: "Is there parking for motorcycles?", a: "We don't have a lockable motorcycle garage — but free parking and plenty of motorcycle spaces right in the courtyard. Popular with riders around the Nürburgring." },
      { q: "Do you offer half board?", a: "Half board can be booked on request (+23 € per person/day) — fresh Eifel country cuisine daily. The large breakfast buffet is always included." },
      { q: "Why book direct instead of via Booking.com?", a: "Booking direct, you pay commission-free, without the surcharge of a booking portal. We are also more flexible with special requests — and you directly support our family business." },
      { q: "When is the hotel's season?", a: "It's best to ask us directly about current opening and season times — by phone on +49 6573 306 or by email to info@landhaus-schend.de. We're happy to help." },
    ],
    allFaqCta: "View all questions",
    dotLabels: ["Start", "Rooms", "Restaurant", "Packages", "Reviews", "Directions"],
  },

  fr: {
    metaTitle: "Hôtel trois étoiles & court séjour dans l'Eifel volcanique",
    metaDescription:
      "Hôtel trois étoiles familial à Immerath, Eifel volcanique — 21 chambres, cuisine régionale de l'Eifel, demi-pension. Idéal pour la randonnée. Réservez en direct, sans commission.",
    schemaHotelDescription:
      "Maison de campagne 3 étoiles supérieure, familiale, à Immerath / Eifel volcanique, avec 21 chambres confortables, son propre restaurant de l'Eifel et la demi-pension sur demande.",
    schemaInLanguage: "fr",
    heroBadge: "Anno 1856 · Eifel volcanique",
    heroH1: "Bienvenue au Landhaus Schend",
    heroSubtitle:
      "Une maison de campagne familiale ★★★ Superior dans l'Eifel volcanique — cuisine régionale de l'Eifel, sentiers de randonnée et pistes cyclables juste devant la porte, accueil chaleureux depuis 1856.",
    statTripadvisor: "4,0/5 Tripadvisor",
    statBooking: "/10 Booking",
    statTradition: "ans de tradition",
    statRooms: "chambres confort",
    ctaInquire: "Demander maintenant",
    ctaRestaurant: "Manger au restaurant",
    callPrefix: "ou appeler",
    scrollLabel: "Défiler",
    uspsAria: "Compris dans l'hôtel",
    usps: [
      "Parking gratuit dans la cour",
      "Stationnement moto dans la cour",
      "Demi-pension sur demande",
      "Restaurant maison",
      "21 chambres confort",
      "Wi-Fi gratuit",
      "Grand petit-déjeuner buffet",
      "Booking.com 8,7 · n° 1 à Immerath selon Tripadvisor",
    ],
    roomsH2: "Séjourner au Landhaus Schend",
    roomsIntro:
      "Des chambres doubles confortables (aussi en occupation simple) et de spacieuses chambres familiales avec vue sur l'Eifel volcanique. Petit-déjeuner buffet inclus.",
    roomCardEyebrow: "Voir la chambre",
    allRoomsCta: "Toutes les chambres & tarifs",
    ctaStripTitle: "Une date en tête ? Demandez sans engagement.",
    ctaStripText: "Sans commission, directement auprès de la maison — une réponse personnelle de la famille Beimler, le plus souvent le jour même.",
    ctaStripButton: "Demande sans engagement",
    banner: "Même sans nuitée — visiteurs d'un jour les bienvenus",
    bannerReserve: "Réserver une table : +49 6573 306 →",
    restImgAlt: "Restaurant & terrasse du Landhaus",
    restH2: "Restaurant & terrasse du Landhaus",
    restPara1:
      "Pour les grandes faims, notre restaurant particulièrement chaleureux est le bon choix — spécialités de l'Eifel et internationales dans une atmosphère élégante, Bitburger fraîchement tirée et produits de la cuisine régionale de l'Eifel.",
    restPara2:
      "Nous n'utilisons que des ingrédients frais et de grande qualité — des spécialités de saison qui ravissent même les palais les plus exigeants.",
    hoursEyebrow: "Horaires d'ouverture",
    hoursThuSat: "Jeudi – samedi",
    hoursThuSatTime: "17h30 – 20h00",
    hoursSun: "Dimanche",
    hoursSunT1: "12h00 – 14h00",
    hoursSunT2: "17h30 – 20h00",
    hoursRuhetag: "Jours de fermeture",
    hoursRuhetagDays: "lundi, mardi, mercredi",
    hoursNote:
      "Lun–mer sur réservation — nous vous régalons avec plaisir de nos menus préparés avec soin, même en dehors des heures à la carte. Ouvert normalement les jours fériés.",
    fullRestLink: "Voir la page complète du restaurant",
    fullRestSub: "Avec demande de table de fête et accès pour les visiteurs d'un jour",
    kitchenH3: "De notre cuisine",
    card1Eyebrow: "Classiques de l'Eifel",
    card1H4: "Demi-pension à la mode de l'Eifel",
    card1Text: "Menu trois plats avec des produits régionaux — gibier en automne, asperges au printemps.",
    card1Note: "+23 €/personne/jour — à ajouter à la nuitée.",
    card2Eyebrow: "Pour les groupes",
    card2H4: "Tables de fête & célébrations",
    card2Text: "Mariages, anniversaires marquants, dîners d'entreprise — la salle des fêtes accueille jusqu'à 70 convives.",
    card2Note: "Sur demande, volontiers avec un menu personnalisé.",
    reserveCta: "Réserver · +49 6573 306",
    feiernAlt:
      "Salle des fêtes du Landhaus Schend, décorée pour un anniversaire en noir et or avec une arche de ballons — fêtes de famille et d'entreprise jusqu'à 70 personnes",
    feiernH2: "Fêtes de famille & d'entreprise",
    feiernText:
      "Invitez à une fête inoubliable dans un cadre attrayant. L'élégante salle Eichelberg accueille jusqu'à 70 personnes, le salon-cheminée 35, l'auberge du village et la terrasse ensoleillée 40 chacune. Nous composons pour vous un forfait sur mesure — de la planification à la décoration jusqu'au menu ou buffet.",
    paketeH2: "Forfaits pour votre escapade",
    paketeIntro: "Randonnée, vélo ou simplement respirer — en harmonie avec la cuisine régionale de l'Eifel.",
    paketBadgeLabel: "Forfait",
    mehrErfahren: "En savoir plus",
    regionH2: "Région de vacances Eifel",
    regionIntro:
      "Notre hôtel se niche dans la cuvette du cratère d'un volcan éteint. Découvrez le caractère unique de notre paysage de santé, l'Eifel volcanique.",
    mosaicAlts: [
      "Pulvermaar dans l'Eifel volcanique — lac de cratère dans la forêt",
      "Vue depuis la tour Dronke sur le Gemündener Maar près de Daun",
      "Schalkenmehrener Maar dans l'Eifel volcanique en automne",
      "Weinfelder Maar (Totenmaar) près de Daun dans l'Eifel volcanique",
      "Holzmaar dans l'Eifel volcanique se reflétant dans l'eau",
    ],
    erdgeschichteEyebrow: "Histoire vivante de la Terre",
    freizeitH3: "Loisirs & excursions",
    freizeitP1:
      "Immerath et le maar du même nom, le lac de cratère d'un volcan entré en éruption il y a des dizaines de milliers d'années, vous ouvrent des fenêtres sur l'histoire de la Terre. On ne peut qu'imaginer les dimensions d'antan lors de circuits à travers une nature préservée.",
    freizeitP2:
      "D'attrayants itinéraires de vélo, de randonnée et de marche nordique offrent des conditions idéales — au premier rang la piste cyclable Maare-Mosel et le sentier de randonnée premium Eifelsteig.",
    dreilaendH4: "Diversité au cœur des trois frontières",
    dreilaendP1:
      "Des circuits adaptés aux familles mènent au musée de l'école d'Immerath, au musée des maars de Manderscheid et à la maison du volcan de Strohn. D'autres maars de l'Eifel sont à découvrir tout autour.",
    dreilaendP2:
      "Visitez le parc animalier de Daun, le circuit du Nürburgring — ou partez en excursion d'une journée vers la Moselle, le Luxembourg ou la Belgique.",
    mehrRegion: "Plus sur la région de vacances →",
    zeichnungAlt: "Dessin au crayon du Landhaus Schend à Immerath avec cour intérieure et entrée",
    aboutH2: "Hôtel familial depuis 1856",
    aboutP1: "La maison d'origine a été construite en 1856 et servait déjà à l'époque d'auberge et, par moments, de bureau de poste du village.",
    aboutP2Html: `Depuis ${Y("1976")}, la fille Roswitha et son mari Reinhold ont travaillé dans l'établissement, qu'ils ont repris en ${Y("1993")}. En ${Y("1997")}, ils ont ouvert le nouveau bâtiment sous le nom de « Landhaus Schend », classé 3 étoiles depuis ${Y("1999")}. Depuis 2019, la famille Beimler dirige le Landhaus et perpétue la tradition.`,
    ganzeGeschichte: "Toute notre histoire →",
    timelineEyebrow: "Plus de 170 ans d'hospitalité",
    timelineH3Html: '<span class="font-display-italic font-light">De</span> l\'auberge de 1856 <span class="font-display-italic font-light">à</span> aujourd\'hui',
    timeline: [
      { year: "1856", event: "Maison d'origine construite — auberge & poste" },
      { year: "1954", event: "Les époux Schneiders reprennent" },
      { year: "1970", event: "Premières 3 chambres avec eau chaude" },
      { year: "1976", event: "La fille Roswitha rejoint l'établissement" },
      { year: "1993", event: "Reprise par la fille" },
      { year: "1997", event: "Réouverture sous le nom de « Landhaus Schend »" },
      { year: "1999", event: "Première classification 3 étoiles" },
      { year: "2019", event: "Reprise par la famille Beimler" },
      { year: "Aujourd'hui", event: "21 chambres, ★★★ Superior — dirigé par la famille Beimler" },
    ],
    reviewsEyebrow: "Avis",
    reviewsH2: "Ce que disent les clients sur les plateformes",
    reviewsIntro: "Lisez de vrais avis directement sur Booking.com, Tripadvisor, HRS et Google.",
    platformLines: ["Très bien", "n° 1 à Immerath sur Tripadvisor", "Recommandation selon HRS", "Lire les avis sur Google"],
    platformReviewsWord: "Avis",
    ansehen: "Voir",
    reviewAriaPre: "Voir les avis de ",
    reviewAriaPost: " (ouvre dans un nouvel onglet)",
    faqH2: "Questions fréquentes des clients",
    faqHome: [
      { q: "Où se trouve exactement le Landhaus Schend ?", a: "Au Hauptstraße 9, 54552 Immerath, au cœur de l'Eifel volcanique. Cochem sur la Moselle 25 min, Nürburgring 30 min, Cologne 94 min (temps de trajet approx., selon le trafic)." },
      { q: "Combien coûte une nuitée ?", a: "Chambre double à partir de 57 € par personne/nuit, petit-déjeuner buffet inclus. En occupation simple à partir de 80 €. Chambre familiale à partir de 170 €. Demi-pension sur demande +23 € par personne/jour." },
      { q: "Y a-t-il un stationnement pour les motos ?", a: "Nous n'avons pas de garage à moto fermé — mais un parking gratuit et suffisamment de places pour motos directement dans la cour. Apprécié des motards autour du Nürburgring." },
      { q: "Proposez-vous la demi-pension ?", a: "La demi-pension est réservable sur demande (+23 € par personne/jour) — cuisine régionale de l'Eifel fraîche chaque jour. Le grand petit-déjeuner buffet est toujours inclus." },
      { q: "Pourquoi réserver en direct plutôt que via Booking.com ?", a: "En réservant en direct, vous payez sans commission, sans le supplément d'un portail de réservation. Nous sommes aussi plus flexibles pour les demandes particulières — et vous soutenez directement notre entreprise familiale." },
      { q: "Quelle est la saison de l'hôtel ?", a: "Le mieux est de vous renseigner directement auprès de nous sur les horaires d'ouverture et de saison actuels — par téléphone au +49 6573 306 ou par e-mail à info@landhaus-schend.de. Nous vous renseignons avec plaisir." },
    ],
    allFaqCta: "Voir toutes les questions",
    dotLabels: ["Début", "Chambres", "Restaurant", "Forfaits", "Avis", "Accès"],
  },

  nl: {
    metaTitle: "Driesterrenhotel & korte vakantie in de Vulkaneifel",
    metaDescription:
      "Familiaal driesterrenhotel in Immerath, Vulkaneifel — 21 kamers, Eifeler streekkeuken, halfpension. Ideaal om te wandelen. Boek direct, provisievrij.",
    schemaHotelDescription:
      "Familiaal 3-sterren-superior landhuis in Immerath / Vulkaneifel met 21 comfortabele kamers, een eigen Eifeler restaurant en halfpension op verzoek.",
    schemaInLanguage: "nl",
    heroBadge: "Anno 1856 · Vulkaneifel",
    heroH1: "Welkom in Landhaus Schend",
    heroSubtitle:
      "Een familiaal ★★★ Superior landhuis in de Vulkaneifel — Eifeler streekkeuken, wandel- en fietsroutes vlak voor de deur, gastvrij sinds 1856.",
    statTripadvisor: "4,0/5 Tripadvisor",
    statBooking: "/10 Booking",
    statTradition: "jaar traditie",
    statRooms: "comfortkamers",
    ctaInquire: "Nu aanvragen",
    ctaRestaurant: "Eten in het restaurant",
    callPrefix: "of bel",
    scrollLabel: "Scroll",
    uspsAria: "Inbegrepen in het hotel",
    usps: [
      "Gratis parkeren op de binnenplaats",
      "Motorparkeerplaatsen op de binnenplaats",
      "Halfpension op verzoek",
      "Eigen restaurant",
      "21 comfortkamers",
      "Gratis wifi",
      "Groot ontbijtbuffet",
      "Booking.com 8,7 · nr. 1 in Immerath volgens Tripadvisor",
    ],
    roomsH2: "Te gast in Landhaus Schend",
    roomsIntro:
      "Comfortabele tweepersoonskamers (ook voor eenpersoonsgebruik) en ruime familiekamers met uitzicht op de Vulkaneifel. Ontbijtbuffet inbegrepen.",
    roomCardEyebrow: "Kamer bekijken",
    allRoomsCta: "Alle kamers & tarieven",
    ctaStripTitle: "Datum in gedachten? Vraag vrijblijvend aan.",
    ctaStripText: "Provisievrij rechtstreeks bij het huis — een persoonlijk antwoord van familie Beimler, meestal nog dezelfde dag.",
    ctaStripButton: "Vrijblijvend aanvragen",
    banner: "Ook zonder overnachting — dagjesgasten van harte welkom",
    bannerReserve: "Tafel reserveren: +49 6573 306 →",
    restImgAlt: "Landhaus-restaurant & terras",
    restH2: "Landhaus-restaurant & terras",
    restPara1:
      "Voor de grote honger is ons bijzonder gezellige restaurant precies de juiste keuze — Eifeler en internationale specialiteiten in een stijlvolle sfeer, vers getapt Bitburger en producten uit de Eifeler streekkeuken.",
    restPara2:
      "Wij gebruiken uitsluitend hoogwaardige, verse ingrediënten — seizoensspecialiteiten die zelfs verwende gehemeltes bekoren.",
    hoursEyebrow: "Openingstijden",
    hoursThuSat: "Donderdag – zaterdag",
    hoursThuSatTime: "17:30 – 20:00",
    hoursSun: "Zondag",
    hoursSunT1: "12:00 – 14:00",
    hoursSunT2: "17:30 – 20:00",
    hoursRuhetag: "Rustdag",
    hoursRuhetagDays: "maandag, dinsdag, woensdag",
    hoursNote:
      "Ma–wo op aanmelding — wij verwennen u graag met onze met zorg samengestelde menu's, ook buiten de à-la-carte-tijden. Op feestdagen gewoon geopend.",
    fullRestLink: "Volledige restaurantpagina bekijken",
    fullRestSub: "Met feesttafel-aanvraag en route voor dagjesgasten",
    kitchenH3: "Uit onze keuken",
    card1Eyebrow: "Eifeler klassiekers",
    card1H4: "Halfpension op zijn Eifels",
    card1Text: "Driegangenmenu met regionale ingrediënten — wildgerechten in de herfst, asperges in het voorjaar.",
    card1Note: "+23 €/persoon/dag — bij te boeken bij de overnachting.",
    card2Eyebrow: "Voor groepen",
    card2H4: "Feesttafel & vieringen",
    card2Text: "Bruiloften, ronde verjaardagen, bedrijfsdiners — de feestzaal biedt plaats aan tot 70 gasten.",
    card2Note: "Op aanvraag, graag met een individueel menu.",
    reserveCta: "Reserveren · +49 6573 306",
    feiernAlt:
      "Feestzaal in Landhaus Schend, feestelijk versierd voor een verjaardag in zwart-goud met een ballonboog — familie- en bedrijfsfeesten tot 70 personen",
    feiernH2: "Familie- & bedrijfsfeesten",
    feiernText:
      "Nodig uit voor een onvergetelijk feest in een aansprekende ambiance. In de elegante Eichelbergkamer dineren tot 70 personen, in de haardkamer 35, in de dorpsherberg en op het zonneterras elk 40. Wij stellen voor u een individueel pakket samen — van planning en decoratie tot het menu of buffet.",
    paketeH2: "Arrangementen voor uw uitje",
    paketeIntro: "Wandelen, fietsen of gewoon diep ademhalen — harmonieus gecombineerd met Eifeler streekkeuken.",
    paketBadgeLabel: "Arrangement",
    mehrErfahren: "Meer weten",
    regionH2: "Vakantieregio Eifel",
    regionIntro:
      "Ons hotel nestelt zich in de kraterkom van een uitgedoofde vulkaan. Ervaar de uniciteit van ons gezondheidslandschap, de Vulkaneifel.",
    mosaicAlts: [
      "Pulvermaar in de Vulkaneifel — kratermeer in het bos",
      "Uitzicht vanaf de Dronketoren over het Gemündener Maar bij Daun",
      "Schalkenmehrener Maar in de Vulkaneifel in de herfst",
      "Weinfelder Maar (Totenmaar) bij Daun in de Vulkaneifel",
      "Holzmaar in de Vulkaneifel met weerspiegeling in het water",
    ],
    erdgeschichteEyebrow: "Levende aardgeschiedenis",
    freizeitH3: "Vrijetijdstips & uitstapjes",
    freizeitP1:
      "Immerath en het gelijknamige maar, het kratermeer van een tienduizenden jaren geleden uitgebarsten vulkaan, openen voor u vensters op de aardgeschiedenis. De vroegere afmetingen zijn tijdens tochten door de ongerepte natuur slechts te vermoeden.",
    freizeitP2:
      "Aantrekkelijke fiets-, wandel- en nordic-walkingroutes bieden ideale omstandigheden — bovenal het Maare-Mosel-fietspad en het premium wandelpad Eifelsteig.",
    dreilaendH4: "Verscheidenheid in het drielandenpunt",
    dreilaendP1:
      "Gezinsvriendelijke tochten leiden naar het schoolmuseum Immerath, het marenmuseum Manderscheid en het vulkaanhuis Strohn. Rondom zijn nog meer Eifelmaren te ontdekken.",
    dreilaendP2:
      "Bezoek het wildpark Daun, het Eifel-circuit Nürburgring — of vertrek voor dagtochten naar de Moezel, naar Luxemburg of België.",
    mehrRegion: "Meer over de vakantieregio →",
    zeichnungAlt: "Potloodtekening van Landhaus Schend in Immerath met binnenplaats en ingang",
    aboutH2: "Familiehotel sinds 1856",
    aboutP1: "Het oorspronkelijke huis werd in 1856 gebouwd en diende ook toen al als herberg en tijdelijk als postkantoor van het dorp.",
    aboutP2Html: `Sinds ${Y("1976")} werkten dochter Roswitha en echtgenoot Reinhold mee in het bedrijf, dat zij in ${Y("1993")} overnamen. In ${Y("1997")} openden zij het nieuwe gebouw als „Landhaus Schend", sinds ${Y("1999")} bekroond met 3 sterren. Sinds 2019 leidt de familie Beimler het Landhaus en zet de traditie voort.`,
    ganzeGeschichte: "Ons hele verhaal →",
    timelineEyebrow: "170+ jaar gastvrijheid",
    timelineH3Html: '<span class="font-display-italic font-light">Van de</span> herberg uit 1856 <span class="font-display-italic font-light">tot</span> vandaag',
    timeline: [
      { year: "1856", event: "Oorspronkelijk huis gebouwd — herberg & postkantoor" },
      { year: "1954", event: "Echtpaar Schneiders neemt over" },
      { year: "1970", event: "Eerste 3 gastenkamers met warm water" },
      { year: "1976", event: "Dochter Roswitha treedt toe" },
      { year: "1993", event: "Overname door de dochter" },
      { year: "1997", event: "Heropening als „Landhaus Schend\"" },
      { year: "1999", event: "Eerste 3-sterren-classificatie" },
      { year: "2019", event: "Overname door de familie Beimler" },
      { year: "Vandaag", event: "21 kamers, ★★★ Superior — geleid door de familie Beimler" },
    ],
    reviewsEyebrow: "Beoordelingen",
    reviewsH2: "Wat gasten zeggen op de platforms",
    reviewsIntro: "Lees echte beoordelingen direct op Booking.com, Tripadvisor, HRS en Google.",
    platformLines: ["Zeer goed", "nr. 1 in Immerath volgens Tripadvisor", "Aanbeveling volgens HRS", "Beoordelingen op Google lezen"],
    platformReviewsWord: "Beoordelingen",
    ansehen: "Bekijken",
    reviewAriaPre: "Beoordelingen van ",
    reviewAriaPost: " bekijken (opent in een nieuw tabblad)",
    faqH2: "Wat gasten vaak vragen",
    faqHome: [
      { q: "Waar ligt Landhaus Schend precies?", a: "Aan de Hauptstraße 9, 54552 Immerath, midden in de Vulkaneifel. Cochem aan de Moezel 25 min, Nürburgring 30 min, Keulen 94 min (reistijden ca., afhankelijk van het verkeer)." },
      { q: "Wat kost een overnachting?", a: "Tweepersoonskamer vanaf 57 € per persoon/nacht incl. ontbijtbuffet. Voor eenpersoonsgebruik vanaf 80 €. Familiekamer vanaf 170 €. Halfpension op verzoek +23 € per persoon/dag." },
      { q: "Is er een parkeerplaats voor motoren?", a: "Een afsluitbare motorgarage hebben wij niet — maar gratis parkeerplaatsen en voldoende motorplekken direct op de binnenplaats. Geliefd bij rijders rond de Nürburgring." },
      { q: "Bieden jullie halfpension aan?", a: "Halfpension is op verzoek te boeken (+23 € per persoon/dag) — dagelijks verse Eifeler streekkeuken. Het grote ontbijtbuffet is altijd inbegrepen." },
      { q: "Waarom direct boeken in plaats van via Booking.com?", a: "Bij direct boeken betaalt u provisievrij, zonder toeslag van een boekingsportaal. Bovendien zijn wij flexibeler bij speciale wensen — en steunt u rechtstreeks ons familiebedrijf." },
      { q: "Wanneer heeft het hotel seizoen?", a: "Vraag onze actuele openings- en seizoenstijden het beste rechtstreeks bij ons op — telefonisch via +49 6573 306 of per e-mail naar info@landhaus-schend.de. We helpen u graag." },
    ],
    allFaqCta: "Alle vragen bekijken",
    dotLabels: ["Start", "Kamers", "Restaurant", "Arrangementen", "Beoordelingen", "Route"],
  },
};
