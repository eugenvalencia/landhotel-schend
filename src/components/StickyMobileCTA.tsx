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
          <Button asChild variant="outline" size="lg" className="h-12 rounded-sm">
            <a href="tel:+4965731306" aria-label="Hotel anrufen unter +49 6573 306">
              <Phone className="h-4 w-4" />
              Anrufen
            </a>
          </Button>
          <Button asChild size="lg" className="h-12 rounded-sm">
            <Link to="/booking" aria-label="Direkt online buchen">
              <CalendarCheck className="h-4 w-4" />
              Buchen
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop — floating editorial pill, rechts etwas unter der Mitte */}
      <div
        className={cn(
          "hidden md:block fixed right-6 lg:right-8 z-40 transition-all duration-500 ease-out",
          show
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none",
        )}
        style={{ top: "58%" }}
        aria-hidden={!show}
      >
        <Link
          to="/booking"
          aria-label="Direkt buchen — provisionsfrei"
          className="group flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-sm shadow-elevated hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
        >
          <CalendarCheck className="h-4 w-4 shrink-0" strokeWidth={1.6} />
          <span className="text-[11px] font-medium tracking-[0.22em] uppercase whitespace-nowrap">
            Direkt buchen
          </span>
          <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </>
  );
}
