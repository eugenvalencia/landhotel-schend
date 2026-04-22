import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, CalendarPlus, Pencil, X, BedDouble, Star, User, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { eur, formatDate } from "@/lib/format";

type Booking = {
  id: string;
  booking_number: string;
  room_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  booking_type: "online" | "intern";
  payment_status: string;
  total_price: number;
  notes: string | null;
  extras: any;
  created_at: string;
};

type Room = { id: string; room_number?: number; name: string; room_type?: string | null };

const nights = (a: string, b: string) =>
  Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

export default function GuestProfileDialog({
  guestKey,
  open,
  onOpenChange,
  onCreateBooking,
}: {
  guestKey: { name: string; email?: string | null } | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreateBooking?: (guest: { name: string; email: string; phone: string }) => void;
}) {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guestRecord, setGuestRecord] = useState<{ id?: string; notes?: string | null } | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (!open || !guestKey) return;
    (async () => {
      const [{ data: b }, { data: r }] = await Promise.all([
        supabase.from("bookings").select("*").order("check_in", { ascending: false }),
        supabase.from("rooms").select("id,name,room_number,room_type"),
      ]);
      setAllBookings((b as any[]) ?? []);
      setRooms((r as any[]) ?? []);

      if (guestKey.email) {
        const { data: g } = await supabase.from("guests").select("id,notes").eq("email", guestKey.email).maybeSingle();
        setGuestRecord(g ?? null);
        setStaffNotes(g?.notes ?? "");
      } else {
        setGuestRecord(null);
        setStaffNotes("");
      }
    })();
  }, [open, guestKey?.name, guestKey?.email]);

  const roomMap = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), [rooms]);

  const guestBookings = useMemo(() => {
    if (!guestKey) return [];
    const key = (guestKey.email || guestKey.name).toLowerCase();
    return allBookings.filter((b) => {
      if (b.booking_type === "intern") return false;
      const k = (b.guest_email || b.guest_name).toLowerCase();
      return k === key;
    });
  }, [allBookings, guestKey?.name, guestKey?.email]);

  const stats = useMemo(() => {
    const total = guestBookings.length;
    const totalSpent = guestBookings.reduce((s, b) => s + Number(b.total_price || 0), 0);
    const totalNights = guestBookings.reduce((s, b) => s + nights(b.check_in, b.check_out), 0);
    const avgNights = total ? Math.round((totalNights / total) * 10) / 10 : 0;
    const today = new Date().toISOString().slice(0, 10);
    const past = guestBookings.filter((b) => b.check_out <= today);
    const upcoming = guestBookings.filter((b) => b.check_in >= today);
    const lastStay = past[0]?.check_out;
    const nextStay = [...upcoming].sort((a, b) => a.check_in.localeCompare(b.check_in))[0]?.check_in;
    const firstBooking = [...guestBookings].sort((a, b) => a.created_at.localeCompare(b.created_at))[0]?.created_at;

    const roomCount = new Map<string, number>();
    guestBookings.forEach((b) => roomCount.set(b.room_id, (roomCount.get(b.room_id) ?? 0) + 1));
    const favRoomId = [...roomCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const favRoom = favRoomId ? roomMap[favRoomId] : undefined;

    const extraCount = new Map<string, number>();
    guestBookings.forEach((b) => {
      const arr = Array.isArray(b.extras) ? b.extras : [];
      arr.forEach((e: any) => extraCount.set(e.name, (extraCount.get(e.name) ?? 0) + 1));
    });
    const favExtras = [...extraCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n);

    return { total, totalSpent, avgNights, lastStay, nextStay, firstBooking, favRoom, favExtras, upcoming };
  }, [guestBookings, roomMap]);

  const isRegular = stats.total >= 3;
  const guestInfo = guestBookings[0];
  const phone = guestInfo?.guest_phone ?? "";
  const email = guestInfo?.guest_email ?? guestKey?.email ?? "";

  const saveStaffNotes = async () => {
    if (!email) {
      toast.error("Keine E-Mail – Notiz kann nicht gespeichert werden");
      return;
    }
    setSavingNotes(true);
    if (guestRecord?.id) {
      const { error } = await supabase.from("guests").update({ notes: staffNotes || null }).eq("id", guestRecord.id);
      setSavingNotes(false);
      if (error) { toast.error(error.message); return; }
    } else {
      const { data, error } = await supabase
        .from("guests")
        .insert({ name: guestKey?.name ?? "", email, phone: phone || null, notes: staffNotes || null })
        .select("id,notes")
        .maybeSingle();
      setSavingNotes(false);
      if (error) { toast.error(error.message); return; }
      setGuestRecord(data ?? null);
    }
    toast.success("Notiz gespeichert");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {guestKey && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-3 pr-6">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl">{guestKey.name}</DialogTitle>
                  <DialogDescription>
                    {stats.firstBooking
                      ? <>Erste Buchung: {formatDate(stats.firstBooking)} · {stats.total} {stats.total === 1 ? "Aufenthalt" : "Aufenthalte"}</>
                      : "Noch keine Buchungen"}
                  </DialogDescription>
                </div>
                {isRegular ? (
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Star className="h-3 w-3 mr-1" /> Stammgast
                  </Badge>
                ) : (
                  <Badge>Neugast</Badge>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-5">
              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="shadow-card"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Aufenthalte</div>
                  <div className="text-xl font-semibold">{stats.total}</div>
                </CardContent></Card>
                <Card className="shadow-card"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Gesamtausgaben</div>
                  <div className="text-xl font-semibold">{eur(stats.totalSpent)}</div>
                </CardContent></Card>
                <Card className="shadow-card"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Ø Aufenthalt</div>
                  <div className="text-xl font-semibold">{stats.avgNights} N</div>
                </CardContent></Card>
                <Card className="shadow-card"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Lieblingszimmer</div>
                  <div className="text-sm font-semibold truncate">{stats.favRoom?.name ?? "—"}</div>
                </CardContent></Card>
              </div>

              {/* Personal */}
              <section>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><User className="h-4 w-4 text-secondary" /> Kontakt</h3>
                <div className="rounded-lg border p-3 text-sm space-y-1.5">
                  <div className="font-medium">{guestKey.name}</div>
                  {email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {email}</div>}
                  {phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {phone}</div>}
                  {!email && !phone && <div className="text-muted-foreground italic">Keine Kontaktdaten</div>}
                </div>
              </section>

              {/* Upcoming */}
              {stats.upcoming.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><CalendarPlus className="h-4 w-4 text-secondary" /> Bevorstehende Buchungen</h3>
                  <div className="space-y-2">
                    {stats.upcoming.map((b) => {
                      const room = roomMap[b.room_id];
                      return (
                        <div key={b.id} className="rounded-lg border p-3 text-sm flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{room?.name ?? "Zimmer"}</div>
                            <div className="text-muted-foreground text-xs">{formatDate(b.check_in)} → {formatDate(b.check_out)} · {nights(b.check_in, b.check_out)} N</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-xs text-muted-foreground">{b.booking_number}</div>
                            <div className="font-semibold">{eur(Number(b.total_price))}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* History */}
              <section>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><BedDouble className="h-4 w-4 text-secondary" /> Buchungshistorie</h3>
                {guestBookings.length === 0 ? (
                  <div className="rounded-lg border p-3 text-sm text-muted-foreground italic">Keine Buchungen</div>
                ) : (
                  <div className="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-border">
                    {guestBookings.map((b) => {
                      const room = roomMap[b.room_id];
                      const n = nights(b.check_in, b.check_out);
                      return (
                        <div key={b.id} className="relative">
                          <span className="absolute -left-[14px] top-2 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-background" />
                          <div className="rounded-lg border p-3 text-sm">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <div>
                                <div className="font-medium">{room ? `Zimmer ${room.room_number} · ${room.room_type ?? room.name}` : "Zimmer"}</div>
                                <div className="text-muted-foreground text-xs">
                                  {formatDate(b.check_in)} → {formatDate(b.check_out)} · {n} {n === 1 ? "Nacht" : "Nächte"}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-mono text-[11px] text-muted-foreground">{b.booking_number}</div>
                                <div className="font-semibold">{eur(Number(b.total_price))}</div>
                              </div>
                            </div>
                            {b.notes && (
                              <div className="text-xs text-muted-foreground italic mt-1 pt-1 border-t">„{b.notes}"</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Stats summary */}
              <section>
                <h3 className="text-sm font-semibold mb-2">Übersicht</h3>
                <div className="rounded-lg border p-3 text-sm grid sm:grid-cols-2 gap-y-1.5 gap-x-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Letzter Aufenthalt</span><span>{stats.lastStay ? formatDate(stats.lastStay) : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Nächster Aufenthalt</span><span>{stats.nextStay ? formatDate(stats.nextStay) : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Bevorzugte Extras</span><span className="text-right">{stats.favExtras.length ? stats.favExtras.join(", ") : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Lieblingszimmer</span><span>{stats.favRoom?.name ?? "—"}</span></div>
                </div>
              </section>

              {/* Loyalty */}
              <section>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-secondary" /> Treueprogramm</h3>
                <div className="rounded-lg border p-3 text-sm space-y-2 bg-secondary/5">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Star className="h-3 w-3 mr-1" /> {isRegular ? `Stammgast – ${stats.total} Aufenthalte` : `Neugast – ${stats.total}/3`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Nächster Bonus: 10% Rabatt ab 5. Aufenthalt</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-secondary transition-all" style={{ width: `${Math.min(100, (stats.total / 5) * 100)}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground pt-1">
                    🎁 Geburtstag hinterlegt → Automatischer 20€ Gutschein wird jährlich versendet
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Pencil className="h-4 w-4 text-secondary" /> Interne Notizen</h3>
                <Textarea
                  rows={3}
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="z. B. mag ruhige Zimmer, reist mit Hund, Stammgast Familie…"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" onClick={saveStaffNotes} disabled={savingNotes || staffNotes === (guestRecord?.notes ?? "")}>
                    Notiz speichern
                  </Button>
                </div>
              </section>
            </div>

            <Separator />

            <DialogFooter className="flex-wrap gap-2 sm:gap-2">
              {onCreateBooking && (
                <Button size="sm" variant="outline" onClick={() => onCreateBooking({ name: guestKey.name, email, phone })}>
                  <CalendarPlus className="h-4 w-4" /> Neue Buchung
                </Button>
              )}
              {email && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${email}`}><Mail className="h-4 w-4" /> E-Mail</a>
                </Button>
              )}
              {phone && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${phone}`}><Phone className="h-4 w-4" /> Anrufen</a>
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" /> Schließen
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
