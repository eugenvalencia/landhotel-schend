// Voll-Detail einer Buchung/Anfrage — von überall aufrufbar (Übersicht-Panel,
// Buchungsliste). Zeigt ALLE Infos, bevor man bestätigt/ablehnt. Lädt den
// vollständigen Datensatz per id, damit es auch aus Kurzlisten heraus funktioniert.

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Loader2, Mail, Phone, BedDouble, CalendarDays, Tag, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyBooking } from "@/lib/notify-booking";
import { toast } from "sonner";
import { eur, formatDate } from "@/lib/format";
import { notifyRequestsChanged } from "@/hooks/useOpenRequests";

type Extra = { name: string; price: number; per_night: boolean };
type FullBooking = {
  id: string;
  booking_number: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  extras: Extra[] | null;
  notes: string | null;
  source: string | null;
  request_status: "angefragt" | "bestaetigt" | "abgelehnt" | null;
  payment_status: string;
  rooms: { name?: string; room_type?: string; bed_description?: string } | null;
};

const nights = (ci: string, co: string) =>
  Math.max(1, Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86_400_000));

export default function BookingDetailDialog({
  bookingId,
  open,
  onOpenChange,
  onChanged,
}: {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onChanged?: () => void;
}) {
  const [b, setB] = useState<FullBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !bookingId) return;
    let active = true;
    setLoading(true);
    setB(null);
    (async () => {
      const { data, error } = await (supabase as any)
        .from("bookings")
        .select(
          "id, booking_number, guest_name, guest_email, guest_phone, check_in, check_out, total_price, extras, notes, source, request_status, payment_status, rooms ( name, room_type, bed_description )",
        )
        .eq("id", bookingId)
        .single();
      if (!active) return;
      if (error) toast.error("Buchung konnte nicht geladen werden");
      setB((data as FullBooking) ?? null);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [open, bookingId]);

  const act = async (status: "bestaetigt" | "abgelehnt") => {
    if (!b) return;
    setBusy(true);
    const { error } = await supabase.rpc("set_booking_request_status", {
      p_booking_id: b.id,
      p_status: status,
    });
    setBusy(false);
    if (error) {
      toast.error("Aktion fehlgeschlagen: " + error.message);
      return;
    }
    toast.success(status === "bestaetigt" ? "Anfrage bestätigt" : "Anfrage abgelehnt");
    // Verbindliche Bestätigungs-Mail an den Gast — nur beim Bestätigen, best-effort.
    if (status === "bestaetigt") notifyBooking(b.id, "confirmation");
    notifyRequestsChanged();
    onChanged?.();
    onOpenChange(false);
  };

  const extras = Array.isArray(b?.extras) ? (b!.extras as Extra[]) : [];
  const n = b ? nights(b.check_in, b.check_out) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {loading || !b ? "Buchung …" : `Buchung ${b.booking_number}`}
          </DialogTitle>
        </DialogHeader>

        {loading || !b ? (
          <div className="py-10 text-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            {/* Status */}
            <div className="flex flex-wrap items-center gap-2">
              {b.request_status === "angefragt" && <Badge variant="secondary">Angefragt</Badge>}
              {b.request_status === "bestaetigt" && <Badge>Bestätigt</Badge>}
              {b.request_status === "abgelehnt" && <Badge variant="outline">Abgelehnt</Badge>}
              <Badge
                variant={b.payment_status === "paid" ? "default" : b.payment_status === "cancelled" ? "destructive" : "secondary"}
              >
                {b.payment_status}
              </Badge>
              <Badge variant="outline" className="ml-auto font-normal">
                <Tag className="h-3 w-3 mr-1" /> Quelle: {b.source ?? "—"}
              </Badge>
            </div>

            <Separator />

            {/* Gast */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Gast</div>
              <div className="font-semibold text-base">{b.guest_name}</div>
              {b.guest_email && (
                <a href={`mailto:${b.guest_email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Mail className="h-3.5 w-3.5" /> {b.guest_email}
                </a>
              )}
              {b.guest_phone && (
                <a href={`tel:${b.guest_phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Phone className="h-3.5 w-3.5" /> {b.guest_phone}
                </a>
              )}
            </div>

            <Separator />

            {/* Zimmer + Zeitraum */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><BedDouble className="h-3 w-3" /> Zimmer</div>
                <div className="font-medium">{b.rooms?.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{b.rooms?.room_type}{b.rooms?.bed_description ? ` · ${b.rooms.bed_description}` : ""}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Zeitraum</div>
                <div className="font-medium">{formatDate(b.check_in)} → {formatDate(b.check_out)}</div>
                <div className="text-xs text-muted-foreground">{n} {n === 1 ? "Nacht" : "Nächte"}</div>
              </div>
            </div>

            {/* Extras */}
            {extras.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Extras</div>
                  <ul className="space-y-0.5">
                    {extras.map((e, i) => (
                      <li key={i} className="flex justify-between text-muted-foreground">
                        <span>{e.name}</span>
                        <span>{eur(Number(e.price))}{e.per_night ? " / Nacht" : ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Sonderwünsche */}
            {b.notes && (
              <>
                <Separator />
                <div className="rounded-md border bg-accent/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1"><StickyNote className="h-3 w-3" /> Sonderwünsche</div>
                  <p className="italic text-muted-foreground">„{b.notes}"</p>
                </div>
              </>
            )}

            <Separator />
            <div className="flex items-center justify-between text-base font-bold">
              <span>Gesamtpreis</span>
              <span>{eur(Number(b.total_price))}</span>
            </div>
            <p className="text-xs text-muted-foreground">Zahlung vor Ort — keine Online-Zahlung.</p>
          </div>
        )}

        {/* Aktionen nur bei offener Anfrage */}
        {b && b.request_status === "angefragt" && (
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" disabled={busy} onClick={() => act("abgelehnt")}>
              <X className="h-4 w-4" /> Ablehnen
            </Button>
            <Button disabled={busy} onClick={() => act("bestaetigt")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Bestätigen
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
