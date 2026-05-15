import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Wind, Droplets, Thermometer, Sunrise, Sunset, Compass, Navigation, Mountain, Footprints, Bike, Coffee, Waves, Castle, Flower2, Cloud } from "lucide-react";

// Landhotel Schend, Immerath — Default-Position
const HOTEL_LAT = 50.1303;
const HOTEL_LON = 6.9594;
const HOTEL_LABEL = "Immerath · Hotel";

// Auto-Refresh alle 15 Minuten
const REFRESH_MS = 15 * 60 * 1000;

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

interface WeatherCardProps {
  /** "hotel" (Default Immerath) oder "gps" (Browser-Standort, Fallback Hotel) */
  defaultMode?: "hotel" | "gps";
  /** Zeigt den GPS-Toggle-Button (sinnvoll auf der oeffentlichen Site) */
  allowGpsToggle?: boolean;
  /** Eigene Ueberschrift; null = keine Ueberschrift */
  title?: string | null;
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

interface ActivityTip {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

/**
 * Vulkaneifel-spezifische Aktivitaets-Tipps abhaengig vom Wetter-Code.
 * Bewusst hyperlokal — Maare, Eifelsteig, Manderscheid, Bad Bertrich.
 */
const activityTipsForCode = (code: number): { headline: string; tips: ActivityTip[] } => {
  // Klar / Heiter (0-2) — Top Outdoor
  if (code <= 2) return {
    headline: "Heute perfekt für",
    tips: [
      { icon: Footprints, label: "Maartour Schalkenmehren (3 Maare, 8 km)" },
      { icon: Mountain,   label: "Aussichtsplattform Steineberger Ley" },
      { icon: Bike,       label: "Maare-Mosel-Radweg" },
      { icon: Coffee,     label: "Maarcafé Terrasse" },
    ],
  };
  // Bewoelkt (3) — Outdoor moeglich
  if (code === 3) return {
    headline: "Heute gut für",
    tips: [
      { icon: Footprints, label: "Eifelsteig Etappe 14" },
      { icon: Waves,      label: "Spaziergang Immerather Maar" },
      { icon: Mountain,   label: "Wildpark Daun" },
      { icon: Coffee,     label: "Café Schneider Daun" },
    ],
  };
  // Nebel (45-48) — Atmosphaerisch
  if (code <= 48) return {
    headline: "Heute atmosphärisch",
    tips: [
      { icon: Cloud,      label: "Nebelwanderung um's Maar" },
      { icon: Castle,     label: "Burg Manderscheid mystisch" },
      { icon: Coffee,     label: "Heißer Kaffee am Kamin" },
    ],
  };
  // Niesel / Regen / Schauer / Schnee / Gewitter — Indoor & Wellness
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return {
    headline: "Heute gemütlich",
    tips: [
      { icon: Castle,  label: "Maarmuseum Manderscheid" },
      { icon: Mountain, label: "Vulkanhaus Strohn" },
      { icon: Flower2, label: "Wellness Vulkaneifel-Therme Bad Bertrich" },
      { icon: Coffee,  label: "Kaminzimmer im Haus" },
    ],
  };
  // Schnee (71-86)
  return {
    headline: "Heute winterlich",
    tips: [
      { icon: Footprints, label: "Schneewanderung Maarrunde" },
      { icon: Castle,     label: "Burg Manderscheid im Schnee" },
      { icon: Flower2,    label: "Wellness Bad Bertrich" },
      { icon: Coffee,     label: "Heiße Schokolade am Kamin" },
    ],
  };
};

const dayLabel = (iso: string): string => {
  const d = new Date(iso + "T12:00:00");
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Heute";
  if (d.toDateString() === new Date(today.getTime() + 86400000).toDateString()) return "Morgen";
  return d.toLocaleDateString("de-DE", { weekday: "short" });
};

export default function WeatherCard({
  defaultMode = "hotel",
  allowGpsToggle = false,
  title = null,
}: WeatherCardProps) {
  const [pos, setPos] = useState<Position | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const requestGps = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setPos({ lat: HOTEL_LAT, lon: HOTEL_LON, label: HOTEL_LABEL, source: "hotel" });
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
          label: "Mein Standort",
          source: "gps",
        });
        setGpsLoading(false);
      },
      () => {
        setPos({ lat: HOTEL_LAT, lon: HOTEL_LON, label: HOTEL_LABEL, source: "hotel" });
        setGpsLoading(false);
      },
      { timeout: 4000, maximumAge: 30 * 60 * 1000 },
    );
  }, []);

  const setHotel = useCallback(() => {
    setPos({ lat: HOTEL_LAT, lon: HOTEL_LON, label: HOTEL_LABEL, source: "hotel" });
  }, []);

  // Initial-Position
  useEffect(() => {
    if (defaultMode === "gps") requestGps();
    else setHotel();
  }, [defaultMode, requestGps, setHotel]);

  // Wetter laden + 15-Min-Refresh
  useEffect(() => {
    if (!pos) return;
    let active = true;
    setError(null);

    const load = () => {
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
    };

    load();
    const interval = window.setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [pos]);

  const today = useMemo(() => (data ? codeLabel(data.current.weatherCode) : null), [data]);
  const activities = useMemo(() => (data ? activityTipsForCode(data.current.weatherCode) : null), [data]);
  const sunriseHHMM = (iso: string) => iso.slice(11, 16);
  const isHotelLocation = pos?.source === "hotel";

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-4 md:px-5 py-3 border-b bg-muted/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
            <span className="font-medium truncate">
              {title ?? pos?.label ?? "Position wird ermittelt …"}
            </span>
            {pos?.source === "gps" && (
              <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shrink-0">
                GPS
              </Badge>
            )}
            {pos?.source === "hotel" && !title && (
              <Badge variant="outline" className="text-[9px] shrink-0">Hotel-Standort</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {allowGpsToggle && (
              <Button
                onClick={pos?.source === "gps" ? setHotel : requestGps}
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] gap-1.5"
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Navigation className="h-3 w-3" />
                )}
                {pos?.source === "gps" ? "Eifel-Wetter zeigen" : "Mein Wetter vergleichen"}
              </Button>
            )}
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hidden sm:inline">
              Live · Open-Meteo
            </span>
          </div>
        </div>

        {/* Body */}
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

            {/* 5-Tage */}
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
                Aktualisiert alle 15 Minuten · Datenquelle Open-Meteo
              </p>
            </div>
          </div>
        )}

        {/* Wetter-basierte Vulkaneifel-Tipps — nur wenn Hotel-Standort */}
        {data && activities && isHotelLocation && (
          <div className="border-t bg-muted/20 px-4 md:px-5 py-3.5">
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {activities.headline}
              </p>
              <span className="text-[10px] italic text-secondary">
                hyperlokale Tipps aus der Vulkaneifel
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {activities.tips.map((tip) => (
                <span
                  key={tip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] md:text-xs text-foreground/85 hover:border-secondary/60 hover:text-foreground transition-colors"
                >
                  <tip.icon className="h-3 w-3 md:h-3.5 md:w-3.5 text-secondary shrink-0" />
                  <span>{tip.label}</span>
                </span>
              ))}
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
