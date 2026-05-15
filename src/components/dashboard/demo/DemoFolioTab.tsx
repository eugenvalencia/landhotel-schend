import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Receipt, Plus, Printer, BedDouble, Utensils, GlassWater, Wifi, Cigarette, Coffee } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface FolioItem {
  id: string;
  date: string;
  category: "Übernachtung" | "Restaurant" | "Bar" | "Zusatz" | "Frühstück";
  description: string;
  quantity: number;
  unit: number;
  vat: 7 | 19;
}

interface OpenFolio {
  room: string;
  roomType: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  items: FolioItem[];
}

const FOLIOS: OpenFolio[] = [
  {
    room: "Zimmer 14", roomType: "Doppelzimmer Komfort", guestName: "Familie Berger",
    checkIn: "15.05.2026", checkOut: "17.05.2026",
    items: [
      { id: "1", date: "15.05.", category: "Übernachtung", description: "DZ Komfort, Halbpension",  quantity: 2, unit: 105, vat: 7 },
      { id: "2", date: "15.05.", category: "Restaurant",   description: "Abendmenü, 2 Erw + 2 Kind", quantity: 1, unit: 78,  vat: 19 },
      { id: "3", date: "15.05.", category: "Bar",          description: "2× Riesling, Apfelschorle", quantity: 1, unit: 18,  vat: 19 },
      { id: "4", date: "16.05.", category: "Zusatz",       description: "Hund Bruno",                quantity: 2, unit: 15,  vat: 19 },
      { id: "5", date: "16.05.", category: "Frühstück",    description: "Lunchpaket Wanderung",      quantity: 4, unit: 8,   vat: 7  },
    ],
  },
  {
    room: "Zimmer 7", roomType: "Doppelzimmer Standard", guestName: "Marcus & Carla Reuter",
    checkIn: "13.05.2026", checkOut: "17.05.2026",
    items: [
      { id: "1", date: "13.05.", category: "Übernachtung", description: "DZ Standard",            quantity: 4, unit: 95,  vat: 7 },
      { id: "2", date: "13.05.", category: "Bar",          description: "Begrüßungs-Sekt (Hausgeschenk)", quantity: 1, unit: 0,   vat: 19 },
      { id: "3", date: "14.05.", category: "Restaurant",   description: "Eifeler Wildgerichte",    quantity: 1, unit: 92,  vat: 19 },
      { id: "4", date: "15.05.", category: "Zusatz",       description: "Wäscherei-Service",       quantity: 1, unit: 14,  vat: 19 },
      { id: "5", date: "16.05.", category: "Restaurant",   description: "Sonntags-Brunch 2 P.",    quantity: 1, unit: 58,  vat: 7 },
    ],
  },
  {
    room: "Zimmer 11", roomType: "Doppelzimmer Komfort", guestName: "Holger Krause",
    checkIn: "14.05.2026", checkOut: "16.05.2026",
    items: [
      { id: "1", date: "14.05.", category: "Übernachtung", description: "DZ Komfort, geschäftlich", quantity: 2, unit: 105, vat: 7 },
      { id: "2", date: "14.05.", category: "Restaurant",   description: "Geschäftsessen 1 P.",       quantity: 1, unit: 34,  vat: 19 },
      { id: "3", date: "15.05.", category: "Zusatz",       description: "Drucker-Nutzung Büro",      quantity: 1, unit: 5,   vat: 19 },
    ],
  },
];

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "Übernachtung": BedDouble,
  "Restaurant":   Utensils,
  "Bar":          GlassWater,
  "Zusatz":       Wifi,
  "Frühstück":    Coffee,
};

export default function DemoFolioTab() {
  const [selected, setSelected] = useState<OpenFolio | null>(null);

  return (
    <div>
      <DemoBanner description="Laufende Zimmer-Rechnung: jeder Posten landet automatisch auf der Folio. Beim Check-out 1-Klick-Gesamtrechnung mit korrektem MwSt-Splitting (7 % Übernachtung / 19 % Speisen)." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <Receipt className="h-5 w-5 text-secondary" /> Folio · offene Rechnungen
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {FOLIOS.length} Zimmer aktuell belegt — Klick auf eine Karte zeigt die laufende Rechnung.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {FOLIOS.map((f) => {
          const total = f.items.reduce((s, i) => s + i.quantity * i.unit, 0);
          const itemCount = f.items.length;
          return (
            <Card
              key={f.room}
              className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => setSelected(f)}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{f.room}</div>
                    <div className="text-xs text-muted-foreground">{f.roomType}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {f.checkIn} → {f.checkOut}
                  </Badge>
                </div>
                <div className="font-display text-sm">{f.guestName}</div>
                <div className="pt-2 border-t flex items-baseline justify-between">
                  <span className="text-[11px] text-muted-foreground">{itemCount} Posten</span>
                  <span className="text-lg font-semibold tabular-nums">{total.toLocaleString("de-DE")} €</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <FolioDialog folio={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FolioDialog({ folio, onClose }: { folio: OpenFolio | null; onClose: () => void }) {
  if (!folio) return null;
  const total = folio.items.reduce((s, i) => s + i.quantity * i.unit, 0);
  const vat7 = folio.items.filter((i) => i.vat === 7).reduce((s, i) => s + i.quantity * i.unit, 0);
  const vat19 = folio.items.filter((i) => i.vat === 19).reduce((s, i) => s + i.quantity * i.unit, 0);
  const netto7 = vat7 / 1.07;
  const netto19 = vat19 / 1.19;
  const mwst7 = vat7 - netto7;
  const mwst19 = vat19 - netto19;

  return (
    <Dialog open={!!folio} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-secondary" />
            {folio.room} · {folio.guestName}
          </DialogTitle>
        </DialogHeader>
        <div className="text-xs text-muted-foreground -mt-1">
          {folio.roomType} · {folio.checkIn} → {folio.checkOut}
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs">
              <tr>
                <th className="text-left py-2 px-3">Datum</th>
                <th className="text-left py-2 px-3">Posten</th>
                <th className="text-right py-2 px-3">Menge</th>
                <th className="text-right py-2 px-3">Einzel</th>
                <th className="text-right py-2 px-3">Summe</th>
              </tr>
            </thead>
            <tbody>
              {folio.items.map((it) => {
                const Icon = CATEGORY_ICON[it.category] ?? Cigarette;
                const sum = it.quantity * it.unit;
                return (
                  <tr key={it.id} className="border-b last:border-0">
                    <td className="py-2 px-3 text-xs text-muted-foreground whitespace-nowrap">{it.date}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <div>
                          <div className="text-sm">{it.description}</div>
                          <div className="text-[10px] text-muted-foreground">{it.category} · {it.vat} % MwSt</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">{it.quantity}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{it.unit.toFixed(2)} €</td>
                    <td className="py-2 px-3 text-right tabular-nums font-medium">{sum.toFixed(2)} €</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-foreground">MwSt-Splitting</div>
            <div className="flex justify-between"><span className="text-muted-foreground">7 % (Übernachtung/Frühstück)</span><span className="tabular-nums">{mwst7.toFixed(2)} €</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">19 % (Speisen/Sonstiges)</span><span className="tabular-nums">{mwst19.toFixed(2)} €</span></div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-foreground">Netto-Anteile</div>
            <div className="flex justify-between"><span className="text-muted-foreground">Netto 7 %</span><span className="tabular-nums">{netto7.toFixed(2)} €</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Netto 19 %</span><span className="tabular-nums">{netto19.toFixed(2)} €</span></div>
          </div>
        </div>

        <div className="border-t pt-3 flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Brutto-Gesamt</span>
          <span className="text-2xl font-semibold tabular-nums">{total.toFixed(2)} €</span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Posten hinzufügen</Button>
          <Button className="gap-2"><Printer className="h-4 w-4" /> Rechnung drucken</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
