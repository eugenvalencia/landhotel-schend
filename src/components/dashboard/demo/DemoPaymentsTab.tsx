import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, TrendingUp, Euro, CalendarClock, Loader2 } from "lucide-react";
import DemoBanner from "../DemoBanner";
import { supabase } from "@/integrations/supabase/client";
import { eur, formatDate, toISODate } from "@/lib/format";

interface BookingRow {
  id: string;
  booking_number: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: string;
  created_at: string;
  notes: string | null;
  rooms?: { name: string; room_type: string } | null;
}

const CARD_BRANDS = ["Visa", "Mastercard", "PayPal", "Apple Pay", "SEPA-Lastschrift", "AmEx"];
function fakeMethod(bookingId: string): string {
  // Stabil je Buchung: erste 4 Hex-Stellen + Kartenmarke aus Buchungs-ID
  const hash = bookingId.replace(/-/g, "").slice(0, 4);
  const idx = parseInt(hash, 16) % CARD_BRANDS.length;
  const brand = CARD_BRANDS[idx];
  if (brand === "PayPal" || brand === "Apple Pay") return brand;
  if (brand === "SEPA-Lastschrift") return "SEPA";
  const last4 = parseInt(bookingId.replace(/-/g, "").slice(0, 8), 16) % 10000;
  return `${brand} •••• ${String(last4).padStart(4, "0")}`;
}

export default function DemoPaymentsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BookingRow | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, booking_number, guest_name, guest_email, guest_phone, check_in, check_out, total_price, payment_status, created_at, notes, rooms(name, room_type)")
        .eq("booking_type", "online")
        .order("created_at", { ascending: false })
        .limit(120);
      if (!alive) return;
      setBookings((data as unknown as BookingRow[]) ?? []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => {
    const today = toISODate(new Date());
    const monthStart = today.slice(0, 7) + "-01";
    const paid = bookings.filter((b) => b.payment_status === "paid");
    const revToday = paid
      .filter((b) => b.created_at.slice(0, 10) === today)
      .reduce((s, b) => s + Number(b.total_price), 0);
    const revMonth = paid
      .filter((b) => b.created_at.slice(0, 10) >= monthStart)
      .reduce((s, b) => s + Number(b.total_price), 0);
    const total = bookings.length;
    const success = total > 0 ? Math.round((paid.length / total) * 100 * 10) / 10 : 0;
    return { revToday, revMonth, success, total };
  }, [bookings]);

  return (
    <div>
      <DemoBanner description="Online-Zahlungen ueber Stripe — Karte/PayPal/Apple Pay/SEPA. Wird im Booking-Flow direkt eingebunden, Auszahlung 2-Werktage-Rhythmus." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-secondary" /> Online-Zahlungen
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Alle Stripe-Transaktionen — automatisch den Buchungen zugeordnet. Klick auf eine Zeile zeigt die Buchungsdetails.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Umsatz heute" value={eur(stats.revToday)}  icon={Euro} />
        <StatCard label="Umsatz Monat" value={eur(stats.revMonth)}  icon={TrendingUp} />
        <StatCard label="Erfolgsquote" value={`${stats.success}%`}  icon={CreditCard} />
        <StatCard label="Naechste Auszahlung" value="Montag"         icon={CalendarClock} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Transaktionen ({bookings.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Lade …
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground text-left">
                    <th className="font-medium py-2 px-2">Datum</th>
                    <th className="font-medium py-2 px-2">Buchung</th>
                    <th className="font-medium py-2 px-2">Gast</th>
                    <th className="font-medium py-2 px-2">Methode</th>
                    <th className="font-medium py-2 px-2">Status</th>
                    <th className="font-medium py-2 px-2 text-right">Betrag</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="border-b last:border-0 hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="py-2 px-2 text-muted-foreground whitespace-nowrap text-xs">
                        {formatDate(b.created_at.slice(0, 10))}
                      </td>
                      <td className="py-2 px-2 font-mono text-xs text-secondary">{b.booking_number}</td>
                      <td className="py-2 px-2 font-medium">{b.guest_name}</td>
                      <td className="py-2 px-2 text-muted-foreground text-xs">{fakeMethod(b.id)}</td>
                      <td className="py-2 px-2">
                        <StatusBadge status={b.payment_status} />
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums font-medium">{eur(Number(b.total_price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <BookingDetailDialog booking={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className="h-3.5 w-3.5 text-secondary" />
        </div>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    paid:      { label: "erfolgreich", variant: "default" },
    pending:   { label: "ausstehend",  variant: "outline" },
    refunded:  { label: "erstattet",   variant: "secondary" },
    cancelled: { label: "storniert",   variant: "secondary" },
  };
  const m = map[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={m.variant} className="text-[10px]">{m.label}</Badge>;
}

function BookingDetailDialog({ booking, onClose }: { booking: BookingRow | null; onClose: () => void }) {
  if (!booking) return null;
  const nights = Math.round(
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 86400000,
  );
  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Buchung</span>
            <span className="font-mono text-secondary text-base">{booking.booking_number}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1 text-sm">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <p className="text-xs text-muted-foreground">Gast</p>
              <p className="font-medium">{booking.guest_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={booking.payment_status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Zimmer</p>
              <p>{booking.rooms?.name ?? "—"} · {booking.rooms?.room_type ?? ""}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Naechte</p>
              <p>{nights}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Anreise</p>
              <p>{formatDate(booking.check_in)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Abreise</p>
              <p>{formatDate(booking.check_out)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">E-Mail</p>
              <p className="truncate">{booking.guest_email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefon</p>
              <p>{booking.guest_phone ?? "—"}</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Gesamtbetrag</p>
              <p className="text-xl font-semibold tabular-nums">{eur(Number(booking.total_price))}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">Zahlungsmethode</p>
              <p className="text-xs text-muted-foreground">{fakeMethod(booking.id)}</p>
            </div>
          </div>

          {booking.notes && (
            <div className="border-t pt-3">
              <p className="text-xs text-muted-foreground">Notiz</p>
              <p className="italic text-muted-foreground mt-0.5">{booking.notes}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>Schliessen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
