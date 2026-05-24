import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  // Wenn true, startet beim Mount statt beim Scroll-in. Für above-the-fold-Pills.
  startOnMount?: boolean;
  // Optionaler Mount-Delay in ms (für stage-by-stage Reveal)
  delay?: number;
}

export default function CountUp({
  to,
  duration = 1200,
  decimals = 0,
  className,
  prefix,
  suffix,
  startOnMount,
  delay = 0,
}: CountUpProps) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(to);
      startedRef.current = true;
      return;
    }

    const startAnim = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(to * eased);
        if (t < 1) requestAnimationFrame(animate);
        else setVal(to);
      };
      requestAnimationFrame(animate);
    };

    if (startOnMount) {
      const timer = window.setTimeout(startAnim, delay);
      return () => window.clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          if (delay > 0) window.setTimeout(startAnim, delay);
          else startAnim();
          obs.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, startOnMount, delay]);

  const formatted = decimals === 0
    ? Math.round(val).toString()
    : val.toFixed(decimals).replace(".", ",");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
