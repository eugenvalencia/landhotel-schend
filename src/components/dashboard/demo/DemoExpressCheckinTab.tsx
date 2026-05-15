import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanLine, Send, Check, Clock, Smartphone, UserCheck } from "lucide-react";
import DemoBanner from "../DemoBanner";

type Status = "eingeladen" | "ausgefüllt" | "eingecheckt" | "wartet";

interface PreCheckin {
  id: string;
  guest: string;
  room: string;
  check_in: string;
  eta?: string;
  status: Status;
  invited_at: string;
  filled_at?: string;
  fields_complete: number;
  fields_total: number;
}

const PRE: PreCheckin[] = [
  { id: "PC-2611", guest: "Familie Berger",       room: "Z. 14", check_in: "15.05.", eta: "19:00", status: "ausgefüllt",  invited_at: "12.05.", filled_at: "14.05. 21:18", fields_complete: 7, fields_total: 7 },
  { id: "PC-2612", guest: "Petra Wittmann",       room: "Z. 3",  check_in: "15.05.", eta: "21:00", status: "ausgefüllt",  invited_at: "12.05.", filled_at: "15.05. 10:42", fields_complete: 7, fields_total: 7 },
  { id: "PC-2613", guest: "Klaus Hofmann",        room: "Z. 15", check_in: "15.05.", status: "eingeladen",                invited_at: "12.05.", fields_complete: 0, fields_total: 7 },
  { id: "PC-2614", guest: "Robert Lehmann",       room: "Z. 8",  check_in: "15.05.", status: "eingecheckt", invited_at: "10.05.", filled_at: "14.05. 19:00", fields_complete: 7, fields_total: 7 },
  { id: "PC-2615", guest: "Familie Wirth",        room: "Z. 11", check_in: "22.05.", status: "eingeladen",                invited_at: "14.05.", fields_complete: 0, fields_total: 7 },
  { id: "PC-2616", guest: "Michael Berg",         room: "Z. 10", check_in: "29.05.", status: "wartet",                    invited_at: "—", fields_complete: 0, fields_total: 7 },
];

const STATUS_LABEL: Record<Status, string> = {
  eingeladen: "Eingeladen",
  ausgefüllt: "Ausgefüllt",
  eingecheckt: "Eingecheckt",
  wartet: "Noch nicht eingeladen",
};
const STATUS_STYLE: Record<Status, string> = {
  eingeladen: "bg-sky-500 hover:bg-sky-500 text-white",
  ausgefüllt: "bg-emerald-500 hover:bg-emerald-500 text-white",
  eingecheckt: "bg-secondary text-secondary-foreground",
  wartet: "bg-muted text-muted-foreground",
};

export default function DemoExpressCheckinTab() {
  const total = PRE.length;
  const filled = PRE.filter((p) => p.status === "ausgefüllt" || p.status === "eingecheckt").length;
  const rate = Math.round((filled / total) * 100);

  return (
    <div>
      <DemoBanner description="Express-Check-in via QR und Pre-Check-in-Link: Personalien, Ausweis-Foto und Anreisezeit werden vor Anreise erfasst. An der Theke nur noch QR scannen, Schlüssel auf dem Handy." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-secondary" /> Express-Check-in
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Vor-Check-in für Anreisen — Empfangsdame entlastet, Gast freut sich über schnelles Eintreffen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Erfolgsquote</p>
            <p className="text-2xl font-semibold tabular-nums text-emerald-600">{rate} %</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{filled} von {total} Gästen</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Heute eingecheckt</p>
            <p className="text-2xl font-semibold tabular-nums">{PRE.filter((p) => p.status === "eingecheckt").length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Wartet auf Gast</p>
            <p className="text-2xl font-semibold tabular-nums text-sky-600">{PRE.filter((p) => p.status === "eingeladen").length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Noch einzuladen</p>
            <p className="text-2xl font-semibold tabular-nums text-amber-600">{PRE.filter((p) => p.status === "wartet").length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-base">Pre-Check-in Status</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {PRE.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{p.guest}</span>
                      <Badge variant="outline" className="text-[10px]">{p.room}</Badge>
                      <Badge variant="outline" className="text-[10px]">Anreise {p.check_in}</Badge>
                      {p.eta && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40">ETA {p.eta}</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-mono">{p.id}</span>
                      {p.status === "eingeladen" && <> · eingeladen am {p.invited_at}</>}
                      {p.filled_at && <> · ausgefüllt {p.filled_at}</>}
                    </div>
                    {p.fields_total > 0 && p.status !== "wartet" && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1 w-28 rounded-full bg-muted overflow-hidden">
                          <div
                            className={"h-full " + (p.fields_complete === p.fields_total ? "bg-emerald-500" : "bg-amber-500")}
                            style={{ width: `${(p.fields_complete / p.fields_total) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{p.fields_complete}/{p.fields_total} Felder</span>
                      </div>
                    )}
                  </div>
                  <Badge className={"text-[10px] shrink-0 " + STATUS_STYLE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                  {p.status === "wartet" && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                      <Send className="h-3 w-3" /> Einladen
                    </Button>
                  )}
                  {p.status === "ausgefüllt" && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                      <Check className="h-3 w-3" /> Check-in
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Smartphone className="h-4 w-4 text-secondary" /> Pre-Check-in Felder</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Personalien (Vor- + Nachname)</li>
              <li className="flex items-center gap-2"><UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Geburtsdatum + Geburtsort</li>
              <li className="flex items-center gap-2"><UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Anschrift</li>
              <li className="flex items-center gap-2"><UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Ausweis-Foto (Foto-Upload)</li>
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-500" /> Voraussichtliche Anreisezeit</li>
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-500" /> Wünsche / Anmerkungen</li>
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-500" /> Hund / Allergien (optional)</li>
            </ul>
            <div className="mt-4 pt-3 border-t text-xs text-muted-foreground space-y-1.5">
              <p>📧 Einladung geht automatisch <strong>3 Tage vor Anreise</strong> raus.</p>
              <p>🔒 Daten sicher gespeichert, nach 10 Jahren automatisch gelöscht.</p>
              <p>📱 Funktioniert ohne App — nur Browser-Link.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
