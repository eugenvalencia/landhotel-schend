import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Persistent booking CTA.
 * - Mobile: full-width bottom bar with Call + Book.
 * - Desktop: floating side button at right edge, ~58% from top
 *   (slightly below center), editorial slate pill.
 * Both appear after the hero is mostly scrolled past, and are hidden
 * on booking / dashboard / login routes.
 */
export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > Math.max(window.innerHeight - 120, 320));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (
    pathname.startsWith("/booking") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login")
  ) {
    return null;
  }

  return (
    <>
      {/* Mobile — full-width bottom bar */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300",
          show ? "translate-y-0" : "translate-y-full",
        )}
        role="region"
        aria-label="Schnellaktion Anruf und Buchung"
      >
        <div className="bg-background/95 backdrop-blur border-t shadow-elevated p-2 grid grid-cols-2 gap-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          <Button asChild variant="outline" size="lg" className="h-14 rounded-sm text-base">
            <a href="tel:+4965731306" aria-label="Hotel anrufen unter +49 6573 306">
              <Phone className="h-5 w-5" />
              Anrufen
            </a>
          </Button>
          <Button asChild size="lg" className="h-14 rounded-sm text-base">
            <Link to="/booking" aria-label="Direkt online buchen">
              <CalendarCheck className="h-5 w-5" />
              Buchen
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop — floating Editorial-Pill, rechts etwas unter der Mitte.
          Style: Stamp-Look mit Hairline-Border + Backdrop-Blur, "stempelt" sich beim Hover. */}
      <div
        className={cn(
          "hidden md:block fixed right-6 lg:right-8 z-40 transition-all duration-700 ease-out",
          show
            ? "opacity-100 translate-x-0 rotate-0"
            : "opacity-0 translate-x-10 -rotate-3 pointer-events-none",
        )}
        style={{ top: "58%" }}
        aria-hidden={!show}
      >
        <Link
          to="/booking"
          aria-label="Direkt buchen — provisionsfrei"
          className="group relative flex flex-col items-center justify-center gap-1.5 px-4 py-5 min-w-[64px] bg-card/95 backdrop-blur-md border-2 border-foreground/15 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:border-secondary hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:rotate-[-2deg] transition-all duration-300"
        >
          {/* Inner Hairline-Frame für Stempel-Optik */}
          <span aria-hidden className="absolute inset-1.5 border border-foreground/10 rounded-sm pointer-events-none transition-colors group-hover:border-secondary/30" />
          <CalendarCheck
            className="h-5 w-5 text-foreground group-hover:text-secondary transition-colors"
            strokeWidth={1.6}
          />
          <span className="[writing-mode:vertical-rl] [transform:rotate(180deg)] text-[10px] font-medium tracking-[0.32em] uppercase text-foreground group-hover:text-secondary transition-colors leading-none py-1">
            Direkt buchen
          </span>
          {/* Schmaler Goldakzent als visueller Anker */}
          <span aria-hidden className="block h-px w-6 bg-secondary/50 group-hover:bg-secondary transition-colors" />
        </Link>
      </div>
    </>
  );
}
