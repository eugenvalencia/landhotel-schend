import { useEffect, useState } from "react";
import { activateOnKey } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet, Download, Check, Loader2, Mail } from "lucide-react";
import DemoBanner from "../DemoBanner";
import { supabase } from "@/integrations/supabase/client";

interface MonthlySummary {
  period: string;       // "2026-04"
  label: string;        // "April 2026"
  rows: number;
  revenue: number;
  status: "uebergeben" | "offen";
  file: string;
  date: string | null;  // Versanddatum
  details: BookingDetail[];
}

interface BookingDetail {
  booking_number: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  total_price: number;
}

const MONTH_NAMES = ["Januar", "Februar", "Maerz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export default function DemoDatevTab() {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MonthlySummary | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      // Buchungen der letzten 6 Monate, paid only, fuer DATEV-Export
      const { data } = await supabase
        .from("bookings")
        .select("booking_number, check_in, check_out, guest_name, total_price, payment_status")
        .eq("booking_type", "online")
        .eq("payment_status", "paid")
        .order("check_out", { ascending: false });

      if (!alive) return;

      const today = new Date();
      const groups: Record<string, BookingDetail[]> = {};

      for (const b of (data ?? []) as Array<BookingDetail & { check_out: string; payment_status: string }>) {
        const period = b.check_out.slice(0, 7); // "YYYY-MM"
        (groups[period] ||= []).push(b);
      }

      const list: MonthlySummary[] = [];
      // Letzte 6 abgeschlossene Monate
      for (let i = 1; i <= 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const details = groups[period] ?? [];
        const revenue = details.reduce((s, b) => s + Number(b.total_price), 0);
        const dateOfNext = new Date(d.getFullYear(), d.getMonth() + 1, 2);
        list.push({
          period,
          label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
          rows: details.length * 2,  // jeweils Erloese + MwSt-Splitting
          revenue,
          status: "uebergeben",
          file: `DATEV_${period}.csv`,
          date: dateOfNext.toLocaleDateString("de-DE"),
          details,
        });
      }
      setSummaries(list);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const generateThisMonth = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert("Demo-Modus: in der produktiven Version wird hier der CSV-Export gestartet + per E-Mail ans Steuerbuero versandt.");
    }, 800);
  };

  return (
    <div>
      <DemoBanner description="Monatlicher Steuer-Export ans Steuerbuero. CSV mit Konto-Zuordnung (Erloese 4400 / 4410), Belegnummern, MwSt-Splitting. Versand automatisch via Mail." />

      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-secondary" /> DATEV-Export
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monatliche Buchungsbelege im DATEV-Format. Klick auf einen Export zeigt Inhalt.
          </p>
        </div>
        <Button className="gap-2" onClick={generateThisMonth} disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {generating ? "Erzeuge …" : "Aktuellen Monat erzeugen"}
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Bisherige Exporte</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Lade …
            </div>
          ) : (
            <ul className="divide-y">
              {summaries.map((e) => (
                <li
                  key={e.period}
                  onClick={() => setSelected(e)}
                  onKeyDown={activateOnKey(() => setSelected(e))}
                  role="button"
                  tabIndex={0}
                  className="py-3 flex items-center justify-between gap-4 text-sm cursor-pointer hover:bg-muted/40 -mx-2 px-2 rounded"
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-medium">{e.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.rows} Buchungssaetze · {e.revenue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € Umsatz · Versandt {e.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{e.status}</Badge>
                    <span className="text-xs text-muted-foreground font-mono hidden md:inline">{e.file}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <DatevPreviewDialog summary={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function DatevPreviewDialog({ summary, onClose }: { summary: MonthlySummary | null; onClose: () => void }) {
  if (!summary) return null;
  return (
    <Dialog open={!!summary} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-secondary" />
            <span className="font-mono">{summary.file}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
            <span>{summary.details.length} Buchungen</span>
            <span>·</span>
            <span>Umsatz: <strong>{summary.revenue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong></span>
            <span>·</span>
            <span>Versandt: {summary.date}</span>
            <span className="ml-auto inline-flex items-center gap-1"><Mail className="h-3 w-3" /> steuer@bender-partner.de</span>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted/60 px-3 py-2 text-xs font-mono">
              Konto;Gegenkonto;Betrag;Belegnr;Datum;Notiz
            </div>
            <div className="max-h-[360px] overflow-y-auto font-mono text-[11px]">
              <table className="w-full">
                <tbody>
                  {summary.details.slice(0, 80).map((b, i) => {
                    const netto = (Number(b.total_price) / 1.07).toFixed(2);
                    const mwst = (Number(b.total_price) - Number(netto)).toFixed(2);
                    return (
                      <>
                        <tr key={`${b.booking_number}-n`} className="border-b odd:bg-muted/20">
                          <td className="px-3 py-1.5">4400</td>
                          <td className="px-3 py-1.5">10000</td>
                          <td className="px-3 py-1.5 text-right">{netto}</td>
                          <td className="px-3 py-1.5">{b.booking_number}</td>
                          <td className="px-3 py-1.5">{b.check_out}</td>
                          <td className="px-3 py-1.5 text-muted-foreground truncate max-w-[180px]">{b.guest_name}</td>
                        </tr>
                        <tr key={`${b.booking_number}-m`} className="border-b odd:bg-muted/20">
                          <td className="px-3 py-1.5">1576</td>
                          <td className="px-3 py-1.5">10000</td>
                          <td className="px-3 py-1.5 text-right">{mwst}</td>
                          <td className="px-3 py-1.5">{b.booking_number}</td>
                          <td className="px-3 py-1.5">{b.check_out}</td>
                          <td className="px-3 py-1.5 text-muted-foreground">7% MwSt</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {summary.details.length > 80 && (
              <div className="bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground text-center">
                … nur erste 80 von {summary.details.length} Buchungen angezeigt
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose}>Schliessen</Button>
            <Button onClick={() => alert("Demo: in echt landet die Datei in deinem Download-Ordner.")} className="gap-2">
              <Download className="h-4 w-4" /> CSV herunterladen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
