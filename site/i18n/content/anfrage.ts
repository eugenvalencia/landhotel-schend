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
  /** Bremse gegen Bots hat gegriffen — kann auch einen echten Gast treffen. */
  jsRateLimited: string;
  jsConnFailed: string;
  /**
   * Eigenstaendiger Lesetext rund um das Formular (seit 19.09.2026).
   * ⚠ WARUM: Die Seite bestand aus Ueberschrift + Formular und stand deshalb
   * seit dem 08.09. bewusst auf `noindex` — eine reine Formularseite hat fuer
   * Google keinen eigenen Wert und haette die uebrigen Seiten mit verduennt.
   * Diese Bloecke beantworten, was ein Gast beim Ausfuellen wirklich fragt:
   * Was passiert nach dem Absenden? Was kostet es? Wann kann ich anreisen?
   * Kann ich stornieren? Erst damit traegt die Seite sich selbst.
   * ⛔ JEDE Aussage hier ist im Repo belegt (AGB, FAQ, Zimmer, Datenschutz).
   * Nichts hinzudichten — der Gast plant danach seine Reise.
   */
  infoBloecke: { h2: string; text: string }[];
  /** Haeufige Fragen zur Anfrage selbst — als <details>, nicht als Fliesstext. */
  faqTitel: string;
  faq: { q: string; a: string }[];
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
    jsRateLimited: "Es kamen gerade sehr viele Anfragen an. Bitte versuchen Sie es in einigen Minuten noch einmal — oder rufen Sie uns an: +49 6573 306.",
    jsConnFailed: "Verbindung fehlgeschlagen. Bitte rufen Sie uns an: +49 6573 306 — oder versuchen Sie es später erneut.",
    infoBloecke: [
      {
        h2: "So läuft Ihre Anfrage ab",
        text: "Ihre Angaben gehen direkt an unsere Rezeption und werden dort von Hand geprüft — eine automatische Verfügbarkeitsprüfung gibt es bei uns nicht. Gleich nach dem Absenden erhalten Sie eine automatische Eingangsbestätigung per E-Mail: Sie sagt Ihnen, dass Ihre Anfrage angekommen ist, und ist noch keine Buchung. In der Regel antwortet Familie Beimler noch am selben Tag persönlich — mit der Verfügbarkeit und dem genauen Endpreis für Ihren Zeitraum. Erst diese Antwort bestätigt Ihre Buchung. Die Anfrage selbst ist unverbindlich und kostet nichts.",
      },
      {
        h2: "Zimmer und Preise auf einen Blick",
        text: "Wir haben 21 Zimmer — 19 Doppelzimmer und 2 Familienzimmer, alle Nichtraucherzimmer, jedes mit Dusche/WC, Telefon, Sat-TV, kostenfreiem WLAN und Safe. Ein Doppelzimmer kostet ab 57 € pro Person und Nacht, zur Einzelnutzung ab 80 € pro Nacht — jeweils inklusive Frühstücksbuffet. Das Familienzimmer für bis zu 4 Personen kostet ab 170 € pro Nacht, bei Nutzung durch zwei Personen ab 130 €. Kinder bis 2 Jahre übernachten im Elternzimmer kostenfrei, bis 12 Jahre zum halben Preis; zusätzliche Kinderbetten stellen wir auf Wunsch bereit. Alle Preise sind „ab“-Preise — den genauen Endpreis für Ihren Zeitraum nennen wir Ihnen in unserer Antwort.",
      },
      {
        h2: "Anreise und Abreise",
        text: "Ihr Zimmer steht Ihnen ab 15:00 Uhr am Anreisetag zur Verfügung. Am Abreisetag bitten wir Sie, das Zimmer bis 11:00 Uhr freizugeben. Möchten Sie später abreisen, fragen Sie uns bitte vorher — nach Absprache ist das oft möglich; ohne Absprache berechnen wir eine spätere Räumung nach unseren AGB. Auch eine frühere Anreise lässt sich oft einrichten; schreiben Sie es uns einfach in die Nachricht zu Ihrer Anfrage.",
      },
      {
        h2: "Zahlung, Stornierung und Direktbuchung",
        text: "Bezahlt wird bei uns vor Ort — bar, mit EC- oder Kreditkarte; über die Website läuft keine Zahlung. Nur bei Gruppen- und Sonderbuchungen vereinbaren wir gelegentlich vorab eine Anzahlung — das sagen wir Ihnen dann ausdrücklich. Stornieren können Sie jederzeit kostenfrei: Es fallen keine Stornogebühren an, ganz gleich wie kurzfristig Sie absagen, und auch dann nicht, wenn Sie gar nicht anreisen. Eine formlose Nachricht per Telefon oder E-Mail genügt. Weil Sie direkt bei uns statt über ein Buchungsportal anfragen, zahlen Sie zudem keine Vermittlungs-Provision.",
      },
      {
        h2: "Mit Hund, mit Kindern, in der Gruppe",
        text: "Ihr Hund ist bei uns willkommen — geben Sie ihn bitte in der Anfrage mit an; es kommen 15 € pro Tag dazu. Nur in den Hauptbereich des Restaurants nehmen Sie ihn bitte nicht mit. Einen Bademantel leihen wir für 5 € aus. Möchten Sie mehr als neun Zimmer, eine Familien- oder eine Firmenfeier anfragen, wählen Sie im Formular „mehr“ bei der Zimmeranzahl und schildern Sie uns Ihr Vorhaben in der Nachricht — wir melden uns dann mit einem individuellen Vorschlag. Feiern richten wir für bis zu 70 Personen aus.",
      },
    ],
    faqTitel: "Häufige Fragen zur Anfrage",
    faq: [
      {
        q: "Bekomme ich sofort eine Buchungsbestätigung?",
        a: "Sie erhalten sofort eine automatische Eingangsbestätigung per E-Mail — das ist noch keine Buchung, sondern die Nachricht, dass Ihre Anfrage angekommen ist. Verbindlich wird es erst mit unserer persönlichen Antwort, in der Regel noch am selben Tag, mit Verfügbarkeit und Endpreis.",
      },
      {
        q: "Muss ich bei der Anfrage schon etwas bezahlen?",
        a: "Nein. Über die Website werden keine Zahlungen abgewickelt und keine Kreditkartendaten erhoben. Bezahlt wird vor Ort — bar, mit EC- oder Kreditkarte. Nur bei Gruppen- und Sonderbuchungen kann vorab eine Anzahlung vereinbart werden; das sprechen wir vorher mit Ihnen ab.",
      },
      {
        q: "Kann ich meine Buchung kostenfrei stornieren?",
        a: "Ja, jederzeit — auch kurzfristig vor der Anreise. Es fallen keine Stornogebühren an, auch dann nicht, wenn Sie gar nicht anreisen. Eine formlose Nachricht per Telefon (+49 6573 306) oder E-Mail genügt.",
      },
      {
        q: "Wann kann ich anreisen, wann muss ich abreisen?",
        a: "Ihr Zimmer steht ab 15:00 Uhr am Anreisetag bereit. Am Abreisetag bitten wir Sie, das Zimmer bis 11:00 Uhr freizugeben. Andere Zeiten sind nach Absprache oft möglich — fragen Sie uns bitte vorher, sonst berechnen wir eine spätere Räumung nach unseren AGB.",
      },
      {
        q: "Kann ich mit Hund anreisen?",
        a: "Ja. Hunde sind willkommen, es fällt ein Zuschlag von 15 € pro Tag an. Nur in den Hauptbereich des Restaurants nehmen Sie ihn bitte nicht mit. Kreuzen Sie im Formular „Reise mit Hund“ an, damit wir Bescheid wissen.",
      },
      {
        q: "Was, wenn ich mehr als neun Zimmer oder eine Feier anfragen möchte?",
        a: "Wählen Sie „mehr“ bei der Zimmeranzahl und schildern Sie uns Ihr Vorhaben in der Nachricht. Für Familien- und Firmenfeiern bis 70 Personen stellen wir Menü oder Buffet individuell zusammen.",
      },
    ],
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
    jsRateLimited: "We have just received a great many requests. Please try again in a few minutes — or call us: +49 6573 306.",
    jsConnFailed: "Connection failed. Please call us: +49 6573 306 — or try again later.",
    infoBloecke: [
      {
        h2: "How your enquiry works",
        text: "Your details go straight to our reception desk, where they are checked by hand — we do not offer an automatic availability check. Right after you submit the form, you will receive an automatic confirmation email: it lets you know your enquiry has arrived, but it is not yet a booking. As a rule, the Beimler family replies personally on the same day — with availability and the exact final price for your dates. Only this reply confirms your booking; the enquiry itself is non-binding and free of charge.",
      },
      {
        h2: "Rooms and prices at a glance",
        text: 'We have 21 rooms — 19 double rooms and 2 family rooms, all non-smoking, each with shower/WC, telephone, satellite TV, free WiFi and a safe. A double room costs from 57 € per person per night, for single occupancy from 80 € per night — both including breakfast buffet. The family room for up to 4 people costs from 170 € per night, for two people from 130 €. Children up to 2 years stay free of charge in their parents\' room, up to 12 years at half price; additional children\'s beds are provided on request. All prices are "from" prices — we will give you the exact final price for your dates in our reply.',
      },
      {
        h2: "Arrival and departure",
        text: "Your room is available to you from 3 p.m. on the day of arrival. On the day of departure, we ask you to vacate the room by 11 a.m. If you would like to leave later, please ask us beforehand — by arrangement this is often possible; without prior arrangement we charge for a later check-out according to our terms and conditions. An earlier arrival can also often be arranged; just mention it in the message field of your enquiry.",
      },
      {
        h2: "Payment, cancellation and direct booking",
        text: "Payment is made on site — in cash, by debit or credit card; our website does not process online payments. Only for group and special bookings do we sometimes agree a deposit in advance — we will tell you explicitly if that applies. You may also cancel your booking free of charge at any time — no cancellation fees apply, regardless of how close to arrival, and even in case of no-show. An informal message by phone or email is enough. Because you enquire directly with us rather than through a booking portal, you also pay no booking commission.",
      },
      {
        h2: "With a dog, with children, in a group",
        text: 'Your dog is welcome with us — please mention it in your enquiry; this adds 15 € per day. We only ask that you do not bring it into the main restaurant area. For families we provide additional children\'s beds on request, and a bathrobe can be borrowed for 5 €. If you would like to request more than nine rooms, or a family or company celebration, select "more" for the number of rooms in the form and describe your plans in the message — we will then get back to you with an individual proposal. We host celebrations for up to 70 people.',
      },
    ],
    faqTitel: "Frequently asked questions about your enquiry",
    faq: [
      {
        q: "Will I receive an immediate booking confirmation?",
        a: "You will receive an automatic confirmation email straight away — this is not yet a booking, just confirmation that your enquiry has arrived. It only becomes binding with our personal reply, usually on the same day, including availability and the final price.",
      },
      {
        q: "Do I have to pay anything when making the enquiry?",
        a: "As a rule, no. The website does not process payments or collect credit card details — payment is made on site, in cash, by debit or credit card. Only for group and special bookings can a deposit be agreed in advance; we will discuss that with you beforehand.",
      },
      {
        q: "Can I cancel my booking free of charge?",
        a: "Yes, at any time — regardless of how close to arrival. No cancellation fees apply, even in case of no-show. An informal message by phone (+49 6573 306) or email is enough.",
      },
      {
        q: "When can I arrive, when do I have to leave?",
        a: "Your room is available from 3 p.m. on the day of arrival. On the day of departure we ask you to vacate it by 11 a.m. Other times are often possible by arrangement — please ask us beforehand, otherwise we will charge for a later check-out according to our terms and conditions.",
      },
      {
        q: "Can I travel with a dog?",
        a: 'Yes. Dogs are welcome, for a surcharge of 15 € per day. We only ask that you do not bring it into the main restaurant area. Simply tick "Travelling with a dog" in the form.',
      },
      {
        q: "What if I would like to request more than nine rooms or a celebration?",
        a: 'Select "more" for the number of rooms and describe your plans in the message. For family and company celebrations of up to 70 people we put together a menu or buffet individually.',
      },
    ],
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
    jsRateLimited: "Nous venons de recevoir un très grand nombre de demandes. Merci de réessayer dans quelques minutes — ou appelez-nous : +49 6573 306.",
    jsConnFailed: "Échec de la connexion. Appelez-nous : +49 6573 306 — ou réessayez plus tard.",
    infoBloecke: [
      {
        h2: "Comment se déroule votre demande",
        text: "Vos informations parviennent directement à notre réception, où elles sont vérifiées manuellement — nous ne proposons pas de vérification automatique de disponibilité. Juste après l'envoi, vous recevez un accusé de réception automatique par e-mail : il vous confirme que votre demande est bien arrivée, mais ce n'est pas encore une réservation. En règle générale, la famille Beimler répond personnellement le jour même — avec la disponibilité et le prix final exact pour vos dates. Seule cette réponse confirme votre réservation ; la demande elle-même est sans engagement et gratuite.",
      },
      {
        h2: "Chambres et prix en un coup d'œil",
        text: "Nous disposons de 21 chambres — 19 chambres doubles et 2 chambres familiales, toutes non-fumeurs, chacune avec douche/WC, téléphone, télévision satellite, WiFi gratuit et coffre-fort. Une chambre double coûte à partir de 57 € par personne et par nuit, en occupation simple à partir de 80 € par nuit — petit-déjeuner buffet inclus dans les deux cas. La chambre familiale pour jusqu'à 4 personnes coûte à partir de 170 € par nuit, pour deux personnes à partir de 130 €. Les enfants jusqu'à 2 ans dorment gratuitement dans la chambre des parents, jusqu'à 12 ans à moitié prix ; des lits d'enfant supplémentaires sont fournis sur demande. Tous les prix s'entendent « à partir de » — nous vous indiquons le prix final exact pour vos dates dans notre réponse.",
      },
      {
        h2: "Arrivée et départ",
        text: "Votre chambre est à votre disposition à partir de 15 h le jour de l'arrivée. Le jour du départ, nous vous demandons de libérer la chambre avant 11 h. Si vous souhaitez partir plus tard, merci de nous le demander au préalable — c'est souvent possible après entente ; sans accord préalable, nous facturons une libération tardive selon nos conditions générales. Une arrivée plus tôt peut également, la plupart du temps, être organisée ; indiquez-le simplement dans le message de votre demande.",
      },
      {
        h2: "Paiement, annulation et réservation directe",
        text: "Le paiement s'effectue sur place — en espèces, par carte EC ou par carte de crédit ; notre site internet ne traite aucun paiement en ligne. Uniquement pour les réservations de groupe ou spéciales, il arrive que nous convenions au préalable d'un acompte — nous vous le préciserons alors expressément. Vous pouvez également annuler votre réservation gratuitement à tout moment — aucuns frais d'annulation ne s'appliquent, quel que soit le délai avant l'arrivée, y compris en cas de non-présentation. Un simple message par téléphone ou par e-mail suffit. Comme vous nous contactez directement plutôt que via un portail de réservation, vous ne payez en outre aucune commission d'intermédiaire.",
      },
      {
        h2: "Avec un chien, avec des enfants, en groupe",
        text: "Votre chien est le bienvenu chez nous — merci de le mentionner dans votre demande ; cela ajoute 15 € par jour. Nous vous demandons seulement de ne pas l'emmener dans la partie principale du restaurant. Pour les familles, nous fournissons sur demande des lits d'enfant supplémentaires, et un peignoir peut être loué pour 5 €. Si vous souhaitez demander plus de neuf chambres, ou organiser une fête familiale ou d'entreprise, sélectionnez « plus » pour le nombre de chambres dans le formulaire et décrivez-nous votre projet dans le message — nous vous répondrons alors avec une proposition personnalisée. Nous organisons des fêtes pour jusqu'à 70 personnes.",
      },
    ],
    faqTitel: "Questions fréquentes sur votre demande",
    faq: [
      {
        q: "Vais-je recevoir immédiatement une confirmation de réservation ?",
        a: "Vous recevez immédiatement un accusé de réception automatique par e-mail — ce n'est pas encore une réservation, seulement la confirmation que votre demande nous est bien parvenue. Elle ne devient ferme qu'avec notre réponse personnelle, en général le jour même, avec la disponibilité et le prix final.",
      },
      {
        q: "Dois-je déjà payer quelque chose lors de la demande ?",
        a: "En règle générale, non. Le site internet ne traite aucun paiement et ne collecte aucune donnée de carte de crédit — le paiement s'effectue sur place, en espèces, par carte EC ou par carte de crédit. Uniquement pour les réservations de groupe ou spéciales, un acompte peut être convenu au préalable ; nous en discutons alors avec vous à l'avance.",
      },
      {
        q: "Puis-je annuler ma réservation gratuitement ?",
        a: "Oui, à tout moment — quel que soit le délai avant l'arrivée. Aucuns frais d'annulation ne s'appliquent, même en cas de non-présentation. Un simple message par téléphone (+49 6573 306) ou par e-mail suffit.",
      },
      {
        q: "Quand puis-je arriver, quand dois-je partir ?",
        a: "Votre chambre est disponible à partir de 15 h le jour de l'arrivée. Le jour du départ, nous vous demandons de la libérer avant 11 h. D'autres horaires sont souvent possibles après entente — merci de nous le demander au préalable, sinon nous facturons une libération tardive selon nos conditions générales.",
      },
      {
        q: "Puis-je venir avec mon chien ?",
        a: "Oui. Les chiens sont les bienvenus, moyennant un supplément de 15 € par jour. Nous vous demandons seulement de ne pas l'emmener dans la partie principale du restaurant. Cochez simplement « Voyage avec un chien » dans le formulaire.",
      },
      {
        q: "Et si je souhaite demander plus de neuf chambres ou une fête ?",
        a: "Sélectionnez « plus » pour le nombre de chambres et décrivez-nous votre projet dans le message. Pour les fêtes familiales et d'entreprise jusqu'à 70 personnes, nous composons un menu ou un buffet sur mesure.",
      },
    ],
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
    jsRateLimited: "We hebben zojuist heel veel aanvragen ontvangen. Probeer het over een paar minuten opnieuw — of bel ons: +49 6573 306.",
    jsConnFailed: "Verbinding mislukt. Bel ons: +49 6573 306 — of probeer het later opnieuw.",
    infoBloecke: [
      {
        h2: "Zo verloopt uw aanvraag",
        text: "Uw gegevens gaan rechtstreeks naar onze receptie en worden daar met de hand gecontroleerd — een automatische beschikbaarheidscontrole bieden wij niet aan. Direct na het versturen ontvangt u een automatische ontvangstbevestiging per e-mail: deze laat u weten dat uw aanvraag is binnengekomen, maar is nog geen boeking. In de regel antwoordt Familie Beimler nog dezelfde dag persoonlijk — met de beschikbaarheid en de exacte eindprijs voor uw periode. Pas met dit antwoord is uw boeking bevestigd; de aanvraag zelf is vrijblijvend en kosteloos.",
      },
      {
        h2: "Kamers en prijzen in één oogopslag",
        text: 'Wij hebben 21 kamers — 19 tweepersoonskamers en 2 familiekamers, allemaal niet-roken, elk met douche/wc, telefoon, sat-tv, gratis wifi en een kluis. Een tweepersoonskamer kost vanaf 57 € per persoon per nacht, bij eenpersoonsgebruik vanaf 80 € per nacht — beide inclusief ontbijtbuffet. De familiekamer voor maximaal 4 personen kost vanaf 170 € per nacht, bij gebruik door twee personen vanaf 130 €. Kinderen tot 2 jaar overnachten gratis op de kamer van de ouders, tot 12 jaar tegen halve prijs; extra kinderbedden stellen wij op verzoek beschikbaar. Alle prijzen zijn "vanaf"-prijzen — de exacte eindprijs voor uw periode noemen wij in ons antwoord.',
      },
      {
        h2: "Aankomst en vertrek",
        text: "Uw kamer staat vanaf 15.00 uur op de dag van aankomst tot uw beschikking. Op de dag van vertrek vragen wij u de kamer voor 11.00 uur te verlaten. Wilt u later vertrekken, vraag dit dan vooraf aan ons — in overleg is dat vaak mogelijk; zonder overleg berekenen wij een latere ontruiming volgens onze algemene voorwaarden. Ook een eerdere aankomst is meestal te regelen; vermeld dit gewoon in het bericht bij uw aanvraag.",
      },
      {
        h2: "Betaling, annulering en rechtstreeks boeken",
        text: "Bij ons wordt ter plaatse betaald — contant, met pinpas of creditcard; via onze website worden geen online betalingen verwerkt. Alleen bij groeps- en bijzondere boekingen spreken wij soms vooraf een aanbetaling af — dat laten wij u dan uitdrukkelijk weten. U kunt uw boeking te allen tijde kosteloos annuleren — er zijn geen annuleringskosten, ongeacht hoe kort van tevoren voor aankomst, en ook niet bij niet-verschijnen. Een informeel bericht per telefoon of e-mail volstaat. Omdat u rechtstreeks bij ons aanvraagt in plaats van via een boekingsportaal, betaalt u bovendien geen bemiddelingsprovisie.",
      },
      {
        h2: "Met hond, met kinderen, in groep",
        text: 'Uw hond is bij ons welkom — vermeld dit a.u.b. in uw aanvraag; er komt 15 € per dag bij. Alleen in het hoofdgedeelte van het restaurant vragen wij u hem niet mee te nemen. Voor gezinnen stellen wij op verzoek extra kinderbedden beschikbaar, een badjas is te huur voor 5 €. Wilt u meer dan negen kamers, een familie- of bedrijfsfeest aanvragen, kies dan in het formulier "meer" bij het aantal kamers en beschrijf uw plannen in het bericht — wij nemen dan contact met u op met een individueel voorstel. Feesten organiseren wij voor tot 70 personen.',
      },
    ],
    faqTitel: "Veelgestelde vragen over uw aanvraag",
    faq: [
      {
        q: "Krijg ik direct een boekingsbevestiging?",
        a: "U ontvangt direct een automatische ontvangstbevestiging per e-mail — dit is nog geen boeking, maar het bericht dat uw aanvraag is binnengekomen. Bindend wordt het pas met ons persoonlijke antwoord, meestal nog dezelfde dag, met beschikbaarheid en eindprijs.",
      },
      {
        q: "Moet ik bij de aanvraag al iets betalen?",
        a: "In de regel niet. Via de website worden geen betalingen verwerkt en geen creditcardgegevens verzameld — er wordt ter plaatse betaald, contant, met pinpas of creditcard. Alleen bij groeps- en bijzondere boekingen kan vooraf een aanbetaling worden afgesproken; dat bespreken wij dan vooraf met u.",
      },
      {
        q: "Kan ik mijn boeking kosteloos annuleren?",
        a: "Ja, te allen tijde — ongeacht hoe kort van tevoren voor aankomst. Er zijn geen annuleringskosten, ook niet bij niet-verschijnen. Een informeel bericht per telefoon (+49 6573 306) of e-mail volstaat.",
      },
      {
        q: "Wanneer kan ik aankomen, wanneer moet ik vertrekken?",
        a: "Uw kamer staat vanaf 15.00 uur op de dag van aankomst klaar. Op de dag van vertrek vragen wij u de kamer voor 11.00 uur te verlaten. Andere tijden zijn vaak in overleg mogelijk — vraag dit vooraf aan ons, anders berekenen wij een latere ontruiming volgens onze algemene voorwaarden.",
      },
      {
        q: "Kan ik met een hond komen?",
        a: 'Ja. Honden zijn welkom, er geldt een toeslag van 15 € per dag. Alleen in het hoofdgedeelte van het restaurant vragen wij u hem niet mee te nemen. Vink in het formulier gewoon "Reizen met hond" aan.',
      },
      {
        q: "Wat als ik meer dan negen kamers of een feest wil aanvragen?",
        a: 'Kies "meer" bij het aantal kamers en beschrijf uw plannen in het bericht. Voor familie- en bedrijfsfeesten tot 70 personen stellen wij een menu of buffet op maat samen.',
      },
    ],
  },
};
