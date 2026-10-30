// Test: Die Bestätigungsmail an den Gast enthält keinen vom Gast getippten Freitext.
// Lauf: node scripts/pruefe-inquiry-gastmail.mjs   (Node ≥ 22.18, liest .ts direkt)
import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/inquiry.ts";

test("Gast-Mail ohne Freitext, Hotel-Mail vollständig", async () => {
  const sent = [];
  globalThis.fetch = async (_u, init) => {
    sent.push(JSON.parse(init.body));
    return new Response("{}", { status: 200 });
  };
  const gift = "SPAMTEXT-http://boese.example";
  const body = {
    name: `Name ${gift}`, email: "opfer@example.org", phone: `Tel ${gift}`,
    street: `Str ${gift}`, city: `Ort ${gift}`, message: `Msg ${gift}`, paket: `Paket ${gift}`,
    checkin: gift.slice(0, 10), checkout: "2026-12-03", persons: 2, zimmer: "1",
    rooms: [{ kategorie: "Doppelzimmer", anzahl: 1 }], datenschutz: true,
  };
  const res = await onRequestPost({
    request: new Request("https://x.test/api/inquiry", { method: "POST", headers: { "cf-connecting-ip": "203.0.113.9" }, body: JSON.stringify(body) }),
    env: { RESEND_API_KEY: "k", INQUIRY_TO: "hotel@example.org" },
  });
  assert.equal((await res.json()).ok, true);
  const [hotel, gast] = sent;
  assert.match(hotel.html, /SPAMTEXT/); // Hotel bekommt alles
  for (const feld of ["html", "text", "subject"]) assert.doesNotMatch(gast[feld], /SPAMTEXT|boese|Opfer|opfer/);
  assert.match(gast.html, /2026-12-03/); // geprüftes Datum bleibt
  assert.doesNotMatch(gast.html, /2026-1[^2]|SPAMTEXT/);
});
