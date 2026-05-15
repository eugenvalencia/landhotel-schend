import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Wind, Droplets, Thermometer, Sunrise, Sunset, Compass } from "lucide-react";

// Landhotel Schend, Immerath — Default-Position fuer Fallback
const HOTEL_LAT = 50.1303;
const HOTEL_LON = 6.9594;
const HOTEL_LABEL = "Immerath · Hotel";

interface WeatherData {
  current: {
    temperature: number;
    apparent: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    precipitation: number;
  };
  daily: Array<{
    date: string;
    weatherCode: number;
    tMax: number;
    tMin: number;
    rainMm: number;
    sunrise: string;
    sunset: string;
  }>;
}

interface Position {
  lat: number;
  lon: number;
  label: string;
  source: "gps" | "hotel";
}

const buildUrl = (lat: number, lon: number) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,relative_humidity_2m,precipitation` +
  `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
  `&timezone=Europe/Berlin&forecast_days=5`;

const codeLabel = (code: number): { icon: string; label: string; mood: string } => {
  if (code === 0) return { icon: "☀️", label: "Klar",                 mood: "Perfekt zum Wandern" };
  if (code <= 2)  return { icon: "🌤️", label: "Heiter",               mood: "Maartour ideal" };
  if (code === 3) return { icon: "⛅", label: "Bewölkt",              mood: "Outdoor möglich" };
  if (code <= 48) return { icon: "🌫️", label: "Nebel",                mood: "Atmosphärisch" };
  if (code <= 57) return { icon: "🌦️", label: "Niesel",               mood: "Regenjacke" };
  if (code <= 67) return { icon: "🌧️", label: "Regen",                mood: "Indoor-Empfehlung" };
  if (code <= 77) return { icon: "❄️", label: "Schnee",               mood: "Winterzauber" };
  if (code <= 82) return { icon: "🌧️", label: "Schauer",              mood: "Wechselhaft" };
  if (code <= 86) return { icon: "🌨️", label: "Schneeschauer",        mood: "Vorsicht Glätte" };
  return            { icon: "⛈️", label: "Gewitter",              mood: "Drinnen bleiben" };
};

const windDirToCompass = (deg: number): string => {
  const dirs = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

const dayLabel = (iso: string): string => {
  const d = new Date(iso + "T12:00:00");
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Heute";
  if (d.toDateString() === new Date(today.getTime() + 86400000).toDateString()) return "Morgen";
  return d.toLocaleDateString("de-DE", { weekday: "short" });
};

export default function DashboardWeatherWidget() {
  const [pos, setPos] = useState<Position | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Position bestimmen: Geolocation → Fallback Hotel
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setPos({ lat: HOTEL_LAT, lon: HOTEL_LON, label: HOTEL_LABEL, source: "hotel" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
          label: "Aktueller Standort",
          source: "gps",
        });
      },
      () => {
        setPos({ lat: HOTEL_LAT, lon: HOTEL_LON, label: HOTEL_LABEL, source: "hotel" });
      },
      { timeout: 4000, maximumAge: 30 * 60 * 1000 },
    );
  }, []);

  // 2. Wetter fuer aktuelle Position laden
  useEffect(() => {
    if (!pos) return;
    let active = true;
    setError(null);
    fetch(buildUrl(pos.lat, pos.lon))
      .then((r) => r.json())
      .then((raw) => {
        if (!active || !raw?.current || !raw?.daily) {
          setError("Keine Wetterdaten verfügbar");
          return;
        }
        const cur = raw.current;
        const dly = raw.daily;
        const daily: WeatherData["daily"] = dly.time.map((d: string, i: number) => ({
          date: d,
          weatherCode: Number(dly.weathercode[i] ?? 0),
          tMax: Number(dly.temperature_2m_max[i] ?? 0),
          tMin: Number(dly.temperature_2m_min[i] ?? 0),
          rainMm: Number(dly.precipitation_sum[i] ?? 0),
          sunrise: String(dly.sunrise[i] ?? ""),
          sunset: String(dly.sunset[i] ?? ""),
        }));
        setData({
          current: {
            temperature: Number(cur.temperature_2m ?? 0),
            apparent: Number(cur.apparent_temperature ?? 0),
            weatherCode: Number(cur.weathercode ?? 0),
            windSpeed: Number(cur.windspeed_10m ?? 0),
            windDirection: Number(cur.winddirection_10m ?? 0),
            humidity: Number(cur.relative_humidity_2m ?? 0),
            precipitation: Number(cur.precipitation ?? 0),
          },
          daily,
        });
      })
      .catch(() => {
        if (active) setError("Wetter-API nicht erreichbar");
      });
    return () => { active = false; };
  }, [pos]);

  const today = useMemo(() => (data ? codeLabel(data.current.weatherCode) : null), [data]);
  const sunriseHHMM = (iso: string) => iso.slice(11, 16);

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        {/* Header-Streifen mit Standort */}
        <div className="px-4 md:px-5 py-3 border-b bg-muted/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            <span className="font-medium">{pos?.label ?? "Position wird ermittelt …"}</span>
            {pos?.source === "gps" && (
              <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
                GPS
              </Badge>
            )}
            {pos?.source === "hotel" && (
              <Badge variant="outline" className="text-[9px]">Hotel-Standort</Badge>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Live · Open-Meteo
          </span>
        </div>

        {/* Aktuelles Wetter + 5-Tage-Vorschau */}
        {!data && !error && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
            Lade Wetter …
          </div>
        )}
        {error && (
          <div className="px-5 py-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        )}
        {data && today && (
          <div className="grid md:grid-cols-[1fr_2fr] gap-0">
            {/* Aktuell */}
            <div className="px-5 py-5 border-b md:border-b-0 md:border-r">
              <div className="flex items-start gap-4">
                <div className="text-5xl leading-none" aria-hidden>{today.icon}</div>
                <div>
                  <div className="text-3xl font-semibold tabular-nums leading-tight">
                    {Math.round(data.current.temperature)}°
                  </div>
                  <div className="text-xs text-muted-foreground">
                    gefühlt {Math.round(data.current.apparent)}°
                  </div>
                  <div className="text-sm font-medium mt-2">{today.label}</div>
                  <div className="text-xs text-secondary italic">{today.mood}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-4 text-[11px]">
                <Detail icon={Wind} label={`${Math.round(data.current.windSpeed)} km/h ${windDirToCompass(data.current.windDirection)}`} />
                <Detail icon={Droplets} label={`${Math.round(data.current.humidity)}% Luftf.`} />
                <Detail icon={Thermometer} label={`${data.current.precipitation.toFixed(1)} mm/h Niederschlag`} />
                <Detail icon={Compass} label={`${Math.round(data.current.windDirection)}°`} />
                <Detail icon={Sunrise} label={`SA ${sunriseHHMM(data.daily[0].sunrise)}`} />
                <Detail icon={Sunset}  label={`SU ${sunriseHHMM(data.daily[0].sunset)}`} />
              </div>
            </div>

            {/* 5-Tage-Vorschau */}
            <div className="px-3 md:px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Vorhersage · 5 Tage
              </p>
              <div className="grid grid-cols-5 gap-2">
                {data.daily.map((d) => {
                  const c = codeLabel(d.weatherCode);
                  return (
                    <div key={d.date} className="text-center rounded-md py-2 px-1 hover:bg-muted/40 transition-colors">
                      <div className="text-[11px] font-medium">{dayLabel(d.date)}</div>
                      <div className="text-2xl my-0.5" aria-hidden>{c.icon}</div>
                      <div className="text-[11px] tabular-nums">
                        <span className="font-medium">{Math.round(d.tMax)}°</span>
                        <span className="text-muted-foreground"> / {Math.round(d.tMin)}°</span>
                      </div>
                      {d.rainMm > 0.3 && (
                        <div className="text-[10px] text-sky-600 tabular-nums">
                          {d.rainMm.toFixed(1)} mm
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                Standort wird via Geolocation gelesen — wenn der Browser fragt &quot;Standort teilen?&quot;,
                bestätige für aktuelle Position. Bei Ablehnung wird das Hotel in Immerath verwendet.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Detail({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3 w-3 text-secondary shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}
