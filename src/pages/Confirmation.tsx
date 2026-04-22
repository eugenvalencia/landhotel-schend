import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2, Hotel, ArrowLeft, Mail, MessageSquare, Home,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { eur, formatDate } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import { SCHEND_LOGO, photoForRoomType } from "@/lib/photos";

type ExtraLine = { id: string; name: string; price: number; per_night: boolean };

export default function Confirmation() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookingNumber) return;
    supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", bookingNumber)
      .maybeSingle()
      .then(async ({ data }) => {
        setBooking(data);
        if (data?.room_id) {
          const { data: r } = await supabase.from("rooms").select("*").eq("id", data.room_id).maybeSingle();
          setRoom(r);
        }
        if (data) {
          setTimeout(() => toast.success("📱 Telegram-Benachrichtigung an Hotel gesendet"), 400);
        }
      });
  }, [bookingNumber]);

  const scrollToEmail = () =>
    emailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const nights =
    booking && booking.check_in && booking.check_out
      ? Math.max(
          1,
          Math.round(
            (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
              86400000,
          ),
        )
      : 0;

  const extras: ExtraLine[] = Array.isArray(booking?.extras) ? booking.extras : [];
  const roomTotal = room ? Number(room.price_per_night) * nights : 0;
  const extrasTotal = extras.reduce(
    (s, e) => s + (e.per_night ? Number(e.price) * nights : Number(e.price)),
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            <span className="font-semibold">Landhotel Schend</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
        {/* CONFIRMATION CARD */}
        <Card className="shadow-elevated">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-success" />
            </div>
            <h1 className="text-3xl font-bold">
              Vielen Dank{booking?.guest_name ? `, ${booking.guest_name}` : ""}!
            </h1>
            <p className="text-muted-foreground text-lg">Ihre Buchung ist bestätigt.</p>

            {booking && (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mt-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Buchungsnummer</span>
                  <span className="font-mono font-semibold">#{booking.booking_number}</span>
                </div>

                <div className="text-left bg-accent rounded-lg p-5 space-y-2 mt-4">
                  {room && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zimmer</span>
                      <span>Nr. {room.room_number} · {room.room_type}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anreise</span>
                    <span>{formatDate(booking.check_in)} ab 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Abreise</span>
                    <span>{formatDate(booking.check_out)} bis 11:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gast</span>
                    <span>{booking.guest_name}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Bezahlt</span>
                    <span>{eur(Number(booking.total_price))}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground pt-2">
                  <p className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" /> Bestätigung wurde an {booking.guest_email} gesendet
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Telegram-Benachrichtigung an Hotel gesendet
                  </p>
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <Button variant="outline" onClick={scrollToEmail}>
                <Mail className="h-4 w-4" /> Email-Vorschau anzeigen
              </Button>
              <Button asChild>
                <Link to="/"><Home className="h-4 w-4" /> Zurück zur Startseite</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* EMAIL PREVIEW */}
        {booking && (
          <section ref={emailRef} className="space-y-3">
            <h2 className="text-center text-lg font-semibold">
              📧 So sieht Ihre Bestätigungs-Email aus:
            </h2>

            <div className="bg-muted rounded-xl p-4 sm:p-6">
              <div className="mx-auto max-w-[600px] bg-white text-slate-900 rounded-lg shadow-elevated overflow-hidden border">
                {/* meta header */}
                <div className="border-b px-5 py-3 text-xs text-slate-600 space-y-0.5 bg-slate-50">
                  <div><span className="text-slate-400">Von:</span> info@landhotel-schend.de</div>
                  <div><span className="text-slate-400">An:</span> {booking.guest_email}</div>
                  <div><span className="text-slate-400">Betreff:</span> ✅ Buchungsbestätigung #{booking.booking_number}</div>
                </div>

                {/* navy header */}
                <div className="bg-primary text-primary-foreground px-5 py-5 flex items-center gap-3">
                  <HotelImage
                    src={SCHEND_LOGO}
                    alt="Landhotel Schend Logo"
                    className="h-10 w-auto object-contain bg-transparent"
                  />
                  <div className="font-bold tracking-wide text-lg">LANDHOTEL SCHEND</div>
                </div>

                <div className="px-5 sm:px-7 py-6 space-y-5 text-sm leading-relaxed">
                  <p>Liebe/r {booking.guest_name},</p>
                  <p>
                    vielen Dank für Ihre Buchung! Wir freuen uns auf Ihren Besuch in der
                    wunderschönen Vulkaneifel.
                  </p>

                  {room && (
                    <div className="rounded-lg overflow-hidden aspect-[16/9]">
                      <HotelImage
                        src={photoForRoomType(room.room_type)}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <div className="font-semibold mb-2">📋 BUCHUNGSDETAILS</div>
                    <div className="border-t border-slate-200" />
                    <dl className="grid grid-cols-[140px_1fr] gap-y-1 mt-2">
                      <dt className="text-slate-500">Buchungsnummer:</dt>
                      <dd className="font-mono">#{booking.booking_number}</dd>
                      <dt className="text-slate-500">Zimmer:</dt>
                      <dd>{room ? `Nr. ${room.room_number} · ${room.room_type}` : "—"}</dd>
                      <dt className="text-slate-500">Check-in:</dt>
                      <dd>{formatDate(booking.check_in)} ab 15:00 Uhr</dd>
                      <dt className="text-slate-500">Check-out:</dt>
                      <dd>{formatDate(booking.check_out)} bis 11:00 Uhr</dd>
                      <dt className="text-slate-500">Aufenthalt:</dt>
                      <dd>{nights} {nights === 1 ? "Nacht" : "Nächte"}</dd>
                      <dt className="text-slate-500">Personen:</dt>
                      <dd>{room?.max_persons ?? 2}</dd>
                    </dl>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">💰 PREISÜBERSICHT</div>
                    <div className="border-t border-slate-200 mb-2" />
                    {room && (
                      <div className="flex justify-between">
                        <span>Zimmer ({nights} × {eur(Number(room.price_per_night))})</span>
                        <span>{eur(roomTotal)}</span>
                      </div>
                    )}
                    {extras.map((e) => (
                      <div key={e.id} className="flex justify-between text-slate-700">
                        <span>{e.name}</span>
                        <span>
                          {eur(e.per_night ? Number(e.price) * nights : Number(e.price))}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Gesamt bezahlt:</span>
                      <span>{eur(Number(booking.total_price))}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Zahlungsart: Kreditkarte / SEPA-Lastschrift
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">📍 ANREISE</div>
                    <div className="border-t border-slate-200 mb-2" />
                    <div>Landhotel Schend</div>
                    <div>Immerath, Vulkaneifel 54552</div>
                    <div>Tel: +49 6573 306</div>
                    <div>info@landhotel-schend.de</div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">✅ Highlights</div>
                    <ul className="space-y-1">
                      <li>🅿️ Kostenlose Parkplätze — videoüberwacht</li>
                      <li>🏍️ Motorrad-Parkplätze — videoüberwacht</li>
                      <li>🧖 Sauna & Wellness</li>
                      <li>🍽️ Restaurant & großes Frühstücksbuffet</li>
                      <li>📶 Kostenloses WLAN</li>
                    </ul>
                  </div>

                  <p className="text-slate-700">
                    Bei Fragen erreichen Sie uns unter <strong>+49 6573 306</strong>.
                  </p>

                  <p>
                    Herzliche Grüße,<br />
                    Ihr Team vom Landhotel Schend
                  </p>
                </div>

                <div className="border-t px-5 py-4 text-xs text-slate-500 text-center bg-slate-50">
                  © {new Date().getFullYear()} Landhotel Schend · Immerath · Vulkaneifel<br />
                  landhaus-schend.de
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button asChild variant="ghost">
                <Link to="/"><ArrowLeft className="h-4 w-4" /> Zurück zur Startseite</Link>
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
