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
import { ChevronLeft, ChevronRight, Plus, Mail, Pencil, Ban, X, BedDouble, Users, Phone, CalendarDays, CreditCard, StickyNote, FileText } from "lucide-react";
import InvoiceDialog from "./InvoiceDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { eur, toISODate, formatDate, formatDateShort } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import { photoForRoomType } from "@/lib/photos";
import { getHoliday } from "@/lib/holidays";

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

// "YYYY-MM-DD" als LOKALES Datum parsen (sonst UTC-Mitternacht → vermischt sich mit
// lokal gebauten Monatsgrenzen und verschiebt Nächte/Umsatzanteil um den TZ-Offset).
const parseLocalDate = (iso: string): Date => {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(y, (mo || 1) - 1, d || 1);
};

const nightsBetween = (inIso: string, outIso: string) =>
  Math.max(
    1,
    Math.round((parseLocalDate(outIso).getTime() - parseLocalDate(inIso).getTime()) / 86400000),
  );

type ViewMode = "day" | "week" | "month" | "year";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const startOfWeek = (d: Date) => {
  const x = startOfDay(d);
  const dow = (x.getDay() + 6) % 7;
  return addDays(x, -dow);
};
const isoWeek = (d: Date) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dow = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dow + 3);
  const firstThu = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const diff = (t.getTime() - firstThu.getTime()) / 86400000;
  return 1 + Math.round((diff - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
};

const initialQuick = {
  room_id: "",
  guest_name: "",
  guest_email: "",
  guest_phone: "",
  check_in: "",
  check_out: "",
  notes: "",
  type: "online" as "online" | "intern",
};

export default function CalendarTab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<ViewMode>("month");
  const [anchor, setAnchor] = useState<Date>(startOfDay(new Date()));
  const [internOpen, setInternOpen] = useState(false);
  const [internForm, setInternForm] = useState({ room_id: "", guest_name: "", check_in: "", check_out: "", notes: "" });

  // Quick-booking
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickForm, setQuickForm] = useState(initialQuick);
  const [quickSaving, setQuickSaving] = useState(false);

  // Drag selection
  const [dragStart, setDragStart] = useState<{ roomId: string; date: Date } | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);

  const [selected, setSelected] = useState<Booking | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ check_in: "", check_out: "", notes: "" });
  const [staffNotes, setStaffNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const loadAll = async () => {
    // Supabase / Postgrest hat einen Server-seitigen Max-Rows-Default von 1000
    // pro Anfrage. Wir holen die Buchungen in Seiten zu je 1000 bis nichts mehr
    // kommt — damit funktionieren auch Mehrjahres-Vergleiche mit > 4000 Rows.
    const fetchAllBookings = async (): Promise<Booking[]> => {
      const all: Booking[] = [];
      const pageSize = 1000;
      for (let page = 0; page < 50; page++) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("check_in")
          .range(from, to);
        // Jeder Page-Fehler MUSS werfen — nicht nur Seite 0. Früher gab ein
        // Fehler auf Seite >0 still die Teilliste zurück → der Kalender sah
        // vollständig aus, fehlende Buchungen erschienen als freie Nächte →
        // Doppelbuchungs-Risiko. Lieber laut scheitern (Toast) als still lügen.
        if (error) throw error;
        if (!data || data.length === 0) break;
        all.push(...(data as unknown as Booking[]));
        if (data.length < pageSize) break;
      }
      return all;
    };

    const [{ data: r, error: rErr }, b] = await Promise.all([
      supabase.from("rooms").select("id,room_number,name,room_type,price_per_night,photos").order("room_number"),
      fetchAllBookings().catch(() => null),
    ]);
    const bErr = b === null ? new Error("Konnte Buchungen nicht laden") : null;
    if (rErr || bErr) {
      toast.error("Kalender konnte nicht geladen werden");
      return;
    }
    setRooms((r as Room[] | null) ?? []);
    setBookings(
      ((b ?? []) as unknown as Booking[]).map((x) => ({
        ...x,
        extras: Array.isArray(x.extras) ? (x.extras as ExtraLine[]) : [],
      })),
    );
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await loadAll();
      if (!active) return;
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) return;
    setEditForm({ check_in: selected.check_in, check_out: selected.check_out, notes: selected.notes ?? "" });
    setStaffNotes(selected.notes ?? "");
    setEditMode(false);
  }, [selected?.id]);

  const { days, headerLabel } = useMemo(() => {
    if (view === "day") {
      return {
        days: [anchor],
        headerLabel: anchor.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }),
      };
    }
    if (view === "week") {
      const start = startOfWeek(anchor);
      const arr = Array.from({ length: 7 }, (_, i) => addDays(start, i));
      const end = arr[6];
      return {
        days: arr,
        headerLabel: `KW ${isoWeek(start)}: ${formatDateShort(start)} – ${formatDate(end)}`,
      };
    }
    // month
    const ref = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
    const arr: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) arr.push(new Date(ref.getFullYear(), ref.getMonth(), i));
    return { days: arr, headerLabel: ref.toLocaleDateString("de-DE", { month: "long", year: "numeric" }) };
  }, [view, anchor]);

  const goPrev = () => {
    if (view === "day") setAnchor((d) => addDays(d, -1));
    else if (view === "week") setAnchor((d) => addDays(d, -7));
    else if (view === "month") setAnchor((d) => addMonths(d, -1));
    else setAnchor((d) => new Date(d.getFullYear() - 1, 0, 1));
  };
  const goNext = () => {
    if (view === "day") setAnchor((d) => addDays(d, 1));
    else if (view === "week") setAnchor((d) => addDays(d, 7));
    else if (view === "month") setAnchor((d) => addMonths(d, 1));
    else setAnchor((d) => new Date(d.getFullYear() + 1, 0, 1));
  };
  const goToday = () => setAnchor(startOfDay(new Date()));

  const cellState = (roomId: string, day: Date): { type: "free" | "pending" | "paid" | "intern"; booking?: Booking } => {
    const iso = toISODate(day);
    const b = bookings.find(
      (x) => x.room_id === roomId && x.payment_status !== "cancelled" && x.check_in <= iso && x.check_out > iso
    );
    if (!b) return { type: "free" };
    if (b.booking_type === "intern") return { type: "intern", booking: b };
    return { type: b.payment_status === "paid" ? "paid" : "pending", booking: b };
  };

  const todayIso = toISODate(new Date());

  // Conflict check: returns the conflicting booking or null.
  // Two bookings conflict if their [check_in, check_out) ranges overlap on the same room.
  const findConflict = (
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeBookingId?: string,
  ): Booking | null => {
    return (
      bookings.find(
        (b) =>
          b.room_id === roomId &&
          b.payment_status !== "cancelled" &&
          b.id !== excludeBookingId &&
          b.check_in < checkOut &&
          b.check_out > checkIn,
      ) ?? null
    );
  };

  const conflictMessage = (c: Booking) =>
    `Konflikt: Zimmer ist vom ${formatDateShort(c.check_in)} bis ${formatDateShort(c.check_out)} bereits durch „${c.guest_name}" belegt (#${c.booking_number}).`;

  const submitIntern = async () => {
    if (!internForm.room_id || !internForm.guest_name || !internForm.check_in || !internForm.check_out) {
      toast.error("Bitte alle Felder ausfüllen");
      return;
    }
    if (internForm.check_out <= internForm.check_in) {
      toast.error("Abreise muss nach Anreise liegen");
      return;
    }
    const conflict = findConflict(internForm.room_id, internForm.check_in, internForm.check_out);
    if (conflict) {
      toast.error(conflictMessage(conflict));
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

  // Quick booking helpers
  const openQuickFor = (roomId: string, from: Date, to?: Date) => {
    const checkIn = toISODate(from);
    const checkOut = toISODate(to ? addDays(to, 1) : addDays(from, 1));
    setQuickForm({ ...initialQuick, room_id: roomId, check_in: checkIn, check_out: checkOut, type: "online" });
    setQuickOpen(true);
  };

  const submitQuick = async (asType?: "online" | "intern") => {
    const type = asType ?? quickForm.type;
    if (!quickForm.room_id || !quickForm.guest_name || !quickForm.check_in || !quickForm.check_out) {
      toast.error("Bitte Zimmer, Name und Daten ausfüllen");
      return;
    }
    if (quickForm.check_out <= quickForm.check_in) {
      toast.error("Abreise muss nach Anreise liegen");
      return;
    }
    const conflict = findConflict(quickForm.room_id, quickForm.check_in, quickForm.check_out);
    if (conflict) {
      toast.error(conflictMessage(conflict));
      return;
    }
    const r = rooms.find((x) => x.id === quickForm.room_id);
    const n = nightsBetween(quickForm.check_in, quickForm.check_out);
    const total = type === "intern" ? 0 : Number(r?.price_per_night ?? 0) * n;

    setQuickSaving(true);
    const { error } = await supabase.from("bookings").insert({
      room_id: quickForm.room_id,
      guest_name: quickForm.guest_name,
      guest_email: quickForm.guest_email || null,
      guest_phone: quickForm.guest_phone || null,
      check_in: quickForm.check_in,
      check_out: quickForm.check_out,
      total_price: total,
      booking_type: type,
      payment_status: "paid",
      notes: quickForm.notes || null,
    });
    setQuickSaving(false);
    if (error) { toast.error("Fehler: " + error.message); return; }
    toast.success(type === "intern" ? "Interne Buchung erstellt" : "Buchung erstellt");
    setQuickOpen(false);
    setQuickForm(initialQuick);
    loadAll();
  };

  // Drag selection
  const isInDrag = (roomId: string, date: Date) => {
    if (!dragStart || dragStart.roomId !== roomId || !dragEnd) return false;
    const a = Math.min(dragStart.date.getTime(), dragEnd.getTime());
    const b = Math.max(dragStart.date.getTime(), dragEnd.getTime());
    const t = date.getTime();
    return t >= a && t <= b;
  };
  const finishDrag = () => {
    if (dragStart && dragEnd) {
      const a = dragStart.date.getTime() <= dragEnd.getTime() ? dragStart.date : dragEnd;
      const b = dragStart.date.getTime() <= dragEnd.getTime() ? dragEnd : dragStart.date;
      openQuickFor(dragStart.roomId, a, b);
    } else if (dragStart) {
      openQuickFor(dragStart.roomId, dragStart.date);
    }
    setDragStart(null);
    setDragEnd(null);
  };

  // Drag per globalem mouseup abschließen — Maus-Release IRGENDWO (auch
  // außerhalb der Tabelle) beendet die Auswahl sauber. Früher öffnete das
  // onMouseLeave→finishDrag den Buchungs-Dialog schon beim Verlassen der
  // Tabelle mit gedrückter Maus (Zielgruppe 60+, zittrige Hand). Jetzt öffnet
  // NUR das echte Loslassen.
  useEffect(() => {
    if (!dragStart) return;
    const onUp = () => finishDrag();
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart, dragEnd]);

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
    const conflict = findConflict(selected.room_id, editForm.check_in, editForm.check_out, selected.id);
    if (conflict) {
      toast.error(conflictMessage(conflict));
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
          <Button variant="outline" size="icon" onClick={goPrev}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold text-lg capitalize min-w-[220px] text-center">{view === "year" ? anchor.getFullYear() : headerLabel}</span>
          <Button variant="outline" size="icon" onClick={goNext}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={goToday}>Heute</Button>
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="inline-flex rounded-md border bg-card overflow-hidden">
            {(["day", "week", "month", "year"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  view === v ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {v === "day" ? "Tag" : v === "week" ? "Woche" : v === "month" ? "Monat" : "Jahr"}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-paid))] border" /> Belegt</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="relative w-3 h-3 rounded bg-[hsl(var(--cal-paid))] border">
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
            </span>
            Zahlung offen
          </span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-intern))] border" /> Intern</span>
          <Button size="sm" variant="outline" onClick={() => { setQuickForm(initialQuick); setQuickOpen(true); }}>
            <Plus className="h-4 w-4" /> Neue Buchung
          </Button>
          <Button size="sm" onClick={() => setInternOpen(true)}><Plus className="h-4 w-4" /> Intern eintragen</Button>
        </div>
      </div>

      {view === "year" ? (
        <YearGrid
          year={anchor.getFullYear()}
          rooms={rooms}
          bookings={bookings}
          onPickMonth={(m) => { setAnchor(new Date(anchor.getFullYear(), m, 1)); setView("month"); }}
        />
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            {view === "week" && (
              <div className="px-3 py-2 border-b bg-muted/50 text-xs font-bold tracking-wide">
                KW {isoWeek(days[0])}
              </div>
            )}
            <table
              className="w-full text-xs select-none"
            >
              <thead className="bg-muted">
                <tr>
                  <th className="sticky left-0 bg-muted z-10 text-left font-medium p-2 min-w-[200px] border-b border-r">Zimmer</th>
                  {days.map((d) => {
                    const isToday = toISODate(d) === todayIso;
                    const holiday = getHoliday(d, "RP");
                    // Today-Outline (auf der Spalte) nur in Woche/Monat — in Tag-View ist eh alles "heute".
                    const showTodayRing = isToday && view !== "day";
                    const dayLabel = `${d.getDate()}${view !== "month" ? `.${String(d.getMonth() + 1).padStart(2, "0")}` : ""}`;
                    return (
                      <th
                        key={d.toISOString()}
                        title={holiday ? `Feiertag: ${holiday.name}` : undefined}
                        className={cn(
                          "font-medium p-1 text-center border-b",
                          view === "day" ? "min-w-[420px]" : view === "week" ? "min-w-[110px]" : "min-w-[36px]",
                          (d.getDay() === 0 || d.getDay() === 6) && "bg-accent/40",
                          holiday && "bg-[hsl(var(--cal-holiday))] text-[hsl(var(--cal-holiday-fg))]",
                          showTodayRing && "ring-1 ring-inset ring-[hsl(var(--cal-today))]",
                        )}
                      >
                        <div className="text-[10px] text-muted-foreground uppercase">{d.toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2)}</div>
                        <div>
                          {isToday ? (
                            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-[hsl(var(--cal-today))] text-[hsl(var(--cal-today-fg))] font-bold leading-none">
                              {dayLabel}
                            </span>
                          ) : view !== "month" ? (
                            <>
                              {d.getDate()}
                              <span className="text-muted-foreground font-normal">.{String(d.getMonth() + 1).padStart(2, "0")}</span>
                            </>
                          ) : (
                            d.getDate()
                          )}
                        </div>
                        {holiday && (view === "day" || view === "week") && (
                          <div className="text-[9px] font-medium leading-tight mt-0.5 truncate">{holiday.name}</div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td className="sticky left-0 bg-card z-10 p-2 font-medium border-b border-r whitespace-nowrap">
                      <div>Zimmer {r.room_number}</div>
                      {r.room_type && <div className="text-[10px] text-muted-foreground font-normal">{r.room_type}</div>}
                    </td>
                    {days.map((d) => {
                      const s = cellState(r.id, d);
                      const dragHL = isInDrag(r.id, d);
                      const isToday = toISODate(d) === todayIso;
                      const showTodayRing = isToday && view !== "day";
                      // Alle Belegungen einheitlich blau — "Belegt ist belegt", egal ob bezahlt oder noch offen.
                      // Pending kriegt zusaetzlich einen kleinen orangenen Punkt als Hinweis "Geld noch holen".
                      const cls =
                        s.type === "free" ? cn("bg-[hsl(var(--cal-free))] hover:bg-muted/40 cursor-pointer", dragHL && "bg-secondary/40") :
                        s.type === "intern" ? "bg-[hsl(var(--cal-intern))] hover:brightness-95 cursor-pointer" :
                        "bg-[hsl(var(--cal-paid))] hover:brightness-95 cursor-pointer text-[hsl(var(--cal-paid-fg))]";
                      const showLabel = !!s.booking && (
                        view === "day" || view === "week" ||
                        toISODate(d) === s.booking.check_in
                      );
                      // Pending-Indikator nur am ersten Tag der Buchung (sonst staffelt sich der Punkt ueber alle Naechte)
                      const showPendingDot = s.type === "pending" && s.booking && toISODate(d) === s.booking.check_in;
                      return (
                        <td
                          key={d.toISOString()}
                          className={cn(
                            "relative border-b border-r/50 text-center align-middle transition px-1",
                            view === "day" ? "h-12" : "h-9",
                            cls,
                            showTodayRing && "ring-1 ring-inset ring-[hsl(var(--cal-today))]",
                          )}
                          title={s.booking ? `${s.booking.guest_name} · Zimmer ${r.room_number} (${formatDateShort(s.booking.check_in)}–${formatDateShort(s.booking.check_out)})${s.type === "pending" ? " · Zahlung offen" : ""}` : `Frei · Klicken zum Buchen`}
                          onMouseDown={() => {
                            if (s.booking) return;
                            setDragStart({ roomId: r.id, date: d });
                            setDragEnd(d);
                          }}
                          onMouseEnter={() => {
                            if (dragStart && dragStart.roomId === r.id) setDragEnd(d);
                          }}
                          onClick={() => {
                            if (s.booking) setSelected(s.booking);
                          }}
                        >
                          {showLabel && s.booking && (
                            <span className="text-[10px] font-medium truncate block leading-tight">
                              {s.booking.guest_name.split(" ").map((p, i, a) => i === a.length - 1 || a.length === 1 ? p : `${p[0]}.`).join(" ")}
                              <span className="opacity-75"> #{r.room_number}</span>
                            </span>
                          )}
                          {showPendingDot && (
                            <span
                              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_0_1px_white]"
                              aria-label="Zahlung offen"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* INTERN */}
      {/* QUICK BOOKING */}
      <Dialog open={quickOpen} onOpenChange={(o) => { setQuickOpen(o); if (!o) setQuickForm(initialQuick); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Buchung</DialogTitle>
            <DialogDescription>
              {quickForm.check_in && quickForm.check_out && (
                <>
                  {formatDateShort(quickForm.check_in)} – {formatDateShort(quickForm.check_out)}
                  {" · "}
                  {nightsBetween(quickForm.check_in, quickForm.check_out)}{" "}
                  {nightsBetween(quickForm.check_in, quickForm.check_out) === 1 ? "Nacht" : "Nächte"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Zimmer</Label>
              <Select value={quickForm.room_id} onValueChange={(v) => setQuickForm({ ...quickForm, room_id: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Zimmer wählen" /></SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      Zimmer {r.room_number}{r.room_type ? ` · ${r.room_type}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gastname</Label>
              <Input className="mt-1.5" value={quickForm.guest_name} onChange={(e) => setQuickForm({ ...quickForm, guest_name: e.target.value })} placeholder="Vor- und Nachname" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>E-Mail</Label>
                <Input className="mt-1.5" type="email" value={quickForm.guest_email} onChange={(e) => setQuickForm({ ...quickForm, guest_email: e.target.value })} />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input className="mt-1.5" value={quickForm.guest_phone} onChange={(e) => setQuickForm({ ...quickForm, guest_phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Anreise</Label>
                <Input className="mt-1.5" type="date" value={quickForm.check_in} onChange={(e) => setQuickForm({ ...quickForm, check_in: e.target.value })} />
              </div>
              <div>
                <Label>Abreise</Label>
                <Input className="mt-1.5" type="date" value={quickForm.check_out} onChange={(e) => setQuickForm({ ...quickForm, check_out: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Notiz</Label>
              <Textarea className="mt-1.5" rows={2} value={quickForm.notes} onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })} />
            </div>
            {quickForm.room_id && quickForm.check_in && quickForm.check_out && quickForm.check_out > quickForm.check_in && (
              <div className="rounded-md bg-muted p-2 text-xs flex justify-between">
                <span className="text-muted-foreground">Voraussichtlicher Preis ({quickForm.type === "intern" ? "intern" : "online"})</span>
                <span className="font-semibold">
                  {eur(quickForm.type === "intern" ? 0 : Number(rooms.find((r) => r.id === quickForm.room_id)?.price_per_night ?? 0) * nightsBetween(quickForm.check_in, quickForm.check_out))}
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="flex-wrap gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setQuickOpen(false)}>Abbrechen</Button>
            <Button variant="outline" disabled={quickSaving} onClick={() => submitQuick("intern")}>
              Intern eintragen
            </Button>
            <Button disabled={quickSaving} onClick={() => submitQuick("online")}>
              Online-Buchung
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    {!isIntern && (
                      <Button variant="outline" size="sm" onClick={() => setInvoiceOpen(true)}>
                        <FileText className="h-4 w-4" /> Rechnung erstellen
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

      {selected && (
        <InvoiceDialog
          open={invoiceOpen}
          onOpenChange={setInvoiceOpen}
          booking={selected}
          room={room}
        />
      )}

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

function YearGrid({
  year,
  rooms,
  bookings,
  onPickMonth,
}: {
  year: number;
  rooms: Room[];
  bookings: Booking[];
  onPickMonth: (monthIndex: number) => void;
}) {
  // Aggregiert einen Monat: Belegungs-Counter + Monats-Umsatz + Auslastung.
  // Wir berechnen sowohl das angezeigte Jahr als auch das Vorjahr — fuer den Vergleich.
  const computeMonth = (yr: number, m: number) => {
    const daysInMonth = new Date(yr, m + 1, 0).getDate();
    const totalSlots = daysInMonth * Math.max(1, rooms.length);
    let paid = 0;
    let pending = 0;
    let intern = 0;
    let revenue = 0;
    let bookingsCount = 0;
    const countedBookings = new Set<string>();
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toISODate(new Date(yr, m, day));
      for (const r of rooms) {
        const b = bookings.find(
          (x) => x.room_id === r.id && x.payment_status !== "cancelled" && x.check_in <= iso && x.check_out > iso,
        );
        if (b) {
          if (b.booking_type === "intern") intern++;
          else if (b.payment_status === "paid") paid++;
          else pending++;
          if (b.booking_type !== "intern" && !countedBookings.has(b.id)) {
            countedBookings.add(b.id);
            bookingsCount++;
            const ci = parseLocalDate(b.check_in);   // lokal — konsistent mit monthStart/-End
            const co = parseLocalDate(b.check_out);
            const monthStart = new Date(yr, m, 1);
            const monthEnd = new Date(yr, m + 1, 1);
            const overlapStart = ci < monthStart ? monthStart : ci;
            const overlapEnd = co > monthEnd ? monthEnd : co;
            const nightsInMonth = Math.max(0, Math.round((overlapEnd.getTime() - overlapStart.getTime()) / 86400000));
            const totalNights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));
            revenue += Number(b.total_price) * (nightsInMonth / totalNights);
          }
        }
      }
    }
    const free = totalSlots - paid - pending - intern;
    const occupiedSlots = paid + pending + intern;
    const occupancyPct = totalSlots ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
    return { paid, pending, intern, free, totalSlots, revenue, occupancyPct, bookingsCount };
  };

  const months = Array.from({ length: 12 }, (_, m) => {
    const current = computeMonth(year, m);
    // Vormonat: bei Januar → Dezember Vorjahr
    const prevYear = m === 0 ? year - 1 : year;
    const prevMonth = m === 0 ? 11 : m - 1;
    const prev = computeMonth(prevYear, prevMonth);
    // Selber Monat in den letzten 3 Vorjahren
    const yoy1 = computeMonth(year - 1, m);
    const yoy2 = computeMonth(year - 2, m);
    const yoy3 = computeMonth(year - 3, m);
    return { m, ...current, prev, yoy1, yoy2, yoy3 };
  });

  const fmtEur = (n: number) =>
    n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  // Liefert einen Vergleichs-Text wie "+12% vs. Vormonat" mit Farbe
  const deltaPct = (current: number, base: number): { text: string; color: string } => {
    if (!base) {
      return current > 0
        ? { text: "neu", color: "text-emerald-600" }
        : { text: "—", color: "text-muted-foreground/60" };
    }
    const pct = Math.round(((current - base) / base) * 100);
    if (pct === 0) return { text: "±0%", color: "text-muted-foreground" };
    return {
      text: (pct > 0 ? "▲ +" : "▼ ") + pct + "%",
      color: pct > 0 ? "text-emerald-600" : "text-rose-600",
    };
  };

  // Jahres-Aggregate: Summe ueber alle 12 Monate
  const yearTotal = months.reduce(
    (acc, m) => ({
      revenue: acc.revenue + m.revenue,
      paid: acc.paid + m.paid,
      pending: acc.pending + m.pending,
      intern: acc.intern + m.intern,
      occupied: acc.occupied + m.paid + m.pending + m.intern,
      capacity: acc.capacity + m.totalSlots,
      bookingsCount: acc.bookingsCount + m.bookingsCount,
      yoy1Rev: acc.yoy1Rev + m.yoy1.revenue,
      yoy2Rev: acc.yoy2Rev + m.yoy2.revenue,
      yoy3Rev: acc.yoy3Rev + m.yoy3.revenue,
    }),
    { revenue: 0, paid: 0, pending: 0, intern: 0, occupied: 0, capacity: 0, bookingsCount: 0, yoy1Rev: 0, yoy2Rev: 0, yoy3Rev: 0 },
  );
  const yearOccPct = yearTotal.capacity ? Math.round((yearTotal.occupied / yearTotal.capacity) * 100) : 0;
  const yearOccColor =
    yearOccPct >= 70 ? "text-emerald-600" :
    yearOccPct >= 40 ? "text-amber-600" :
    yearOccPct > 0   ? "text-rose-600" :
    "text-muted-foreground";
  const yearD1 = deltaPct(yearTotal.revenue, yearTotal.yoy1Rev);
  const yearD2 = deltaPct(yearTotal.revenue, yearTotal.yoy2Rev);
  const yearD3 = deltaPct(yearTotal.revenue, yearTotal.yoy3Rev);

  return (
    <div className="space-y-3">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {months.map(({ m, paid, pending, intern, free, totalSlots, revenue, occupancyPct, prev, yoy1, yoy2, yoy3 }) => {
        const label = new Date(year, m, 1).toLocaleDateString("de-DE", { month: "long" });
        const pct = (n: number) => (totalSlots ? (n / totalSlots) * 100 : 0);
        // Ampel-Farbe fuer die Auslastung
        const occColor =
          occupancyPct >= 70 ? "text-emerald-600" :
          occupancyPct >= 40 ? "text-amber-600" :
          occupancyPct > 0   ? "text-rose-600" :
          "text-muted-foreground";
        const dPrev = deltaPct(revenue, prev.revenue);
        const dY1 = deltaPct(revenue, yoy1.revenue);
        const dY2 = deltaPct(revenue, yoy2.revenue);
        const dY3 = deltaPct(revenue, yoy3.revenue);
        return (
          <Card
            key={m}
            className="shadow-card cursor-pointer hover:shadow-elegant transition-shadow"
            onClick={() => onPickMonth(m)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold capitalize">{label}</div>
                <div className={cn("text-xl font-semibold tabular-nums leading-none", occColor)}>
                  {occupancyPct}%
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Umsatz</span>
                <span className="text-sm font-medium tabular-nums">{fmtEur(revenue)}</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-[hsl(var(--cal-free))]">
                <div className="bg-[hsl(var(--cal-paid))]" style={{ width: `${pct(paid)}%` }} />
                <div className="bg-[hsl(var(--cal-pending))]" style={{ width: `${pct(pending)}%` }} />
                <div className="bg-[hsl(var(--cal-intern))]" style={{ width: `${pct(intern)}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[hsl(var(--cal-paid))]" />{paid}</span>
                <span className="inline-flex items-center gap-1 relative">
                  <span className="w-2 h-2 rounded-sm bg-[hsl(var(--cal-paid))]" />
                  <span className="absolute left-1 -top-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {pending}
                </span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[hsl(var(--cal-intern))]" />{intern}</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[hsl(var(--cal-free))] border" />{free}</span>
              </div>

              {/* Vergleiche: vs. Vormonat + Mehrjahres-Vergleich */}
              <div className="pt-2 border-t border-border/50 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs. Vormonat</span>
                  <span className={cn("font-medium tabular-nums", dPrev.color)}>{dPrev.text}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-border/30">
                  <div className="flex flex-col items-center">
                    <span className="text-muted-foreground">{year - 1}</span>
                    <span className={cn("font-medium tabular-nums", dY1.color)}>{dY1.text}</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-border/30">
                    <span className="text-muted-foreground">{year - 2}</span>
                    <span className={cn("font-medium tabular-nums", dY2.color)}>{dY2.text}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-muted-foreground">{year - 3}</span>
                    <span className={cn("font-medium tabular-nums", dY3.color)}>{dY3.text}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Jahres-Gesamt-Karte — kompakt, alles in einer Reihe damit der Bildschirm nicht scrollt */}
    <Card className="shadow-card">
      <CardContent className="p-3 flex items-center gap-x-5 gap-y-2 flex-wrap">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Jahres-Bilanz</span>
          <span className="font-display text-base">{year}</span>
        </div>

        <Stat label="Umsatz"      value={fmtEur(yearTotal.revenue)} />
        <Stat label="Auslastung"  value={`${yearOccPct}%`} color={yearOccColor} />
        <Stat label="Buchungen"   value={String(yearTotal.bookingsCount)} />
        <Stat label="Davon offen" value={String(yearTotal.pending)} color="text-amber-600" />

        <div className="h-8 w-px bg-border/50 mx-1" />

        <YoY label={`vs. ${year - 1}`} delta={yearD1} amount={fmtEur(yearTotal.yoy1Rev)} />
        <YoY label={`vs. ${year - 2}`} delta={yearD2} amount={fmtEur(yearTotal.yoy2Rev)} />
        <YoY label={`vs. ${year - 3}`} delta={yearD3} amount={fmtEur(yearTotal.yoy3Rev)} />
      </CardContent>
    </Card>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">{label}</span>
      <span className={cn("text-base font-semibold tabular-nums leading-tight", color)}>{value}</span>
    </div>
  );
}

function YoY({ label, delta, amount }: { label: string; delta: { text: string; color: string }; amount: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">{label}</span>
      <span className={cn("text-sm font-semibold tabular-nums leading-tight", delta.color)}>{delta.text}</span>
      <span className="text-[9px] text-muted-foreground/60 tabular-nums leading-tight">{amount}</span>
    </div>
  );
}
