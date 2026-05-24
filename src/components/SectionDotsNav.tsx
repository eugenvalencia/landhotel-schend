import { useEffect, useState } from "react";

// Vertikale Editorial-Navigation rechts am Bildschirmrand.
// Aktive Section wird über die Viewport-Mitte bestimmt (nicht IntersectionRatio,
// weil hohe Sektionen wie Pakete/Restaurant nie 75% Ratio erreichen können —
// sie sind höher als das Viewport).
// Click → smooth scroll zur Section (Lenis fängt Anchor-Klicks automatisch ab).

interface SectionEntry {
  id: string;
  label: string;
}

const SECTIONS: SectionEntry[] = [
  { id: "top", label: "Start" },
  { id: "rooms", label: "Zimmer" },
  { id: "restaurant", label: "Restaurant" },
  { id: "pakete", label: "Pakete" },
  { id: "reviews", label: "Bewertungen" },
  { id: "location", label: "Anfahrt" },
];

export default function SectionDotsNav() {
  const [activeId, setActiveId] = useState<string>("top");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;

    const tick = () => {
      // Anchor-Punkt: 40% des Viewports von oben.
      // Höher als Mitte, damit die Section "early" als aktiv markiert wird —
      // fühlt sich natürlicher an beim Scroll.
      const anchorY = window.scrollY + window.innerHeight * 0.4;

      // Welche Section enthält den Anchor-Punkt?
      let bestId = "top";
      let bestStart = -Infinity;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const start = rect.top + window.scrollY;
        const end = start + rect.height;
        // Section enthält Anchor — und hat den höchsten Start (also die unterste passende)
        if (anchorY >= start && anchorY < end && start > bestStart) {
          bestStart = start;
          bestId = id;
        }
      }
      setActiveId(bestId);

      // Sichtbarkeit erst nach 60% Hero-Scroll
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <nav
      aria-label="Abschnitts-Navigation"
      className={`hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
            className="group relative grid place-items-center w-5 h-5"
          >
            <span
              className={`block rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? "w-3 h-3 bg-secondary scale-100 shadow-[0_0_8px_hsl(var(--secondary)/0.4)]"
                  : "w-1.5 h-1.5 bg-foreground/40 group-hover:bg-secondary/80 group-hover:scale-110"
              }`}
            />
            <span
              className="absolute right-full mr-3 px-2.5 py-1 rounded-sm bg-foreground/95 text-background text-[10px] uppercase tracking-[0.18em] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 pointer-events-none"
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
