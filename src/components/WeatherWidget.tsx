import { useEffect, useMemo, useState } from "react";
import { Wind } from "lucide-react";

type WeatherState = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
};

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=50.1303&longitude=6.9594&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe/Berlin";

const weatherContent = (weatherCode: number) => {
  if (weatherCode <= 1) return { icon: "☀️", message: "Perfektes Wanderwetter" };
  if (weatherCode <= 3) return { icon: "⛅", message: "Angenehme Temperaturen" };
  if (weatherCode >= 45 && weatherCode <= 48) return { icon: "🌫️", message: "Mystische Eifelstimmung" };
  if (weatherCode >= 51 && weatherCode <= 67) return { icon: "🌧️", message: "Gemütlich im Hotel bleiben" };
  if (weatherCode >= 71 && weatherCode <= 77) return { icon: "❄️", message: "Winterzauber in der Eifel" };
  if (weatherCode >= 95 && weatherCode <= 99) return { icon: "⛈️", message: "Perfekt für Sauna & Wellness" };
  return { icon: "⛅", message: "Aktuelles Wetter in Immerath" };
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      fetch(WEATHER_URL)
        .then((response) => response.json())
        .then((data) => {
          if (!active || !data?.current) return;
          setWeather({
            temperature: Number(data.current.temperature_2m ?? 0),
            weatherCode: Number(data.current.weathercode ?? 0),
            windSpeed: Number(data.current.windspeed_10m ?? 0),
          });
        })
        .catch(() => {
          if (active) setWeather(null);
        });
    };

    load();
    const interval = window.setInterval(load, 2 * 60 * 60 * 1000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const content = useMemo(
    () => weatherContent(weather?.weatherCode ?? 2),
    [weather?.weatherCode],
  );

  return (
    <div className="rounded-lg border border-border/70 bg-background/85 p-3 text-primary shadow-card backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="text-2xl leading-none" aria-hidden>
          {content.icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">Immerath aktuell</p>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span>{weather ? `${Math.round(weather.temperature)}°C` : "—°C"}</span>
            <span className="flex items-center gap-1 text-primary/80">
              <Wind className="h-3.5 w-3.5" />
              {weather ? `${Math.round(weather.windSpeed)} km/h` : "— km/h"}
            </span>
          </div>
          <p className="text-xs text-primary/80">{content.message}</p>
        </div>
      </div>
    </div>
  );
}