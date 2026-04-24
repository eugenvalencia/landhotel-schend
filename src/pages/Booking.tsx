import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  CalendarIcon, Hotel, ArrowLeft, CheckCircle2, CreditCard, Lock,
  Landmark, ClipboardList, ChevronDown, Loader2, Star, AlertCircle, CheckCircle,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eur, nightsBetween, toISODate } from "@/lib/format";
import { photoForRoomType } from "@/lib/photos";
import { saveBookingConfirmation } from "@/lib/bookingConfirmation";
import { cn } from "@/lib/utils";

type Room = {
  id: string;
  room_number: number;
  name: string;
  room_type: string;
  bed_description: string;
  max_persons: number;
  price_per_night: number;
  amenities: string[];
  photos: string[];
  status: string;
};

type Extra = {
  id: string;
  name: string;
  price: number;
  per_night: boolean;
};

const guestSchema = z.object({
  name: z.string().trim().min(2, "Name muss mind. 2 Zeichen haben").max(120),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(5, "Telefonnummer zu kurz").max(40),
});

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roomIdParam = params.get("room");

  const [room, setRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [persons, setPersons] = useState<number>(2);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [roomBookings, setRoomBookings] = useState<Array<{ check_in: string; check_out: string }>>([]);
  const [allBookings, setAllBookings] = useState<Array<{ room_id: string; check_in: string; check_out: string }>>([]);

  const nights = useMemo(
    () => (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0),
    [checkIn, checkOut]
  );

  // Build a Set of ISO date strings that are blocked for the selected room
  // A booking from check_in -> check_out blocks [check_in, check_out) — checkout day is free
  const blockedDates = useMemo(() => {
    const set = new Set<string>();
    roomBookings.forEach((b) => {
      const start = new Date(b.check_in);
      const end = new Date(b.check_out);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        set.add(toISODate(d));
      }
    });
    return set;
  }, [roomBookings]);

  const isDateBlocked = (d: Date) => blockedDates.has(toISODate(d));

  // Earliest forced check-out: first blocked date strictly after the chosen check-in
  const maxCheckout = useMemo(() => {
    if (!checkIn) return undefined;
    const sorted = [...blockedDates].sort();
    const inIso = toISODate(checkIn);
    for (const iso of sorted) {
      if (iso > inIso) return new Date(iso);
    }
    return undefined;
  }, [checkIn, blockedDates]);

  // Upcoming availability windows (next ~90 days) for info panel
  const availabilityWindows = useMemo(() => {
    if (!room) return [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const windows: Array<{ from: Date; to: Date; available: boolean }> = [];
    let current: { from: Date; available: boolean } | null = null;
    for (let i = 0; i < 90; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const blocked = blockedDates.has(toISODate(d));
      const avail = !blocked;
      if (!current) {
        current = { from: new Date(d), available: avail };
      } else if (current.available !== avail) {
        const to = new Date(d); to.setDate(d.getDate() - 1);
        windows.push({ from: current.from, to, available: current.available });
        current = { from: new Date(d), available: avail };
      }
    }
    if (current) {
      const last = new Date(today); last.setDate(today.getDate() + 89);
      windows.push({ from: current.from, to: last, available: current.available });
    }
    return windows.slice(0, 4);
  }, [room, blockedDates]);

  // Suggest an alternative room when the selected dates are not available
  const alternativeRoom = useMemo(() => {
    if (!room || !checkIn || !checkOut) return null;
    const inIso = toISODate(checkIn);
    const outIso = toISODate(checkOut);
    const conflict = (roomId: string) =>
      allBookings.some((b) => b.room_id === roomId && b.check_in < outIso && b.check_out > inIso);
    if (!conflict(room.id)) return null;
    const candidate = rooms.find(
      (r) => r.id !== room.id && r.room_type === room.room_type && !conflict(r.id)
    );
    return candidate ?? rooms.find((r) => r.id !== room.id && !conflict(r.id)) ?? null;
  }, [room, rooms, checkIn, checkOut, allBookings]);

  useEffect(() => {
    supabase
      .from("rooms")
      .select("*")
      .eq("status", "aktiv")
      .order("room_number")
      .then(({ data }) => {
        const list = (data as any[]) ?? [];
        setRooms(list);
        if (roomIdParam) {
          const found = list.find((r) => r.id === roomIdParam);
          if (found) setRoom(found);
        }
      });
    supabase
      .from("extras")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setExtras((data as any) ?? []));
    supabase
      .from("bookings")
      .select("room_id,check_in,check_out,payment_status")
      .neq("payment_status", "cancelled")
      .then(({ data }) => setAllBookings((data as any[]) ?? []));
  }, [roomIdParam]);

  // Refresh per-room bookings whenever the selected room changes
  useEffect(() => {
    if (!room) { setRoomBookings([]); return; }
    setRoomBookings(
      allBookings
        .filter((b) => b.room_id === room.id)
        .map((b) => ({ check_in: b.check_in, check_out: b.check_out }))
    );
    // Reset chosen dates if they conflict with newly loaded room
    if (checkIn && checkOut) {
      const inIso = toISODate(checkIn);
      const outIso = toISODate(checkOut);
      const conflict = allBookings.some(
        (b) => b.room_id === room.id && b.check_in < outIso && b.check_out > inIso
      );
      if (conflict) {
        setCheckIn(undefined);
        setCheckOut(undefined);
        toast.info("Die zuvor gewählten Daten sind für dieses Zimmer nicht verfügbar.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, allBookings]);

  const UPSELLS = useMemo(() => [
    { id: "ups-suite", name: "Suite-Upgrade", price: 30, perNight: true, desc: "Upgrade in eine Suite (sofern verfügbar)" },
    { id: "ups-romantik", name: "Romantik-Paket", price: 25, perNight: false, desc: "Wein, Rosen & Pralinen im Zimmer" },
    { id: "ups-fruehstueck", name: "Frühstück nachrüsten", price: 12, perNight: true, desc: "Pro Person & Nacht – regional & frisch" },
  ], []);

  const upsellTotal = useMemo(() => {
    return selectedUpsells.reduce((sum, id) => {
      const u = UPSELLS.find((x) => x.id === id);
      if (!u) return sum;
      return sum + (u.perNight ? u.price * Math.max(nights, 1) * (u.id === "ups-fruehstueck" ? persons : 1) : u.price);
    }, 0);
  }, [selectedUpsells, UPSELLS, nights, persons]);

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, id) => {
      const e = extras.find((x) => x.id === id);
      if (!e) return sum;
      return sum + (e.per_night ? e.price * nights : e.price);
    }, 0);
  }, [selectedExtras, extras, nights]);

  const roomTotal = room ? room.price_per_night * nights : 0;
  const grandTotal = roomTotal + extrasTotal + upsellTotal;

  const canSubmit = room && checkIn && checkOut && nights > 0 &&
    guestSchema.safeParse(guest).success;

  const handlePayment = async () => {
    if (!room) {
      toast.error("Bitte wählen Sie ein Zimmer");
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      toast.error("Bitte Check-in und Check-out auswählen");
      return;
    }
    const g = guestSchema.safeParse(guest);
    if (!g.success) {
      toast.error(g.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Eingaben");
      return;
    }
    setSubmitting(true);
    const startedAt = Date.now();
    try {
      // Insert guest record (fire-and-forget — anonymous users can't read it back)
      const { error: gErr } = await supabase
        .from("guests")
        .insert({ name: guest.name, email: guest.email, phone: guest.phone });
      if (gErr) console.warn("Guest insert warning:", gErr.message);

      const extrasPayload = selectedExtras.map((id) => {
        const e = extras.find((x) => x.id === id)!;
        return { id: e.id, name: e.name, price: e.price, per_night: e.per_night };
      });

      const { data: b, error: bErr } = await supabase
        .from("bookings")
        .insert({
          room_id: room.id,
          guest_name: guest.name,
          guest_email: guest.email,
          guest_phone: guest.phone,
          check_in: toISODate(checkIn),
          check_out: toISODate(checkOut),
          total_price: grandTotal,
          extras: extrasPayload,
          booking_type: "online",
          payment_status: "paid",
          notes: notes.trim() || null,
        })
        .select()
        .single();
      if (bErr) throw bErr;

      const confirmationExtras = extrasPayload.map((extra) => ({
        id: extra.id,
        name: extra.name,
        price: Number(extra.price),
        perNight: extra.per_night,
        total: extra.per_night ? Number(extra.price) * nights : Number(extra.price),
      }));

      saveBookingConfirmation({
        bookingNumber: b?.booking_number ?? `LS-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}`,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        checkIn: toISODate(checkIn),
        checkOut: toISODate(checkOut),
        nights,
        persons,
        roomName: room.name,
        roomType: room.room_type,
        roomNumber: room.room_number,
        roomPrice: Number(room.price_per_night),
        roomPhoto: room.photos?.[0] || photoForRoomType(room.room_type),
        roomSubtotal: roomTotal,
        extras: confirmationExtras,
        extrasTotal,
        totalPrice: grandTotal,
        notes: notes.trim() || null,
      });

      const remainingMs = 1200 - (Date.now() - startedAt);
      if (remainingMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingMs));
      }
      toast.success("Buchung bestätigt!");
      navigate("/booking-confirmation");
    } catch (e: any) {
      console.error("Booking failed:", e);
      toast.error("Buchung fehlgeschlagen: " + (e?.message ?? "Unbekannter Fehler"));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90">
            <Hotel className="h-5 w-5" />
            <span className="font-semibold">Landhotel Schend</span>
          </Link>
          <Badge variant="secondary" className="bg-white/15 text-primary-foreground border-0">
            Direktbuchung
          </Badge>
        </div>
        <div className="container mx-auto px-4 pb-8 pt-2">
          <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground -ml-3">
            <Link to={room ? `/rooms/${room.id}` : "/"}>
              <ArrowLeft className="h-4 w-4" /> Zurück
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">Buchung abschließen</h1>
          <p className="opacity-80 text-sm md:text-base">
            {room ? `Zimmer ${room.room_number} · ${room.room_type}` : "Wählen Sie Ihr Zimmer und Reisedaten"}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32 lg:pb-8 max-w-5xl grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* SECTION 1: REISEDATEN */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">1. Reisedaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!roomIdParam && (
                <div>
                  <Label>Zimmer</Label>
                  <Select value={room?.id} onValueChange={(v) => setRoom(rooms.find((r) => r.id === v) ?? null)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Zimmer auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          Nr. {r.room_number} · {r.room_type} · {eur(r.price_per_night)}/Nacht
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {room && availabilityWindows.length > 0 && (
                <div className="rounded-lg border bg-muted/30 p-3 text-xs space-y-1.5">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-secondary" />
                    Zimmer {room.room_number} – nächste Zeiträume
                  </div>
                  {availabilityWindows.map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {w.available ? (
                        <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      )}
                      <span className="text-muted-foreground">
                        {format(w.from, "dd.MM.", { locale: de })} – {format(w.to, "dd.MM.", { locale: de })}:
                      </span>
                      <span className={cn("font-medium", w.available ? "text-success" : "text-destructive")}>
                        {w.available ? "Verfügbar" : "Belegt"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start mt-1.5">
                        <CalendarIcon className="h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP", { locale: de }) : "Datum wählen"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(d) => {
                          setCheckIn(d);
                          if (d && checkOut && checkOut <= d) setCheckOut(undefined);
                        }}
                        disabled={(d) =>
                          d < new Date(new Date().setHours(0, 0, 0, 0)) || isDateBlocked(d)
                        }
                        modifiers={{ booked: (d) => isDateBlocked(d) }}
                        modifiersClassNames={{
                          booked: "line-through text-destructive/60 bg-destructive/10",
                        }}
                        locale={de}
                        className={cn("p-3 pointer-events-auto")}
                      />
                      <div className="px-3 pb-3 text-[11px] text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-destructive/40" /> Belegt</span>
                        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-success" /> Verfügbar</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start mt-1.5" disabled={!checkIn}>
                        <CalendarIcon className="h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP", { locale: de }) : "Datum wählen"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(d) => {
                          if (!checkIn) return true;
                          if (d <= checkIn) return true;
                          // Block any checkout date past the next booking's start
                          if (maxCheckout && d > maxCheckout) return true;
                          return false;
                        }}
                        locale={de}
                        className={cn("p-3 pointer-events-auto")}
                      />
                      {maxCheckout && (
                        <div className="px-3 pb-3 text-[11px] text-muted-foreground">
                          Spätester Check-out: {format(maxCheckout, "dd.MM.yyyy", { locale: de })}
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label>Personen</Label>
                <Select value={String(persons)} onValueChange={(v) => setPersons(Number(v))}>
                  <SelectTrigger className="mt-1.5 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Person" : "Personen"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {nights > 0 && room && (
                <div className="rounded-lg bg-accent p-3 text-sm flex justify-between">
                  <span className="text-muted-foreground">{nights} {nights === 1 ? "Nacht" : "Nächte"} × {eur(room.price_per_night)}</span>
                  <span className="font-semibold">{eur(roomTotal)}</span>
                </div>
              )}
              {alternativeRoom && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-destructive">
                        {room?.name} ist in diesem Zeitraum belegt.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Alternative: Zimmer {alternativeRoom.room_number} ({alternativeRoom.room_type}) – {eur(alternativeRoom.price_per_night)}/Nacht
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setRoom(alternativeRoom)}
                  >
                    Zu Zimmer {alternativeRoom.room_number} wechseln
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 2: EXTRAS */}
          <Card className="shadow-card">
            <button
              onClick={() => setExtrasOpen((v) => !v)}
              className="w-full flex items-center justify-between p-6"
              type="button"
            >
              <span className="text-lg font-semibold">2. Extras (optional)</span>
              <ChevronDown className={cn("h-5 w-5 transition-transform", extrasOpen && "rotate-180")} />
            </button>
            {extrasOpen && (
              <CardContent className="space-y-2 pt-0">
                {extras.map((e) => {
                  const checked = selectedExtras.includes(e.id);
                  const lineTotal = e.per_night ? e.price * Math.max(nights, 1) : e.price;
                  return (
                    <label
                      key={e.id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) =>
                            setSelectedExtras((prev) =>
                              c ? [...prev, e.id] : prev.filter((x) => x !== e.id)
                            )
                          }
                        />
                        <div>
                          <p className="font-medium">{e.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {eur(e.price)} {e.per_night ? "/ Nacht" : "/ Aufenthalt"}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">{eur(lineTotal)}</span>
                    </label>
                  );
                })}
              </CardContent>
            )}
          </Card>

          {/* UPSELLS */}
          <Card className="shadow-card border-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" /> Upgrades & Pakete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {UPSELLS.map((u) => {
                const checked = selectedUpsells.includes(u.id);
                const lineTotal = u.perNight ? u.price * Math.max(nights, 1) * (u.id === "ups-fruehstueck" ? persons : 1) : u.price;
                return (
                  <div key={u.id} className={cn("flex items-center justify-between gap-3 rounded-lg border p-3", checked && "bg-secondary/5 border-secondary")}>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{u.name} <span className="text-secondary font-semibold">+{u.price}€{u.perNight ? "/N" : ""}</span></p>
                      <p className="text-xs text-muted-foreground">{u.desc}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={checked ? "default" : "outline"}
                      onClick={() => setSelectedUpsells((prev) => checked ? prev.filter((x) => x !== u.id) : [...prev, u.id])}
                    >
                      {checked ? `✓ ${eur(lineTotal)}` : "Hinzufügen"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">3. Ihre Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Vor- und Nachname</Label>
                <Input id="name" value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} className="mt-1.5" maxLength={120} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} className="mt-1.5" maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} className="mt-1.5" maxLength={40} />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Sonderwünsche (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5"
                  placeholder="z. B. Allergien, frühere Anreise, ruhiges Zimmer …"
                  maxLength={1000}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: PAYMENT */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> 4. Zahlung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card"><CreditCard className="h-4 w-4 mr-1.5" /> Kreditkarte</TabsTrigger>
                  <TabsTrigger value="sepa"><Landmark className="h-4 w-4 mr-1.5" /> SEPA-Lastschrift</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="rounded-lg border p-4 space-y-3 bg-card mt-4">
                  <div>
                    <Label>Kartennummer</Label>
                    <Input defaultValue="4242 4242 4242 4242" className="mt-1.5 font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Gültig bis</Label>
                      <Input defaultValue="12 / 28" className="mt-1.5 font-mono" />
                    </div>
                    <div>
                      <Label>CVC</Label>
                      <Input defaultValue="123" className="mt-1.5 font-mono" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    Demo-Modus: 4242 4242 4242 4242 – keine echte Belastung
                  </p>
                </TabsContent>

                <TabsContent value="sepa" className="rounded-lg border p-4 space-y-3 bg-card mt-4">
                  <div>
                    <Label>IBAN</Label>
                    <Input defaultValue="DE89 3704 0044 0532 0130 00" className="mt-1.5 font-mono" />
                  </div>
                  <div>
                    <Label>Kontoinhaber</Label>
                    <Input defaultValue={guest.name} className="mt-1.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Mit Klick auf Bezahlen ermächtigen Sie Landhotel Schend, Zahlungen von Ihrem Konto einzuziehen.
                  </p>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handlePayment}
                disabled={!canSubmit || submitting}
                size="lg"
                className="w-full text-base"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {submitting
                  ? "Zahlung wird bestätigt..."
                  : `${eur(grandTotal || 0)} jetzt bezahlen`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                SSL-verschlüsselt · Sofortige Bestätigung · Keine versteckten Gebühren
              </p>
            </CardContent>
          </Card>
        </div>

        {/* LIVE SUMMARY */}
        <aside className="lg:sticky lg:top-4 self-start">
          <Card className="shadow-elevated border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-secondary" /> Ihre Buchung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {room ? (
                <>
                  <div className="space-y-1">
                    <div className="font-semibold">Zimmer {room.room_number} · {room.room_type}</div>
                    <div className="text-muted-foreground text-xs">{room.bed_description}</div>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{checkIn ? `${format(checkIn, "dd.MM.yyyy")} · ab 15:00` : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{checkOut ? `${format(checkOut, "dd.MM.yyyy")} · bis 11:00` : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aufenthalt</span>
                      <span>{nights > 0 ? `${nights} ${nights === 1 ? "Nacht" : "Nächte"}` : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Personen</span>
                      <span>{persons}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span>Zimmer ({nights} × {eur(room.price_per_night)})</span>
                      <span>{eur(roomTotal)}</span>
                    </div>
                    {selectedExtras.map((id) => {
                      const e = extras.find((x) => x.id === id);
                      if (!e) return null;
                      const lineTotal = e.per_night ? e.price * nights : e.price;
                      return (
                        <div key={id} className="flex justify-between text-muted-foreground">
                          <span>{e.name}</span>
                          <span>{eur(lineTotal)}</span>
                        </div>
                      );
                    })}
                    {selectedUpsells.map((id) => {
                      const u = UPSELLS.find((x) => x.id === id);
                      if (!u) return null;
                      const lineTotal = u.perNight ? u.price * Math.max(nights, 1) * (u.id === "ups-fruehstueck" ? persons : 1) : u.price;
                      return (
                        <div key={id} className="flex justify-between text-secondary">
                          <span>{u.name}</span>
                          <span>+{eur(lineTotal)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamt</span>
                    <span>{eur(grandTotal)}</span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Bitte wählen Sie ein Zimmer.</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Sticky mobile pay bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t shadow-elevated safe-pb px-4 pt-3">
        <Button
          onClick={handlePayment}
          disabled={!canSubmit || submitting}
          size="lg"
          className="w-full h-12 text-base"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {submitting
            ? "Zahlung wird bestätigt..."
            : `${eur(grandTotal || 0)} jetzt bezahlen`}
        </Button>
      </div>
    </div>
  );
}
