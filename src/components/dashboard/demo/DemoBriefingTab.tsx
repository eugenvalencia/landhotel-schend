import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Sun, ArrowDownToLine, ArrowUpFromLine, Cake, Wrench, Phone } from "lucide-react";
import DemoBanner from "../DemoBanner";

export default function DemoBriefingTab() {
  return (
    <div>
      <DemoBanner description="Morgendliches Briefing fuers Team — wer kommt, wer geht, was ist heute besonders. Wird um 06:00 generiert und per E-Mail an alle Mitarbeiter gesendet." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Coffee className="h-5 w-5 text-secondary" /> Daily Briefing — Freitag, 15. Mai 2026
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generiert um 06:02 Uhr. Versandt an: eugen@…, theke@…, kueche@…
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Sun className="h-4 w-4 text-amber-500" /> Heute im Haus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><ArrowDownToLine className="h-3 w-3" /> Anreisen (4)</h4>
              <ul className="space-y-1 pl-4">
                <li>· <strong>Familie Berger</strong> (4 P., 2 Naechte) — Zi. 14+15 — kommt erst 19:00, Abendbrot zubereitet?</li>
                <li>· <strong>Hr. & Fr. Reuter</strong> (Stammgast) — Zi. 7 — Glas Sekt zur Begruessung wie immer</li>
                <li>· <strong>Petra Wittmann</strong> (Solo) — Zi. 3 — Allergie: Nuesse</li>
                <li>· <strong>Holger Krause</strong> (Geschaeftlich) — Zi. 11 — Rechnung an Firma „Krause GmbH"</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><ArrowUpFromLine className="h-3 w-3" /> Abreisen (3)</h4>
              <ul className="space-y-1 pl-4">
                <li>· Zi. 8 — Frau Sommerfeld (bar bezahlt am Vorabend)</li>
                <li>· Zi. 12 — Hr. Roth (Karte) — Rechnung anhaengig in der Mappe</li>
                <li>· Zi. 16 — Fam. Schmitt (will 11:30 abreisen, Brot mitnehmen mit Wurst — bitte vorbereiten)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><Cake className="h-3 w-3" /> Besonderes</h4>
              <ul className="space-y-1 pl-4">
                <li>· <strong>Geburtstag</strong>: Hr. Reuter wird 68 — Karte + Kuchenstueck am Sa.-Fruehstueck</li>
                <li>· <strong>Tisch 4</strong>: Reservierung 19:30 fuer 6 Personen, Familie Wirth (Vegetarier)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Wetter Vulkaneifel</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-3xl font-display">17 °C</div>
              <p className="text-muted-foreground text-xs">Sonnig, ab 14 Uhr leichte Wolken. Wind aus SW 14 km/h.</p>
              <p className="text-xs mt-2"><strong>Tipp fuer Gaeste:</strong> Manderscheid-Burgen-Pfad ideal.</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5"><Wrench className="h-3 w-3" /> Operations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 text-muted-foreground">
              <p>· Muellabfuhr: Restmuell (gelbe Tonne)</p>
              <p>· Lieferung Eifeler Metzger: ca. 09:30</p>
              <p>· Wartung Spuelmaschine: morgen 11:00</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5"><Phone className="h-3 w-3" /> Notiz</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground italic">
              Telefon-KI hat heute Nacht 5 Buchungen entgegengenommen — alle in Kalender uebernommen.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
