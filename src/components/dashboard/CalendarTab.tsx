import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Mail, Pencil, Ban, X, BedDouble, Users, Phone, CalendarDays, CreditCard, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { eur, toISODate, formatDate, formatDateShort } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import { photoForRoomType } from "@/lib/photos";

type Room = {
  id: string;
  room_number: number;
  name: string;
  room_type?: string;
  price_per_night?: number;
  photos?: string[];
};

type ExtraLine = { id?: string; name: string; price: number; per_night?: boolean };

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
  extras: ExtraLine[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const nightsBetween = (inIso: string, outIso: string) =>
  Math.max(
    1,
    Math.round((new Date(outIso).getTime() - new Date(inIso).getTime()) / 86400000),
  );

export default function CalendarTab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [internOpen, setInternOpen] = useState(false);
  const [internForm, setInternForm] = useState({ room_id: "", guest_name: "", check_in: "", check_out: "", notes: "" });

  const [selected, setSelected] = useState<Booking | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ check_in: "", check_out: "", notes: "" });
  const [staffNotes, setStaffNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const loadAll = async () => {
    const [{ data: r }, { data: b }] = await Promise.all([
      supabase.from("rooms").select("id,room_number,name,room_type,price_per_night,photos").order("room_number"),
      supabase.from("bookings").select("*").order("check_in"),
    ]);
    setRooms((r as any) ?? []);
    setBookings(((b as any) ?? []).map((x: any) => ({ ...x, extras: Array.isArray(x.extras) ? x.extras : [] })));
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    if (!selected) return;
    setEditForm({ check_in: selected.check_in, check_out: selected.check_out, notes: selected.notes ?? "" });
    setStaffNotes(selected.notes ?? "");
    setEditMode(false);
  }, [selected?.id]);

  const { days, monthLabel } = useMemo(() => {
    const now = new Date();
    const ref = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
    const arr: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) arr.push(new Date(ref.getFullYear(), ref.getMonth(), i));
    return { days: arr, monthLabel: ref.toLocaleDateString("de-DE", { month: "long", year: "numeric" }) };
  }, [monthOffset]);

  const cellState = (roomId: string, day: Date): { type: "free" | "online" | "intern"; booking?: Booking } => {
    const iso = toISODate(day);
    const b = bookings.find(
      (x) => x.room_id === roomId && x.payment_status !== "cancelled" && x.check_in <= iso && x.check_out > iso
    );
    if (!b) return { type: "free" };
    return { type: b.booking_type === "intern" ? "intern" : "online", booking: b };
  };

  const submitIntern = async () => {
    if (!internForm.room_id || !internForm.guest_name || !internForm.check_in || !internForm.check_out) {
      toast.error("Bitte alle Felder ausfüllen");
      return;
    }
    if (internForm.check_out <= internForm.check_in) {
      toast.error("Abreise muss nach Anreise liegen");
      return;
    }
    const { error } = await supabase.from("bookings").insert({
      room_id: internForm.room_id,
      guest_name: internForm.guest_name,
      check_in: internForm.check_in,
      check_out: internForm.check_out,
      total_price: 0,
      booking_type: "intern",
      payment_status: "paid",
      notes: internForm.notes,
    });
    if (error) {
      toast.error("Fehler: " + error.message);
      return;
    }
    toast.success("Interne Buchung erstellt");
    setInternOpen(false);
    setInternForm({ room_id: "", guest_name: "", check_in: "", check_out: "", notes: "" });
    loadAll();
  };

  const room = selected ? rooms.find((r) => r.id === selected.room_id) : null;
  const nights = selected ? nightsBetween(selected.check_in, selected.check_out) : 0;
  const roomPrice = room?.price_per_night ? Number(room.price_per_night) : 0;
  const extras = selected?.extras ?? [];
  const extrasTotal = extras.reduce(
    (s, e) => s + (e.per_night ? Number(e.price) * nights : Number(e.price)),
    0,
  );
  const roomSubtotal = Math.max(0, Number(selected?.total_price ?? 0) - extrasTotal);
  const isIntern = selected?.booking_type === "intern";
  const roomPhoto = room?.photos?.[0] || (room?.room_type ? photoForRoomType(room.room_type) : "");

  const saveEdits = async () => {
    if (!selected) return;
    if (!editForm.check_in || !editForm.check_out || editForm.check_out <= editForm.check_in) {
      toast.error("Ungültiger Zeitraum");
      return;
    }
    const { error } = await supabase
      .from("bookings")
      .update({ check_in: editForm.check_in, check_out: editForm.check_out, notes: editForm.notes || null })
      .eq("id", selected.id);
    if (error) { toast.error("Fehler: " + error.message); return; }
    toast.success("Buchung aktualisiert");
    setEditMode(false);
    await loadAll();
    setSelected({ ...selected, check_in: editForm.check_in, check_out: editForm.check_out, notes: editForm.notes || null });
  };

  const saveStaffNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    const { error } = await supabase.from("bookings").update({ notes: staffNotes || null }).eq("id", selected.id);
    setSavingNotes(false);
    if (error) { toast.error("Fehler: " + error.message); return; }
    toast.success("Notiz gespeichert");
    setSelected({ ...selected, notes: staffNotes || null });
    loadAll();
  };

  const cancelBooking = async () => {
    if (!selected) return;
    const { error } = await supabase.from("bookings").update({ payment_status: "cancelled" }).eq("id", selected.id);
    setConfirmCancel(false);
    if (error) { toast.error("Fehler: " + error.message); return; }
    toast.success("Buchung storniert");
    setSelected(null);
    loadAll();
  };

  const resendEmail = () => {
    if (!selected?.guest_email) { toast.error("Keine E-Mail-Adresse hinterlegt"); return; }
    toast.success(`Bestätigungs-E-Mail erneut an ${selected.guest_email} gesendet`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonthOffset((o) => o - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold text-lg capitalize min-w-[180px] text-center">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={() => setMonthOffset((o) => o + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => setMonthOffset(0)}>Heute</Button>
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-free))] border" /> Frei</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-paid))] border" /> Bezahlt</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-intern))] border" /> Intern</span>
          <Button size="sm" onClick={() => setInternOpen(true)}><Plus className="h-4 w-4" /> Intern eintragen</Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                <th className="sticky left-0 bg-muted z-10 text-left font-medium p-2 min-w-[120px] border-b border-r">Zimmer</th>
                {days.map((d) => (
                  <th key={d.toISOString()} className={cn("font-medium p-1 text-center min-w-[36px] border-b", (d.getDay() === 0 || d.getDay() === 6) && "bg-accent/40")}>
                    <div className="text-[10px] text-muted-foreground uppercase">{d.toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2)}</div>
                    <div>{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td className="sticky left-0 bg-card z-10 p-2 font-medium border-b border-r whitespace-nowrap">{r.name}</td>
                  {days.map((d) => {
                    const s = cellState(r.id, d);
                    const cls =
                      s.type === "free" ? "bg-[hsl(var(--cal-free))]" :
                      s.type === "online" ? "bg-[hsl(var(--cal-paid))] hover:brightness-95 cursor-pointer" :
                      "bg-[hsl(var(--cal-intern))] hover:brightness-95 cursor-pointer";
                    return (
                      <td
                        key={d.toISOString()}
                        className={cn("border-b border-r/50 h-9 text-center align-middle transition", cls)}
                        title={s.booking ? `${s.booking.guest_name} (${formatDateShort(s.booking.check_in)}–${formatDateShort(s.booking.check_out)})` : "Frei"}
                        onClick={() => s.booking && setSelected(s.booking)}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* INTERN */}
      <Dialog open={internOpen} onOpenChange={setInternOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Intern eintragen</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Zimmer</Label>
              <Select value={internForm.room_id} onValueChange={(v) => setInternForm({ ...internForm, room_id: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Zimmer wählen" /></SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Name</Label>
              <Input className="mt-1.5" value={internForm.guest_name} onChange={(e) => setInternForm({ ...internForm, guest_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Anreise</Label>
                <Input className="mt-1.5" type="date" value={internForm.check_in} onChange={(e) => setInternForm({ ...internForm, check_in: e.target.value })} />
              </div>
              <div>
                <Label>Abreise</Label>
                <Input className="mt-1.5" type="date" value={internForm.check_out} onChange={(e) => setInternForm({ ...internForm, check_out: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Notiz</Label>
              <Textarea className="mt-1.5" value={internForm.notes} onChange={(e) => setInternForm({ ...internForm, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInternOpen(false)}>Abbrechen</Button>
            <Button onClick={submitIntern}>Eintragen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAIL */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div className="space-y-1">
                    <DialogTitle className="font-mono text-lg">#{selected.booking_number}</DialogTitle>
                    <DialogDescription>
                      Erstellt am {formatDate(selected.created_at)}
                    </DialogDescription>
                  </div>
                  {isIntern ? (
                    <Badge variant="secondary">Intern</Badge>
                  ) : selected.payment_status === "cancelled" ? (
                    <Badge variant="destructive">Storniert</Badge>
                  ) : (
                    <Badge className="bg-success text-success-foreground hover:bg-success/90">Bezahlt</Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-5">
                {/* GUEST */}
                <section>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-secondary" /> Gast</h3>
                  <div className="rounded-lg border p-3 text-sm space-y-1.5">
                    <div className="font-medium">{selected.guest_name}</div>
                    {selected.guest_email && (
                      <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {selected.guest_email}</div>
                    )}
                    {selected.guest_phone && (
                      <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {selected.guest_phone}</div>
                    )}
                    {isIntern && !selected.guest_email && (
                      <div className="text-muted-foreground italic">Intern eingetragen — keine Gastdaten</div>
                    )}
                  </div>
                </section>

                {/* ROOM + DATES */}
                <section>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><BedDouble className="h-4 w-4 text-secondary" /> Buchung</h3>
                  <div className="grid sm:grid-cols-[140px_1fr] gap-3">
                    {roomPhoto && (
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                        <HotelImage src={roomPhoto} alt={room?.name ?? ""} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="rounded-lg border p-3 text-sm space-y-1.5">
                      <div className="font-medium">
                        {room ? `Zimmer ${room.room_number} · ${room.room_type ?? room.name}` : "Zimmer unbekannt"}
                      </div>
                      {editMode ? (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <Label className="text-xs">Anreise</Label>
                            <Input type="date" className="mt-1" value={editForm.check_in} onChange={(e) => setEditForm({ ...editForm, check_in: e.target.value })} />
                          </div>
                          <div>
                            <Label className="text-xs">Abreise</Label>
                            <Input type="date" className="mt-1" value={editForm.check_out} onChange={(e) => setEditForm({ ...editForm, check_out: e.target.value })} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(selected.check_in)} → {formatDate(selected.check_out)}</div>
                          <div className="text-muted-foreground">{nights} {nights === 1 ? "Nacht" : "Nächte"}</div>
                        </>
                      )}
                    </div>
                  </div>
                </section>

                {/* EXTRAS */}
                {extras.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold mb-2">Extras</h3>
                    <div className="rounded-lg border p-3 text-sm space-y-1">
                      {extras.map((e, i) => (
                        <div key={`${e.id ?? e.name}-${i}`} className="flex justify-between">
                          <span>{e.name}{e.per_night ? ` × ${nights}` : ""}</span>
                          <span className="font-medium">{eur(e.per_night ? Number(e.price) * nights : Number(e.price))}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* PRICE */}
                <section>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><CreditCard className="h-4 w-4 text-secondary" /> Preis & Zahlung</h3>
                  <div className="rounded-lg border p-3 text-sm space-y-1.5">
                    {!isIntern && (
                      <>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Zimmer ({nights} × {eur(roomPrice)})</span>
                          <span>{eur(roomSubtotal)}</span>
                        </div>
                        {extras.length > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Extras</span><span>{eur(extrasTotal)}</span>
                          </div>
                        )}
                        <Separator className="my-1" />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Gesamt</span><span>{eur(Number(selected.total_price))}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-1">
                          Zahlungsart: Kreditkarte / SEPA-Lastschrift
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selected.payment_status === "paid"
                            ? `Bezahlt am ${formatDate(selected.updated_at)}`
                            : selected.payment_status === "cancelled"
                            ? "Storniert"
                            : "Zahlung ausstehend"}
                        </div>
                      </>
                    )}
                    {isIntern && (
                      <div className="text-muted-foreground italic">Intern — keine Zahlung</div>
                    )}
                  </div>
                </section>

                {/* NOTES */}
                <section>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><StickyNote className="h-4 w-4 text-secondary" /> Notizen</h3>
                  <Textarea
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    placeholder="Sonderwünsche oder interne Notizen…"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" variant="outline" onClick={saveStaffNotes} disabled={savingNotes || staffNotes === (selected.notes ?? "")}>
                      Notiz speichern
                    </Button>
                  </div>
                </section>
              </div>

              <DialogFooter className="flex-wrap gap-2 sm:gap-2">
                {editMode ? (
                  <>
                    <Button variant="ghost" onClick={() => setEditMode(false)}>Abbrechen</Button>
                    <Button onClick={saveEdits}>Änderungen speichern</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                      <Pencil className="h-4 w-4" /> Bearbeiten
                    </Button>
                    {!isIntern && (
                      <Button variant="outline" size="sm" onClick={resendEmail}>
                        <Mail className="h-4 w-4" /> E-Mail erneut senden
                      </Button>
                    )}
                    {selected.payment_status !== "cancelled" && (
                      <Button variant="destructive" size="sm" onClick={() => setConfirmCancel(true)}>
                        <Ban className="h-4 w-4" /> Stornieren
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                      <X className="h-4 w-4" /> Schließen
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buchung wirklich stornieren?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Buchung wird als storniert markiert und im Kalender freigegeben.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={cancelBooking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Stornieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
