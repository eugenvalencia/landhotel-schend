// Inhalt „Restaurant" je Locale. DE = EXAKT der bisherige Text. Eigenname
// „Landhaus Restaurant", Telefon, E-Mail, Adresse, Uhrzeiten bleiben unverändert.
import type { Locale } from "../index";

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
        { days: "Montag – Mittwoch", time: "", note: "An diesen Tagen kochen wir exklusiv für unsere Übernachtungsgäste. Von Donnerstag bis Sonntag heißen wir Sie aber herzlich gern bei uns willkommen!" },
        { days: "Donnerstag – Sonntag", time: "17:30 – 20:00 Uhr", note: "Schauen Sie gern vorbei — es erwartet Sie ein 3-Gänge-Tagesmenü oder die À-la-carte-Auswahl. Herzlich willkommen!" },
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
        { days: "Monday – Wednesday", time: "", note: "On these days we cook exclusively for our overnight guests. From Thursday to Sunday, however, we warmly welcome you to join us!" },
        { days: "Thursday – Sunday", time: "5:30 – 8:00 pm", note: "Do drop by — a three-course menu of the day or our à-la-carte selection awaits you. A warm welcome!" },
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
        { days: "Lundi – mercredi", time: "", note: "Ces jours-là, nous cuisinons exclusivement pour nos hôtes en chambre. Du jeudi au dimanche, en revanche, nous vous accueillons très volontiers !" },
        { days: "Jeudi – dimanche", time: "17h30 – 20h00", note: "Passez nous voir — un menu du jour trois plats ou la sélection à la carte vous attend. Soyez les bienvenus !" },
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
        { days: "Maandag – woensdag", time: "", note: "Op deze dagen koken wij exclusief voor onze overnachtende gasten. Van donderdag tot en met zondag heten wij u echter van harte welkom!" },
        { days: "Donderdag – zondag", time: "17:30 – 20:00 uur", note: "Kom gerust langs — een driegangen-dagmenu of de à-la-cartekeuze staat voor u klaar. Van harte welkom!" },
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
