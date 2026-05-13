import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Floating call-to-action bar at the bottom of the viewport on mobile.
 * Hidden on /booking and on desktop. Shows after the user has scrolled
 * past the hero so it doesn't fight with the cookie banner.
 */
export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/booking") || pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label="Schnellaktion Anruf und Buchung"
    >
      <div className="bg-background/95 backdrop-blur border-t shadow-elevated p-2 grid grid-cols-2 gap-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <Button asChild variant="outline" size="lg" className="h-12">
          <a href="tel:+4965731306" aria-label="Hotel anrufen unter +49 6573 306">
            <Phone className="h-4 w-4" />
            Anrufen
          </a>
        </Button>
        <Button asChild size="lg" className="h-12">
          <Link to="/booking" aria-label="Direkt online buchen">
            <CalendarCheck className="h-4 w-4" />
            Buchen
          </Link>
        </Button>
      </div>
    </div>
  );
}
