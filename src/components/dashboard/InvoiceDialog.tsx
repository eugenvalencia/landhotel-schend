import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";
import { eur, formatDate } from "@/lib/format";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  booking: {
    booking_number: string;
    guest_name: string;
    guest_email: string | null;
    check_in: string;
    check_out: string;
    total_price: number;
    extras: any;
    created_at: string;
  };
  room: { room_number?: number; name: string; room_type?: string | null; price_per_night?: number } | null;
};

export default function InvoiceDialog({ open, onOpenChange, booking, room }: Props) {
  const nights = Math.max(1, Math.round((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 86400000));
  const roomPrice = Number(room?.price_per_night ?? 0);
  const extras = Array.isArray(booking.extras) ? booking.extras : [];
  const extrasTotal = extras.reduce((s: number, e: any) => s + (e.per_night ? Number(e.price) * nights : Number(e.price)), 0);
  const roomSubtotal = Math.max(0, Number(booking.total_price) - extrasTotal);
  const net = Number(booking.total_price) / 1.07;
  const vat = Number(booking.total_price) - net;
  const invoiceNr = `R-${booking.booking_number.replace(/\D/g, "").slice(-6).padStart(6, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-card p-8 print:p-12">
          <div className="flex items-start justify-between border-b pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span
                role="img"
                aria-label="Landhotel Schend Logo"
                className="schend-mark shrink-0 h-12 text-primary print:text-black"
              />
              <div>
                <div className="text-lg font-bold tracking-wide text-primary">LANDHOTEL SCHEND</div>
                <div className="text-xs text-muted-foreground">Hauptstraße 23 · 54552 Immerath</div>
                <div className="text-xs text-muted-foreground">Tel: +49 6573 306 · info@landhaus-schend.de</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">RECHNUNG</div>
              <div className="text-xs text-muted-foreground">Nr. {invoiceNr}</div>
              <div className="text-xs text-muted-foreground">Datum: {formatDate(new Date().toISOString())}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <div className="text-xs uppercase text-muted-foreground mb-1">Rechnungsempfänger</div>
              <div className="font-semibold">{booking.guest_name}</div>
              {booking.guest_email && <div className="text-muted-foreground">{booking.guest_email}</div>}
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground mb-1">Buchungsdetails</div>
              <div>Buchung: <span className="font-mono">{booking.booking_number}</span></div>
              <div>{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</div>
              <div className="text-muted-foreground">{nights} {nights === 1 ? "Nacht" : "Nächte"}</div>
            </div>
          </div>

          <table className="w-full text-sm border-t border-b">
            <thead>
              <tr className="border-b bg-muted/50 text-xs uppercase">
                <th className="text-left p-2">Position</th>
                <th className="text-right p-2">Menge</th>
                <th className="text-right p-2">Einzel</th>
                <th className="text-right p-2">Summe</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">
                  <div className="font-medium">Übernachtung</div>
                  <div className="text-xs text-muted-foreground">{room ? `Zimmer ${room.room_number} · ${room.room_type ?? room.name}` : "Zimmer"}</div>
                </td>
                <td className="text-right p-2">{nights}</td>
                <td className="text-right p-2">{eur(roomPrice || roomSubtotal / nights)}</td>
                <td className="text-right p-2 font-medium">{eur(roomSubtotal)}</td>
              </tr>
              {extras.map((e: any, i: number) => {
                const qty = e.per_night ? nights : 1;
                const sum = Number(e.price) * qty;
                return (
                  <tr key={i} className="border-b">
                    <td className="p-2">{e.name}{e.per_night ? " (pro Nacht)" : ""}</td>
                    <td className="text-right p-2">{qty}</td>
                    <td className="text-right p-2">{eur(Number(e.price))}</td>
                    <td className="text-right p-2 font-medium">{eur(sum)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Netto</span><span>{eur(net)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>MwSt. 7%</span><span>{eur(vat)}</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-2"><span>Gesamtbetrag</span><span>{eur(Number(booking.total_price))}</span></div>
            <div className="text-xs text-success pt-1">✓ Bezahlt am {formatDate(booking.created_at)}</div>
          </div>

          <div className="mt-8 pt-4 border-t text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground">Zahlungsinformationen</div>
            <div>IBAN: DE89 3704 0044 0532 0130 00 · BIC: COBADEFFXXX</div>
            <div>Steuernummer: 41/641/12345 · USt-IdNr.: DE123456789</div>
            <div className="pt-2">Vielen Dank für Ihren Aufenthalt im Landhotel Schend!</div>
          </div>
        </div>

        <div className="border-t bg-muted/30 p-4 flex flex-wrap justify-end gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Drucken
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Rechnung als PDF heruntergeladen (Demo)")}>
            <Download className="h-4 w-4" /> Herunterladen
          </Button>
          <Button size="sm" onClick={() => toast.success(`Rechnung an ${booking.guest_email ?? "Gast"} gesendet (Demo)`)}>
            <Mail className="h-4 w-4" /> Per E-Mail senden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
