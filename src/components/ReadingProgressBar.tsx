import { useEffect, useState } from "react";

// 2px Brass-Linie ganz oben, wandert mit Scroll-Position.
// Wird nicht auf Booking/Dashboard/Operator gerendert — siehe Aufruf-Stelle.
// prefers-reduced-motion: weiterhin sichtbar (es ist Information, keine Deko),
// aber ohne transition-Animation auf die Width-Änderung.
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;
    const tick = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, pct)));
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

  // Nicht rendern wenn fast nichts zu scrollen ist (kurze Pages)
  if (progress < 0.5 && typeof window !== "undefined" && document.documentElement.scrollHeight <= window.innerHeight + 100) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full bg-secondary origin-left"
        style={{
          transform: `scaleX(${progress / 100})`,
          transition: "transform 80ms linear",
          boxShadow: progress > 1 ? "0 0 6px hsl(var(--secondary) / 0.5)" : "none",
        }}
      />
    </div>
  );
}
