import { Link } from "react-router-dom";
import { CheckCircle2, Hotel } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HotelImage } from "@/components/HotelImage";
import {
  loadBookingConfirmation,
  toDisplayBookingNumber,
} from "@/lib/bookingConfirmation";
import { eur, formatDate } from "@/lib/format";

const contactLines = [
  "Landhotel Schend",
  "Hauptstraße 23, 54552 Immerath",
  "Tel: +49 6573 306",
  "Email: info@landhaus-schend.de",
  "Web: landhaus-schend.de",
];

const EmailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-border py-2 last:border-b-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default function Confirmation() {
  const booking = loadBookingConfirmation();

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-16">
          <Card className="w-full shadow-elevated">
            <CardContent className="space-y-6 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Hotel className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Keine Buchungsdaten gefunden</h1>
                <p className="text-muted-foreground">
                  Bitte schließen Sie die Buchung erneut ab, damit die Bestätigungsseite angezeigt werden kann.
                </p>
              </div>
              <Button asChild size="lg">
                <Link to="/booking">Zurück zur Buchung</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const displayBookingNumber = toDisplayBookingNumber(booking.bookingNumber);

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
        <section className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center justify-center gap-3 text-primary">
            <Hotel className="h-8 w-8" />
            <span className="text-xl font-bold tracking-wide">LANDHOTEL SCHEND</span>
          </div>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Buchung bestätigt!</h1>
          <p className="mt-2 text-lg text-muted-foreground">Vielen Dank für Ihre Buchung</p>
        </section>

        <section className="space-y-4">
          <p className="text-center text-sm font-medium text-foreground md:text-base">
            Bestätigungsemail wurde gesendet an: <span className="text-primary">{booking.guestEmail}</span>
          </p>

          <div className="mx-auto max-w-4xl rounded-lg border bg-card p-3 shadow-card sm:p-5">
            <div className="overflow-hidden rounded-md border bg-background">
              <div className="border-b bg-muted/40 px-5 py-4">
                <div className="flex items-center gap-2 text-primary">
                  <Hotel className="h-5 w-5" />
                  <span className="text-sm font-bold tracking-wide">LANDHOTEL SCHEND</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Betreff: Buchungsbestätigung - Landhotel Schend
                </p>
              </div>

              <div className="space-y-6 px-5 py-6 text-sm text-foreground sm:px-8 sm:py-8">
                <div className="space-y-2">
                  <p className="font-medium">Sehr geehrte/r {booking.guestName},</p>
                  <p className="text-muted-foreground">Ihre Buchung wurde erfolgreich bestätigt.</p>
                </div>

                <div className="rounded-md border bg-card p-4">
                  <h2 className="mb-3 text-base font-semibold text-foreground">Buchungsdetails</h2>
                  <div className="space-y-0">
                    <EmailRow label="Buchungsnummer" value={displayBookingNumber} />
                    <EmailRow label="Check-in" value={formatDate(booking.checkIn)} />
                    <EmailRow label="Check-out" value={formatDate(booking.checkOut)} />
                    <EmailRow label="Zimmertyp" value={booking.roomType} />
                    <EmailRow label="Zimmernummer" value={String(booking.roomNumber)} />
                    <EmailRow label="Anzahl Gäste" value={String(booking.persons)} />
                  </div>
                </div>

                <div className="overflow-hidden rounded-md border">
                  <div className="aspect-[16/9]">
                    <HotelImage
                      src={booking.roomPhoto}
                      alt={`${booking.roomType} im Landhotel Schend`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-md border bg-card p-4">
                  <h2 className="mb-3 text-base font-semibold text-foreground">Preisübersicht</h2>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
                      <div>
                        <p className="font-medium">Zimmerpreis</p>
                        <p className="text-muted-foreground">
                          {eur(booking.roomPrice)} × {booking.nights} {booking.nights === 1 ? "Nacht" : "Nächte"}
                        </p>
                      </div>
                      <p className="font-medium">{eur(booking.roomSubtotal)}</p>
                    </div>

                    <div className="space-y-2 border-b border-border pb-3">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">Extras</p>
                        <p className="font-medium">{eur(booking.extrasTotal)}</p>
                      </div>
                      {booking.extras.length > 0 ? (
                        booking.extras.map((extra) => (
                          <div key={extra.id} className="flex items-start justify-between gap-4 text-muted-foreground">
                            <div>
                              <p>{extra.name}</p>
                              <p className="text-xs">
                                {eur(extra.price)} {extra.perNight ? "pro Nacht" : "pro Aufenthalt"}
                              </p>
                            </div>
                            <p>{eur(extra.total)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Keine Extras ausgewählt</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 text-base font-semibold">
                      <p>Gesamtpreis</p>
                      <p>{eur(booking.totalPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border bg-card p-4">
                  <h2 className="mb-3 text-base font-semibold text-foreground">Hotelkontakt</h2>
                  <div className="space-y-1 text-muted-foreground">
                    {contactLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                <p className="font-medium text-foreground">Wir freuen uns auf Ihren Besuch!</p>
              </div>

              <div className="border-t bg-muted/40 px-5 py-4">
                <div className="flex items-center gap-2 text-primary">
                  <Hotel className="h-4 w-4" />
                  <span className="text-sm font-bold tracking-wide">LANDHOTEL SCHEND</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Ihr Familienhotel im Immerath | Vulkaneifel</p>
              </div>
            </div>
          </div>

          <div className="pt-3 text-center">
            <Button asChild size="lg" className="min-h-12 min-w-[260px]">
              <Link to="/">Zurück zur Startseite</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
