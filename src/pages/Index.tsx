import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  ParkingCircle, Bike, Waves, UtensilsCrossed, BedDouble, Wifi, Coffee, Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import ReviewsSection from "@/components/ReviewsSection";
import LocationSection from "@/components/LocationSection";
import EifelRegionSection from "@/components/EifelRegionSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import FeatureIcon from "@/components/FeatureIcon";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";
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
  { icon: ParkingCircle, key: "parking", variant: "primary" as const },
  { icon: Bike, key: "moto", variant: "ocean" as const },
  { icon: Waves, key: "sauna", variant: "ocean" as const },
  { icon: UtensilsCrossed, key: "restaurant", variant: "sunset" as const },
  { icon: BedDouble, key: "rooms", variant: "primary" as const },
  { icon: Wifi, key: "wifi", variant: "ocean" as const },
  { icon: Coffee, key: "breakfast", variant: "sunset" as const },
  { icon: Trophy, key: "rating", variant: "secondary" as const },
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

  useSEO({
    title: "3-Sterne-Superior Hotel in der Vulkaneifel",
    description:
      "Familiengeführtes Landhotel in Immerath mit 21 Zimmern, Sauna & Wellness, Eifeler Restaurant. Direkt buchen — provisionsfrei. Top-Lage für Wanderer, Motorradfahrer und Familien in der Vulkaneifel.",
    canonical: "/",
  });

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
        for (const r of data) {
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

      <main id="main">
      {/* HERO — editorial: photo + typography only */}
      <section
        id="top"
        className="relative h-[100vh] min-h-[640px] max-h-[1100px] overflow-hidden"
      >
        {SCHEND_HEROES.map((src, i) => (
          <HotelImage
            key={src}
            src={src}
            alt="Landhotel Schend in der Vulkaneifel"
            loading={i === 0 ? "eager" : "lazy"}
            decoding={i === 0 ? "sync" : "async"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-out",
              i === heroIdx ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Soft editorial overlay — tokenized */}
        <div className="absolute inset-0 gradient-hero" />
        {/* Bottom vignette for legibility of CTA */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Eyebrow with hairlines */}
          <div className="flex items-center gap-4 mb-10 md:mb-14 animate-fade-up">
            <span className="block h-px w-12 md:w-20 bg-white/55" />
            <span className="text-[11px] md:text-xs font-medium tracking-[0.24em] uppercase text-white/85">
              Anno 1856 · Vulkaneifel
            </span>
            <span className="block h-px w-12 md:w-20 bg-white/55" />
          </div>

          {/* Display headline — Fraunces, balanced */}
          <h1
            className="font-display text-balance text-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] mb-7 md:mb-9 max-w-4xl animate-fade-up"
            style={{ animationDelay: "0.15s", textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
          >
            {t("hero.title")}
          </h1>

          {/* Italic subhead */}
          <p
            className="font-display-italic text-balance text-white/92 text-lg md:text-2xl max-w-2xl leading-snug mb-12 md:mb-14 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {t("hero.text")}
          </p>

          {/* Single primary CTA + phone link */}
          <div
            className="flex flex-col items-center gap-5 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            <Link
              to="/booking"
              className="group inline-flex items-center gap-3 px-9 py-3.5 bg-white text-primary text-xs font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 shadow-sm"
            >
              <CalendarCheck className="h-4 w-4" />
              {t("hero.bookDirect")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="tel:+4965731306"
              className="text-white/75 text-sm tracking-wide hover:text-white transition-colors"
            >
              oder anrufen <span className="font-medium ml-1">+49 6573 306</span>
            </a>
          </div>
        </div>

        {/* Subtle scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/55">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <span className="block h-10 w-px bg-white/45" />
        </div>
      </section>

      {/* USPs */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-7">
          {USPS.map((u) => (
            <div
              key={u.key}
              className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition-all duration-300 hover:bg-muted/40"
            >
              <FeatureIcon icon={u.icon} variant={u.variant} size="sm" />
              <span className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                {t(`usps.${u.key}`)}
              </span>
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
                loading="lazy"
                decoding="async"
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
              loading="lazy"
              decoding="async"
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
                  <img src={p.cover} alt={t(`paketDetails.${p.slug}.title`, p.title)} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

      {/* URLAUBSREGION EIFEL */}
      <div id="region">
        <EifelRegionSection />
      </div>

      {/* ABOUT */}
      <AboutSection />

      {/* REVIEWS */}
      <div id="reviews">
        <ReviewsSection />
      </div>

      {/* FAQ — wichtig für GEO/AI-Empfehlungen */}
      <FAQSection />

      {/* LOCATION / MAP */}
      <div id="location">
        <LocationSection />
      </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
