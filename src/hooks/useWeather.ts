import { useQuery } from "@tanstack/react-query";

// Aktualisierung alle 15 Minuten (gilt für alle Wetter-Komponenten).
export const WEATHER_REFRESH_MS = 15 * 60 * 1000;

export interface OpenMeteoResponse {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    weathercode: number;
    windspeed_10m: number;
    winddirection_10m: number;
    relative_humidity_2m: number;
    precipitation: number;
  };
  daily?: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
  };
}

const buildUrl = (lat: number, lon: number) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,relative_humidity_2m,precipitation` +
  `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
  `&timezone=Europe/Berlin&forecast_days=5`;

/**
 * Eine geteilte Open-Meteo-Abfrage für alle Wetter-Komponenten (HeaderWeather,
 * WeatherCard, …). Gleiche (lat, lon) ⇒ gleicher queryKey ⇒ React Query
 * dedupliziert + cached, statt dass jede Komponente einzeln fetcht. Die volle
 * Antwort (current + daily) deckt alle Verbraucher ab; schmale Komponenten
 * nutzen nur `current`.
 *
 * `enabled: false` solange keine Position feststeht (z. B. GPS-Ermittlung läuft).
 */
export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async ({ signal }): Promise<OpenMeteoResponse> => {
      const res = await fetch(buildUrl(lat as number, lon as number), { signal });
      if (!res.ok) throw new Error("Wetter-API nicht erreichbar");
      return res.json();
    },
    enabled: lat != null && lon != null,
    staleTime: WEATHER_REFRESH_MS,
    refetchInterval: WEATHER_REFRESH_MS,
    gcTime: WEATHER_REFRESH_MS * 2,
    retry: 1,
  });
}
