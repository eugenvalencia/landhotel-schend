import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { saveBookingConfirmation, type BookingConfirmationData } from "@/lib/bookingConfirmation";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";
import BookingConfirmationCard from "@/components/BookingConfirmationCard";

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

const FALLBACK_ROOMS: Room[] = [
  { id: "d47bcebd-a254-4880-8952-72a2929d2520", room_number: 1, name: "Zimmer 1", room_type: "Einzelzimmer", bed_description: "Einzelbett", max_persons: 1, price_per_night: 65, amenities: [], photos: [], status: "aktiv" },
  { id: "6d45c8cb-d584-43b4-ad7b-4f54d7f4c8de", room_number: 2, name: "Zimmer 2", room_type: "Einzelzimmer", bed_description: "Einzelbett", max_persons: 1, price_per_night: 65, amenities: [], photos: [], status: "aktiv" },
  { id: "ade89315-160a-4211-b7ee-7dfbf4e7eeb3", room_number: 3, name: "Zimmer 3", room_type: "Einzelzimmer", bed_description: "Einzelbett", max_persons: 1, price_per_night: 65, amenities: [], photos: [], status: "aktiv" },
  ...[4, 5, 6, 7, 8, 9, 10].map((n, i) => ({ id: ["8e3d91a0-0711-4cdf-a580-c2debb684d0c", "e288b28f-affb-4a18-b95e-991b28e15306", "b350d97f-8f76-4144-be97-6a2f18d69c6b", "cbdb5c64-5843-44e7-a802-da8b361ccb7a", "8ea5ebaa-2570-45c3-8340-112391ae422b", "a75e046c-6f0b-4ddc-bce6-77f5f4141644", "2f539adf-8c88-440f-8900-996ebbb764b8"][i], room_number: n, name: `Zimmer ${n}`, room_type: "Doppelzimmer Standard", bed_description: "Doppelbett", max_persons: 2, price_per_night: 95, amenities: [], photos: [], status: "aktiv" })),
  ...[11, 12, 13, 14, 15, 16].map((n, i) => ({ id: ["5af7abab-0811-4e14-9b71-923c3afafbeb", "c219233b-4571-4196-a697-c49c3412d4b1", "0e940352-a7a7-4d5d-890a-4db63ad9e2fc", "05af9142-9a56-4583-a2de-c3e11cdd6380", "dce1e187-c5fd-4649-950c-03d51236261c", "e67d9828-126c-4700-b223-a3acb88ceb44"][i], room_number: n, name: `Zimmer ${n}`, room_type: "Doppelzimmer Komfort", bed_description: "Doppelbett", max_persons: 2, price_per_night: 105, amenities: [], photos: [], status: "aktiv" })),
  ...[17, 18, 19].map((n, i) => ({ id: ["2dffe866-7b1a-42d5-8ea9-29c9f2975994", "d1bd202f-eedf-45e9-be4c-18a43742ca12", "ab65f06b-385c-4f6a-ad3c-5b9c4de47495"][i], room_number: n, name: `Zimmer ${n}`, room_type: "Familienzimmer", bed_description: "Doppelbett und Schlafsofa", max_persons: 4, price_per_night: 145, amenities: [], photos: [], status: "aktiv" })),
  { id: "8460eb23-82ff-4280-a1f1-ca01f97733bd", room_number: 20, name: "Junior Suite", room_type: "Junior Suite", bed_description: "Doppelbett und Wohnbereich", max_persons: 2, price_per_night: 165, amenities: [], photos: [], status: "aktiv" },
  { id: "06183ce9-3314-4f82-aab9-40e8c7d32d86", room_number: 21, name: "Eifel-Suite", room_type: "Suite", bed_description: "Doppelbett und separater Wohnbereich", max_persons: 2, price_per_night: 195, amenities: [], photos: [], status: "aktiv" },
];

const FALLBACK_EXTRAS: Extra[] = [
  { id: "2177e1d4-cb02-49d5-b1bb-ae995fd19d7a", name: "Frühstück", price: 12, per_night: true },
  { id: "595b0d19-c04d-4c13-a44b-53c478baa9b3", name: "Halbpension", price: 28, per_night: true },
  { id: "04801a2c-88db-418a-ac8a-177bf145912b", name: "Fahrrad", price: 15, per_night: false },
  { id: "3c738498-11a0-4b52-aa92-d7bfef4bdae1", name: "Late Check-out", price: 20, per_night: false },
  { id: "1d6b93b1-78aa-4fa7-8bde-a24600290d29", name: "Früh Check-in", price: 20, per_night: false },
  { id: "5744643a-c890-4195-bbe2-bd8100d64ed2", name: "Haustier", price: 10, per_night: true },
];

const guestSchema = z.object({
  name: z.string().trim().min(2, "Name muss mind. 2 Zeichen haben").max(120),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(5, "Telefonnummer zu kurz").max(40),
});

export default function Booking() {
  const [params] = useSearchParams();
  const roomIdParam = params.get("room");

  useSEO({
    title: "Direkt buchen — provisionsfrei",
    description:
      "Buchen Sie direkt im Landhotel Schend in Immerath / Vulkaneifel. Bester Preis garantiert, keine OTA-Provision, sofortige Bestätigung.",
    canonical: "/booking",
  });

  const [room, setRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(FALLBACK_ROOMS);
  const [extras, setExtras] = useState<Extra[]>(FALLBACK_EXTRAS);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [persons, setPersons] = useState<number>(2);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingConfirmationData | null>(null);
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
      .then(({ data, error }) => {
        const list = !error && data?.length ? (data as Room[]) : FALLBACK_ROOMS;
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
      .then(({ data, error }) => {
        const list = !error && data?.length ? (data as Extra[]) : FALLBACK_EXTRAS;
        setExtras(list);
      });
    supabase
      .rpc("get_booked_ranges")
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

  const canSubmit = !!(room && checkIn && checkOut && nights > 0 &&
    guestSchema.safeParse(guest).success);
  const guestValidation = guestSchema.safeParse(guest);
  const emailMissingAt = guest.email.length > 0 && !guest.email.includes("@");

  const insertAtSign = () => {
    const input = document.getElementById("email") as HTMLInputElement | null;
    // Cursor-Position lesen waehrend Input noch Fokus hat — der @-Button
    // muss onMouseDown preventDefault'en, sonst wird selectionStart von 0
    // gelesen (Blur durch Buttonklick setzt Selection zurueck) und das @
    // landet am Anfang.
    const cursor = input?.selectionStart ?? input?.value.length ?? guest.email.length;
    const next = guest.email.slice(0, cursor) + "@" + guest.email.slice(cursor);
    setGuest({ ...guest, email: next });
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(cursor + 1, cursor + 1);
    });
  };

  const showConfirmation = (data: BookingConfirmationData) => {
    saveBookingConfirmation(data);
    setConfirmed(data);
    requestAnimationFrame(() => {
      document.getElementById("booking-confirmation")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

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
    const minDelay = (started: number) =>
      new Promise<void>((resolve) => {
        const remaining = 1200 - (Date.now() - started);
        if (remaining > 0) setTimeout(resolve, remaining);
        else resolve();
      });

    try {
      const { data, error } = await supabase.rpc("create_booking", {
        p_room_id: room.id,
        p_check_in: toISODate(checkIn),
        p_check_out: toISODate(checkOut),
        p_guest_name: guest.name,
        p_guest_email: guest.email,
        p_guest_phone: guest.phone,
        p_extras: selectedExtras,
        p_notes: notes.trim() || null,
      });

      if (error || !data) {
        await minDelay(startedAt);
        console.error("[booking] create_booking failed:", error);
        const msg =
          error?.message?.includes("Room not available")
            ? "Zimmer in diesem Zeitraum leider nicht mehr verfügbar."
            : "Buchung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 6573 306";
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      const result = data as {
        booking_number: string;
        total_price: number;
        extras: Array<{ id: string; name: string; price: number; per_night: boolean }>;
        nights: number;
        room_total: number;
        extras_total: number;
      };

      const confirmationExtras = (result.extras ?? []).map((extra) => ({
        id: extra.id,
        name: extra.name,
        price: Number(extra.price),
        perNight: extra.per_night,
        total: extra.per_night ? Number(extra.price) * result.nights : Number(extra.price),
      }));

      const confirmationData: BookingConfirmationData = {
        bookingNumber: result.booking_number,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        checkIn: toISODate(checkIn),
        checkOut: toISODate(checkOut),
        nights: result.nights,
        persons,
        roomName: room.name,
        roomType: room.room_type,
        roomNumber: room.room_number,
        roomPrice: Number(room.price_per_night),
        roomPhoto: room.photos?.[0] || photoForRoomType(room.room_type),
        roomSubtotal: Number(result.room_total),
        extras: confirmationExtras,
        extrasTotal: Number(result.extras_total),
        totalPrice: Number(result.total_price),
        notes: notes.trim() || null,
      };

      await minDelay(startedAt);
      toast.success("Buchung bestätigt — Ihr Zimmer ist reserviert.");
      showConfirmation(confirmationData);
      setSubmitting(false);
    } catch (e) {
      console.error("[booking] unexpected error:", e);
      await minDelay(startedAt);
      toast.error("Verbindungsfehler. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 6573 306");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[hsl(220_22%_13%)] text-[hsl(38_30%_92%)]">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Hotel className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-display text-lg">Landhotel Schend</span>
          </Link>
          <Badge variant="secondary" className="bg-white/15 text-[hsl(38_30%_92%)] border-0 rounded-sm uppercase tracking-[0.18em] text-[10px]">
            Direktbuchung
          </Badge>
        </div>
        <div className="container mx-auto px-4 pb-10 pt-2">
          <Link
            to={room ? `/rooms/${room.id}` : "/"}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-75 hover:opacity-100 transition-opacity -ml-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Zurück
          </Link>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mt-3 text-balance leading-[1.05]">
            {confirmed ? "Buchung bestätigt" : "Buchung abschließen"}
          </h1>
          <p className="opacity-85 text-sm md:text-base mt-2">
            {confirmed
              ? "Vielen Dank — Ihr Zimmer ist verbindlich reserviert."
              : room
                ? `Zimmer ${room.room_number} · ${room.room_type}`
                : "Wählen Sie Ihr Zimmer und Reisedaten"}
          </p>
        </div>
      </header>

      {confirmed && (
        <main id="booking-confirmation" className="container mx-auto px-4 py-10 pb-24 max-w-3xl">
          <BookingConfirmationCard booking={confirmed} />
        </main>
      )}

      {!confirmed && (
      <main className="container mx-auto px-4 py-8 pb-32 lg:pb-8 max-w-5xl grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* SECTION 1: REISEDATEN */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-xl md:text-2xl">1. Reisedaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!roomIdParam && (
                <div>
                  <Label>Zimmer</Label>
                  <select
                    value={room?.id ?? ""}
                    onChange={(event) => setRoom(rooms.find((r) => r.id === event.target.value) ?? null)}
                    className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Zimmer auswählen</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Nr. {r.room_number} · {r.room_type} · {eur(r.price_per_night)}/Nacht
                      </option>
                    ))}
                  </select>
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
              <CardTitle className="font-display text-xl md:text-2xl flex items-center gap-2">
                <Star className="h-4 w-4 text-secondary" strokeWidth={1.5} /> Upgrades & Pakete
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
              <CardTitle className="font-display text-xl md:text-2xl">3. Ihre Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Vor- und Nachname</Label>
                <Input
                  id="name"
                  value={guest.name}
                  onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                  className="mt-1.5"
                  maxLength={120}
                  placeholder="z. B. Max Mustermann"
                  autoComplete="name"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="email"
                      type="email"
                      value={guest.email}
                      onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                      maxLength={255}
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      placeholder="max.mustermann@beispiel.de"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={insertAtSign}
                      title="@-Zeichen einfügen"
                      aria-label="@-Zeichen einfügen"
                      className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-9 rounded text-sm font-bold transition-colors",
                        emailMissingAt
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 animate-pulse"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      @
                    </button>
                  </div>
                  {emailMissingAt && (
                    <p className="mt-1 text-xs text-secondary">
                      Tipp: Tippen Sie auf <strong>@</strong> rechts im Feld, falls Ihre Tastatur das Zeichen nicht produziert.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guest.phone}
                    onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                    className="mt-1.5"
                    maxLength={40}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="z. B. +49 171 1234567"
                  />
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

          {/* SECTION 4: BOOKING */}
          <Card className="shadow-card border-secondary/30">
            <CardHeader>
              <CardTitle className="font-display text-xl md:text-2xl flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-secondary" strokeWidth={1.5} /> 4. Buchung abschließen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border bg-accent/40 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Sofortige Buchungsbestätigung</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ihr Zimmer wird direkt in unserem Belegungskalender für Sie reserviert —
                      keine Wartezeit, keine zusätzliche Bestätigung nötig. Sie erhalten Ihre
                      Bestätigung sofort per E-Mail.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Landmark className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Zahlung bequem vor Ort</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Die Bezahlung erfolgt bei der Anreise — bar oder mit EC-/Kreditkarte.
                      Keine Vorauszahlung, keine Kreditkartendaten erforderlich.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!canSubmit || submitting}
                size="lg"
                className="w-full text-base"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {submitting ? "Buchung wird verarbeitet..." : "Jetzt verbindlich buchen"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Bei Änderungen oder Stornierung einfach anrufen: <a href="tel:+4965731306" className="font-medium text-foreground hover:text-primary">+49 6573 306</a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* LIVE SUMMARY */}
        <aside className="lg:sticky lg:top-4 self-start">
          <Card className="shadow-elevated border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg md:text-xl flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-secondary" strokeWidth={1.5} /> Ihre Buchung
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
      )}

      {/* Sticky mobile reservation bar */}
      {!confirmed && (
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t shadow-elevated safe-pb px-4 pt-3">
        <Button
          onClick={handlePayment}
          disabled={!canSubmit || submitting}
          size="lg"
          className="w-full h-12 text-base"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {submitting ? "Buchung wird verarbeitet..." : "Jetzt verbindlich buchen"}
        </Button>
      </div>
      )}
    </div>
  );
}
