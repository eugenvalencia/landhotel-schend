import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, BedDouble, Users, Wifi, Tv, Bath, Mountain,
  Snowflake, Coffee, Lock, CalendarCheck, Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { eur } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import { galleryForRoomType } from "@/lib/photos";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const TYPE_DESCRIPTIONS: Record<string, string> = {
  "Einzelzimmer":
    "Gemütliches Einzelzimmer mit Blick auf die Vulkaneifel. Ideal für Geschäftsreisende und Solo-Urlauber. Inklusive Frühstücksbuffet und kostenlosem WLAN.",
  "Doppelzimmer Standard":
    "Komfortables Doppelzimmer mit Doppelbett, Balkon und Eifel-Blick. Liebevoll eingerichtet mit allem, was Sie für einen erholsamen Aufenthalt brauchen.",
  "Doppelzimmer Komfort":
    "Geräumiges Komfort-Zimmer mit zwei Einzelbetten und großzügiger Terrasse. Perfekt für Freunde oder Paare, die mehr Platz wünschen.",
  "Familienzimmer":
    "Großes Familienzimmer für bis zu 4 Personen, mit kindgerechter Ausstattung und viel Platz zum Wohlfühlen.",
  "Junior Suite":
    "Elegante Junior Suite mit Kingsize-Bett, Sitzecke und Premium-Ausstattung. Ein Hauch von Luxus inmitten der Vulkaneifel.",
  "Suite":
    "Unsere schönste Suite mit Wohnbereich, Panoramablick und edler Ausstattung – das Beste, was Landhotel Schend zu bieten hat.",
  "Eifel-Suite":
    "Unsere schönste Suite mit Wohnbereich, Panoramablick und edler Ausstattung – das Beste, was Landhotel Schend zu bieten hat.",
};

type Room = {
  id: string;
  room_number: number;
  name: string;
  room_type: string;
  bed_description: string;
  max_persons: number;
  price_per_night: number;
  amenities: string[];
  photos: string[];
  description: string | null;
};

const AMENITY_ICONS = [
  { icon: Wifi, label: "Kostenloses WLAN" },
  { icon: Tv, label: "Flat-TV" },
  { icon: Bath, label: "Bad / Dusche" },
  { icon: Mountain, label: "Balkon / Terrasse" },
  { icon: Snowflake, label: "Klimaanlage" },
  { icon: Coffee, label: "Kaffeemaschine" },
  { icon: Lock, label: "Safe" },
];

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    if (!id) { setStatus("notfound"); return; }
    let active = true;
    setStatus("loading");
    setActiveIdx(0); // Galerie-Index bei Zimmerwechsel zuruecksetzen (sonst stale -> undefined)
    supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          if (error) console.warn("[RoomDetail] load failed", error);
          setRoom(null);
          setStatus("notfound");
          return;
        }
        setRoom(data as Room);
        setStatus("ready");
      });
    return () => {
      active = false;
    };
  }, [id]);

  const gallery = useMemo(() => {
    if (!room) return [];
    // Aus dem Server-Pool ziehen wir 4 verschiedene Sichtrichtungen pro Zimmer-Typ.
    // Wenn das DB-Foto-Feld eigene URLs hat, kommen die zuerst.
    // DB-Spalte ist jsonb — kann {} (Default) statt [] sein, deshalb defensiv pruefen
    const fromDb = Array.isArray(room.photos) ? room.photos.filter(Boolean) : [];
    if (fromDb.length >= 2) return fromDb.slice(0, 6);
    return galleryForRoomType(room.room_type);
  }, [room]);

  if (status !== "ready" || !room) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">
          {status === "notfound" ? (
            <>
              <p className="eyebrow mb-4">Nicht gefunden</p>
              <p className="font-display text-2xl mb-8">Dieses Zimmer gibt es nicht (mehr).</p>
              <Button asChild variant="outline" className="rounded-sm uppercase tracking-[0.18em] text-xs">
                <Link to="/#rooms">Zu allen Zimmern</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="eyebrow mb-4">Einen Moment</p>
              <p className="font-display text-2xl">Zimmer wird geladen …</p>
            </>
          )}
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-20 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Zurück
        </button>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-md overflow-hidden shadow-elevated">
              <HotelImage
                src={gallery[activeIdx] ?? gallery[0]}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out hover:scale-[1.03]"
              />
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${Math.min(gallery.length, 6)}, minmax(0, 1fr))` }}
            >
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={cn(
                    "aspect-[4/3] rounded-sm overflow-hidden border transition-all duration-300",
                    activeIdx === i
                      ? "border-secondary shadow-card"
                      : "border-transparent opacity-65 hover:opacity-100",
                  )}
                >
                  <HotelImage src={src} alt={`${room.name} – Ansicht ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="eyebrow">{room.room_type}</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-6 leading-[1.05] text-balance">
              {room.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-3xl md:text-4xl text-primary">
                ab {eur(room.price_per_night)}
              </span>
              <span className="text-sm text-muted-foreground">pro Nacht</span>
            </div>

            <p className="text-foreground/85 leading-relaxed max-w-prose mb-10">
              {room.description || TYPE_DESCRIPTIONS[room.room_type] || ""}
            </p>

            {/* Ausstattung — Hairline-Grid */}
            <div className="mb-10">
              <p className="eyebrow mb-5">Ausstattung</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <span className="flex items-center gap-3 text-foreground/85">
                  <BedDouble className="h-4 w-4 text-secondary shrink-0" strokeWidth={1.5} />
                  {room.bed_description}
                </span>
                <span className="flex items-center gap-3 text-foreground/85">
                  <Users className="h-4 w-4 text-secondary shrink-0" strokeWidth={1.5} />
                  Max. {room.max_persons} Personen
                </span>
                {AMENITY_ICONS.map((a) => (
                  <span key={a.label} className="flex items-center gap-3 text-foreground/85">
                    <a.icon className="h-4 w-4 text-secondary shrink-0" strokeWidth={1.5} />
                    {a.label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button
                asChild
                size="lg"
                className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-8"
              >
                <Link to={`/booking?room=${room.id}`}>
                  <CalendarCheck className="h-4 w-4" strokeWidth={1.5} />
                  Jetzt buchen
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-8 border-primary/40"
              >
                <a href="tel:+4965731306">
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
                  +49 6573 306
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
