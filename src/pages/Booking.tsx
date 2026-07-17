import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import i18n from "@/i18n";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  CalendarIcon, ArrowLeft, CheckCircle2, CreditCard, Lock,
  Landmark, ClipboardList, ChevronDown, Loader2, AlertCircle, CheckCircle,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { notifyBooking } from "@/lib/notify-booking";
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
  price_per_person?: boolean;
  single_use_price?: number | null;
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

// Echtes Inventar: 19 Doppelzimmer + 2 Familienzimmer = 21. KEINE Einzelzimmer,
// KEINE Suiten (siehe site/lib/rooms.ts). Im Live-Betrieb liefert die DB die echten
// Zimmer; diese Liste ist nur Initial-/Fallback-Zustand.
const FALLBACK_DZ_IDS = [
  "d47bcebd-a254-4880-8952-72a2929d2520", "6d45c8cb-d584-43b4-ad7b-4f54d7f4c8de", "ade89315-160a-4211-b7ee-7dfbf4e7eeb3",
  "8e3d91a0-0711-4cdf-a580-c2debb684d0c", "e288b28f-affb-4a18-b95e-991b28e15306", "b350d97f-8f76-4144-be97-6a2f18d69c6b", "cbdb5c64-5843-44e7-a802-da8b361ccb7a", "8ea5ebaa-2570-45c3-8340-112391ae422b", "a75e046c-6f0b-4ddc-bce6-77f5f4141644", "2f539adf-8c88-440f-8900-996ebbb764b8",
  "5af7abab-0811-4e14-9b71-923c3afafbeb", "c219233b-4571-4196-a697-c49c3412d4b1", "0e940352-a7a7-4d5d-890a-4db63ad9e2fc", "05af9142-9a56-4583-a2de-c3e11cdd6380", "dce1e187-c5fd-4649-950c-03d51236261c", "e67d9828-126c-4700-b223-a3acb88ceb44",
  "ab65f06b-385c-4f6a-ad3c-5b9c4de47495", "8460eb23-82ff-4280-a1f1-ca01f97733bd", "06183ce9-3314-4f82-aab9-40e8c7d32d86",
];

const FALLBACK_ROOMS: Room[] = [
  ...FALLBACK_DZ_IDS.map((id, i) => ({ id, room_number: i + 1, name: `Zimmer ${i + 1}`, room_type: "Doppelzimmer", bed_description: "Doppelbett", max_persons: 2, price_per_night: 95, amenities: [], photos: [], status: "aktiv" })),
  { id: "2dffe866-7b1a-42d5-8ea9-29c9f2975994", room_number: 20, name: "Familienzimmer 20", room_type: "Familienzimmer", bed_description: "Zwei getrennte Zimmer, 4 Schlafplätze", max_persons: 4, price_per_night: 170, amenities: [], photos: [], status: "aktiv" },
  { id: "d1bd202f-eedf-45e9-be4c-18a43742ca12", room_number: 21, name: "Familienzimmer 21", room_type: "Familienzimmer", bed_description: "Zwei getrennte Zimmer, 4 Schlafplätze", max_persons: 4, price_per_night: 170, amenities: [], photos: [], status: "aktiv" },
];

// Kurzbeschreibung je Zimmer-Typ — der Gast bucht eine Kategorie, kein Zimmer Nr. X.
const TYPE_BLURB: Record<string, string> = {
  Doppelzimmer: "Komfortabel, mit Balkon oder Terrasse — auch zur Einzelnutzung.",
  Familienzimmer: "Zwei getrennte Bereiche, bis zu 4 Personen — ideal für Familien.",
};

// Buchbare Extras (Eugen 17.06.): nur noch Halbpension (auf Wunsch, 23 €) und
// Haustier (15 €). Frühstück ist im Übernachtungspreis enthalten → KEIN Aufpreis;
// Sonderfälle (ohne Frühstück −8 €, externes Frühstück 15 €) stehen als Hinweis,
// nicht als buchbares Extra. Muss mit der extras-Tabelle (Migration) übereinstimmen.
const FALLBACK_EXTRAS: Extra[] = [
  { id: "595b0d19-c04d-4c13-a44b-53c478baa9b3", name: "Halbpension", price: 23, per_night: true },
  { id: "5744643a-c890-4195-bbe2-bd8100d64ed2", name: "Haustier", price: 15, per_night: true },
];

const guestSchema = z.object({
  name: z.string().trim().min(2, "Name muss mind. 2 Zeichen haben").max(120),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(5, "Telefonnummer zu kurz").max(40),
});

/** Parst "YYYY-MM-DD" als lokales Datum (kein UTC-Shift). */
function parseISOLocal(s: string | null): Date | undefined {
  if (!s) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return undefined;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function Booking() {
  const [params] = useSearchParams();
  const roomIdParam = params.get("room");

  useSEO({
    title: "Direkt buchen — provisionsfrei",
    description:
      "Buchen Sie direkt im Landhaus Schend in Immerath / Vulkaneifel. Bester Preis garantiert, keine OTA-Provision. Unverbindlich anfragen — das Hotel bestätigt Ihre Buchung in Kürze.",
    canonical: "/booking",
  });

  // Akquisitions-Kanal für die Provisionsfrei-Auswertung: Default 'Direkt',
  // Kampagnen-Traffic trägt ?utm_source=/?source=/?ref= (auf 40 Zeichen begrenzt).
  const bookingSource = (
    params.get("utm_source") || params.get("source") || params.get("ref") || "Direkt"
  ).slice(0, 40);

  const [room, setRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(FALLBACK_ROOMS);
  const [selectedTypeKey, setSelectedTypeKey] = useState<string | null>(null);
  const [extras, setExtras] = useState<Extra[]>(FALLBACK_EXTRAS);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [persons, setPersons] = useState<number>(2);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingConfirmationData | null>(null);
  const [roomBookings, setRoomBookings] = useState<Array<{ check_in: string; check_out: string }>>([]);
  const [allBookings, setAllBookings] = useState<Array<{ room_id: string; check_in: string; check_out: string }>>([]);

  // Prefill aus Hero-Schnellanfrage (?checkin/?checkout) — nur valide Werte,
  // nicht in der Vergangenheit; Abreise muss nach der Anreise liegen.
  useEffect(() => {
    const ci = parseISOLocal(params.get("checkin"));
    const co = parseISOLocal(params.get("checkout"));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (ci && ci >= today) {
      setCheckIn(ci);
      if (co && co > ci) setCheckOut(co);
    }
  }, [params]);

  const nights = useMemo(
    () => (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0),
    [checkIn, checkOut]
  );

  // Build a Set of ISO date strings that are blocked for the selected room
  // A booking from check_in -> check_out blocks [check_in, check_out) — checkout day is free
  const blockedDates = useMemo(() => {
    const set = new Set<string>();
    roomBookings.forEach((b) => {
      // Lokal parsen (nicht new Date(string)=UTC) — sonst verschiebt sich die
      // Belegung in negativen Zeitzonen und der Kalender zeigt belegte Naechte als frei.
      const start = parseISOLocal(b.check_in);
      const end = parseISOLocal(b.check_out);
      if (!start || !end) return;
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
    const sorted = [...blockedDates].sort((a, b) => a.localeCompare(b));
    const inIso = toISODate(checkIn);
    for (const iso of sorted) {
      // parseISOLocal statt new Date(iso): new Date("YYYY-MM-DD") parst UTC-Mitternacht
      // → in der Kalender-Vergleichslogik (lokale Mitternacht) kann der späteste
      // Check-out um einen Tag verrutschen. Lokal parsen hält es konsistent.
      if (iso > inIso) return parseISOLocal(iso);
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

  // ---- Buchen nach Typ: der Gast wählt Kategorie + Foto, nicht 21 Zimmernummern ----
  const roomTypes = useMemo(() => {
    const byType = new Map<string, Room[]>();
    for (const r of rooms) {
      const list = byType.get(r.room_type) ?? [];
      list.push(r);
      byType.set(r.room_type, list);
    }
    return Array.from(byType.entries())
      .map(([key, list]) => {
        const minPrice = Math.min(...list.map((r) => r.price_per_night));
        const ref = list.find((r) => r.price_per_night === minPrice) ?? list[0];
        return {
          key,
          rooms: list,
          minPrice,
          pricePerPerson: !!ref.price_per_person,
          singleUsePrice: ref.single_use_price ?? null,
          maxPersons: Math.max(...list.map((r) => r.max_persons)),
        };
      })
      .sort((a, b) => a.minPrice - b.minPrice);
  }, [rooms]);

  // Verfügbarkeit je Typ = ist für die gewählten Daten mindestens EIN Zimmer dieses Typs frei?
  const typeAvailability = useMemo(() => {
    const map: Record<string, boolean> = {};
    const hasDates = !!(checkIn && checkOut);
    const inIso = hasDates ? toISODate(checkIn) : "";
    const outIso = hasDates ? toISODate(checkOut) : "";
    for (const t of roomTypes) {
      map[t.key] = !hasDates || t.rooms.some(
        (r) => !allBookings.some((b) => b.room_id === r.id && b.check_in < outIso && b.check_out > inIso)
      );
    }
    return map;
  }, [roomTypes, allBookings, checkIn, checkOut]);

  useEffect(() => {
    // Cleanup-Flag verhindert setState auf unmounted Component bei schnellem Routenwechsel
    let active = true;
    Promise.allSettled([
      supabase.from("rooms").select("*").eq("status", "aktiv").order("room_number"),
      supabase.from("extras").select("*").eq("active", true).order("sort_order"),
      supabase.rpc("get_booked_ranges"),
    ]).then(([roomsRes, extrasRes, bookingsRes]) => {
      if (!active) return;

      const roomsOk = roomsRes.status === "fulfilled" && !roomsRes.value.error && roomsRes.value.data?.length;
      const list = roomsOk ? (roomsRes.value.data as Room[]) : FALLBACK_ROOMS;
      setRooms(list);
      if (roomIdParam) {
        const found = list.find((r) => r.id === roomIdParam);
        if (found) setSelectedTypeKey(found.room_type);
      }

      const extrasOk = extrasRes.status === "fulfilled" && !extrasRes.value.error && extrasRes.value.data?.length;
      setExtras(extrasOk ? (extrasRes.value.data as Extra[]) : FALLBACK_EXTRAS);

      const bookingsOk = bookingsRes.status === "fulfilled" && !bookingsRes.value.error;
      setAllBookings(bookingsOk ? ((bookingsRes.value.data as any[]) ?? []) : []);

      if (!roomsOk || !extrasOk || !bookingsOk) {
        console.warn("[booking] partial load — using fallbacks where needed", {
          rooms: roomsRes, extras: extrasRes, bookings: bookingsRes,
        });
      }
    });
    return () => {
      active = false;
    };
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

  // Personenzahl nie über die Zimmer-Kapazität — beim Zimmerwechsel anpassen.
  useEffect(() => {
    if (room && persons > room.max_persons) setPersons(room.max_persons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id]);

  // Hält das konkrete, FREIE Zimmer passend zum gewählten Typ + Daten — der Gast
  // sieht nur die Kategorie, der Server bekommt eine echte Zimmer-ID. Ist der Typ
  // für die Daten ausgebucht, wird room=null (die Karte zeigt dann „Belegt").
  useEffect(() => {
    if (!selectedTypeKey) { setRoom(null); return; }
    const hasDates = !!(checkIn && checkOut);
    const inIso = hasDates ? toISODate(checkIn) : "";
    const outIso = hasDates ? toISODate(checkOut) : "";
    const free = rooms
      .filter((r) => r.room_type === selectedTypeKey)
      .sort((a, b) => a.room_number - b.room_number)
      .find((r) => !hasDates || !allBookings.some(
        (b) => b.room_id === r.id && b.check_in < outIso && b.check_out > inIso
      ));
    setRoom(free ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypeKey, checkIn, checkOut, allBookings, rooms]);

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, id) => {
      const e = extras.find((x) => x.id === id);
      if (!e) return sum;
      return sum + (e.per_night ? e.price * nights : e.price);
    }, 0);
  }, [selectedExtras, extras, nights]);

  // Zimmerpreis-Vorschau — MUSS der Server-Logik in create_booking entsprechen:
  //   1 Person + Einzelbelegungs-Preis -> single_use_price (pauschal)
  //   sonst pro Person                 -> price_per_night × Personen
  //   sonst                            -> price_per_night (pauschal/Zimmer)
  const roomRatePerNight = useMemo(() => {
    if (!room) return 0;
    if (persons <= 1 && room.single_use_price != null) return Number(room.single_use_price);
    if (room.price_per_person) return room.price_per_night * persons;
    return room.price_per_night;
  }, [room, persons]);
  const roomTotal = roomRatePerNight * nights;
  // Upsells sind WÜNSCHE auf Anfrage — sie fließen NICHT in den verbindlichen
  // Gesamtpreis (der serverseitig nur aus Zimmer + echten Extras berechnet wird).
  // Früher waren sie in grandTotal eingerechnet, aber nicht an create_booking
  // gesendet → angezeigter Betrag ≠ gespeicherter Betrag, und das Hotel sah den
  // Wunsch nie. Jetzt: Anzeige = gespeichert; Wünsche gehen in die Notizen.
  const grandTotal = roomTotal + extrasTotal;

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

    const combinedNotes = notes.trim() || null;

    try {
      const { data, error } = await supabase.rpc("create_booking", {
        p_room_id: room.id,
        p_check_in: toISODate(checkIn),
        p_check_out: toISODate(checkOut),
        p_guest_name: guest.name,
        p_guest_email: guest.email,
        p_guest_phone: guest.phone,
        p_extras: selectedExtras,
        p_notes: combinedNotes,
        // UI-Sprache des Gasts mitsenden — triggert mehrsprachige Auto-Reply (DE/EN/FR/NL)
        p_preferred_language: i18n.language?.split("-")[0] ?? null,
        // Akquisitions-Kanal — Default 'Direkt', belegt die Provisionsfreiheit
        p_source: bookingSource,
        // Personen — treibt Pro-Person-Preis + max_persons-Prüfung serverseitig
        p_persons: persons,
      });

      if (error || !data) {
        await minDelay(startedAt);
        console.error("[booking] create_booking failed:", error);
        const em = error?.message ?? "";
        const msg = em.includes("Room not available")
          ? "Zimmer in diesem Zeitraum leider nicht mehr verfügbar."
          : em.includes("rate_limit")
            ? "Es liegen bereits mehrere Anfragen von Ihnen vor. Bitte warten Sie kurz oder rufen Sie uns an: +49 6573 306"
            : "Buchung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 6573 306";
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      const result = data as {
        booking_id: string;
        booking_number: string;
        total_price: number;
        extras: Array<{ id: string; name: string; price: number; per_night: boolean }>;
        nights: number;
        room_total: number;
        extras_total: number;
        notify_token: string;
      };

      // Eingangsbestätigung an den Gast (Resend via notify-schend) — best-effort.
      // Der notify_token autorisiert genau diese eine Mail (IDOR-Schutz).
      notifyBooking(result.booking_id, "request", result.notify_token);

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
        roomPhoto: (Array.isArray(room.photos) ? room.photos[0] : undefined) || photoForRoomType(room.room_type),
        roomSubtotal: Number(result.room_total),
        extras: confirmationExtras,
        extrasTotal: Number(result.extras_total),
        totalPrice: Number(result.total_price),
        notes: notes.trim() || null,
      };

      await minDelay(startedAt);
      toast.success("Anfrage gesendet — wir bestätigen Ihre Buchung in Kürze per Email.");
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
        {/* Top-Bar — auf Desktop in einer Zeile mit Titel mittig.
            Auf Mobile/Tablet bleibt der Titel unten, damit nichts gequetscht wird. */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0">
            <span
              role="img"
              aria-label="Landhaus Schend Logo"
              className="schend-mark shrink-0 h-6 text-[hsl(38_30%_92%)]"
            />
            <span className="font-display text-base md:text-lg whitespace-nowrap">Landhaus Schend</span>
          </Link>

          {/* Titel mittig — erst ab lg sichtbar, darunter erscheint er unter der Top-Bar */}
          <div className="hidden lg:flex flex-1 min-w-0 flex-col items-center text-center">
            <h1 className="font-display text-xl xl:text-2xl leading-tight truncate max-w-full">
              {confirmed ? "Anfrage gesendet" : "Buchung anfragen"}
            </h1>
            <p className="opacity-75 text-xs leading-tight truncate max-w-full">
              {confirmed
                ? "Vielen Dank — wir bestätigen Ihre Anfrage in Kürze per Email."
                : room
                  ? room.room_type
                  : "Wählen Sie Ihr Zimmer und Reisedaten"}
            </p>
          </div>

          <Badge variant="secondary" className="bg-white/15 text-[hsl(38_30%_92%)] border-0 rounded-sm uppercase tracking-[0.18em] text-[10px] shrink-0">
            Direktbuchung
          </Badge>
        </div>

        {/* Zurueck-Link — schlank, immer sichtbar */}
        <div className="container mx-auto px-4 pb-3 lg:pb-4 pt-0">
          <Link
            to={room ? `/rooms/${room.id}` : "/"}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-75 hover:opacity-100 transition-opacity -ml-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Zurück
          </Link>

          {/* Titel-Block fuer Mobile/Tablet — Desktop versteckt das (siehe oben) */}
          <div className="lg:hidden mt-2">
            <h1 className="font-display text-2xl md:text-3xl text-balance leading-[1.05]">
              {confirmed ? "Anfrage gesendet" : "Buchung anfragen"}
            </h1>
            <p className="opacity-85 text-sm mt-1">
              {confirmed
                ? "Vielen Dank — wir bestätigen Ihre Anfrage in Kürze per Email."
                : room
                  ? room.room_type
                  : "Wählen Sie Ihr Zimmer und Reisedaten"}
            </p>
          </div>
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
              {/* Datum zuerst — danach zeigen wir, welche Zimmer-Typen frei sind */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkin-trigger">Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="checkin-trigger" aria-label="Check-in-Datum wählen" variant="outline" className="w-full justify-start mt-1.5">
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
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        locale={de}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="checkout-trigger">Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="checkout-trigger" aria-label="Check-out-Datum wählen" variant="outline" className="w-full justify-start mt-1.5" disabled={!checkIn}>
                        <CalendarIcon className="h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP", { locale: de }) : "Datum wählen"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(d) => !checkIn || d <= checkIn}
                        locale={de}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="persons-trigger">Personen</Label>
                <Select value={String(persons)} onValueChange={(v) => setPersons(Number(v))}>
                  <SelectTrigger id="persons-trigger" aria-label="Anzahl Personen" className="mt-1.5 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.max(room?.max_persons ?? 4, 1) }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Person" : "Personen"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Zimmer-Auswahl nach Typ + Foto (nicht nach Zimmernummer) */}
              <div>
                <Label className="block">Zimmer</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {checkIn && checkOut
                    ? `Frei für ${format(checkIn, "dd.MM.", { locale: de })} – ${format(checkOut, "dd.MM.", { locale: de })}:`
                    : "Wählen Sie zuerst Ihre Daten — dann sehen Sie, was frei ist."}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {roomTypes.map((t) => {
                    const selected = selectedTypeKey === t.key;
                    const hasDates = !!(checkIn && checkOut);
                    const free = typeAvailability[t.key] ?? true;
                    const overCapacity = persons > t.maxPersons;
                    const disabled = (hasDates && !free) || overCapacity;
                    const blurb = TYPE_BLURB[t.key] ?? t.rooms[0]?.bed_description ?? "";
                    // Preis folgt der Personenzahl: 1 Person = Einzelnutzung, sonst pro Person × N (bzw. Pauschale).
                    const singleUse = persons <= 1 && t.singleUsePrice != null;
                    const ratePerNight = singleUse
                      ? t.singleUsePrice
                      : t.pricePerPerson
                        ? t.minPrice * persons
                        : t.minPrice;
                    const priceNote = singleUse
                      ? "Einzelnutzung"
                      : t.pricePerPerson
                        ? `${eur(t.minPrice)} p.P. × ${persons}`
                        : null;
                    return (
                      <button
                        type="button"
                        key={t.key}
                        disabled={disabled}
                        onClick={() => setSelectedTypeKey(t.key)}
                        aria-pressed={selected}
                        className={cn(
                          "group relative text-left rounded-lg border overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          selected ? "border-secondary ring-2 ring-secondary/40" : "border-input hover:border-secondary/60",
                          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                        )}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          <img
                            src={photoForRoomType(t.key)}
                            alt={t.key}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-display text-base leading-tight">{t.key}</h3>
                            {selected && <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug">{blurb}</p>
                          <div className="flex items-end justify-between gap-2 pt-1">
                            <div className="min-w-0">
                              {overCapacity ? (
                                <span className="text-xs font-medium text-muted-foreground">max. {t.maxPersons} {t.maxPersons === 1 ? "Person" : "Personen"}</span>
                              ) : (
                                <>
                                  <span className="block text-sm font-semibold text-secondary whitespace-nowrap">{eur(ratePerNight)} / Nacht</span>
                                  {priceNote && <span className="block text-[10px] text-muted-foreground leading-tight">{priceNote}</span>}
                                </>
                              )}
                            </div>
                            {hasDates && !overCapacity && (
                              <span className={cn("text-[11px] font-medium inline-flex items-center gap-1 shrink-0", free ? "text-success" : "text-destructive")}>
                                {free ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                {free ? "Verfügbar" : "Belegt"}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {checkIn && checkOut && selectedTypeKey && !room && (
                  <p className="mt-3 text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Für diese Daten ist dieser Zimmertyp leider belegt — bitte andere Daten wählen.
                  </p>
                )}
              </div>

              {nights > 0 && room && (
                <div className="rounded-lg bg-accent text-accent-foreground p-3 text-sm flex justify-between">
                  <span className="text-accent-foreground/85">
                    {nights} {nights === 1 ? "Nacht" : "Nächte"} × {eur(roomRatePerNight)}
                    {room.price_per_person && !(persons <= 1 && room.single_use_price != null) ? ` (${persons} P. × ${eur(room.price_per_night)})` : ""}
                  </span>
                  <span className="font-semibold">{eur(roomTotal)}</span>
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
                {/* Frühstück = inklusive. Sonderfälle (−8 € ohne / 15 € extern) ehrlich
                    als Hinweis, nicht als (Negativ-)Buchungsposition. */}
                <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3 mt-1">
                  <strong className="text-foreground">Frühstück ist im Übernachtungspreis enthalten.</strong>{" "}
                  Sie reisen lieber ohne Frühstück an? Wir ziehen 8 € pro Person/Nacht ab — sagen Sie
                  uns einfach unten im Feld „Anmerkungen" Bescheid. Gäste ohne Übernachtung sind zum
                  Frühstück ebenfalls willkommen (15 € pro Person).
                </p>
              </CardContent>
            )}
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
                      className="pr-14"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={insertAtSign}
                      title="@-Zeichen einfügen"
                      aria-label="@-Zeichen einfügen"
                      className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 h-9 w-11 rounded text-sm font-bold transition-colors",
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
                <ClipboardList className="h-4 w-4 text-secondary" strokeWidth={1.5} /> 4. Anfrage absenden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border bg-accent/40 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Unverbindliche Anfrage</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Wir merken Ihr Zimmer für Sie vor und prüfen die Verfügbarkeit.
                      Sie erhalten sofort eine Eingangsbestätigung per E-Mail; die
                      verbindliche Buchungsbestätigung folgt in der Regel binnen weniger
                      Stunden. Keine Vorauszahlung, keine Kreditkartendaten nötig.
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
                {submitting ? "Anfrage wird gesendet..." : "Anfrage senden"}
              </Button>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Mit dem Absenden willigen Sie ein, dass wir Ihre Angaben zur Bearbeitung Ihrer
                Anfrage verarbeiten. Details in unserer{" "}
                <Link to="/datenschutz" className="font-medium text-foreground underline hover:text-primary">Datenschutzerklärung</Link>.
                Es entstehen keine Kosten, keine Online-Zahlung.
              </p>
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
                      <span>Zimmer ({nights} × {eur(roomRatePerNight)})</span>
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
        {room && nights > 0 && (
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-muted-foreground">{nights} {nights === 1 ? "Nacht" : "Nächte"}</span>
            <span className="text-base font-semibold">Gesamt {eur(grandTotal)}</span>
          </div>
        )}
        <Button
          onClick={handlePayment}
          disabled={!canSubmit || submitting}
          size="lg"
          className="w-full h-12 text-base"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {submitting ? "Anfrage wird gesendet..." : "Anfrage senden"}
        </Button>
      </div>
      )}
    </div>
  );
}
