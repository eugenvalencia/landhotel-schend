import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Hotel, ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { eur, formatDate } from "@/lib/format";

export default function Confirmation() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);

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
      <main className="container mx-auto px-4 py-12 max-w-2xl">
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
                    <span>{formatDate(booking.check_in)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Abreise</span>
                    <span>{formatDate(booking.check_out)}</span>
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

            <Button asChild variant="outline" className="mt-6">
              <Link to="/"><ArrowLeft className="h-4 w-4" /> Zur Startseite</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
