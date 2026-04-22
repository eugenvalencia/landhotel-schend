import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Hotel, Users, BedDouble, ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AmenityIcon } from "@/components/AmenityIcon";
import { eur, nightsBetween, toISODate } from "@/lib/format";
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

type Step = "dates" | "room" | "extras" | "guest" | "payment";

const guestSchema = z.object({
  name: z.string().trim().min(2, "Name muss mind. 2 Zeichen haben").max(120),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(5, "Telefonnummer zu kurz").max(40),
});

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("dates");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [extras, setExtras] = useState<Extra[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
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
      .then(({ data }) => setRooms((data as any) ?? []));
    supabase
      .from("extras")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setExtras((data as any) ?? []));
  }, []);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut || nights < 1) {
      toast.error("Bitte gültigen Zeitraum wählen");
      return;
    }
    const { data, error } = await supabase.rpc("get_room_availability", {
      _check_in: toISODate(checkIn),
      _check_out: toISODate(checkOut),
    });
    if (error) {
      toast.error("Verfügbarkeit konnte nicht geprüft werden");
      return;
    }
    const map: Record<string, boolean> = {};
    (data as any[])?.forEach((r) => (map[r.room_id] = r.is_available));
    setAvailability(map);
    setStep("room");
  };

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, id) => {
      const e = extras.find((x) => x.id === id);
      if (!e) return sum;
      return sum + (e.per_night ? e.price * nights : e.price);
    }, 0);
  }, [selectedExtras, extras, nights]);

  const roomTotal = selectedRoom ? selectedRoom.price_per_night * nights : 0;
  const grandTotal = roomTotal + extrasTotal;

  const handleConfirmGuest = () => {
    const result = guestSchema.safeParse(guest);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return;
    setSubmitting(true);
    try {
      // Create guest
      const { data: g, error: gErr } = await supabase
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
          room_id: selectedRoom.id,
          guest_id: g!.id,
          guest_name: guest.name,
          guest_email: guest.email,
          guest_phone: guest.phone,
          check_in: toISODate(checkIn),
          check_out: toISODate(checkOut),
          total_price: grandTotal,
          extras: extrasPayload,
          booking_type: "online",
          payment_status: "paid",
        })
        .select()
        .single();
      if (bErr) throw bErr;

      toast.success("📱 Telegram: Neue Buchung gesendet!");
      navigate(`/confirmation/${b!.booking_number}`);
    } catch (e: any) {
      toast.error("Buchung fehlgeschlagen: " + (e.message ?? "Unbekannt"));
    } finally {
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
        <div className="container mx-auto px-4 pb-10 pt-4">
          <h1 className="text-2xl md:text-3xl font-bold">Zimmer buchen</h1>
          <p className="opacity-80 text-sm md:text-base">Ihr Urlaubsdomizil in der Vulkaneifel · sichere Zahlung · sofortige Bestätigung</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress */}
        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          {[
            ["dates", "1. Reisedaten"],
            ["room", "2. Zimmer"],
            ["extras", "3. Extras"],
            ["guest", "4. Gastdaten"],
            ["payment", "5. Zahlung"],
          ].map(([k, label]) => (
            <Badge
              key={k}
              variant={step === k ? "default" : "secondary"}
              className={cn("rounded-full", step === k && "bg-secondary")}
            >
              {label}
            </Badge>
          ))}
        </div>

        {/* STEP 1: DATES */}
        {step === "dates" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Reisezeitraum wählen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Anreise</Label>
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
                  <Label>Abreise</Label>
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
              {nights > 0 && (
                <p className="text-sm text-muted-foreground">
                  {nights} {nights === 1 ? "Nacht" : "Nächte"}
                </p>
              )}
              <Button onClick={checkAvailability} className="w-full sm:w-auto" size="lg">
                Verfügbarkeit prüfen
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: ROOM */}
        {step === "room" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("dates")}>
                <ArrowLeft className="h-4 w-4" /> Datum ändern
              </Button>
              <p className="text-sm text-muted-foreground">
                {checkIn && checkOut && `${format(checkIn, "dd.MM.yyyy")} – ${format(checkOut, "dd.MM.yyyy")} · ${nights} Nächte`}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((r) => {
                const available = availability[r.id] !== false;
                return (
                  <Card
                    key={r.id}
                    className={cn("shadow-card overflow-hidden flex flex-col", !available && "opacity-50")}
                  >
                    <div className="aspect-[4/3] bg-accent flex items-center justify-center overflow-hidden">
                      {r.photos?.[0] ? (
                        <img src={r.photos[0]} alt={r.name} className="w-full h-full object-cover" />
                      ) : (
                        <BedDouble className="h-12 w-12 text-secondary/40" />
                      )}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{r.name}</h3>
                        <Badge variant="secondary">{eur(r.price_per_night)}/Nacht</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{r.room_type}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                        <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{r.bed_description}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />max {r.max_persons}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(r.amenities ?? []).map((a) => (
                          <AmenityIcon key={a} name={a} />
                        ))}
                      </div>
                      <Button
                        className="mt-auto"
                        disabled={!available}
                        onClick={() => {
                          setSelectedRoom(r);
                          setStep("extras");
                        }}
                      >
                        {available ? "Auswählen" : "Nicht verfügbar"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 3: EXTRAS */}
        {step === "extras" && selectedRoom && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Extras auswählen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {extras.map((e) => {
                const checked = selectedExtras.includes(e.id);
                const lineTotal = e.per_night ? e.price * nights : e.price;
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
              <Separator className="my-4" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{selectedRoom.name} · {nights} Nächte</span>
                <span>{eur(roomTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extras</span>
                <span>{eur(extrasTotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Gesamt</span>
                <span>{eur(grandTotal)}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("room")}>Zurück</Button>
                <Button onClick={() => setStep("guest")} className="flex-1">Weiter</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: GUEST */}
        {step === "guest" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Gastdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Vor- und Nachname</Label>
                <Input id="name" value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} className="mt-1.5" maxLength={120} />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} className="mt-1.5" maxLength={255} />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} className="mt-1.5" maxLength={40} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("extras")}>Zurück</Button>
                <Button onClick={handleConfirmGuest} className="flex-1">Weiter zur Zahlung</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: PAYMENT */}
        {step === "payment" && selectedRoom && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Zahlung (Demo-Modus)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg bg-accent p-4 text-sm space-y-1">
                <p><strong>{selectedRoom.name}</strong> · {nights} Nächte</p>
                <p className="text-muted-foreground">{guest.name} · {guest.email}</p>
                <p className="text-lg font-semibold pt-2">{eur(grandTotal)}</p>
              </div>
              <div className="rounded-lg border p-4 space-y-3 bg-card">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Test-Zahlungsdaten</p>
                <div>
                  <Label>Kartennummer</Label>
                  <Input defaultValue="4242 4242 4242 4242" className="mt-1.5 font-mono" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Gültig bis</Label>
                    <Input defaultValue="12 / 28" className="mt-1.5 font-mono" readOnly />
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input defaultValue="123" className="mt-1.5 font-mono" readOnly />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  Demo-Zahlung – keine echte Belastung
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("guest")} disabled={submitting}>Zurück</Button>
                <Button onClick={handlePayment} className="flex-1" size="lg" disabled={submitting}>
                  {submitting ? "Wird verarbeitet..." : `${eur(grandTotal)} jetzt bezahlen`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
