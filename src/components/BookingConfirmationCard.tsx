import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, Printer, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HotelImage } from "@/components/HotelImage";
import {
  BookingConfirmationData,
  toDisplayBookingNumber,
} from "@/lib/bookingConfirmation";
import { eur, formatDate } from "@/lib/format";

const EmailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-border py-2 last:border-b-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

type Props = {
  booking: BookingConfirmationData;
  showActions?: boolean;
};

/**
 * Email-style booking confirmation. Used both inline on the booking page
 * (right after submit) and on the standalone /booking-confirmation route.
 */
export default function BookingConfirmationCard({ booking, showActions = true }: Props) {
  const displayBookingNumber = toDisplayBookingNumber(booking.bookingNumber);

  return (
    <div className="space-y-6">
      {/* Hero confirmation */}
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.5} />
        </div>
        <p className="eyebrow">Buchung bestätigt</p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-3 mb-4 text-balance leading-[1.05]">
          Vielen Dank, {booking.guestName.split(" ")[0]}.
        </h2>
        <p className="text-foreground/85 max-w-prose mx-auto leading-relaxed">
          Ihr Zimmer ist verbindlich für Sie reserviert. Eine Bestätigung wurde versendet an{" "}
          <span className="text-primary font-medium">{booking.guestEmail}</span>.
        </p>
      </div>

      {/* Email Preview */}
      <div className="rounded-md border bg-card p-3 shadow-elevated sm:p-5">
        <div className="overflow-hidden rounded-sm border bg-background">
          {/* Email Header */}
          <div className="border-b bg-muted/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/schend-logo-black.svg"
                alt="Landhotel Schend Logo"
                className="h-10 w-auto dark:hidden"
              />
              <img
                src="/schend-logo-white.svg"
                alt="Landhotel Schend Logo"
                className="hidden h-10 w-auto dark:block"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display text-base text-primary">Landhotel Schend</span>
                <span className="text-xs text-muted-foreground">Vulkaneifel · seit 1856</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Betreff: Buchungsbestätigung {displayBookingNumber} — Landhotel Schend
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Von: info@landhaus-schend.de · An: {booking.guestEmail}
            </p>
          </div>

          {/* Email Body */}
          <div className="space-y-6 px-5 py-6 text-sm text-foreground sm:px-8 sm:py-8">
            <div className="space-y-2">
              <p className="font-medium">Sehr geehrte/r {booking.guestName},</p>
              <p className="text-muted-foreground">
                vielen Dank für Ihre Buchung — wir freuen uns auf Sie. Ihr Zimmer ist verbindlich
                in unserem Belegungskalender reserviert. Sie müssen vorab nichts weiter tun.
              </p>
            </div>

            <div className="rounded-md border bg-card p-4">
              <h3 className="mb-3 text-base font-semibold text-foreground">Buchungsdetails</h3>
              <div className="space-y-0">
                <EmailRow label="Buchungsnr." value={displayBookingNumber} />
                <EmailRow label="Check-in" value={`${formatDate(booking.checkIn)} · ab 15:00`} />
                <EmailRow label="Check-out" value={`${formatDate(booking.checkOut)} · bis 11:00`} />
                <EmailRow label="Zimmertyp" value={booking.roomType} />
                <EmailRow label="Zimmernr." value={String(booking.roomNumber)} />
                <EmailRow label="Personen" value={String(booking.persons)} />
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
              <h3 className="mb-3 text-base font-semibold text-foreground">Preisübersicht</h3>
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

                {booking.extras.length > 0 && (
                  <div className="space-y-2 border-b border-border pb-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">Extras</p>
                      <p className="font-medium">{eur(booking.extrasTotal)}</p>
                    </div>
                    {booking.extras.map((extra) => (
                      <div key={extra.id} className="flex items-start justify-between gap-4 text-muted-foreground">
                        <div>
                          <p>{extra.name}</p>
                          <p className="text-xs">
                            {eur(extra.price)} {extra.perNight ? "pro Nacht" : "pro Aufenthalt"}
                          </p>
                        </div>
                        <p>{eur(extra.total)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 text-base font-semibold">
                  <p>Gesamtpreis</p>
                  <p className="text-primary">{eur(booking.totalPrice)}</p>
                </div>

                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  Zahlung bequem vor Ort bei Anreise — bar oder mit EC-/Kreditkarte.
                  Keine Vorauszahlung erforderlich.
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="rounded-md border bg-accent/40 p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Ihre Sonderwünsche</h3>
                <p className="text-sm text-muted-foreground italic">"{booking.notes}"</p>
              </div>
            )}

            <div className="rounded-md border bg-card p-4">
              <h3 className="mb-3 text-base font-semibold text-foreground">Hotelkontakt</h3>
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold text-foreground">Landhotel Schend</p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Hauptstraße 9, 54552 Immerath
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <a href="tel:+4965731306" className="hover:text-primary">+49 6573 306</a>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <a href="mailto:info@landhaus-schend.de" className="hover:text-primary">info@landhaus-schend.de</a>
                </p>
              </div>
            </div>

            <p className="font-medium text-foreground">Wir freuen uns auf Ihren Besuch! 🏔️</p>
            <p className="text-xs text-muted-foreground">
              Bei Änderungen oder Stornierung erreichen Sie uns telefonisch unter
              <a href="tel:+4965731306" className="font-medium text-foreground hover:text-primary"> +49 6573 306</a>.
            </p>
          </div>

          {/* Email Footer */}
          <div className="border-t bg-muted/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/schend-logo-black.svg"
                alt="Landhotel Schend Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/schend-logo-white.svg"
                alt="Landhotel Schend Logo"
                className="hidden h-8 w-auto dark:block"
              />
              <span className="font-display text-base text-primary">Landhotel Schend</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ihr Familienhotel in der Vulkaneifel · landhaus-schend.de
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp simulation */}
      <div className="rounded-lg border bg-card p-4 sm:p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-success" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">WhatsApp-Bestätigung ✓</div>
            <div className="text-xs text-muted-foreground">An {booking.guestPhone || "+49 …"} · vor wenigen Sekunden</div>
          </div>
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-success/10 border border-success/20 p-3 text-sm">
          <p className="font-semibold mb-1">Landhotel Schend</p>
          <p>
            Hallo {booking.guestName.split(" ")[0]}, Ihre Buchung <span className="font-mono font-semibold">{displayBookingNumber}</span> ist bestätigt.
            Check-in: {formatDate(booking.checkIn)} ab 15:00 Uhr. Wir freuen uns auf Sie! 🏔️
          </p>
          <p className="text-xs text-muted-foreground mt-2">— Landhotel Schend, Vulkaneifel</p>
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.print()}
            className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-7 border-primary/40"
          >
            <Printer className="h-4 w-4" strokeWidth={1.5} />
            Drucken / PDF
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-7"
          >
            <Link to="/">Zur Startseite</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
