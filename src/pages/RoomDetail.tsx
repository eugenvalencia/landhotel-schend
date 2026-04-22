import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Hotel, ArrowLeft, BedDouble, Users, Wifi, Tv, Bath, Mountain,
  Snowflake, Coffee, Lock, Star, CalendarCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { eur } from "@/lib/format";

const ROOM_TYPE_PHOTO: Record<string, string> = {
  "Einzelzimmer": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
  "Doppelzimmer Standard": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200",
  "Doppelzimmer Komfort": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
  "Familienzimmer": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200",
  "Junior Suite": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
  "Suite": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
  "Eifel-Suite": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  "Einzelzimmer": "Gemütliches Einzelzimmer mit Blick auf die Vulkaneifel. Ideal für Geschäftsreisende und Solo-Urlauber. Inklusive Frühstücksoption und kostenlosem WLAN.",
  "Doppelzimmer Standard": "Komfortables Doppelzimmer mit Doppelbett, Balkon und Eifel-Blick. Liebevoll eingerichtet mit allem, was Sie für einen erholsamen Aufenthalt brauchen.",
  "Doppelzimmer Komfort": "Geräumiges Komfort-Zimmer mit zwei Einzelbetten und großzügiger Terrasse. Perfekt für Freunde oder Paare, die mehr Platz wünschen.",
  "Familienzimmer": "Großes Familienzimmer für bis zu 4 Personen, mit kindgerechter Ausstattung und viel Platz zum Wohlfühlen.",
  "Junior Suite": "Elegante Junior Suite mit Kingsize-Bett, Sitzecke und Premium-Ausstattung. Ein Hauch von Luxus inmitten der Vulkaneifel.",
  "Suite": "Unsere schönste Suite mit Wohnbereich, Panoramablick und edler Ausstattung – das Beste, was Landhotel Schend zu bieten hat.",
  "Eifel-Suite": "Unsere schönste Suite mit Wohnbereich, Panoramablick und edler Ausstattung – das Beste, was Landhotel Schend zu bieten hat.",
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

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setRoom(data as any));
  }, [id]);

  const gallery = useMemo(() => {
    if (!room) return [];
    const main = ROOM_TYPE_PHOTO[room.room_type] ?? room.photos?.[0];
    return [main, main, main, main];
  }, [room]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Lade Zimmer …
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90">
            <Hotel className="h-5 w-5" />
            <span className="font-semibold">Landhotel Schend</span>
          </Link>
          <Button asChild variant="secondary" size="sm">
            <Link to={`/booking?room=${room.id}`}>Jetzt buchen</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* GALLERY */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-elevated">
              <img src={gallery[activeIdx]} alt={room.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${
                    activeIdx === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Foto ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-1">{room.room_type}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{room.name}</h1>
              <div className="flex items-center gap-1 mt-2 text-secondary">
                {[1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                <Star className="h-4 w-4" />
                <span className="text-sm text-muted-foreground ml-2">Sehr gut bewertet</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">ab {eur(room.price_per_night)}</span>
              <span className="text-muted-foreground">/ Nacht</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {room.description || TYPE_DESCRIPTIONS[room.room_type] || ""}
            </p>

            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Ausstattung
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-secondary" /> {room.bed_description}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-secondary" /> max {room.max_persons} Personen</span>
                <span className="flex items-center gap-2"><Wifi className="h-4 w-4 text-secondary" /> Kostenloses WLAN</span>
                <span className="flex items-center gap-2"><Tv className="h-4 w-4 text-secondary" /> Flat-TV</span>
                <span className="flex items-center gap-2"><Bath className="h-4 w-4 text-secondary" /> Bad / Dusche</span>
                <span className="flex items-center gap-2"><Mountain className="h-4 w-4 text-secondary" /> Balkon / Terrasse</span>
                <span className="flex items-center gap-2"><Snowflake className="h-4 w-4 text-secondary" /> Klimaanlage</span>
                <span className="flex items-center gap-2"><Coffee className="h-4 w-4 text-secondary" /> Kaffeemaschine</span>
                <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-secondary" /> Safe</span>
              </div>
            </Card>

            <Button asChild size="lg" className="w-full text-base">
              <Link to={`/booking?room=${room.id}`}>
                <CalendarCheck className="h-5 w-5" /> Jetzt buchen
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
