import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, Printer, ArrowDownToLine, ArrowUpFromLine,
  Phone, AlertTriangle, MessageSquare, Coffee,
} from "lucide-react";
import DemoBanner from "../DemoBanner";

const TODAY = "Freitag, 15. Mai 2026";
const SHIFT = "Spätschicht 15:00 – 23:00";

const LATE_ARRIVALS = [
  { time: "ca. 21:00", guest: "Petra Wittmann", room: "Zimmer 3",  note: "Solo-Reisende. Tor offen lassen, Schlüssel-Box-Code per SMS schicken." },
  { time: "ab 19:00",  guest: "Familie Berger",  room: "Zimmer 14", note: "4 Pers. + Hund Bruno. Hundedecke ist drin, Wassernapf vorbereitet." },
  { time: "ca. 22:30", guest: "Klaus Hofmann",   room: "Zimmer 15", note: "Motorrad in Garage abstellen — er kennt den Code, ggf. helfen." },
];

const OPEN_TASKS = [
  { priority: "hoch", what: "Z. 11: Heizung wird laut — Techniker hat für morgen 11 Uhr zugesagt. Gast (Krause) informiert.", who: "Eugen" },
  { priority: "normal", what: "Z. 14: Hunde-Allergie-Reinigung nach Abreise am So. — Reinigung extra eingeplant.", who: "Reinigung" },
  { priority: "normal", what: "Tisch 4 Reservierung 19:30 (6 Pers., Familie Wirth, vegetarisch) — Bedienung Informiert.", who: "Küche/Service" },
  { priority: "info",  what: "Bewertung 4★ auf Google (Klaus Meier) eingetroffen — Antwort steht im Entwurf.", who: "Inhaber" },
];

const CALLS = [
  { time: "15:42", what: "Anruf Frau Schmidt (Stammgast): fragt nach Verfügbarkeit Sept. → an Eugen weiter."},
  { time: "16:18", what: "Anruf Bäckerei Reichmann: Brotbestellung morgen 10 statt 8 Uhr — Küche notiert." },
  { time: "17:05", what: "Anruf Maler Hahn: Schlüssel für Renovierung Z. 9 wird Montag abgegeben." },
];

const SPECIAL = [
  "🎂 Hr. Reuter (Z. 7) wird morgen 68 — Karte + Kuchenstück am Frühstück, schon vorbereitet.",
  "🌧 Wetter morgen: Regen ab Mittag — Schirme bereit, Indoor-Tipps am Empfang griffbereit.",
  "🍷 Sommelier-Verkostung morgen 19 Uhr im Restaurant — 8 Anmeldungen, Tisch 3+4 reserviert.",
];

export default function DemoHandoverTab() {
  return (
    <div>
      <DemoBanner description="Schicht-Übergabe-Protokoll: was die nächste Schicht wissen muss. Knopfdruck → Print-Page. Quittierung durch die ablösende Person automatisch im Audit-Log." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-secondary" /> Schicht-Übergabe
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {TODAY} · {SHIFT}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Drucken
          </Button>
          <Button className="gap-2">
            Quittieren &amp; übernehmen
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><ArrowDownToLine className="h-4 w-4 text-emerald-500" /> Späte Anreisen ({LATE_ARRIVALS.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {LATE_ARRIVALS.map((a, i) => (
                <li key={i} className="text-sm border-l-2 border-emerald-500/50 pl-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <strong>{a.guest}</strong>
                    <Badge variant="outline" className="text-[10px]">{a.time}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{a.room}</div>
                  <div className="text-xs mt-0.5 italic">{a.note}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Offene Punkte ({OPEN_TASKS.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {OPEN_TASKS.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Badge
                    variant={t.priority === "hoch" ? "default" : "outline"}
                    className={"text-[10px] shrink-0 " + (t.priority === "hoch" ? "bg-rose-500 hover:bg-rose-500 text-white" : "")}
                  >
                    {t.priority}
                  </Badge>
                  <div>
                    <div className="text-sm">{t.what}</div>
                    <div className="text-[11px] text-muted-foreground">Verantwortlich: {t.who}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4 text-sky-500" /> Anrufe / Mitteilungen</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {CALLS.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5">{c.time}</span>
                  <span>{c.what}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Coffee className="h-4 w-4 text-amber-700" /> Besonderes heute &amp; morgen</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {SPECIAL.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><ArrowUpFromLine className="h-4 w-4 text-rose-500" /> Frühschicht morgen — was vorbereiten</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>· <strong>3 Abreisen</strong> bis 11:00 — alle bezahlt, Schlüssel-Rückgabe in der Box</p>
            <p>· <strong>14 Frühstücke</strong> — davon 3 vegetarisch, 1 glutenfrei (siehe Briefing)</p>
            <p>· <strong>Lunchpaket</strong> für Familie Berger (Z. 14) — Wanderung, 4 Pers., ab 9:00 abholbereit</p>
            <p>· <strong>Geburtstagskuchen</strong> auf Tisch 7 für Hr. Reuter zum Frühstück</p>
            <p>· <strong>Tisch 4</strong> reserviert 12:30 Mittagessen für 6 Pers., Familie Wirth, vegetarisch</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card mt-4 bg-muted/30 border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Übergabe protokolliert um 23:00 von:</strong>{" "}
          <em>noch nicht quittiert</em> · Nach Quittierung landet ein Audit-Eintrag in der Compliance-Vault.
        </CardContent>
      </Card>
    </div>
  );
}
