// Inhalt der Buchungs-ANFRAGE je Locale (Formular-Labels, Kategorien, JS-Meldungen).
// Kategorie-WERTE (an den Server) bleiben deutsch/stabil; nur Anzeige übersetzt.
// Datenschutz-Link zeigt bis zur Walter-geprüften Rechtstext-Übersetzung auf /datenschutz (DE).
import type { Locale } from "../index";

// Stabile Kategorie-Schlüssel (Wert im Payload) — NICHT übersetzen.
export const KATEGORIE_KEYS = ["Doppelzimmer", "Doppelzimmer Einzelnutzung", "Familienzimmer"] as const;

export interface AnfrageKategorie { label: string; sub: string; ab: string }
export interface AnfrageContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  introHtml: string;
  fotoHinweisHtml: string;
  honeypotLabel: string;
  nameLabel: string;
  streetLabel: string;
  cityLabel: string;
  emailLabel: string;
  phoneLabel: string;
  personsLabel: string;
  paketLabel: string;
  roomsLegend: string;
  roomsMulti: string;
  kategorien: AnfrageKategorie[];
  zimmerAnzahlLabel: string;
  zimmerUnit: string;
  zimmerMehr: string;
  halbpensionHint: string;
  checkinLabel: string;
  checkoutLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  optHalbpension: string;
  optHalbpensionNote: string;
  optKinderbett: string;
  optHund: string;
  optHundNote: string;
  dsLinkText: string;
  dsAfter: string;
  submitLabel: string;
  bottomNote: string;
  jsSending: string;
  jsRequiredFields: string;
  jsPickCategory: string;
  jsSuccess: string;
  jsValidationServer: string;
  jsFailed: string;
  jsConnFailed: string;
}

export const anfrageContent: Record<Locale, AnfrageContent> = {
  de: {
    metaTitle: "Buchungsanfrage",
    metaDescription:
      "Unverbindliche Buchungsanfrage im Landhaus Schend, Immerath — Doppel- & Familienzimmer, Frühstück inklusive. Wir prüfen Ihren Wunschtermin und melden uns persönlich zurück.",
    eyebrow: "Unverbindliche Anfrage",
    h1: "Ihre Buchungsanfrage",
    introHtml:
      'Senden Sie uns Ihren Wunschtermin — wir prüfen die Verfügbarkeit und melden uns persönlich bei Ihnen zurück. Alle Preise verstehen sich <span class="font-semibold">„ab"</span> und inklusive Frühstück; den Endpreis nennen wir Ihnen in unserer Antwort.',
    fotoHinweisHtml:
      'Die gezeigten Zimmerfotos sind <span class="font-medium">Beispielbilder</span>. Ausstattung und Ansicht des tatsächlich zugewiesenen Zimmers können je nach Verfügbarkeit leicht abweichen.',
    honeypotLabel: "Bitte leer lassen",
    nameLabel: "Vorname & Nachname",
    streetLabel: "Straße mit Hausnummer",
    cityLabel: "Wohnort",
    emailLabel: "E-Mail",
    phoneLabel: "Telefon",
    personsLabel: "Anzahl Personen",
    paketLabel: "Paket",
    roomsLegend: "Gewünschte Zimmer",
    roomsMulti: "(Mehrfachauswahl möglich)",
    kategorien: [
      { label: "Doppelzimmer", sub: "", ab: "ab 57 € p. P./Nacht" },
      { label: "Doppelzimmer", sub: "Einzelnutzung", ab: "ab 80 € p. P./Nacht" },
      { label: "Familienzimmer", sub: "", ab: "ab 170 € / Nacht" },
    ],
    zimmerAnzahlLabel: "Anzahl Zimmer",
    zimmerUnit: "Zimmer",
    zimmerMehr: "mehr",
    halbpensionHint: "Halbpension auf Wunsch: zzgl. 23 € pro Person/Tag — bitte unten ankreuzen.",
    checkinLabel: "Anreisedatum",
    checkoutLabel: "Abreisedatum",
    messageLabel: "Nachricht",
    messagePlaceholder: "Sonderwünsche, Fragen, gewünschte Zimmerlage …",
    optHalbpension: "Halbpension gewünscht",
    optHalbpensionNote: "(zzgl. 23 € p. P./Tag)",
    optKinderbett: "Zusätzliches Kinderbett",
    optHund: "Reise mit Hund",
    optHundNote: "(15 € / Tag)",
    dsLinkText: "Datenschutz",
    dsAfter: "gelesen und akzeptiert",
    submitLabel: "Anfrage senden",
    bottomNote:
      "Unverbindliche Anfrage — es entstehen keine Kosten und es wird nichts gebucht. Wir melden uns persönlich mit Verfügbarkeit und Endpreis.",
    jsSending: "Wird gesendet …",
    jsRequiredFields: "Bitte füllen Sie die markierten Pflichtfelder aus.",
    jsPickCategory: "Bitte wählen Sie mindestens eine Zimmer-Kategorie aus.",
    jsSuccess: "Vielen Dank! Ihre Anfrage ist bei uns eingegangen — wir melden uns persönlich bei Ihnen zurück.",
    jsValidationServer:
      "Bitte prüfen Sie Ihre Angaben — tippen Sie sie ggf. direkt ein. Automatisch ausgefüllte Felder (Browser) werden nicht immer übernommen.",
    jsFailed: "Das hat leider nicht geklappt. Bitte rufen Sie uns an: +49 6573 306 — oder versuchen Sie es später erneut.",
    jsConnFailed: "Verbindung fehlgeschlagen. Bitte rufen Sie uns an: +49 6573 306 — oder versuchen Sie es später erneut.",
  },

  en: {
    metaTitle: "Booking enquiry",
    metaDescription:
      "No-obligation booking enquiry at Landhaus Schend, Immerath — double & family rooms, breakfast included. We check your preferred dates and get back to you personally.",
    eyebrow: "No-obligation enquiry",
    h1: "Your booking enquiry",
    introHtml:
      'Send us your preferred dates — we will check availability and get back to you personally. All prices are <span class="font-semibold">"from"</span> prices and include breakfast; we will give you the final price in our reply.',
    fotoHinweisHtml:
      'The room photos shown are <span class="font-medium">example images</span>. The furnishings and view of the room actually assigned may vary slightly depending on availability.',
    honeypotLabel: "Please leave blank",
    nameLabel: "First & last name",
    streetLabel: "Street and house number",
    cityLabel: "Town/city",
    emailLabel: "Email",
    phoneLabel: "Phone",
    personsLabel: "Number of people",
    paketLabel: "Package",
    roomsLegend: "Desired rooms",
    roomsMulti: "(multiple selection possible)",
    kategorien: [
      { label: "Double room", sub: "", ab: "from 57 € pp/night" },
      { label: "Double room", sub: "Single occupancy", ab: "from 80 € pp/night" },
      { label: "Family room", sub: "", ab: "from 170 € / night" },
    ],
    zimmerAnzahlLabel: "Number of rooms",
    zimmerUnit: "room(s)",
    zimmerMehr: "more",
    halbpensionHint: "Half board on request: plus 23 € per person/day — please tick below.",
    checkinLabel: "Arrival date",
    checkoutLabel: "Departure date",
    messageLabel: "Message",
    messagePlaceholder: "Special requests, questions, preferred room location …",
    optHalbpension: "Half board desired",
    optHalbpensionNote: "(plus 23 € pp/day)",
    optKinderbett: "Additional child's bed",
    optHund: "Travelling with a dog",
    optHundNote: "(15 € / day)",
    dsLinkText: "Privacy policy",
    dsAfter: "read and accepted",
    submitLabel: "Send enquiry",
    bottomNote:
      "No-obligation enquiry — there are no costs and nothing is booked. We will get back to you personally with availability and the final price.",
    jsSending: "Sending …",
    jsRequiredFields: "Please fill in the highlighted required fields.",
    jsPickCategory: "Please select at least one room category.",
    jsSuccess: "Thank you! Your enquiry has reached us — we will get back to you personally.",
    jsValidationServer:
      "Please check your details — type them in directly if needed. Auto-filled fields (browser) are not always transmitted.",
    jsFailed: "Unfortunately that did not work. Please call us: +49 6573 306 — or try again later.",
    jsConnFailed: "Connection failed. Please call us: +49 6573 306 — or try again later.",
  },

  fr: {
    metaTitle: "Demande de réservation",
    metaDescription:
      "Demande de réservation sans engagement au Landhaus Schend, Immerath — chambres doubles & familiales, petit-déjeuner inclus. Nous vérifions vos dates et vous répondons personnellement.",
    eyebrow: "Demande sans engagement",
    h1: "Votre demande de réservation",
    introHtml:
      'Envoyez-nous vos dates souhaitées — nous vérifions la disponibilité et vous répondons personnellement. Tous les prix s\'entendent <span class="font-semibold">« à partir de »</span> et petit-déjeuner inclus ; nous vous indiquons le prix final dans notre réponse.',
    fotoHinweisHtml:
      'Les photos de chambres présentées sont des <span class="font-medium">exemples</span>. L\'équipement et la vue de la chambre réellement attribuée peuvent légèrement varier selon les disponibilités.',
    honeypotLabel: "Laisser vide s'il vous plaît",
    nameLabel: "Prénom & nom",
    streetLabel: "Rue et numéro",
    cityLabel: "Localité",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone",
    personsLabel: "Nombre de personnes",
    paketLabel: "Forfait",
    roomsLegend: "Chambres souhaitées",
    roomsMulti: "(sélection multiple possible)",
    kategorien: [
      { label: "Chambre double", sub: "", ab: "à p. de 57 € / pers./nuit" },
      { label: "Chambre double", sub: "Occupation simple", ab: "à p. de 80 € / pers./nuit" },
      { label: "Chambre familiale", sub: "", ab: "à p. de 170 € / nuit" },
    ],
    zimmerAnzahlLabel: "Nombre de chambres",
    zimmerUnit: "chambre(s)",
    zimmerMehr: "plus",
    halbpensionHint: "Demi-pension sur demande : + 23 € par personne/jour — à cocher ci-dessous.",
    checkinLabel: "Date d'arrivée",
    checkoutLabel: "Date de départ",
    messageLabel: "Message",
    messagePlaceholder: "Demandes particulières, questions, emplacement de chambre souhaité …",
    optHalbpension: "Demi-pension souhaitée",
    optHalbpensionNote: "(+ 23 € / pers./jour)",
    optKinderbett: "Lit d'enfant supplémentaire",
    optHund: "Voyage avec un chien",
    optHundNote: "(15 € / jour)",
    dsLinkText: "Politique de confidentialité",
    dsAfter: "lue et acceptée",
    submitLabel: "Envoyer la demande",
    bottomNote:
      "Demande sans engagement — aucun frais et aucune réservation. Nous vous répondons personnellement avec la disponibilité et le prix final.",
    jsSending: "Envoi …",
    jsRequiredFields: "Veuillez remplir les champs obligatoires signalés.",
    jsPickCategory: "Veuillez sélectionner au moins une catégorie de chambre.",
    jsSuccess: "Merci ! Votre demande nous est bien parvenue — nous vous répondons personnellement.",
    jsValidationServer:
      "Veuillez vérifier vos informations — saisissez-les directement si besoin. Les champs remplis automatiquement (navigateur) ne sont pas toujours transmis.",
    jsFailed: "Cela n'a malheureusement pas fonctionné. Appelez-nous : +49 6573 306 — ou réessayez plus tard.",
    jsConnFailed: "Échec de la connexion. Appelez-nous : +49 6573 306 — ou réessayez plus tard.",
  },

  nl: {
    metaTitle: "Boekingsaanvraag",
    metaDescription:
      "Vrijblijvende boekingsaanvraag in Landhaus Schend, Immerath — tweepersoons- & familiekamers, ontbijt inbegrepen. Wij controleren uw gewenste data en nemen persoonlijk contact op.",
    eyebrow: "Vrijblijvende aanvraag",
    h1: "Uw boekingsaanvraag",
    introHtml:
      'Stuur ons uw gewenste data — wij controleren de beschikbaarheid en nemen persoonlijk contact met u op. Alle prijzen zijn <span class="font-semibold">„vanaf"-prijzen</span> en inclusief ontbijt; de eindprijs noemen wij in ons antwoord.',
    fotoHinweisHtml:
      'De getoonde kamerfoto\'s zijn <span class="font-medium">voorbeeldbeelden</span>. De inrichting en het uitzicht van de daadwerkelijk toegewezen kamer kunnen afhankelijk van de beschikbaarheid licht afwijken.',
    honeypotLabel: "Laat dit leeg a.u.b.",
    nameLabel: "Voor- & achternaam",
    streetLabel: "Straat en huisnummer",
    cityLabel: "Woonplaats",
    emailLabel: "E-mail",
    phoneLabel: "Telefoon",
    personsLabel: "Aantal personen",
    paketLabel: "Arrangement",
    roomsLegend: "Gewenste kamers",
    roomsMulti: "(meerdere keuzes mogelijk)",
    kategorien: [
      { label: "Tweepersoonskamer", sub: "", ab: "vanaf 57 € p.p./nacht" },
      { label: "Tweepersoonskamer", sub: "Eenpersoonsgebruik", ab: "vanaf 80 € p.p./nacht" },
      { label: "Familiekamer", sub: "", ab: "vanaf 170 € / nacht" },
    ],
    zimmerAnzahlLabel: "Aantal kamers",
    zimmerUnit: "kamer(s)",
    zimmerMehr: "meer",
    halbpensionHint: "Halfpension op verzoek: + 23 € per persoon/dag — hieronder aankruisen a.u.b.",
    checkinLabel: "Aankomstdatum",
    checkoutLabel: "Vertrekdatum",
    messageLabel: "Bericht",
    messagePlaceholder: "Speciale wensen, vragen, gewenste kamerligging …",
    optHalbpension: "Halfpension gewenst",
    optHalbpensionNote: "(+ 23 € p.p./dag)",
    optKinderbett: "Extra kinderbed",
    optHund: "Reizen met hond",
    optHundNote: "(15 € / dag)",
    dsLinkText: "Privacyverklaring",
    dsAfter: "gelezen en geaccepteerd",
    submitLabel: "Aanvraag versturen",
    bottomNote:
      "Vrijblijvende aanvraag — er zijn geen kosten en er wordt niets geboekt. Wij nemen persoonlijk contact op met beschikbaarheid en eindprijs.",
    jsSending: "Bezig met verzenden …",
    jsRequiredFields: "Vul a.u.b. de gemarkeerde verplichte velden in.",
    jsPickCategory: "Selecteer a.u.b. minstens één kamercategorie.",
    jsSuccess: "Hartelijk dank! Uw aanvraag is bij ons binnengekomen — wij nemen persoonlijk contact met u op.",
    jsValidationServer:
      "Controleer a.u.b. uw gegevens — typ ze zo nodig direct in. Automatisch ingevulde velden (browser) worden niet altijd doorgegeven.",
    jsFailed: "Dat is helaas niet gelukt. Bel ons: +49 6573 306 — of probeer het later opnieuw.",
    jsConnFailed: "Verbinding mislukt. Bel ons: +49 6573 306 — of probeer het later opnieuw.",
  },
};
