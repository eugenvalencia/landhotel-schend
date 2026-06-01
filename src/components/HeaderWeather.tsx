import { WeatherIcon, weatherMood } from "./WeatherIcons";
import { useWeather } from "@/hooks/useWeather";

// Landhotel Schend, Immerath — identische Koordinaten wie WeatherCard, damit
// sich beide denselben React-Query-Cache-Eintrag teilen (1 Request statt 2).
const HOTEL_LAT = 50.1303;
const HOTEL_LON = 6.9594;

/**
 * Editorial Wetter-Strip fuer den SiteHeader.
 * Schmal (Header-konform) + horizontal lang mit Detail-Infos.
 * Custom Hairline-SVG-Icons, currentColor — passt sich an Theme an.
 */
export default function HeaderWeather() {
  const { data } = useWeather(HOTEL_LAT, HOTEL_LON);
  const cur = data?.current;
  if (!cur) return null;

  const temp = Number(cur.temperature_2m ?? 0);
  const apparent = Number(cur.apparent_temperature ?? 0);
  const code = Number(cur.weathercode ?? 0);
  const wind = Number(cur.windspeed_10m ?? 0);
  const mood = weatherMood(code);

  return (
    <div
      className="hidden md:flex items-center gap-2 lg:gap-2.5 text-foreground/85"
      aria-label={`Wetter in Immerath: ${Math.round(temp)} Grad, ${mood}, gefühlt ${Math.round(apparent)} Grad, Wind ${Math.round(wind)} km/h`}
    >
      <WeatherIcon code={code} className="h-4 w-4 text-secondary shrink-0" />
      <span className="tabular-nums font-medium text-sm leading-none">
        {Math.round(temp)}°
      </span>
      <span className="block h-3 w-px bg-border" aria-hidden />
      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground leading-none">
        {mood}
      </span>
      <span className="block h-3 w-px bg-border hidden xl:block" aria-hidden />
      <span className="hidden xl:inline text-[10px] tabular-nums text-muted-foreground leading-none">
        gefühlt {Math.round(apparent)}° · {Math.round(wind)} km/h
      </span>
    </div>
  );
}
