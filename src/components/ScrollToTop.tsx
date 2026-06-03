import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "@/hooks/useLenisScroll";

/**
 * Setzt bei jedem Routenwechsel den Scroll an den Seitenanfang. Ohne das behaelt
 * Lenis (Smooth-Scroll) den Offset der vorigen Seite — die neue Route oeffnet dann
 * mittendrin oder unten statt oben, was unprofessionell wirkt.
 *
 * Anchor-Deeplinks (#rooms, #restaurant …) werden NICHT ueberschrieben: dort soll
 * die Seite gezielt an der Sektion oeffnen (Lenis/SiteHeader uebernehmen das).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return; // Deep-Link auf eine Sektion respektieren

    const lenis = getLenis();
    if (lenis) {
      // immediate+force: sofort, auch wenn Lenis gerade gestoppt ist
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    // Belt & Suspenders: nativer Reset (reduced-motion / Lenis noch nicht bereit)
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
