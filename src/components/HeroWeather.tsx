import { useEffect, useState } from "react";

// Landhotel Schend, Immerath
const HOTEL_LAT = 50.1303;
const HOTEL_LON = 6.9594;
const REFRESH_MS = 15 * 60 * 1000;

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${HOTEL_LAT}&longitude=${HOTEL_LON}` +
  `&current=temperature_2m,weathercode&timezone=Europe/Berlin`;

const codeIcon = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 2)  return "🌤️";
  if (code === 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 86) return "🌨️";
  return "⛈️";
};

const codeMood = (code: number): string => {
  if (code === 0) return "Klar";
  if (code <= 2)  return "Heiter";
  if (code === 3) return "Bewölkt";
  if (code <= 48) return "Neblig";
  if (code <= 57) return "Niesel";
  if (code <= 67) return "Regen";
  if (code <= 77) return "Schnee";
  if (code <= 86) return "Schauer";
  return "Gewitter";
};

interface Weather { temp: number; code: number }

/**
 * Editorial Hero-Wetter — dezente Pille rechts oben.
 * Bewusst minimal: keine Card-Box, nur hairlines wie der Eyebrow.
 */
export default function HeroWeather() {
  const [w, setW] = useState<Weather | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      fetch(WEATHER_URL)
        .then((r) => r.json())
        .then((data) => {
          if (!active || !data?.current) return;
          setW({
            temp: Number(data.current.temperature_2m ?? 0),
            code: Number(data.current.weathercode ?? 0),
          });
        })
        .catch(() => { /* still */ });
    };
    load();
    const i = window.setInterval(load, REFRESH_MS);
    return () => { active = false; window.clearInterval(i); };
  }, []);

  if (!w) return null;

  return (
    <div
      className="absolute top-20 right-6 md:top-24 md:right-10 z-10 flex items-center gap-2.5 md:gap-3 animate-fade-up text-white/95"
      style={{ animationDelay: "0.6s", textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
      aria-label={`Aktuelles Wetter in Immerath: ${Math.round(w.temp)} Grad, ${codeMood(w.code)}`}
    >
      <span className="text-base md:text-lg leading-none" aria-hidden>{codeIcon(w.code)}</span>
      <span className="block h-px w-5 md:w-7 bg-white/60" aria-hidden />
      <span className="tabular-nums font-medium text-sm md:text-base leading-none">
        {Math.round(w.temp)}°
      </span>
      <span className="hidden sm:inline text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-white/85 leading-none">
        {codeMood(w.code)} · Immerath
      </span>
    </div>
  );
}
