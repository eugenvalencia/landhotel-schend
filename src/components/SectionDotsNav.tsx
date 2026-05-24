import { useEffect, useState } from "react";

// Vertikale Editorial-Navigation rechts am Bildschirmrand.
// Beobachtet Sections via IntersectionObserver, markiert aktiven Dot.
// Click → smooth scroll zur Section (Lenis fängt Anchor-Klicks automatisch ab).
// Auf Touch-Geräten ausgeblendet (kein hover, geringer Nutzen).

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

    // Erst zeigen, wenn Hero verlassen wurde — sonst stört's beim First-Impression
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver pro Section. Wer am meisten im Viewport ist, gewinnt.
    const visibleRatios = new Map<string, number>();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          visibleRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId = "top";
        let bestRatio = 0;
        for (const [id, ratio] of visibleRatios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActiveId(bestId);
      },
      { threshold: [0.15, 0.35, 0.55, 0.75] },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
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
