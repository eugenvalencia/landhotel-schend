// Inhalt „Urlaubsregion" je Locale. DE = EXAKT der bisherige deutsche Text.
// EN/FR/NL faithful übersetzt; Eigennamen (Eifelsteig, Maare, Nürburgring …),
// Adresse und Fahrzeiten bleiben unverändert.
import type { Locale } from "../index";

export interface RegionHighlight {
  img: string;
  title: string;
  text: string;
}
export interface RegionDistanz {
  ort: string;
  zeit: string;
}
export interface RegionContent {
  metaTitle: string;
  metaDescription: string;
  heroAlt: string;
  eyebrow: string;
  h1: string;
  heroText: string;
  highlights: RegionHighlight[];
  ausfluegeH2: string;
  ausfluege: string[];
  distanzenH2: string;
  distanzen: RegionDistanz[];
  distanzNote: string;
  addressLabel: string;
  ctaH2: string;
  ctaText: string;
  ctaZimmer: string;
  ctaAnfrage: string;
}

// Bildquellen sind sprachneutral.
const IMG = {
  eifelsteig: "/fotos/wanderer-am-eifelmaar-landhaus-schend-vulkaneifel.jpg",
  maare: "/pakete/eifel-1.jpg",
  rad: "/fotos/radfahrer-am-radweg-landhaus-schend-vulkaneifel.jpg",
  sterne: "/pakete/eifel-4.jpg",
};
const ADDRESS = "Hauptstraße 9, 54552 Immerath · Vulkaneifel";

export const regionContent: Record<Locale, RegionContent> = {
  de: {
    metaTitle: "Vulkaneifel — Wandern, Maare & Eifelsteig",
    metaDescription:
      "Die Vulkaneifel rund um das Landhaus Schend in Immerath: Eifelsteig, Maare, Maare-Mosel-Radweg, Nürburgring und Sternenpark — alles direkt vor der Tür.",
    heroAlt: "Landschaft der Vulkaneifel",
    eyebrow: "Urlaubsregion",
    h1: "Die Vulkaneifel vor der Tür",
    heroText:
      "Kraterseen, Premium-Wanderwege und Radrouten beginnen direkt am Hotel. Das Landhaus Schend liegt mitten in der Vulkaneifel — eingebettet in die Kratermulde eines erloschenen Vulkans, fernab vom Großstadttrubel. Und die Mosel mit Cochem und seiner Reichsburg ist nur 25 Minuten entfernt — viele Gäste verbinden einen Tag in Cochem mit einer ruhigen Nacht bei uns.",
    highlights: [
      {
        img: IMG.eifelsteig,
        title: "Wandern auf dem Eifelsteig",
        text: "Der Premium-Wanderweg Eifelsteig (300 km von Aachen nach Trier) führt nahe am Hotel vorbei — wir liegen auf der Etappenstrecke Daun ↔ Manderscheid. Dazu der Maar-Pfad und unzählige Rundwege ab Immerath. Wanderkarten und persönliche Tourenempfehlungen stellen wir kostenlos.",
      },
      {
        img: IMG.maare,
        title: "Die Maare der Vulkaneifel",
        text: "Das Immerath-Maar erreichen Sie direkt zu Fuß — und viele Gäste wandern von uns aus auch zum Pulvermaar (einem der tiefsten Maare der Eifel) und zum Schalkenmehrener Maar. In 15–30 Autominuten liegen außerdem die übrigen Dauner Maare (Gemündener, Weinfelder), das Meerfelder Maar und das Holzmaar. Die Rundwanderung über die Dauner Maare mit dem Dronketurm ist eine der schönsten Tagestouren der Eifel.",
      },
      {
        img: IMG.rad,
        title: "Radfahren, Mosel & Nürburgring",
        text: "Maare-Mosel-Radweg und Kylltal-Radweg starten direkt am Hotel und führen hinab ins Moseltal Richtung Cochem — für Genussradler und Mountainbiker. Der Nürburgring ist in 30 Minuten erreichbar; die kurvenreichen Eifelstraßen machen uns zu einem beliebten Ziel für Motorradfahrer.",
      },
      {
        img: IMG.sterne,
        title: "Sternenhimmel & Natur",
        text: "Die Vulkaneifel ist ideal zum Sternegucken — der zertifizierte Sternenpark des Nationalpark Eifel liegt rund 60–80 Minuten entfernt. Auch über Immerath gibt es bei klarem Himmel hervorragende Sicht auf die Milchstraße. Gerne geben wir Tipps für die besten Beobachtungsplätze.",
      },
    ],
    ausfluegeH2: "Ausflugsziele in der Nähe",
    ausfluege: [
      "Cochem an der Mosel mit Reichsburg",
      "Pulvermaar & Schalkenmehrener Maar — zu Fuß erwanderbar",
      "Maarmuseum Manderscheid",
      "Vulkanhaus Strohn",
      "Wildpark & Kurstadt Daun",
      "Schulmuseum Immerath",
      "Mosel & Weinorte",
      "Tagestouren nach Luxemburg & Belgien",
    ],
    distanzenH2: "So nah sind Sie dran",
    distanzen: [
      { ort: "Cochem an der Mosel", zeit: "25 Min" },
      { ort: "Nürburgring", zeit: "30 Min" },
      { ort: "Trier", zeit: "43 Min" },
      { ort: "Köln", zeit: "94 Min" },
      { ort: "Luxemburg", zeit: "71 Min" },
    ],
    distanzNote: "Fahrzeiten als Richtwert, je nach Verkehr.",
    addressLabel: "Adresse",
    ctaH2: "Ihr Ausgangspunkt für die Eifel",
    ctaText:
      "21 Komfortzimmer, hauseigene Eifeler Landküche und persönliche Tourenempfehlungen — ideal für Ihren Aktiv- oder Erholungsurlaub in der Vulkaneifel.",
    ctaZimmer: "Zimmer ansehen",
    ctaAnfrage: "Jetzt unverbindlich anfragen",
  },

  en: {
    metaTitle: "Volcanic Eifel — Hiking, Maars & the Eifelsteig",
    metaDescription:
      "The Volcanic Eifel around Landhaus Schend in Immerath: the Eifelsteig trail, crater lakes (maars), the Maare-Mosel cycle path, the Nürburgring and the dark-sky park — all right on the doorstep.",
    heroAlt: "Landscape of the Volcanic Eifel",
    eyebrow: "Holiday region",
    h1: "The Volcanic Eifel on your doorstep",
    heroText:
      "Crater lakes, premium hiking trails and cycle routes begin right at the hotel. Landhaus Schend lies in the heart of the Volcanic Eifel — nestled in the crater hollow of an extinct volcano, far from the bustle of the city. And the Mosel river with Cochem and its imperial castle is just 25 minutes away — many guests combine a day in Cochem with a quiet night with us.",
    highlights: [
      {
        img: IMG.eifelsteig,
        title: "Hiking the Eifelsteig",
        text: "The premium Eifelsteig trail (300 km from Aachen to Trier) runs close to the hotel — we sit on the Daun ↔ Manderscheid stage. Add the Maar trail and countless circular walks starting in Immerath. We provide hiking maps and personal route tips free of charge.",
      },
      {
        img: IMG.maare,
        title: "The maars of the Volcanic Eifel",
        text: "The Immerath Maar is reachable on foot — and many guests hike from here to the Pulvermaar (one of the deepest maars in the Eifel) and the Schalkenmehrener Maar. Within a 15–30 minute drive lie the other Daun maars (Gemünden, Weinfeld), the Meerfeld Maar and the Holzmaar. The circular hike across the Daun maars with the Dronke Tower is one of the finest day tours in the Eifel.",
      },
      {
        img: IMG.rad,
        title: "Cycling, the Mosel & the Nürburgring",
        text: "The Maare-Mosel cycle path and the Kyll valley cycle path start right at the hotel and lead down into the Mosel valley towards Cochem — for leisure cyclists and mountain bikers alike. The Nürburgring is 30 minutes away; the winding Eifel roads make us a favourite destination for motorcyclists.",
      },
      {
        img: IMG.sterne,
        title: "Starry skies & nature",
        text: "The Volcanic Eifel is ideal for stargazing — the certified dark-sky park of the Eifel National Park lies about 60–80 minutes away. Above Immerath, too, you get an excellent view of the Milky Way on clear nights. We're happy to suggest the best spots for watching the stars.",
      },
    ],
    ausfluegeH2: "Places to visit nearby",
    ausfluege: [
      "Cochem on the Mosel with its imperial castle",
      "Pulvermaar & Schalkenmehrener Maar — reachable on foot",
      "Maar Museum, Manderscheid",
      "Volcano House, Strohn",
      "Wildlife park & spa town of Daun",
      "School Museum, Immerath",
      "The Mosel & its wine villages",
      "Day trips to Luxembourg & Belgium",
    ],
    distanzenH2: "How close you are",
    distanzen: [
      { ort: "Cochem on the Mosel", zeit: "25 min" },
      { ort: "Nürburgring", zeit: "30 min" },
      { ort: "Trier", zeit: "43 min" },
      { ort: "Cologne", zeit: "94 min" },
      { ort: "Luxembourg", zeit: "71 min" },
    ],
    distanzNote: "Driving times are approximate and depend on traffic.",
    addressLabel: "Address",
    ctaH2: "Your base for the Eifel",
    ctaText:
      "21 comfort rooms, our own Eifel country kitchen and personal route tips — ideal for an active or relaxing holiday in the Volcanic Eifel.",
    ctaZimmer: "View rooms",
    ctaAnfrage: "Send a no-obligation enquiry",
  },

  fr: {
    metaTitle: "Eifel volcanique — randonnée, maars & Eifelsteig",
    metaDescription:
      "L'Eifel volcanique autour du Landhaus Schend à Immerath : sentier Eifelsteig, maars, piste cyclable Maare-Mosel, Nürburgring et parc étoilé — tout juste devant la porte.",
    heroAlt: "Paysage de l'Eifel volcanique",
    eyebrow: "Région de vacances",
    h1: "L'Eifel volcanique devant votre porte",
    heroText:
      "Lacs de cratère, sentiers de randonnée premium et itinéraires cyclables commencent juste devant l'hôtel. Le Landhaus Schend se trouve au cœur de l'Eifel volcanique — niché dans la cuvette d'un volcan éteint, loin de l'agitation de la ville. Et la Moselle, avec Cochem et son château impérial, n'est qu'à 25 minutes — de nombreux clients associent une journée à Cochem à une nuit paisible chez nous.",
    highlights: [
      {
        img: IMG.eifelsteig,
        title: "Randonner sur l'Eifelsteig",
        text: "Le sentier de randonnée premium Eifelsteig (300 km d'Aix-la-Chapelle à Trèves) passe tout près de l'hôtel — nous sommes sur l'étape Daun ↔ Manderscheid. S'y ajoutent le sentier des maars et d'innombrables boucles au départ d'Immerath. Nous fournissons gratuitement des cartes de randonnée et des conseils d'itinéraires personnalisés.",
      },
      {
        img: IMG.maare,
        title: "Les maars de l'Eifel volcanique",
        text: "Le maar d'Immerath est accessible à pied — et de nombreux clients randonnent depuis chez nous jusqu'au Pulvermaar (l'un des maars les plus profonds de l'Eifel) et au Schalkenmehrener Maar. À 15–30 minutes en voiture se trouvent aussi les autres maars de Daun (Gemünden, Weinfeld), le Meerfelder Maar et le Holzmaar. La randonnée en boucle à travers les maars de Daun avec la tour Dronke est l'une des plus belles excursions d'une journée dans l'Eifel.",
      },
      {
        img: IMG.rad,
        title: "Vélo, Moselle & Nürburgring",
        text: "La piste cyclable Maare-Mosel et celle de la vallée de la Kyll partent juste devant l'hôtel et descendent dans la vallée de la Moselle vers Cochem — pour les cyclotouristes comme pour les vététistes. Le Nürburgring est à 30 minutes ; les routes sinueuses de l'Eifel font de nous une destination prisée des motards.",
      },
      {
        img: IMG.sterne,
        title: "Ciel étoilé & nature",
        text: "L'Eifel volcanique est idéale pour observer les étoiles — le parc étoilé certifié du parc national de l'Eifel se trouve à environ 60–80 minutes. Au-dessus d'Immerath aussi, par temps clair, la vue sur la Voie lactée est excellente. Nous vous indiquons volontiers les meilleurs points d'observation.",
      },
    ],
    ausfluegeH2: "À visiter à proximité",
    ausfluege: [
      "Cochem sur la Moselle et son château impérial",
      "Pulvermaar & Schalkenmehrener Maar — accessibles à pied",
      "Musée des maars, Manderscheid",
      "Maison du volcan, Strohn",
      "Parc animalier & ville thermale de Daun",
      "Musée de l'école, Immerath",
      "La Moselle & ses villages viticoles",
      "Excursions vers le Luxembourg & la Belgique",
    ],
    distanzenH2: "À deux pas de tout",
    distanzen: [
      { ort: "Cochem sur la Moselle", zeit: "25 min" },
      { ort: "Nürburgring", zeit: "30 min" },
      { ort: "Trèves", zeit: "43 min" },
      { ort: "Cologne", zeit: "94 min" },
      { ort: "Luxembourg", zeit: "71 min" },
    ],
    distanzNote: "Temps de trajet indicatifs, selon le trafic.",
    addressLabel: "Adresse",
    ctaH2: "Votre point de départ pour l'Eifel",
    ctaText:
      "21 chambres confort, notre propre cuisine régionale de l'Eifel et des conseils d'itinéraires personnalisés — idéal pour vos vacances actives ou de détente dans l'Eifel volcanique.",
    ctaZimmer: "Voir les chambres",
    ctaAnfrage: "Demande sans engagement",
  },

  nl: {
    metaTitle: "Vulkaneifel — wandelen, maren & de Eifelsteig",
    metaDescription:
      "De Vulkaneifel rond Landhaus Schend in Immerath: de Eifelsteig, maren, het Maare-Mosel-fietspad, de Nürburgring en het sterrenpark — alles vlak voor de deur.",
    heroAlt: "Landschap van de Vulkaneifel",
    eyebrow: "Vakantieregio",
    h1: "De Vulkaneifel voor de deur",
    heroText:
      "Kratermeren, premium wandelpaden en fietsroutes beginnen direct bij het hotel. Landhaus Schend ligt midden in de Vulkaneifel — genesteld in de kraterkom van een uitgedoofde vulkaan, ver van de drukte van de stad. En de Moezel met Cochem en zijn keizerlijke burcht ligt op slechts 25 minuten — veel gasten combineren een dag in Cochem met een rustige nacht bij ons.",
    highlights: [
      {
        img: IMG.eifelsteig,
        title: "Wandelen op de Eifelsteig",
        text: "Het premium wandelpad Eifelsteig (300 km van Aken naar Trier) loopt vlak langs het hotel — wij liggen op de etappe Daun ↔ Manderscheid. Daarbij komen het maren-pad en talloze rondwandelingen vanuit Immerath. Wandelkaarten en persoonlijke routetips bieden wij kosteloos aan.",
      },
      {
        img: IMG.maare,
        title: "De maren van de Vulkaneifel",
        text: "Het Immerath-maar bereikt u te voet — en veel gasten wandelen vanaf hier ook naar het Pulvermaar (een van de diepste maren van de Eifel) en het Schalkenmehrener Maar. Op 15–30 autominuten liggen bovendien de overige Dauner maren (Gemünden, Weinfeld), het Meerfelder Maar en het Holzmaar. De rondwandeling over de Dauner maren met de Dronketoren is een van de mooiste dagtochten van de Eifel.",
      },
      {
        img: IMG.rad,
        title: "Fietsen, Moezel & Nürburgring",
        text: "Het Maare-Mosel-fietspad en het Kyll-dal-fietspad starten direct bij het hotel en voeren omlaag het Moezeldal in richting Cochem — voor genietersfietsers en mountainbikers. De Nürburgring ligt op 30 minuten; de bochtige Eifelwegen maken ons tot een geliefde bestemming voor motorrijders.",
      },
      {
        img: IMG.sterne,
        title: "Sterrenhemel & natuur",
        text: "De Vulkaneifel is ideaal om naar de sterren te kijken — het gecertificeerde sterrenpark van het Nationaal Park Eifel ligt zo'n 60–80 minuten verderop. Ook boven Immerath is er bij heldere hemel uitstekend zicht op de Melkweg. Wij geven u graag tips voor de beste observatieplekken.",
      },
    ],
    ausfluegeH2: "Bezienswaardigheden in de buurt",
    ausfluege: [
      "Cochem aan de Moezel met keizerlijke burcht",
      "Pulvermaar & Schalkenmehrener Maar — te voet bereikbaar",
      "Marenmuseum Manderscheid",
      "Vulkaanhuis Strohn",
      "Wildpark & kuurstad Daun",
      "Schoolmuseum Immerath",
      "De Moezel & wijndorpen",
      "Dagtochten naar Luxemburg & België",
    ],
    distanzenH2: "Zo dichtbij bent u",
    distanzen: [
      { ort: "Cochem aan de Moezel", zeit: "25 min" },
      { ort: "Nürburgring", zeit: "30 min" },
      { ort: "Trier", zeit: "43 min" },
      { ort: "Keulen", zeit: "94 min" },
      { ort: "Luxemburg", zeit: "71 min" },
    ],
    distanzNote: "Reistijden bij benadering, afhankelijk van het verkeer.",
    addressLabel: "Adres",
    ctaH2: "Uw uitvalsbasis voor de Eifel",
    ctaText:
      "21 comfortkamers, onze eigen Eifeler streekkeuken en persoonlijke routetips — ideaal voor uw actieve of ontspannen vakantie in de Vulkaneifel.",
    ctaZimmer: "Kamers bekijken",
    ctaAnfrage: "Vrijblijvend aanvragen",
  },
};

export const REGION_ADDRESS = ADDRESS;
