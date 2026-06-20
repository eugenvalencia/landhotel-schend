// Inhalt „Standort / Anreise" je Locale. Adresse, GPS, Höhe bleiben unverändert.
// DE = EXAKT der bisherige Text. HTML-Felder (mit <strong>/<a>) via set:html.
import type { Locale } from "../index";

export interface DistEntry { name: string; time: string }
export interface LocationContent {
  eyebrow: string;
  h2: string;
  subline: string;
  mapTitle: string;
  mapConsentHtml: string;
  mapLoad: string;
  googleMaps: string;
  appleMaps: string;
  copyAria: string;
  copied: string;
  addrEyebrow: string;
  addressHtml: string;
  hoeheLabel: string;
  hoeheVal: string;
  gpsLabel: string;
  kontaktEyebrow: string;
  entfernungenEyebrow: string;
  deutschlandLabel: string;
  beneluxLabel: string;
  distDE: DistEntry[];
  distBX: DistEntry[];
  distNote: string;
  autoEyebrow: string;
  autoItems: string[];
  bahnEyebrow: string;
  bahnItems: string[];
  flugEyebrow: string;
  flugItems: string[];
}

export const locationContent: Record<Locale, LocationContent> = {
  de: {
    eyebrow: "Anreise",
    h2: "So finden Sie zu uns",
    subline: "Landhaus Schend · Hauptstraße 9 · 54552 Immerath · Vulkaneifel",
    mapTitle: "Karte von Google Maps",
    mapConsentHtml:
      'Beim Laden der Karte werden Daten — u.&nbsp;a. Ihre IP-Adresse — an Google übertragen, auch in die USA. Erst nach Ihrer Zustimmung wird die interaktive Karte geladen. Mehr dazu in unseren <a href="/datenschutz" class="text-secondary underline hover:no-underline">Datenschutzhinweisen</a>.',
    mapLoad: "Karte laden",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copyAria: "GPS-Koordinaten kopieren",
    copied: "Kopiert ✓",
    addrEyebrow: "Adresse",
    addressHtml: "Landhaus Schend<br />Hauptstraße 9<br />54552 Immerath<br />Vulkaneifel · Deutschland",
    hoeheLabel: "Höhe",
    hoeheVal: "400 m ü. NHN",
    gpsLabel: "GPS",
    kontaktEyebrow: "Kontakt",
    entfernungenEyebrow: "Entfernungen",
    deutschlandLabel: "Deutschland",
    beneluxLabel: "Benelux",
    distDE: [
      { name: "Cochem", time: "25 Min" },
      { name: "Nürburgring", time: "30 Min" },
      { name: "Trier", time: "43 Min" },
      { name: "Köln", time: "94 Min" },
      { name: "Düsseldorf", time: "112 Min" },
    ],
    distBX: [
      { name: "Luxemburg-Stadt", time: "71 Min" },
      { name: "Lüttich", time: "119 Min" },
      { name: "Maastricht", time: "129 Min" },
    ],
    distNote: "Fahrzeiten sind Richtwerte mit dem Pkw, je nach Verkehr.",
    autoEyebrow: "Mit dem Auto",
    autoItems: [
      '<strong class="font-medium">A1 / A48</strong> Köln ↔ Trier — Abfahrt Daun, dann B257 ca. 8 km nach Immerath',
      '<strong class="font-medium">A60</strong> aus Belgien / Niederlande — Abfahrt Hillesheim, über B421 / B257',
      "Kostenlose Parkplätze direkt am Hotel — auch Stellplätze für Motorräder",
    ],
    bahnEyebrow: "Mit der Bahn",
    bahnItems: [
      '<strong class="font-medium">Bahnhof Wittlich Hbf</strong> · ca. 25 km — IC / RE Köln ↔ Trier',
      '<strong class="font-medium">Bahnhof Gerolstein</strong> · ca. 30 km — Eifelbahn aus Köln',
      "Letzte Etappe gerne per Taxi — Vorab-Reservierung über uns möglich",
    ],
    flugEyebrow: "Mit dem Flugzeug",
    flugItems: [
      '<strong class="font-medium">Flughafen Frankfurt-Hahn</strong> · ca. 70 km',
      '<strong class="font-medium">Flughafen Luxemburg</strong> · ca. 90 km',
      '<strong class="font-medium">Flughafen Köln/Bonn</strong> · ca. 110 km',
    ],
  },

  en: {
    eyebrow: "Getting here",
    h2: "How to find us",
    subline: "Landhaus Schend · Hauptstraße 9 · 54552 Immerath · Volcanic Eifel",
    mapTitle: "Map by Google Maps",
    mapConsentHtml:
      'When the map loads, data — including your IP address — is transferred to Google, also to the USA. The interactive map is only loaded after your consent. More on this in our <a href="/datenschutz" class="text-secondary underline hover:no-underline">privacy policy</a>.',
    mapLoad: "Load map",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copyAria: "Copy GPS coordinates",
    copied: "Copied ✓",
    addrEyebrow: "Address",
    addressHtml: "Landhaus Schend<br />Hauptstraße 9<br />54552 Immerath<br />Volcanic Eifel · Germany",
    hoeheLabel: "Altitude",
    hoeheVal: "400 m above sea level",
    gpsLabel: "GPS",
    kontaktEyebrow: "Contact",
    entfernungenEyebrow: "Distances",
    deutschlandLabel: "Germany",
    beneluxLabel: "Benelux",
    distDE: [
      { name: "Cochem", time: "25 min" },
      { name: "Nürburgring", time: "30 min" },
      { name: "Trier", time: "43 min" },
      { name: "Cologne", time: "94 min" },
      { name: "Düsseldorf", time: "112 min" },
    ],
    distBX: [
      { name: "Luxembourg City", time: "71 min" },
      { name: "Liège", time: "119 min" },
      { name: "Maastricht", time: "129 min" },
    ],
    distNote: "Driving times are approximate, by car, depending on traffic.",
    autoEyebrow: "By car",
    autoItems: [
      '<strong class="font-medium">A1 / A48</strong> Cologne ↔ Trier — exit Daun, then B257 approx. 8 km to Immerath',
      '<strong class="font-medium">A60</strong> from Belgium / the Netherlands — exit Hillesheim, via B421 / B257',
      "Free parking right at the hotel — including spaces for motorcycles",
    ],
    bahnEyebrow: "By train",
    bahnItems: [
      '<strong class="font-medium">Wittlich Hbf station</strong> · approx. 25 km — IC / RE Cologne ↔ Trier',
      '<strong class="font-medium">Gerolstein station</strong> · approx. 30 km — Eifelbahn from Cologne',
      "Final leg gladly by taxi — advance booking through us possible",
    ],
    flugEyebrow: "By plane",
    flugItems: [
      '<strong class="font-medium">Frankfurt-Hahn Airport</strong> · approx. 70 km',
      '<strong class="font-medium">Luxembourg Airport</strong> · approx. 90 km',
      '<strong class="font-medium">Cologne/Bonn Airport</strong> · approx. 110 km',
    ],
  },

  fr: {
    eyebrow: "Accès",
    h2: "Comment nous trouver",
    subline: "Landhaus Schend · Hauptstraße 9 · 54552 Immerath · Eifel volcanique",
    mapTitle: "Carte par Google Maps",
    mapConsentHtml:
      'Au chargement de la carte, des données — dont votre adresse IP — sont transférées à Google, également aux États-Unis. La carte interactive n\'est chargée qu\'après votre consentement. En savoir plus dans notre <a href="/datenschutz" class="text-secondary underline hover:no-underline">politique de confidentialité</a>.',
    mapLoad: "Charger la carte",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copyAria: "Copier les coordonnées GPS",
    copied: "Copié ✓",
    addrEyebrow: "Adresse",
    addressHtml: "Landhaus Schend<br />Hauptstraße 9<br />54552 Immerath<br />Eifel volcanique · Allemagne",
    hoeheLabel: "Altitude",
    hoeheVal: "400 m au-dessus du niveau de la mer",
    gpsLabel: "GPS",
    kontaktEyebrow: "Contact",
    entfernungenEyebrow: "Distances",
    deutschlandLabel: "Allemagne",
    beneluxLabel: "Benelux",
    distDE: [
      { name: "Cochem", time: "25 min" },
      { name: "Nürburgring", time: "30 min" },
      { name: "Trèves", time: "43 min" },
      { name: "Cologne", time: "94 min" },
      { name: "Düsseldorf", time: "112 min" },
    ],
    distBX: [
      { name: "Luxembourg-Ville", time: "71 min" },
      { name: "Liège", time: "119 min" },
      { name: "Maastricht", time: "129 min" },
    ],
    distNote: "Les temps de trajet sont indicatifs, en voiture, selon le trafic.",
    autoEyebrow: "En voiture",
    autoItems: [
      '<strong class="font-medium">A1 / A48</strong> Cologne ↔ Trèves — sortie Daun, puis B257 env. 8 km jusqu\'à Immerath',
      '<strong class="font-medium">A60</strong> depuis la Belgique / les Pays-Bas — sortie Hillesheim, via B421 / B257',
      "Parking gratuit directement à l'hôtel — également des places pour motos",
    ],
    bahnEyebrow: "En train",
    bahnItems: [
      '<strong class="font-medium">Gare de Wittlich Hbf</strong> · env. 25 km — IC / RE Cologne ↔ Trèves',
      '<strong class="font-medium">Gare de Gerolstein</strong> · env. 30 km — Eifelbahn depuis Cologne',
      "Dernière étape volontiers en taxi — réservation à l'avance possible via nous",
    ],
    flugEyebrow: "En avion",
    flugItems: [
      '<strong class="font-medium">Aéroport de Francfort-Hahn</strong> · env. 70 km',
      '<strong class="font-medium">Aéroport de Luxembourg</strong> · env. 90 km',
      '<strong class="font-medium">Aéroport de Cologne/Bonn</strong> · env. 110 km',
    ],
  },

  nl: {
    eyebrow: "Route",
    h2: "Zo vindt u ons",
    subline: "Landhaus Schend · Hauptstraße 9 · 54552 Immerath · Vulkaneifel",
    mapTitle: "Kaart van Google Maps",
    mapConsentHtml:
      'Bij het laden van de kaart worden gegevens — o.&nbsp;a. uw IP-adres — naar Google verzonden, ook naar de VS. De interactieve kaart wordt pas na uw toestemming geladen. Meer hierover in onze <a href="/datenschutz" class="text-secondary underline hover:no-underline">privacyverklaring</a>.',
    mapLoad: "Kaart laden",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copyAria: "GPS-coördinaten kopiëren",
    copied: "Gekopieerd ✓",
    addrEyebrow: "Adres",
    addressHtml: "Landhaus Schend<br />Hauptstraße 9<br />54552 Immerath<br />Vulkaneifel · Duitsland",
    hoeheLabel: "Hoogte",
    hoeheVal: "400 m boven NAP",
    gpsLabel: "GPS",
    kontaktEyebrow: "Contact",
    entfernungenEyebrow: "Afstanden",
    deutschlandLabel: "Duitsland",
    beneluxLabel: "Benelux",
    distDE: [
      { name: "Cochem", time: "25 min" },
      { name: "Nürburgring", time: "30 min" },
      { name: "Trier", time: "43 min" },
      { name: "Keulen", time: "94 min" },
      { name: "Düsseldorf", time: "112 min" },
    ],
    distBX: [
      { name: "Luxemburg-Stad", time: "71 min" },
      { name: "Luik", time: "119 min" },
      { name: "Maastricht", time: "129 min" },
    ],
    distNote: "Reistijden zijn richtwaarden met de auto, afhankelijk van het verkeer.",
    autoEyebrow: "Met de auto",
    autoItems: [
      '<strong class="font-medium">A1 / A48</strong> Keulen ↔ Trier — afrit Daun, dan B257 ca. 8 km naar Immerath',
      '<strong class="font-medium">A60</strong> vanuit België / Nederland — afrit Hillesheim, via B421 / B257',
      "Gratis parkeerplaatsen direct bij het hotel — ook plekken voor motoren",
    ],
    bahnEyebrow: "Met de trein",
    bahnItems: [
      '<strong class="font-medium">Station Wittlich Hbf</strong> · ca. 25 km — IC / RE Keulen ↔ Trier',
      '<strong class="font-medium">Station Gerolstein</strong> · ca. 30 km — Eifelbahn vanuit Keulen',
      "Laatste etappe graag per taxi — reservering vooraf via ons mogelijk",
    ],
    flugEyebrow: "Met het vliegtuig",
    flugItems: [
      '<strong class="font-medium">Luchthaven Frankfurt-Hahn</strong> · ca. 70 km',
      '<strong class="font-medium">Luchthaven Luxemburg</strong> · ca. 90 km',
      '<strong class="font-medium">Luchthaven Keulen/Bonn</strong> · ca. 110 km',
    ],
  },
};
