import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingConfirmationCard from "@/components/BookingConfirmationCard";
import { loadBookingConfirmation } from "@/lib/bookingConfirmation";

export default function Confirmation() {
  const booking = loadBookingConfirmation();

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <p className="eyebrow mb-5">Keine Daten vorhanden</p>
            <h1 className="font-display text-3xl md:text-4xl mb-5 text-balance">
              Keine Buchungsdaten gefunden
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-prose mx-auto">
              Bitte schließen Sie die Buchung erneut ab, damit die Bestätigungsseite angezeigt
              werden kann.
            </p>
            <Button
              asChild
              variant="outline"
              className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-8 border-primary/40"
            >
              <Link to="/booking">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Zurück zur Buchung
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background">
      <main className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <BookingConfirmationCard booking={booking} />
      </main>
    </div>
  );
}
