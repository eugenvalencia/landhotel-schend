import { useEffect, useRef, useState } from "react";

interface HairlineDividerProps {
  // Variante: "gold" (Brass-Akzent) oder "ink" (Hairline-Grau). Default: gold.
  variant?: "gold" | "ink";
  // Optionaler align für Editorial-Layouts. Default "center".
  align?: "left" | "center" | "right";
  // Optionale className für extra spacing (z.B. "mb-8")
  className?: string;
}

// Editorial-Hairline die beim Scroll-in von ihrer Origin-Seite nach außen "ausrollt".
// Reduzierte Bewegung: erscheint sofort in finaler Breite ohne Animation.
export default function HairlineDivider({
  variant = "gold",
  align = "center",
  className = "",
}: HairlineDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const color = variant === "gold" ? "bg-secondary/70" : "bg-border";
  const origin =
    align === "left" ? "origin-left mr-auto" : align === "right" ? "origin-right ml-auto" : "origin-center mx-auto";
  const width = align === "center" ? "w-24 md:w-40" : "w-32 md:w-56";

  return (
    <div ref={ref} className={`flex ${className}`}>
      <span
        aria-hidden
        className={`h-px ${color} ${origin} ${width} transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          shown ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </div>
  );
}
