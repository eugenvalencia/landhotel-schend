import { Link } from "react-router-dom";
import { Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BookingConfirmationCard from "@/components/BookingConfirmationCard";
import { loadBookingConfirmation } from "@/lib/bookingConfirmation";

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

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <BookingConfirmationCard booking={booking} />
      </main>
    </div>
  );
}
