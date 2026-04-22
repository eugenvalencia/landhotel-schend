import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  CalendarIcon, Hotel, ArrowLeft, CheckCircle2, CreditCard, Lock,
  Landmark, ClipboardList, ChevronDown, Loader2,
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
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(
    () => (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0),
    [checkIn, checkOut]
  );

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
  }, [roomIdParam]);

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, id) => {
      const e = extras.find((x) => x.id === id);
      if (!e) return sum;
      return sum + (e.per_night ? e.price * nights : e.price);
    }, 0);
  }, [selectedExtras, extras, nights]);

  const roomTotal = room ? room.price_per_night * nights : 0;
  const grandTotal = roomTotal + extrasTotal;

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
      toast.error(g.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const startedAt = Date.now();
    try {
      const { data: gd, error: gErr } = await supabase
        .from("guests")
        .insert({ name: guest.name, email: guest.email, phone: guest.phone })
        .select()
        .single();
      if (gErr) throw gErr;

      const extrasPayload = selectedExtras.map((id) => {
        const e = extras.find((x) => x.id === id)!;
        return { id: e.id, name: e.name, price: e.price, per_night: e.per_night };
      });

      const { data: b, error: bErr } = await supabase
        .from("bookings")
        .insert({
          room_id: room.id,
          guest_id: gd!.id,
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
      if (!b?.booking_number) throw new Error("Buchungsnummer fehlt");

      const remainingMs = 2000 - (Date.now() - startedAt);
      if (remainingMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingMs));
      }
      toast.success("Buchung bestätigt!");
      navigate(`/confirmation/${b.booking_number}`);
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
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        locale={de}
                        className={cn("p-3 pointer-events-auto")}
                      />
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
                        disabled={(d) => !checkIn || d <= checkIn}
                        locale={de}
                        className={cn("p-3 pointer-events-auto")}
                      />
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

          {/* SECTION 3: GUEST */}
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
