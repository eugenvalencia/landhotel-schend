import { useEffect, useState } from "react";
import { WeatherIcon, weatherMood } from "./WeatherIcons";

const HOTEL_LAT = 50.1303;
const HOTEL_LON = 6.9594;
const REFRESH_MS = 15 * 60 * 1000;

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${HOTEL_LAT}&longitude=${HOTEL_LON}` +
  `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relative_humidity_2m&timezone=Europe/Berlin`;

interface Weather {
  temp: number;
  apparent: number;
  code: number;
  wind: number;
  humidity: number;
}

/**
 * Editorial Wetter-Strip fuer den SiteHeader.
 * Schmal (Header-konform) + horizontal lang mit Detail-Infos.
 * Custom Hairline-SVG-Icons, currentColor — passt sich an Theme an.
 */
export default function HeaderWeather() {
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
            apparent: Number(data.current.apparent_temperature ?? 0),
            code: Number(data.current.weathercode ?? 0),
            wind: Number(data.current.windspeed_10m ?? 0),
            humidity: Number(data.current.relative_humidity_2m ?? 0),
          });
        })
        .catch(() => { /* still */ });
    };
    load();
    const i = window.setInterval(load, REFRESH_MS);
    return () => { active = false; window.clearInterval(i); };
  }, []);

  if (!w) return null;

  const mood = weatherMood(w.code);

  return (
    <div
      className="hidden md:flex items-center gap-2 lg:gap-2.5 text-foreground/85"
      aria-label={`Wetter in Immerath: ${Math.round(w.temp)} Grad, ${mood}, gefühlt ${Math.round(w.apparent)} Grad, Wind ${Math.round(w.wind)} km/h`}
    >
      <WeatherIcon code={w.code} className="h-4 w-4 text-secondary shrink-0" />
      <span className="tabular-nums font-medium text-sm leading-none">
        {Math.round(w.temp)}°
      </span>
      <span className="block h-3 w-px bg-border" aria-hidden />
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground leading-none">
        {mood}
      </span>
      <span className="block h-3 w-px bg-border hidden xl:block" aria-hidden />
      <span className="hidden xl:inline text-[10px] tabular-nums text-muted-foreground leading-none">
        gefühlt {Math.round(w.apparent)}° · {Math.round(w.wind)} km/h
      </span>
    </div>
  );
}
