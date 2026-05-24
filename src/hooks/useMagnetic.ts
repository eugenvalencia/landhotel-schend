import { useCallback, useEffect, useRef } from "react";

/**
 * Magnetic-Hover Hook — Element driftet leicht in Richtung des Cursors wenn er in der Nähe ist.
 * Pure CSS-Transform, KEINE Animations-Library. Respektiert prefers-reduced-motion.
 *
 * @param strength Wie weit das Element folgt (0.1 = sehr subtil, 0.3 = deutlich). Default 0.18
 * @param maxPx   Max-Drift in Pixeln. Default 14
 *
 * Verwendung:
 *   const ref = useMagnetic();
 *   <button ref={ref} ...>...
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength = 0.18,
  maxPx = 14,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      const clampedX = Math.max(-maxPx, Math.min(maxPx, dx));
      const clampedY = Math.max(-maxPx, Math.min(maxPx, dy));
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(rafId);
      el.style.transition = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "translate3d(0,0,0)";
      setTimeout(() => {
        if (el) el.style.transition = "";
      }, 350);
    };
    const onEnter = () => {
      el.style.transition = "";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, [strength, maxPx]);

  return ref;
}

/**
 * Spotlight-Mouse-Hook — setzt --mx/--my CSS-Variablen auf Element.
 * Wirkt zusammen mit `.spotlight`-CSS-Klasse (siehe index.css).
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, []);

  return { ref, onMouseMove };
}

/**
 * Tilt-on-Hover-Handler — kombiniert Spotlight (--mx/--my) UND
 * 3D-Tilt (--tilt-x/--tilt-y). Funktioniert mit `.spotlight.tilt-card`-Klasse.
 * Max ±6° Drehung, ease-out beim mouseleave.
 *
 * Touch-Geräte und prefers-reduced-motion sind durch CSS-Media-Queries entkoppelt
 * (siehe .tilt-card-Regeln in index.css) — keine JS-Detection nötig, der
 * Listener läuft trotzdem aber ohne sichtbare Wirkung.
 */
export function handleSpotlightTilt(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const xPct = (e.clientX - r.left) / r.width;
  const yPct = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${xPct * 100}%`);
  el.style.setProperty("--my", `${yPct * 100}%`);
  // ±6° um Card-Mitte. Y-Maus oben → X-Achse positive Rotation (kippt nach hinten oben)
  el.style.setProperty("--tilt-x", `${(0.5 - yPct) * 6}deg`);
  el.style.setProperty("--tilt-y", `${(xPct - 0.5) * 6}deg`);
}

export function handleSpotlightTiltReset(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--tilt-x", "0deg");
  el.style.setProperty("--tilt-y", "0deg");
}

/**
 * Reveal-on-Scroll Hook — fügt `.visible` zur Klasse hinzu wenn Element ins
 * Viewport scrollt. Wirkt zusammen mit `.reveal`-CSS-Klasse.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  rootMargin = "0px 0px -10% 0px",
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return ref;
}
