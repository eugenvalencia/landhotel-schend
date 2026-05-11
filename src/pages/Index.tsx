import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Hotel, CalendarCheck, Phone, Star,
  ParkingCircle, Bike, Waves, UtensilsCrossed, BedDouble, Wifi, Coffee, Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import ReviewsSection from "@/components/ReviewsSection";
import LocationSection from "@/components/LocationSection";
import WeatherWidget from "@/components/WeatherWidget";
import AboutSection from "@/components/AboutSection";
import {
  SCHEND_HEROES, SCHEND_RESTAURANT, SCHEND_GALLERY, photoForRoomType,
} from "@/lib/photos";
import food0 from "@/assets/food-0.jpg";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";

const FOOD_PHOTOS = [food0, food1, food2, food3];
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const USPS = [
  { icon: ParkingCircle, text: "Kostenlose Parkplätze — videoüberwacht" },
  { icon: Bike, text: "Genügend Motorrad-Parkplätze — videoüberwacht" },
  { icon: Waves, text: "Sauna & Wellness" },
  { icon: UtensilsCrossed, text: "Hauseigenes Restaurant" },
  { icon: BedDouble, text: "21 Zimmer mit Balkon/Terrasse" },
  { icon: Wifi, text: "Kostenloses WLAN" },
  { icon: Coffee, text: "Großes Frühstücksbuffet" },
  { icon: Trophy, text: "Booking.com 8.5 · Tripadvisor #1" },
];

const TYPE_DESCRIPTIONS: Record<string, string> = {
  "Einzelzimmer": "Gemütliches Einzelzimmer mit Blick auf die Vulkaneifel",
  "Doppelzimmer Standard": "Komfortables Doppelzimmer mit Doppelbett und Balkon",
  "Doppelzimmer Komfort": "Geräumiges Zimmer mit zwei Einzelbetten und Terrasse",
  "Familienzimmer": "Großes Familienzimmer für bis zu 4 Personen",
  "Junior Suite": "Elegante Junior Suite mit Kingsize-Bett",
  "Suite": "Unsere schönste Suite mit Wohnbereich und Panoramablick",
  "Eifel-Suite": "Unsere schönste Suite mit Wohnbereich und Panoramablick",
};

type RoomCategory = { id: string; name: string; type: string; price: number };

const Index = () => {
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % SCHEND_HEROES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    supabase
      .from("rooms")
      .select("id, name, room_type, price_per_night")
      .eq("status", "aktiv")
      .order("price_per_night")
      .then(({ data }) => {
        if (!data) return;
        const seen = new Set<string>();
        const cats: RoomCategory[] = [];
        for (const r of data as any[]) {
          if (seen.has(r.room_type)) continue;
          seen.add(r.room_type);
          cats.push({ id: r.id, name: r.room_type, type: r.room_type, price: Number(r.price_per_night) });
        }
        setCategories(cats);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section id="top" className="relative min-h-[80vh] pt-16 md:pt-20 flex items-center text-primary-foreground overflow-hidden">
        {SCHEND_HEROES.map((src, i) => (
          <HotelImage
            key={src}
            src={src}
            alt="Landhotel Schend in der Vulkaneifel"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === heroIdx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <p className="uppercase tracking-[0.2em] text-sm opacity-90 mb-4">Ihr Urlaubsdomizil in der Vulkaneifel</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow">Willkommen im Landhotel Schend</h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto mb-8">
            Erholen Sie sich in der wunderschönen Vulkaneifel — mit Sauna, Wellness, hauseigenem Restaurant und 21 komfortablen Zimmern.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/booking"><CalendarCheck className="h-5 w-5" /> Jetzt direkt buchen</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-white/10 text-primary-foreground border-white/40 hover:bg-white/20 hover:text-primary-foreground">
              <a href="tel:+4965731306"><Phone className="h-5 w-5" /> +49 6573 306</a>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10 sm:right-auto sm:left-6 sm:bottom-6">
          <div className="max-w-xs">
            <WeatherWidget />
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
          {USPS.map((u) => (
            <div key={u.text} className="flex items-start gap-3">
              <u.icon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{u.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Unsere Zimmer</p>
          <h2 className="text-3xl md:text-4xl font-bold">Zu Gast im Landhotel Schend</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            21 individuell gestaltete Zimmer und Suiten — alle mit Balkon oder Terrasse und Blick in die Vulkaneifel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((r) => (
            <Link
              key={r.id}
              to={`/rooms/${r.id}`}
              className="group rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <HotelImage
                  src={photoForRoomType(r.type)}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{r.name}</h3>
                  <span className="text-sm font-semibold text-secondary">ab {eur(r.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{TYPE_DESCRIPTIONS[r.type] ?? ""}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/booking"><CalendarCheck className="h-5 w-5" /> Verfügbarkeit prüfen</Link>
          </Button>
        </div>
      </section>

      {/* RESTAURANT */}
      <section id="restaurant" className="bg-muted">
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-xl overflow-hidden shadow-elevated order-last md:order-first aspect-[4/3]">
            <HotelImage src={SCHEND_RESTAURANT} alt="Landhaus Restaurant & Terrasse" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Kulinarik</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Landhaus Restaurant & Terrasse</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Für den großen Hunger ist unser besonders gemütliches Restaurant genau die richtige Wahl. Dort werden Ihnen Eifeler und Internationale Spezialitäten in stilvoller Atmosphäre serviert. Wir verwöhnen Sie mit Produkten der Eifeler Landküche und frisch gezapftem Bitburger Bier. Eine separate Karte für Kinder und eine Kinderspielecke bieten auch Familien ein attraktives Angebot. Hunde sind lediglich in der Dorfgaststätte erlaubt.
              </p>
              <p>Gruppen und Veranstaltungen gerne auf Anfrage auch zum Frühstück, Kaffee und Mittag.</p>
              <p>
                Wir verwenden ausschließlich qualitativ hochwertige frische Zutaten. Ausgewählte Delikatessen und saisonale Spezialitäten unserer Speisekarte lassen selbst Gäste mit verwöhnten Gaumen ein Lob an unseren Küchenchef aussprechen.
              </p>
              <p>
                Neben vielfältigen Gerichten bieten wir Ihnen eine umfangreiche Getränkekarte und eine große Auswahl an erlesenen Weinen.
              </p>
            </div>
            <div className="mt-6 rounded-xl bg-accent/60 p-5">
              <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-3">Öffnungszeiten</p>
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-[140px_1fr] gap-x-6">
                  <p className="font-semibold">Montag – Samstag</p>
                  <p className="text-muted-foreground">17:30 – 20:00 Uhr</p>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-6">
                  <p className="font-semibold">Sonntag</p>
                  <div className="text-muted-foreground">
                    <p>12:00 – 14:00 Uhr</p>
                    <p>17:30 – 20:00 Uhr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Endlose Foto-Schleife */}
        <div className="mt-12 overflow-hidden">
          <div className="flex w-max animate-marquee gap-4">
            {[...FOOD_PHOTOS, ...FOOD_PHOTOS].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Gericht aus dem Landhaus Restaurant"
                className="h-48 md:h-64 w-auto rounded-xl object-cover shadow-card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Galerie</p>
          <h2 className="text-3xl md:text-4xl font-bold">Eindrücke aus der Vulkaneifel</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {SCHEND_GALLERY.map((src) => (
            <div key={src} className="aspect-[4/3] rounded-xl overflow-hidden shadow-card">
              <HotelImage src={src} alt="Landhotel Schend Eindruck" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <AboutSection />

      {/* REVIEWS */}
      <div id="reviews">
        <ReviewsSection />
      </div>

      {/* LOCATION / MAP */}
      <div id="location">
        <LocationSection />
      </div>

      <SiteFooter />
    </div>
  );
};

export default Index;
