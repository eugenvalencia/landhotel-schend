// Test-Skript: schickt die ECHTE Buchungs-Mail (gerendert aus dem Live-Template)
// an eine Adresse — ohne Supabase-Deploy, ohne DNS. Für den schnellen Inbox-Test.
//
// Voraussetzung: ein kostenloser Resend-Key (https://resend.com/api-keys).
// WICHTIG (Resend-Sandbox): Ohne verifizierte Domain darf man nur an die
// Adresse senden, mit der das Resend-Konto registriert wurde. Also: Resend-Konto
// mit e.neifer@outlook.de anlegen, dann kommt der Test dort an.
//
// Aufruf (PowerShell):
//   $env:RESEND_API_KEY="re_xxx"; deno run --allow-net --allow-env scripts/send-test-email.ts
// Optional:
//   $env:TEST_TO="e.neifer@outlook.de"   (Default unten)
//   $env:TEST_FROM="onboarding@resend.dev"  (Sandbox-Absender; ohne Domain-Verify)
//   $env:TEST_KIND="both"  (request | confirmation | both — Default both)
//   $env:TEST_LANG="de"    (de | en | fr | nl)

import { renderBookingEmail, type EmailKind } from "../supabase/functions/_shared/booking-email.ts";

const API_KEY = Deno.env.get("RESEND_API_KEY");
const TO = Deno.env.get("TEST_TO") ?? "e.neifer@outlook.de";
const FROM = Deno.env.get("TEST_FROM") ?? "onboarding@resend.dev";
const LANG = Deno.env.get("TEST_LANG") ?? "de";
const KIND = (Deno.env.get("TEST_KIND") ?? "both") as EmailKind | "both";

if (!API_KEY) {
  console.error("❌ RESEND_API_KEY fehlt. Setzen und erneut starten.");
  Deno.exit(1);
}

// Demo-Buchung
const demo = {
  language: LANG,
  bookingNumber: "LSC-TEST-" + new Date().toISOString().slice(11, 19).replace(/:/g, ""),
  guestName: "Eugen Neifer",
  roomName: "Doppelzimmer Komfort",
  roomType: "Doppelzimmer Komfort",
  checkIn: "2026-07-10",
  checkOut: "2026-07-13",
  nights: 3,
  extras: [
    { name: "Frühstück", price: 12, per_night: true },
    { name: "Late Check-out", price: 20, per_night: false },
  ],
  totalPrice: 3 * 105 + 3 * 12 + 20,
  notes: "Test-Buchung über das send-test-email-Skript — ruhiges Zimmer bitte.",
};

async function send(kind: EmailKind) {
  const mail = renderBookingEmail({ ...demo, kind });
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      from: `Landhotel Schend <${FROM}>`,
      to: [TO],
      reply_to: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }),
  });
  const body = await r.text();
  console.log(`${kind.padEnd(12)} -> HTTP ${r.status}  ${r.ok ? "✅ gesendet" : "❌ " + body.slice(0, 300)}`);
}

console.log(`Sende Test-Mail(s) an ${TO} (von ${FROM}, Sprache ${LANG}) ...`);
if (KIND === "both" || KIND === "request") await send("request");
if (KIND === "both" || KIND === "confirmation") await send("confirmation");
console.log("Fertig. Schau in deinen Posteingang (ggf. Spam-Ordner).");
