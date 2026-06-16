// Geführte Rezeptions-Buchung (Eugen 16.06.): Karin gibt ZUERST Datum, Personen
// und Zimmertyp an → das System zeigt nur die für diesen Zeitraum FREIEN Zimmer →
// nach der Zimmerauswahl trägt sie die Gastdaten ein → buchen (sofort bestätigt).
// Die Auswahl-Optionen spiegeln genau das, was auch der Gast auf /booking sieht
// (Typ, Personen, Einzelbelegungs-Preis, Extras) — nur dass Karin das konkrete
// freie Zimmer wählt statt der Auto-Zuteilung.
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HotelImage } from "@/components/HotelImage";
import { supabase } from "@/integrations/supabase/client";
import { eur, toISODate } from "@/lib/format";
import { notifyBooking } from "@/lib/notify-booking";
import { toast } from "sonner";
import { BedDouble, CalendarDays, Users, Tag, ArrowLeft, ArrowRight, Loader2, Mail, Phone, Check, CheckCircle2 } from "lucide-react";

type Room = {
  id: string; name: string; room_type: string; bed_description?: string;
  max_persons: number; price_per_night: number; price_per_person?: boolean;
  single_use_price?: number | null; status: string; amenities?: any; photos?: any; room_number?: number;
};
type Booking = { room_id: string; check_in: string; check_out: string };
type Extra = { id: string; name: string; price: number; per_night: boolean };

const toArr = (v: unknown): any[] =>
  Array.isArray(v) ? v : (v && typeof v === "object" ? Object.values(v as object) : []);

const addDaysIso = (iso: string, days: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, (m || 1) - 1, (d || 1) + days));
};

const nightsBetween = (ci: string, co: string) =>
  Math.max(1, Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86_400_000));

// Zimmerpreis für genau diese Auswahl — identisch zur Gast-/Server-Logik:
//   1 Person + Einzelbelegungspreis -> single_use_price (pauschal)
//   sonst pro Person  -> price_per_night × Personen
//   sonst pro Zimmer  -> price_per_night
const rateFor = (room: Room, persons: number) =>
  persons <= 1 && room.single_use_price != null
    ? Number(room.single_use_price)
    : room.price_per_person
      ? Number(room.price_per_night) * persons
      : Number(room.price_per_night);

export default function ReceptionBookingWizard({
  open, onOpenChange, rooms, bookings, extras, onBooked,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  rooms: Room[];
  bookings: Booking[];
  extras: Extra[];
  onBooked: () => void;
}) {
  const today = toISODate(new Date());
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDaysIso(today, 1));
  const [persons, setPersons] = useState(2);
  const [typeFilter, setTypeFilter] = useState("alle");
  const [selected, setSelected] = useState<Room | null>(null);
  const [form, setForm] = useState({ guest_name: "", guest_phone: "", guest_email: "", notes: "", extras: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [doneNumber, setDoneNumber] = useState<string | null>(null);

  // Zimmertypen aus dem echten Bestand ableiten (kein Hardcoding).
  const types = useMemo(
    () => Array.from(new Set(rooms.filter((r) => r.status === "aktiv").map((r) => r.room_type))),
    [rooms],
  );

  // Freie Zimmer für die Auswahl: aktiv, Typ passt, fasst die Personenzahl,
  // keine überlappende Buchung im Zeitraum [checkIn, checkOut).
  const freeRooms = useMemo(() => {
    return rooms
      .filter((r) => r.status === "aktiv")
      .filter((r) => typeFilter === "alle" || r.room_type === typeFilter)
      .filter((r) => (r.max_persons || 1) >= persons)
      .filter((r) => !bookings.some((b) => b.room_id === r.id && b.check_in < checkOut && b.check_out > checkIn))
      .sort((a, b) => (a.room_number ?? 0) - (b.room_number ?? 0));
  }, [rooms, bookings, typeFilter, persons, checkIn, checkOut]);

  const reset = () => {
    setStep(1); setCheckIn(today); setCheckOut(addDaysIso(today, 1)); setPersons(2);
    setTypeFilter("alle"); setSelected(null);
    setForm({ guest_name: "", guest_phone: "", guest_email: "", notes: "", extras: [] });
    setDoneNumber(null);
  };
  const close = (o: boolean) => { if (!o) reset(); onOpenChange(o); };

  const goSelect = () => {
    if (checkOut <= checkIn) { toast.error("Abreise muss nach Anreise liegen"); return; }
    setStep(2);
  };

  const pickRoom = (r: Room) => {
    setSelected(r);
    setForm((f) => ({ ...f, extras: [] }));
    setStep(3);
  };

  const nights = nightsBetween(checkIn, checkOut);
  const rate = selected ? rateFor(selected, persons) : 0;
  const extrasTotal = form.extras.reduce((sum, id) => {
    const e = extras.find((x) => x.id === id);
    return e ? sum + (e.per_night ? Number(e.price) * nights : Number(e.price)) : sum;
  }, 0);
  const grand = rate * nights + extrasTotal;

  const toggleExtra = (id: string) =>
    setForm((f) => ({ ...f, extras: f.extras.includes(id) ? f.extras.filter((x) => x !== id) : [...f.extras, id] }));

  const submit = async () => {
    if (!selected) return;
    if (!form.guest_name.trim()) { toast.error("Bitte Gastname eingeben"); return; }
    setSaving(true);
    const { data, error } = await supabase.rpc("create_internal_booking", {
      p_room_id: selected.id,
      p_guest_name: form.guest_name.trim(),
      p_guest_phone: form.guest_phone.trim() || null,
      p_guest_email: form.guest_email.trim() || null,
      p_check_in: checkIn,
      p_check_out: checkOut,
      p_persons: persons,
      p_extras: form.extras,
      p_notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (error) { toast.error("Buchung fehlgeschlagen: " + error.message); return; }
    const bookingId = (data as any)?.booking_id;
    const bookingNumber = (data as any)?.booking_number ?? "—";
    if (bookingId && form.guest_email.trim()) notifyBooking(bookingId, "confirmation");
    setDoneNumber(bookingNumber);
    setStep(4);
    window.dispatchEvent(new Event("schend:requests-changed"));
    onBooked();
  };

  const stepLabel = ["Zeitraum & Zimmer", "Freies Zimmer wählen", "Gastdaten", "Bestätigt"][step - 1];

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-secondary" /> Neue Buchung
          </DialogTitle>
        </DialogHeader>

        {/* Fortschritt */}
        {step < 4 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {[1, 2, 3].map((s) => (
              <span key={s} className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full grid place-items-center text-[11px] font-medium ${step >= s ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</span>
                {s < 3 && <span className="h-px w-5 bg-border" />}
              </span>
            ))}
            <span className="ml-2 font-medium text-foreground">{stepLabel}</span>
          </div>
        )}

        {/* Schritt 1 — Datum, Personen, Typ */}
        {step === 1 && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Anreise</Label>
                <Input type="date" className="mt-1.5" value={checkIn}
                  onChange={(e) => { const v = e.target.value || checkIn; setCheckIn(v); if (checkOut <= v) setCheckOut(addDaysIso(v, 1)); }} />
              </div>
              <div>
                <Label className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Abreise</Label>
                <Input type="date" className="mt-1.5" value={checkOut} min={addDaysIso(checkIn, 1)}
                  onChange={(e) => setCheckOut(e.target.value || checkOut)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Personen</Label>
                <Select value={String(persons)} onValueChange={(v) => setPersons(Number(v))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Person" : "Personen"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Zimmertyp</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle Typen</SelectItem>
                    {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {nights} {nights === 1 ? "Nacht" : "Nächte"} · das System zeigt im nächsten Schritt nur die freien Zimmer für genau diese Auswahl.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => close(false)}>Abbrechen</Button>
              <Button onClick={goSelect}>Freie Zimmer anzeigen <ArrowRight className="h-4 w-4" /></Button>
            </DialogFooter>
          </div>
        )}

        {/* Schritt 2 — freie Zimmer */}
        {step === 2 && (
          <div className="space-y-3 text-sm">
            <p className="text-xs text-muted-foreground">
              {persons} {persons === 1 ? "Person" : "Personen"} · {typeFilter === "alle" ? "alle Typen" : typeFilter} · {nights} {nights === 1 ? "Nacht" : "Nächte"}
            </p>
            {freeRooms.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
                Keine freien Zimmer für diese Auswahl. Bitte Zeitraum, Personen oder Typ anpassen.
              </div>
            ) : (
              <div className="space-y-2">
                {freeRooms.map((r) => {
                  const roomRate = rateFor(r, persons);
                  return (
                    <button key={r.id} type="button" onClick={() => pickRoom(r)}
                      className="w-full flex items-center gap-3 rounded-lg border p-2.5 text-left hover:border-secondary hover:bg-accent/40 transition">
                      <div className="h-14 w-20 shrink-0 rounded-md bg-accent overflow-hidden grid place-items-center">
                        {toArr(r.photos)[0]
                          ? <HotelImage src={toArr(r.photos)[0]} alt={r.name} className="w-full h-full object-cover" />
                          : <BedDouble className="h-5 w-5 text-secondary/40" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{r.name}</span>
                          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white shrink-0">Frei</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{r.room_type}{r.bed_description ? ` · ${r.bed_description}` : ""}</div>
                        <div className="text-xs text-muted-foreground truncate">max. {r.max_persons} Pers. · {toArr(r.amenities).slice(0, 3).join(", ")}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold">{eur(roomRate * nights)}</div>
                        <div className="text-[11px] text-muted-foreground">{nights} {nights === 1 ? "Nacht" : "Nächte"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Zurück</Button>
            </DialogFooter>
          </div>
        )}

        {/* Schritt 3 — Gastdaten */}
        {step === 3 && selected && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-lg border bg-accent/30 p-2.5">
              <div className="h-12 w-16 shrink-0 rounded-md bg-accent overflow-hidden grid place-items-center">
                {toArr(selected.photos)[0]
                  ? <HotelImage src={toArr(selected.photos)[0]} alt={selected.name} className="w-full h-full object-cover" />
                  : <BedDouble className="h-5 w-5 text-secondary/40" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{selected.name} · {selected.room_type}</div>
                <div className="text-xs text-muted-foreground">{checkIn} → {checkOut} · {persons} P. · {nights} {nights === 1 ? "Nacht" : "Nächte"}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Ändern</Button>
            </div>

            <div>
              <Label>Gastname</Label>
              <Input className="mt-1.5" value={form.guest_name} placeholder="Vor- und Nachname"
                onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Telefon</Label>
                <Input className="mt-1.5" value={form.guest_phone} placeholder="+49 …"
                  onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> E-Mail</Label>
                <Input type="email" className="mt-1.5" value={form.guest_email} placeholder="gast@…"
                  onChange={(e) => setForm({ ...form, guest_email: e.target.value })} />
              </div>
            </div>

            {extras.length > 0 && (
              <div>
                <Label>Zusatz-Optionen (optional)</Label>
                <div className="mt-1.5 space-y-1.5">
                  {extras.map((e) => (
                    <label key={e.id} className="flex items-center justify-between gap-2 rounded-md border p-2 cursor-pointer hover:bg-accent/50">
                      <span className="flex items-center gap-2">
                        <Checkbox checked={form.extras.includes(e.id)} onCheckedChange={() => toggleExtra(e.id)} />
                        {e.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{eur(Number(e.price))}{e.per_night ? "/N" : ""}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Sonderwünsche (optional)</Label>
              <Textarea className="mt-1.5" rows={2} value={form.notes} placeholder="z. B. ruhiges Zimmer, späte Anreise …"
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div className="rounded-md bg-accent p-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Zimmer · {nights} {nights === 1 ? "Nacht" : "Nächte"} · {persons} P.</span>
                <span>{eur(rate * nights)}</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground"><span>Extras</span><span>{eur(extrasTotal)}</span></div>
              )}
              <div className="flex justify-between font-semibold border-t pt-1"><span>Gesamt</span><span>{eur(grand)}</span></div>
            </div>

            {form.guest_email.trim() && (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> Der Gast erhält automatisch eine Bestätigungs-Mail.
              </p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Zurück</Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Buchung anlegen
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Schritt 4 — bestätigt */}
        {step === 4 && (
          <div className="text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="font-display text-2xl mb-1">Buchung bestätigt</h3>
            <p className="text-sm text-muted-foreground">
              {selected?.name} · {checkIn} → {checkOut}<br />
              Buchungsnr. <span className="font-medium text-foreground">{doneNumber}</span>
              {form.guest_email.trim() ? " — Bestätigungs-Mail an den Gast gesendet." : ""}
            </p>
            <DialogFooter className="mt-6 sm:justify-center">
              <Button variant="outline" onClick={() => reset()}>Weitere Buchung</Button>
              <Button onClick={() => close(false)}>Fertig</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
