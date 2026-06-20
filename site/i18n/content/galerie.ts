// Inhalt „Galerie" je Locale. Bildquellen sprachneutral, Alt-Texte je Sprache
// (a11y/SEO). DE = EXAKT die bisherigen Alt-Texte. Eigenname „Landhaus Schend"
// und Gerichte (Pelmeni Beimler) bleiben unverändert.
import type { Locale } from "../index";

export interface GalleryMeta {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
}
export interface GalleryPhoto {
  src: string;
  alt: Record<Locale, string>;
}

export const galleryMeta: Record<Locale, GalleryMeta> = {
  de: {
    metaTitle: "Galerie — Bilder vom Landhaus Schend",
    metaDescription:
      "Bildergalerie des Landhaus Schend in Immerath: Haus & Garten, Zimmer, Restaurant und die Vulkaneifel rundum.",
    eyebrow: "Galerie",
    h1: "Bilder vom Landhaus Schend",
    intro:
      "Haus & Garten, Zimmer, das Landhaus Restaurant und die Vulkaneifel rundum — einige Eindrücke.",
  },
  en: {
    metaTitle: "Gallery — pictures of Landhaus Schend",
    metaDescription:
      "Photo gallery of Landhaus Schend in Immerath: house & garden, rooms, restaurant and the Volcanic Eifel all around.",
    eyebrow: "Gallery",
    h1: "Pictures of Landhaus Schend",
    intro:
      "House & garden, rooms, the Landhaus restaurant and the Volcanic Eifel all around — a few impressions.",
  },
  fr: {
    metaTitle: "Galerie — photos du Landhaus Schend",
    metaDescription:
      "Galerie photo du Landhaus Schend à Immerath : maison & jardin, chambres, restaurant et l'Eifel volcanique alentour.",
    eyebrow: "Galerie",
    h1: "Photos du Landhaus Schend",
    intro:
      "Maison & jardin, chambres, le restaurant du Landhaus et l'Eifel volcanique alentour — quelques impressions.",
  },
  nl: {
    metaTitle: "Galerij — foto's van Landhaus Schend",
    metaDescription:
      "Fotogalerij van Landhaus Schend in Immerath: huis & tuin, kamers, restaurant en de Vulkaneifel rondom.",
    eyebrow: "Galerij",
    h1: "Foto's van Landhaus Schend",
    intro:
      "Huis & tuin, kamers, het Landhaus-restaurant en de Vulkaneifel rondom — enkele impressies.",
  },
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    src: "/fotos/hotelfront-mit-rosen-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Hotelfront des Landhaus Schend mit roten Rosen im Sommer",
      en: "Front of Landhaus Schend with red roses in summer",
      fr: "Façade du Landhaus Schend avec des roses rouges en été",
      nl: "Voorgevel van Landhaus Schend met rode rozen in de zomer",
    },
  },
  {
    src: "/fotos/hotelgarten-mit-brunnen-landhaus-schend.jpg",
    alt: {
      de: "Hotelgarten mit Brunnen",
      en: "Hotel garden with fountain",
      fr: "Jardin de l'hôtel avec fontaine",
      nl: "Hoteltuin met fontein",
    },
  },
  {
    src: "/fotos/eingang-mit-torbogen-und-hortensien-landhaus-schend.jpg",
    alt: {
      de: "Eingang mit Torbogen und Hortensien",
      en: "Entrance with archway and hydrangeas",
      fr: "Entrée avec arche et hortensias",
      nl: "Ingang met poortboog en hortensia's",
    },
  },
  {
    src: "/fotos/innenhof-mit-balkonen-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Innenhof mit blumengeschmückten Balkonen",
      en: "Courtyard with flower-decked balconies",
      fr: "Cour intérieure aux balcons fleuris",
      nl: "Binnenplaats met bloemrijke balkons",
    },
  },
  {
    src: "/fotos/sonnenterrasse-mit-hortensien-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Sonnenterrasse mit Hortensien",
      en: "Sun terrace with hydrangeas",
      fr: "Terrasse ensoleillée avec hortensias",
      nl: "Zonneterras met hortensia's",
    },
  },
  {
    src: "/fotos/gartenseite-mit-terrasse-landhaus-schend.jpg",
    alt: {
      de: "Gartenseite mit Terrasse",
      en: "Garden side with terrace",
      fr: "Côté jardin avec terrasse",
      nl: "Tuinzijde met terras",
    },
  },
  {
    src: "/fotos/restaurant-panorama-1-landhaus-schend.jpg",
    alt: {
      de: "Landhaus Restaurant — Gastraum",
      en: "Landhaus restaurant — dining room",
      fr: "Restaurant du Landhaus — salle",
      nl: "Landhaus-restaurant — gastenruimte",
    },
  },
  {
    src: "/fotos/restaurant-panorama-2-landhaus-schend.jpg",
    alt: {
      de: "Landhaus Restaurant — gemütliche Atmosphäre",
      en: "Landhaus restaurant — cosy atmosphere",
      fr: "Restaurant du Landhaus — ambiance chaleureuse",
      nl: "Landhaus-restaurant — gezellige sfeer",
    },
  },
  {
    src: "/fotos/restaurant-panorama-3-landhaus-schend.jpg",
    alt: {
      de: "Landhaus Restaurant — Tische und Terrasse",
      en: "Landhaus restaurant — tables and terrace",
      fr: "Restaurant du Landhaus — tables et terrasse",
      nl: "Landhaus-restaurant — tafels en terras",
    },
  },
  {
    src: "/fotos/festsaal-50er-geburtstag-schwarz-gold-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Festsaal im Landhaus Schend festlich dekoriert für eine 50er-Geburtstagsfeier in Schwarz-Gold mit Ballonbogen",
      en: "Banquet hall at Landhaus Schend festively decorated for a 50th birthday party in black and gold with a balloon arch",
      fr: "Salle des fêtes du Landhaus Schend décorée pour un 50e anniversaire en noir et or avec une arche de ballons",
      nl: "Feestzaal in Landhaus Schend feestelijk versierd voor een 50e verjaardag in zwart-goud met een ballonboog",
    },
  },
  {
    src: "/fotos/restaurant-grosser-speisesaal-landhaus-schend.jpg",
    alt: {
      de: "Großer Speisesaal im Landhaus Schend mit festlich gedeckten Tafeln und Fensterfront",
      en: "Large dining hall at Landhaus Schend with festively laid tables and a wall of windows",
      fr: "Grande salle à manger du Landhaus Schend avec tables dressées et baie vitrée",
      nl: "Grote eetzaal in Landhaus Schend met feestelijk gedekte tafels en raampartij",
    },
  },
  {
    src: "/fotos/festtafel-gedeck-schwarz-gold-mit-goldlaeufer-landhaus-schend.jpg",
    alt: {
      de: "Eingedeckte Festtafel im Landhaus Schend mit goldenem Tischläufer, schwarzen Servietten und Sektgläsern",
      en: "Laid banquet table at Landhaus Schend with gold table runner, black napkins and champagne flutes",
      fr: "Table de fête dressée au Landhaus Schend avec chemin de table doré, serviettes noires et flûtes à champagne",
      nl: "Gedekte feesttafel in Landhaus Schend met gouden tafelloper, zwarte servetten en champagneglazen",
    },
  },
  {
    src: "/fotos/festtafel-weiss-gedeckt-mit-serviettenfaecher-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Hell eingedeckte Festtafel im Landhaus Schend mit weißen Serviettenfächern bei Tageslicht",
      en: "Brightly laid banquet table at Landhaus Schend with white fan-folded napkins in daylight",
      fr: "Table de fête claire au Landhaus Schend avec serviettes blanches en éventail, à la lumière du jour",
      nl: "Licht gedekte feesttafel in Landhaus Schend met witte servetwaaiers bij daglicht",
    },
  },
  {
    src: "/fotos/festtafel-am-fenster-mit-gartenblick-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Festlich eingedeckte Tafel am Fenster im Landhaus Schend mit Blick in den Garten",
      en: "Festively laid table by the window at Landhaus Schend with a view into the garden",
      fr: "Table de fête près de la fenêtre au Landhaus Schend avec vue sur le jardin",
      nl: "Feestelijk gedekte tafel bij het raam in Landhaus Schend met uitzicht op de tuin",
    },
  },
  {
    src: "/fotos/eifeler-spezialitaet-gebratene-kloesse-in-rahmsauce-landhaus-schend.jpg",
    alt: {
      de: "Eifeler Spezialität im Restaurant Landhaus Schend: gebratene Klöße in Rahmsauce mit Schnittlauch",
      en: "Eifel speciality at the Landhaus Schend restaurant: fried dumplings in cream sauce with chives",
      fr: "Spécialité de l'Eifel au restaurant Landhaus Schend : boulettes poêlées en sauce crème avec ciboulette",
      nl: "Eifeler specialiteit in restaurant Landhaus Schend: gebakken knoedels in roomsaus met bieslook",
    },
  },
  {
    src: "/fotos/pelmeni-beimler-landhaus-schend.jpg",
    alt: {
      de: "Pelmeni Beimler — hausgemachte Teigtaschen der Familie Beimler im Landhaus Schend",
      en: "Pelmeni Beimler — homemade dumplings by the Beimler family at Landhaus Schend",
      fr: "Pelmeni Beimler — raviolis maison de la famille Beimler au Landhaus Schend",
      nl: "Pelmeni Beimler — huisgemaakte deeghapjes van de familie Beimler in Landhaus Schend",
    },
  },
  {
    src: "/fotos/doppelzimmer-bad-mit-walk-in-dusche-und-led-rundspiegel-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Modernes Badezimmer im Landhaus Schend mit ebenerdiger Walk-in-Dusche und beleuchtetem LED-Rundspiegel",
      en: "Modern bathroom at Landhaus Schend with a level-access walk-in shower and a backlit round LED mirror",
      fr: "Salle de bains moderne au Landhaus Schend avec douche à l'italienne de plain-pied et miroir rond LED rétroéclairé",
      nl: "Moderne badkamer in Landhaus Schend met inloopdouche op vloerniveau en verlichte ronde led-spiegel",
    },
  },
  {
    src: "/fotos/doppelzimmer-mit-holzbett-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Doppelzimmer mit Holzbett",
      en: "Double room with wooden bed",
      fr: "Chambre double avec lit en bois",
      nl: "Tweepersoonskamer met houten bed",
    },
  },
  {
    src: "/fotos/doppelzimmer-comfort-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Komfortables Doppelzimmer",
      en: "Comfortable double room",
      fr: "Chambre double confortable",
      nl: "Comfortabele tweepersoonskamer",
    },
  },
  {
    src: "/fotos/komfortzimmer-mit-balkon-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Komfortzimmer mit Balkon und Eifel-Blick",
      en: "Comfort room with balcony and Eifel view",
      fr: "Chambre confort avec balcon et vue sur l'Eifel",
      nl: "Comfortkamer met balkon en uitzicht op de Eifel",
    },
  },
  {
    src: "/fotos/familienzimmer-doppelbett-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Familienzimmer mit Doppelbett",
      en: "Family room with double bed",
      fr: "Chambre familiale avec lit double",
      nl: "Familiekamer met tweepersoonsbed",
    },
  },
  {
    src: "/fotos/familienzimmer-mit-nebenraum-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Familienzimmer mit separatem Nebenraum",
      en: "Family room with a separate adjoining room",
      fr: "Chambre familiale avec pièce attenante séparée",
      nl: "Familiekamer met aparte aangrenzende ruimte",
    },
  },
  {
    src: "/fotos/landhaus-schend-schriftzug-fassade-landhaus-schend.jpg",
    alt: {
      de: "Fassade mit Schriftzug Landhaus Schend",
      en: "Façade with the Landhaus Schend lettering",
      fr: "Façade avec l'enseigne Landhaus Schend",
      nl: "Gevel met het opschrift Landhaus Schend",
    },
  },
  {
    src: "/fotos/hotelfassade-mit-garten-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Hotelfassade mit Garten",
      en: "Hotel façade with garden",
      fr: "Façade de l'hôtel avec jardin",
      nl: "Hotelgevel met tuin",
    },
  },
  {
    src: "/fotos/wanderer-am-eifelmaar-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Wanderer am Eifelmaar in der Vulkaneifel",
      en: "Hiker at an Eifel maar in the Volcanic Eifel",
      fr: "Randonneur près d'un maar dans l'Eifel volcanique",
      nl: "Wandelaar bij een Eifelmaar in de Vulkaneifel",
    },
  },
  {
    src: "/fotos/radfahrer-am-radweg-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Radfahrer auf dem Radweg in der Vulkaneifel",
      en: "Cyclist on the cycle path in the Volcanic Eifel",
      fr: "Cycliste sur la piste cyclable dans l'Eifel volcanique",
      nl: "Fietser op het fietspad in de Vulkaneifel",
    },
  },
  {
    src: "/fotos/dorfansicht-immerath-landhaus-schend.jpg",
    alt: {
      de: "Dorfansicht von Immerath",
      en: "View of the village of Immerath",
      fr: "Vue du village d'Immerath",
      nl: "Dorpsgezicht van Immerath",
    },
  },
  {
    src: "/fotos/winterlicher-innenhof-landhaus-schend.jpg",
    alt: {
      de: "Winterlicher Innenhof",
      en: "Courtyard in winter",
      fr: "Cour intérieure en hiver",
      nl: "Binnenplaats in de winter",
    },
  },
  {
    src: "/fotos/weihnachtsstimmung-im-schnee-landhaus-schend.jpg",
    alt: {
      de: "Weihnachtsstimmung im Schnee",
      en: "Christmas atmosphere in the snow",
      fr: "Ambiance de Noël sous la neige",
      nl: "Kerstsfeer in de sneeuw",
    },
  },
  {
    src: "/fotos/hoteleingang-mit-schneebaum-landhaus-schend-vulkaneifel.jpg",
    alt: {
      de: "Hoteleingang mit verschneitem Baum",
      en: "Hotel entrance with a snow-covered tree",
      fr: "Entrée de l'hôtel avec un arbre enneigé",
      nl: "Hotelingang met een besneeuwde boom",
    },
  },
];
