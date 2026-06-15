// Mehrsprachige Gast-EINGANGSBESTÄTIGUNG für eine Buchungs-ANFRAGE.
// Anfrage-Modus (Stufe A): der Gast bekommt sofort eine Eingangsbestätigung,
// die verbindliche Bestätigung folgt, sobald das Hotel die Anfrage im Dashboard
// bestätigt. Daher Wording "Anfrage eingegangen", nicht "Buchung bestätigt".
// Sprachen: DE (default), EN, FR, NL — match auf preferred_language.
// Reine String-Templates; HTML ist bewusst inline (max. Kompatibilität in Mail-Clients).

export type SupportedLang = "de" | "en" | "fr" | "nl";

// request      = Eingangsbestätigung beim Absenden (Buchung noch nicht verbindlich)
// confirmation = verbindliche Bestätigung, wenn das Hotel die Anfrage bestätigt
export type EmailKind = "request" | "confirmation";

export interface BookingEmailInput {
  language: string | null | undefined;
  kind?: EmailKind;
  bookingNumber: string;
  guestName: string;
  roomName: string;
  roomType: string | null;
  checkIn: string; // ISO yyyy-mm-dd
  checkOut: string;
  nights: number;
  extras: Array<{ name: string; price: number; per_night: boolean }>;
  totalPrice: number;
  notes: string;
}

const HOTEL = {
  name: "Landhaus Schend",
  street: "Hauptstraße 9",
  city: "54552 Immerath / Vulkaneifel",
  phone: "+49 6573 306",
  email: "info@landhaus-schend.de",
  web: "https://landhaus-schend.de",
};

const pickLang = (raw: string | null | undefined): SupportedLang => {
  const code = (raw ?? "de").toLowerCase().split("-")[0];
  if (code === "en" || code === "fr" || code === "nl") return code;
  return "de";
};

const fmtDate = (iso: string, lang: SupportedLang): string => {
  const d = new Date(iso + "T00:00:00Z");
  const locale = { de: "de-DE", en: "en-GB", fr: "fr-FR", nl: "nl-NL" }[lang];
  return d.toLocaleDateString(locale, { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
};

const fmtEur = (n: number, lang: SupportedLang): string => {
  const locale = { de: "de-DE", en: "en-IE", fr: "fr-FR", nl: "nl-NL" }[lang];
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n);
};

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

const TXT = {
  de: {
    subject: (bn: string, kind: EmailKind) =>
      kind === "confirmation"
        ? `Buchungsbestätigung ${bn} — Landhaus Schend`
        : `Anfrage eingegangen ${bn} — Landhaus Schend`,
    hi: (n: string) => `Liebe(r) ${n},`,
    intro: {
      request: "vielen Dank für Ihre Anfrage im Landhaus Schend. Wir prüfen die Verfügbarkeit und bestätigen Ihnen Ihre Buchung in Kürze — in der Regel binnen weniger Stunden.",
      confirmation: "wir freuen uns, Ihnen Ihre Buchung im Landhaus Schend verbindlich zu bestätigen. Ihr Zimmer ist nun fest für Sie reserviert — wir freuen uns auf Ihren Besuch.",
    },
    summary: { request: "Ihre Anfrage im Überblick", confirmation: "Ihre Buchung im Überblick" },
    bookingNo: "Buchungsnummer",
    room: "Zimmer",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: (n: number) => `${n} ${n === 1 ? "Nacht" : "Nächte"}`,
    extras: "Zusatzleistungen",
    perNight: "/ Nacht",
    notesLabel: "Ihre Nachricht",
    total: "Gesamtpreis",
    auto: {
      request: "Diese Eingangsbestätigung wurde automatisch erstellt — Ihre Buchung ist noch nicht verbindlich. Die verbindliche Bestätigung folgt, sobald wir die Verfügbarkeit geprüft haben. Bei Rückfragen, Sonderwünschen oder Änderungen erreichen Sie uns telefonisch oder per E-Mail — wir antworten in der Regel binnen weniger Stunden.",
      confirmation: "Diese Bestätigung wurde automatisch erstellt. Bei Rückfragen, Sonderwünschen oder Änderungen erreichen Sie uns telefonisch oder per E-Mail — wir antworten in der Regel binnen weniger Stunden.",
    },
    season: "Bei Fragen zu Anreise und Öffnungszeiten erreichen Sie uns jederzeit telefonisch oder per E-Mail.",
    bye: "Herzliche Grüße aus der Vulkaneifel",
    fam: "Ihr Team vom Landhaus Schend",
  },
  en: {
    subject: (bn: string, kind: EmailKind) =>
      kind === "confirmation"
        ? `Booking confirmation ${bn} — Landhaus Schend`
        : `Request received ${bn} — Landhaus Schend`,
    hi: (n: string) => `Dear ${n},`,
    intro: {
      request: "thank you for your enquiry at Landhaus Schend. We are checking availability and will confirm your booking shortly — usually within a few hours.",
      confirmation: "we are delighted to confirm your booking at Landhaus Schend. Your room is now firmly reserved for you — we look forward to welcoming you.",
    },
    summary: { request: "Your request summary", confirmation: "Your booking summary" },
    bookingNo: "Booking number",
    room: "Room",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: (n: number) => `${n} ${n === 1 ? "night" : "nights"}`,
    extras: "Extras",
    perNight: "/ night",
    notesLabel: "Your message",
    total: "Total",
    auto: {
      request: "This acknowledgement was generated automatically — your booking is not yet binding. A binding confirmation will follow once we have checked availability. For any questions, special requests or changes, please reach us by phone or email — we usually reply within a few hours.",
      confirmation: "This confirmation was generated automatically. For any questions, special requests or changes, please reach us by phone or email — we usually reply within a few hours.",
    },
    season: "For any questions about your arrival or our opening hours, you can reach us any time by phone or email.",
    bye: "Warm regards from the Volcanic Eifel",
    fam: "Your team at Landhaus Schend",
  },
  fr: {
    subject: (bn: string, kind: EmailKind) =>
      kind === "confirmation"
        ? `Confirmation de réservation ${bn} — Landhaus Schend`
        : `Demande reçue ${bn} — Landhaus Schend`,
    hi: (n: string) => `Cher / Chère ${n},`,
    intro: {
      request: "merci pour votre demande au Landhaus Schend. Nous vérifions les disponibilités et confirmerons votre réservation sous peu — en général sous quelques heures.",
      confirmation: "nous avons le plaisir de confirmer votre réservation au Landhaus Schend. Votre chambre est désormais fermement réservée — nous nous réjouissons de votre visite.",
    },
    summary: { request: "Récapitulatif de votre demande", confirmation: "Récapitulatif de votre réservation" },
    bookingNo: "Numéro de réservation",
    room: "Chambre",
    checkIn: "Arrivée",
    checkOut: "Départ",
    nights: (n: number) => `${n} ${n === 1 ? "nuit" : "nuits"}`,
    extras: "Services supplémentaires",
    perNight: "/ nuit",
    notesLabel: "Votre message",
    total: "Total",
    auto: {
      request: "Cet accusé de réception est généré automatiquement — votre réservation n'est pas encore ferme. La confirmation définitive suivra après vérification des disponibilités. Pour toute question, demande spéciale ou modification, contactez-nous par téléphone ou e-mail — nous répondons en général sous quelques heures.",
      confirmation: "Cette confirmation est générée automatiquement. Pour toute question, demande spéciale ou modification, contactez-nous par téléphone ou e-mail — nous répondons en général sous quelques heures.",
    },
    season: "Pour toute question sur votre arrivée ou nos horaires, contactez-nous à tout moment par téléphone ou e-mail.",
    bye: "Cordiales salutations de l'Eifel volcanique",
    fam: "Votre équipe du Landhaus Schend",
  },
  nl: {
    subject: (bn: string, kind: EmailKind) =>
      kind === "confirmation"
        ? `Boekingsbevestiging ${bn} — Landhaus Schend`
        : `Aanvraag ontvangen ${bn} — Landhaus Schend`,
    hi: (n: string) => `Beste ${n},`,
    intro: {
      request: "hartelijk dank voor uw aanvraag bij Landhaus Schend. We controleren de beschikbaarheid en bevestigen uw boeking binnenkort — meestal binnen enkele uren.",
      confirmation: "het verheugt ons uw boeking bij Landhaus Schend te bevestigen. Uw kamer is nu definitief voor u gereserveerd — we kijken uit naar uw bezoek.",
    },
    summary: { request: "Overzicht van uw aanvraag", confirmation: "Overzicht van uw boeking" },
    bookingNo: "Boekingsnummer",
    room: "Kamer",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: (n: number) => `${n} ${n === 1 ? "nacht" : "nachten"}`,
    extras: "Extra's",
    perNight: "/ nacht",
    notesLabel: "Uw bericht",
    total: "Totaalprijs",
    auto: {
      request: "Deze ontvangstbevestiging is automatisch aangemaakt — uw boeking is nog niet definitief. De definitieve bevestiging volgt zodra we de beschikbaarheid hebben gecontroleerd. Voor vragen, speciale wensen of wijzigingen kunt u ons telefonisch of per e-mail bereiken — we reageren meestal binnen enkele uren.",
      confirmation: "Deze bevestiging is automatisch aangemaakt. Voor vragen, speciale wensen of wijzigingen kunt u ons telefonisch of per e-mail bereiken — we reageren meestal binnen enkele uren.",
    },
    season: "Voor vragen over uw aankomst of onze openingstijden kunt u ons altijd telefonisch of per e-mail bereiken.",
    bye: "Hartelijke groet uit de Vulkaan-Eifel",
    fam: "Uw team van Landhaus Schend",
  },
} as const;

export const renderBookingEmail = (input: BookingEmailInput) => {
  const lang = pickLang(input.language);
  const kind: EmailKind = input.kind ?? "request";
  const t = TXT[lang];
  const subjectLine = t.subject(input.bookingNumber, kind);

  const ci = fmtDate(input.checkIn, lang);
  const co = fmtDate(input.checkOut, lang);
  const total = fmtEur(input.totalPrice, lang);

  const extrasLines = input.extras.length === 0
    ? ""
    : input.extras
        .map((e) => `<li>${escapeHtml(e.name)} — ${fmtEur(e.price, lang)}${e.per_night ? ` ${t.perNight}` : ""}</li>`)
        .join("");

  const extrasText = input.extras.length === 0
    ? ""
    : input.extras
        .map((e) => `  - ${e.name} — ${fmtEur(e.price, lang)}${e.per_night ? ` ${t.perNight}` : ""}`)
        .join("\n");

  const notesBlock = input.notes
    ? `<p style="margin:18px 0 0;padding:14px 16px;background:#f6f3ee;border-left:3px solid #b8985a;color:#3a3a3a;font-size:14px;line-height:1.55;">
         <strong>${t.notesLabel}:</strong><br>${escapeHtml(input.notes).replace(/\n/g, "<br>")}
       </p>`
    : "";

  const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${escapeHtml(subjectLine)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif;color:#2a2a2a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e0d5;">
          <tr>
            <td style="padding:36px 40px 18px;border-bottom:1px solid #e6e0d5;text-align:center;">
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;color:#b8985a;text-transform:uppercase;margin-bottom:6px;">★★★ Superior</div>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#2a2a2a;letter-spacing:0.02em;">${HOTEL.name}</h1>
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#7a7a7a;margin-top:4px;">${HOTEL.city}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 8px;">
              <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">${escapeHtml(t.hi(input.guestName))}</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3a3a3a;">${t.intro[kind]}</p>

              <h2 style="margin:24px 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#2a2a2a;border-bottom:1px solid #e6e0d5;padding-bottom:8px;">${t.summary[kind]}</h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.7;">
                <tr><td style="color:#7a7a7a;width:160px;">${t.bookingNo}</td><td style="font-weight:600;color:#2a2a2a;letter-spacing:0.04em;">${escapeHtml(input.bookingNumber)}</td></tr>
                <tr><td style="color:#7a7a7a;">${t.room}</td><td style="color:#2a2a2a;">${escapeHtml(input.roomName)}${input.roomType ? ` <span style="color:#7a7a7a;">— ${escapeHtml(input.roomType)}</span>` : ""}</td></tr>
                <tr><td style="color:#7a7a7a;">${t.checkIn}</td><td style="color:#2a2a2a;">${escapeHtml(ci)}</td></tr>
                <tr><td style="color:#7a7a7a;">${t.checkOut}</td><td style="color:#2a2a2a;">${escapeHtml(co)} <span style="color:#7a7a7a;">(${t.nights(input.nights)})</span></td></tr>
              </table>

              ${extrasLines ? `<h3 style="margin:24px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2a2a2a;">${t.extras}</h3><ul style="margin:0;padding-left:20px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.7;color:#3a3a3a;">${extrasLines}</ul>` : ""}

              ${notesBlock}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;border-top:1px solid #e6e0d5;">
                <tr><td style="padding:18px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;color:#b8985a;text-transform:uppercase;">${t.total}</td>
                    <td align="right" style="padding:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2a2a2a;font-weight:600;">${total}</td></tr>
              </table>

              <p style="margin:32px 0 0;padding:16px;background:#f6f3ee;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.6;color:#5a5a5a;">${t.auto[kind]}</p>
              <p style="margin:14px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#7a7a7a;font-style:italic;">${t.season}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #e6e0d5;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.7;color:#5a5a5a;">
              <p style="margin:0 0 6px;">${t.bye}</p>
              <p style="margin:0 0 18px;color:#2a2a2a;">${t.fam}</p>
              <div style="border-top:1px solid #e6e0d5;padding-top:14px;font-size:12px;color:#7a7a7a;">
                <strong style="color:#2a2a2a;">${HOTEL.name}</strong><br>
                ${HOTEL.street} · ${HOTEL.city}<br>
                Tel <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#5a5a5a;text-decoration:none;">${HOTEL.phone}</a> · <a href="mailto:${HOTEL.email}" style="color:#5a5a5a;text-decoration:none;">${HOTEL.email}</a> · <a href="${HOTEL.web}" style="color:#5a5a5a;text-decoration:none;">${HOTEL.web.replace("https://", "")}</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    t.hi(input.guestName),
    "",
    t.intro[kind],
    "",
    `=== ${t.summary[kind]} ===`,
    `${t.bookingNo}: ${input.bookingNumber}`,
    `${t.room}: ${input.roomName}${input.roomType ? ` (${input.roomType})` : ""}`,
    `${t.checkIn}: ${ci}`,
    `${t.checkOut}: ${co} (${t.nights(input.nights)})`,
    extrasText ? `\n${t.extras}:\n${extrasText}` : "",
    input.notes ? `\n${t.notesLabel}:\n${input.notes}` : "",
    "",
    `${t.total}: ${total}`,
    "",
    t.auto[kind],
    "",
    t.season,
    "",
    t.bye,
    t.fam,
    "",
    `${HOTEL.name}`,
    `${HOTEL.street} · ${HOTEL.city}`,
    `Tel ${HOTEL.phone} · ${HOTEL.email} · ${HOTEL.web}`,
  ]
    .filter((line) => line !== undefined && line !== null)
    .join("\n");

  return {
    subject: subjectLine,
    html,
    text,
    language: lang,
    fromName: HOTEL.name,
    replyTo: HOTEL.email,
  };
};
