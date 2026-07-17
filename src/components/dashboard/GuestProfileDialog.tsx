import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail, Phone, CalendarPlus, X, BedDouble, Star, Crown,
  Cake, UtensilsCrossed, Heart, Save, ChevronDown,
} from "lucide-react";
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
  extras: unknown;
  created_at: string;
};

type Room = { id: string; room_number?: number; name: string; room_type?: string | null };

interface GuestRecord {
  id?: string;
  notes?: string | null;
  birthday?: string | null;
  diet?: string | null;
}

const nights = (a: string, b: string) =>
  Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

// Tier-Definition wie im GuestsTab
function computeTier(count: number): "vip" | "stammgast" | "wiederkommer" | "neugast" {
  if (count >= 8) return "vip";
  if (count >= 3) return "stammgast";
  if (count === 2) return "wiederkommer";
  return "neugast";
}

const TIER_LABEL: Record<string, string> = {
  vip: "VIP-Stammgast",
  stammgast: "Stammgast",
  wiederkommer: "Wiederkommer",
  neugast: "Neugast",
};

function birthdayInfo(birthday: string | null | undefined): { label: string; nextInDays: number | null } {
  if (!birthday) return { label: "—", nextInDays: null };
  const b = new Date(birthday);
  const today = new Date();
  const age = today.getFullYear() - b.getFullYear() -
    (today < new Date(today.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
  const thisYearBd = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  const nextBd = thisYearBd < today
    ? new Date(today.getFullYear() + 1, b.getMonth(), b.getDate())
    : thisYearBd;
  const days = Math.round((nextBd.getTime() - today.getTime()) / 86400000);
  const label = `${b.toLocaleDateString("de-DE")} · ${age} J.`;
  return { label, nextInDays: days };
}

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guestRecord, setGuestRecord] = useState<GuestRecord | null>(null);
  const [notes, setNotes] = useState("");
  const [birthday, setBirthday] = useState("");
  const [diet, setDiet] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !guestKey) return;
    // Guard gegen Stale-Write-Race: bei schnellem Gastwechsel darf ein langsam
    // ankommender Fetch des vorigen Gasts nicht die Anzeige des aktuellen mit
    // FALSCHEN persoenlichen Daten (notes/birthday/diet) ueberschreiben.
    let active = true;
    (async () => {
      const filterCol = guestKey.email ? "guest_email" : "guest_name";
      const filterVal = guestKey.email ?? guestKey.name;
      const [{ data: b }, { data: r }] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq(filterCol, filterVal)
          .order("check_in", { ascending: false })
          .limit(500),
        supabase.from("rooms").select("id, name, room_number, room_type"),
      ]);
      if (!active) return;
      setBookings((b as Booking[] | null) ?? []);
      setRooms((r as Room[] | null) ?? []);

      if (guestKey.email) {
        const { data: g } = await (supabase as any)
          .from("guests")
          .select("id, notes, birthday, diet")
          .eq("email", guestKey.email)
          .maybeSingle();
        if (!active) return;
        setGuestRecord(g ?? null);
        setNotes(g?.notes ?? "");
        setBirthday(g?.birthday ?? "");
        setDiet(g?.diet ?? "");
      } else {
        setGuestRecord(null);
        setNotes("");
        setBirthday("");
        setDiet("");
      }
    })();
    return () => { active = false; };
  }, [open, guestKey?.name, guestKey?.email]);

  const roomMap = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), [rooms]);

  const stats = useMemo(() => {
    const valid = bookings.filter((b) => b.booking_type !== "intern" && b.payment_status !== "cancelled");
    const total = valid.length;
    const totalSpent = valid.reduce((s, b) => s + Number(b.total_price || 0), 0);
    const totalNights = valid.reduce((s, b) => s + nights(b.check_in, b.check_out), 0);
    const avgNights = total ? Math.round((totalNights / total) * 10) / 10 : 0;
    const today = new Date().toISOString().slice(0, 10);
    const past = valid.filter((b) => b.check_out <= today);
    const upcoming = valid.filter((b) => b.check_in >= today).sort((a, b) => a.check_in.localeCompare(b.check_in));
    // bookings ist nach check_in DESC sortiert → past[0] ist NICHT der letzte
    // Aufenthalt. Spaetesten check_out nehmen (ISO-Strings sortieren chronolog.).
    const lastStay = past.length
      ? past.map((b) => b.check_out).sort((a, b) => a.localeCompare(b)).at(-1)
      : undefined;
    const nextStay = upcoming[0]?.check_in;
    const firstBooking = [...valid].sort((a, b) => a.created_at.localeCompare(b.created_at))[0]?.created_at;

    const roomCount = new Map<string, number>();
    valid.forEach((b) => roomCount.set(b.room_id, (roomCount.get(b.room_id) ?? 0) + 1));
    const favRoomId = [...roomCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const favRoom = favRoomId ? roomMap[favRoomId] : undefined;

    const extraCount = new Map<string, number>();
    valid.forEach((b) => {
      const arr = Array.isArray(b.extras) ? (b.extras as Array<{ name?: string }>) : [];
      arr.forEach((e) => {
        if (e.name) extraCount.set(e.name, (extraCount.get(e.name) ?? 0) + 1);
      });
    });
    const favExtras = [...extraCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n);

    return { total, totalSpent, avgNights, lastStay, nextStay, firstBooking, favRoom, favExtras, upcoming, allValid: valid };
  }, [bookings, roomMap]);

  const tier = computeTier(stats.total);
  const guestInfo = bookings[0];
  const phone = guestInfo?.guest_phone ?? "";
  const email = guestInfo?.guest_email ?? guestKey?.email ?? "";
  const bd = birthdayInfo(birthday || guestRecord?.birthday);
  const isDirty =
    notes !== (guestRecord?.notes ?? "") ||
    birthday !== (guestRecord?.birthday ?? "") ||
    diet !== (guestRecord?.diet ?? "");

  const save = async () => {
    if (!email) {
      toast.error("Keine E-Mail — kann nicht gespeichert werden");
      return;
    }
    setSaving(true);
    const payload = {
      notes: notes || null,
      birthday: birthday || null,
      diet: diet || null,
    };
    if (guestRecord?.id) {
      const { error } = await (supabase as any).from("guests").update(payload).eq("id", guestRecord.id);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      setGuestRecord({ ...guestRecord, ...payload });
    } else {
      // guests.email hat KEINE UNIQUE-Constraint (s. Migration) → blinder Insert
      // erzeugt Duplikate, wenn der Gast nur ueber den Namen geladen wurde.
      // Erst per email nachsehen, sonst updaten. Echte Loesung: UNIQUE(tenant_id,
      // email) als Schema-Constraint (Alisa) — dann upsert onConflict moeglich.
      const { data: existing } = await (supabase as any)
        .from("guests")
        .select("id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();
      if (existing?.id) {
        const { error } = await (supabase as any).from("guests").update(payload).eq("id", existing.id);
        setSaving(false);
        if (error) { toast.error(error.message); return; }
        setGuestRecord({ id: existing.id, ...payload });
      } else {
        const { data, error } = await (supabase as any)
          .from("guests")
          .insert({ name: guestKey?.name ?? "", email, phone: phone || null, ...payload })
          .select("id, notes, birthday, diet")
          .maybeSingle();
        setSaving(false);
        if (error) { toast.error(error.message); return; }
        setGuestRecord(data ?? null);
      }
    }
    toast.success("Gespeichert");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {guestKey && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-3 pr-6">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {tier === "vip" && <Crown className="h-5 w-5 text-amber-500" />}
                    {tier === "stammgast" && <Star className="h-5 w-5 text-secondary" />}
                    {guestKey.name}
                  </DialogTitle>
                  <DialogDescription>
                    {TIER_LABEL[tier]} ·{" "}
                    {stats.firstBooking
                      ? <>seit {new Date(stats.firstBooking).toLocaleDateString("de-DE", { month: "short", year: "numeric" })} · {stats.total} Aufenthalte</>
                      : "Noch keine Buchungen"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Quick-Stats — kompakte Zeile, immer sichtbar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              <Stat label="Gesamt-Umsatz" value={eur(stats.totalSpent)} />
              <Stat label="Ø Aufenthalt"  value={`${stats.avgNights} N`} />
              <Stat label="Letzter Besuch" value={stats.lastStay ? formatDate(stats.lastStay) : "—"} />
              <Stat label="Lieblingszimmer" value={stats.favRoom?.name ?? "—"} />
            </div>

            {/* Kontakt + Geburtstag — immer sichtbar */}
            <section className="rounded-lg border p-3 text-sm space-y-1.5 bg-muted/30">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="font-medium text-foreground/90 flex items-center gap-2">
                  <span>Kontakt &amp; persönlich</span>
                </div>
                {bd.nextInDays !== null && bd.nextInDays <= 30 && bd.nextInDays >= 0 && (
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
                    <Cake className="h-3 w-3" /> in {bd.nextInDays} Tagen
                  </Badge>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cake className="h-3.5 w-3.5 shrink-0" />
                  <span>{bd.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UtensilsCrossed className="h-3.5 w-3.5 shrink-0" />
                  <span>{diet || guestRecord?.diet || "—"}</span>
                </div>
              </div>
            </section>

            {/* Bevorstehende Buchungen — Highlight wenn vorhanden */}
            {stats.upcoming.length > 0 && (
              <section className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4 text-emerald-500" /> Bevorstehend
                  </h3>
                  <span className="text-xs text-muted-foreground">{stats.upcoming.length} Buchung{stats.upcoming.length === 1 ? "" : "en"}</span>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {stats.upcoming.slice(0, 3).map((b) => {
                    const room = roomMap[b.room_id];
                    return (
                      <li key={b.id} className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate">
                          {formatDate(b.check_in)} → {formatDate(b.check_out)} · {room?.name ?? "Zimmer"}
                        </span>
                        <span className="font-mono text-muted-foreground">{b.booking_number}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Vorlieben & Notizen — Editierbar, prominent */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-secondary" /> Vorlieben &amp; interne Hinweise
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="g-birthday" className="text-xs">Geburtstag</Label>
                  <Input
                    id="g-birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="g-diet" className="text-xs">Diät / Allergien</Label>
                  <Input
                    id="g-diet"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    placeholder="z. B. Vegetarisch, Nuss-Allergie"
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="g-notes" className="text-xs">Notizen (Vorlieben, Verhalten, persönliche Hinweise)</Label>
                <Textarea
                  id="g-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="z. B. mag ruhige Zimmer, reist mit Hund Bruno, kommt jährlich im Mai…"
                />
              </div>
              {stats.favExtras.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Bevorzugte Extras:</span> {stats.favExtras.join(", ")}
                </div>
              )}
              <div className="flex justify-end">
                <Button size="sm" onClick={save} disabled={saving || !isDirty} className="gap-2">
                  <Save className="h-3.5 w-3.5" /> {saving ? "Speichere …" : "Speichern"}
                </Button>
              </div>
            </section>

            {/* Buchungshistorie — AUFKLAPPBAR */}
            <details className="group rounded-lg border">
              <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-secondary" />
                  Buchungshistorie ({stats.allValid.length})
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t p-3">
                {stats.allValid.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Keine Buchungen</p>
                ) : (
                  <div className="relative pl-5 space-y-2.5 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-border">
                    {stats.allValid.map((b) => {
                      const room = roomMap[b.room_id];
                      const n = nights(b.check_in, b.check_out);
                      return (
                        <div key={b.id} className="relative">
                          <span className="absolute -left-[14px] top-2 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-background" />
                          <div className="text-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium">{room ? `${room.name} · ${room.room_type ?? ""}` : "Zimmer"}</div>
                                <div className="text-muted-foreground text-xs">
                                  {formatDate(b.check_in)} → {formatDate(b.check_out)} · {n} {n === 1 ? "Nacht" : "Nächte"}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-mono text-[11px] text-muted-foreground">{b.booking_number}</div>
                                <div className="font-semibold text-sm">{eur(Number(b.total_price))}</div>
                              </div>
                            </div>
                            {b.notes && (
                              <div className="text-xs text-muted-foreground italic mt-0.5">„{b.notes}"</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </details>

            {/* Treueprogramm — AUFKLAPPBAR */}
            <details className="group rounded-lg border">
              <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium flex items-center justify-between hover:bg-muted/50 transition-colors">
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-secondary" /> Treueprogramm
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t p-3 space-y-2 bg-secondary/5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge className="bg-secondary text-secondary-foreground">
                    <Star className="h-3 w-3 mr-1" /> {TIER_LABEL[tier]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {tier === "vip" ? "Bonus aktiv: 15 % Rabatt + Sekt aufs Zimmer" :
                     tier === "stammgast" ? "Bonus aktiv: 10 % Rabatt ab 5. Aufenthalt" :
                     `Nächster Bonus: 10 % Rabatt ab 3. Aufenthalt (${stats.total}/3)`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-secondary transition-all" style={{ width: `${Math.min(100, (stats.total / 8) * 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  🎁 Geburtstags-Gutschein wird automatisch versendet, sobald das Datum hinterlegt ist.
                </p>
              </div>
            </details>

            <DialogFooter className="flex-wrap gap-2 sm:gap-2 pt-2">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-2.5 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums mt-0.5 truncate">{value}</div>
    </div>
  );
}
