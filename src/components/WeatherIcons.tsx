/**
 * Hairline-SVG-Wetter-Icons im Schend-Stil.
 * currentColor stroke, kein fill — passen sich an text-color an, ohne Emoji-Look.
 */

interface IconProps {
  className?: string;
}

const sw = 1.4; // strokeWidth, einheitlich fuer alle Icons

const Sun = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
  </svg>
);

const SunCloud = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="8" cy="9" r="3" />
    <path d="M8 3v1.5M3 9h1.5M4.2 5.2l1 1M11.8 5.2l-1 1" />
    <path d="M9 17.5h8.5a3 3 0 0 0 .2-5.99 4.5 4.5 0 0 0-8.7-.51A3 3 0 0 0 9 17.5z" />
  </svg>
);

const Clouds = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M6 16h9a3 3 0 0 0 .2-5.99 4.5 4.5 0 0 0-8.7-.51A3 3 0 0 0 6 16z" />
    <path d="M14 8.5a4 4 0 0 1 4.8.3 3 3 0 0 1 .2 5.7" />
  </svg>
);

const Fog = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M4 9h16M3 13h14M6 17h12M4 21h12" />
  </svg>
);

const Drizzle = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M6 13h9a3 3 0 0 0 .2-5.99 4.5 4.5 0 0 0-8.7-.51A3 3 0 0 0 6 13z" />
    <path d="M9 17v1M12 16v2M15 17v1" />
  </svg>
);

const Rain = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M6 13h9a3 3 0 0 0 .2-5.99 4.5 4.5 0 0 0-8.7-.51A3 3 0 0 0 6 13z" />
    <path d="M8 16l-1 3M12 16l-1 3M16 16l-1 3" />
  </svg>
);

const Snow = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 4v16M5 8l14 8M19 8l-14 8" />
    <path d="M9 5l3 1 3-1M9 19l3-1 3 1M3 9l1 3-1 3M21 9l-1 3 1 3" />
  </svg>
);

const Storm = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M6 13h9a3 3 0 0 0 .2-5.99 4.5 4.5 0 0 0-8.7-.51A3 3 0 0 0 6 13z" />
    <path d="M11 14l-2 4h3l-1.5 3 3-4h-3l1.5-3z" />
  </svg>
);

export function WeatherIcon({ code, className }: { code: number; className?: string }) {
  if (code === 0) return <Sun className={className} />;
  if (code <= 2)  return <SunCloud className={className} />;
  if (code === 3) return <Clouds className={className} />;
  if (code <= 48) return <Fog className={className} />;
  if (code <= 57) return <Drizzle className={className} />;
  if (code <= 67) return <Rain className={className} />;
  if (code <= 77) return <Snow className={className} />;
  if (code <= 82) return <Rain className={className} />;
  if (code <= 86) return <Snow className={className} />;
  return <Storm className={className} />;
}

export function weatherMood(code: number): string {
  if (code === 0) return "Klar";
  if (code <= 2)  return "Heiter";
  if (code === 3) return "Bewölkt";
  if (code <= 48) return "Neblig";
  if (code <= 57) return "Niesel";
  if (code <= 67) return "Regen";
  if (code <= 77) return "Schnee";
  if (code <= 82) return "Schauer";
  if (code <= 86) return "Schneeschauer";
  return "Gewitter";
}
