import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Download, Check } from "lucide-react";
import DemoBanner from "../DemoBanner";

const EXPORTS = [
  { period: "April 2026",  status: "uebergeben", rows: 318, revenue: 21480, file: "DATEV_2026-04.csv",  date: "02.05.2026" },
  { period: "Maerz 2026",  status: "uebergeben", rows: 296, revenue: 19250, file: "DATEV_2026-03.csv",  date: "03.04.2026" },
  { period: "Februar 2026",status: "uebergeben", rows: 244, revenue: 16780, file: "DATEV_2026-02.csv",  date: "02.03.2026" },
  { period: "Januar 2026", status: "uebergeben", rows: 198, revenue: 13420, file: "DATEV_2026-01.csv",  date: "02.02.2026" },
];

export default function DemoDatevTab() {
  return (
    <div>
      <DemoBanner description="Monatlicher Steuer-Export ans Steuerbuero. CSV mit Konto-Zuordnung (Erloese 4400 / 4410), Belegnummern, MwSt-Splitting. Versand automatisch via Mail." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-secondary" /> DATEV-Export
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monatliche Buchungsbelege im DATEV-Format. Direkt importierbar in DATEV Unternehmen Online.
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" /> Mai 2026 erzeugen
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Bisherige Exporte</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {EXPORTS.map((e) => (
              <li key={e.period} className="py-3 flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-medium">{e.period}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.rows} Buchungssaetze · {e.revenue.toLocaleString("de-DE")} € Umsatz · Versandt {e.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{e.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" /> {e.file}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
