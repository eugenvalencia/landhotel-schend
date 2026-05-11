import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import EifelRegionSection from "@/components/EifelRegionSection";
import WeatherWidget from "@/components/WeatherWidget";
import AboutSection from "@/components/AboutSection";
import {
  SCHEND_HEROES, SCHEND_RESTAURANT, SCHEND_GALLERY, photoForRoomType,
} from "@/lib/photos";
import food0 from "@/assets/food-0.jpg";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import feiernImg from "@/assets/feiern.jpg";
import { PAKETE } from "@/lib/pakete";

const FOOD_PHOTOS = [food0, food1, food2, food3];
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const USPS = [
  { icon: ParkingCircle, key: "parking" },
  { icon: Bike, key: "moto" },
  { icon: Waves, key: "sauna" },
  { icon: UtensilsCrossed, key: "restaurant" },
  { icon: BedDouble, key: "rooms" },
  { icon: Wifi, key: "wifi" },
  { icon: Coffee, key: "breakfast" },
  { icon: Trophy, key: "rating" },
] as const;

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
  const { t } = useTranslation();

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
          <p className="uppercase tracking-[0.2em] text-sm opacity-90 mb-4">{t("hero.eyebrow")}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow">{t("hero.title")}</h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto mb-8">{t("hero.text")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/booking"><CalendarCheck className="h-5 w-5" /> {t("hero.bookDirect")}</Link>
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
            <div key={u.key} className="flex items-start gap-3">
              <u.icon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{t(`usps.${u.key}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("rooms.eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-bold">{t("rooms.title")}</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{t("rooms.intro")}</p>
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
                  <span className="text-sm font-semibold text-secondary">{t("rooms.from")} {eur(r.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{TYPE_DESCRIPTIONS[r.type] ?? ""}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/booking"><CalendarCheck className="h-5 w-5" /> {t("rooms.check")}</Link>
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
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("restaurant.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("restaurant.title")}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>{t("restaurant.p1")}</p>
              <p>{t("restaurant.p2")}</p>
              <p>{t("restaurant.p3")}</p>
              <p>{t("restaurant.p4")}</p>
            </div>
            <div className="mt-6 rounded-xl bg-accent/60 p-5">
              <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-3">{t("restaurant.hours")}</p>
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-[160px_1fr] gap-x-6">
                  <p className="font-semibold">{t("restaurant.monSat")}</p>
                  <p className="text-muted-foreground">17:30 – 20:00</p>
                </div>
                <div className="grid grid-cols-[160px_1fr] gap-x-6">
                  <p className="font-semibold">{t("restaurant.sun")}</p>
                  <div className="text-muted-foreground">
                    <p>12:00 – 14:00</p>
                    <p>17:30 – 20:00</p>
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

        {/* Familien- & Firmenfeiern */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-xl overflow-hidden shadow-elevated aspect-[4/3]">
            <img
              src={feiernImg}
              alt="Festlich gedeckter Saal im Landhotel Schend"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("feiern.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("feiern.title")}</h2>
            <p className="text-muted-foreground">{t("feiern.text")}</p>
          </div>
        </div>
      </section>

      {/* PAKETE */}
      <section id="pakete" className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("pakete.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold">{t("pakete.title")}</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{t("pakete.intro")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAKETE.map((p) => (
              <div key={p.slug} className="rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-elevated transition-shadow flex flex-col">
                <Link to={`/pakete/${p.slug}`} className="block aspect-[4/3] overflow-hidden group">
                  <img src={p.cover} alt={t(`paketDetails.${p.slug}.title`, p.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-5 flex-1 flex flex-col text-center">
                  <h3 className="font-semibold text-lg mb-4 flex-1">{t(`paketDetails.${p.slug}.title`, p.title)}</h3>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to={`/pakete/${p.slug}`}>{t("pakete.more")}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("gallery.eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-bold">{t("gallery.title")}</h2>
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

      {/* URLAUBSREGION EIFEL */}
      <div id="region">
        <EifelRegionSection />
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
