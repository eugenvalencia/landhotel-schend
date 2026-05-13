import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  ParkingCircle, Bike, ChefHat, UtensilsCrossed, BedDouble, Wifi, Coffee, Trophy,
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
  { icon: ChefHat, key: "halfboard", variant: "sunset" as const },
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
      "Familiengeführtes Landhotel in Immerath mit 21 Zimmern, hauseigener Eifeler Landküche und Halbpension auf Wunsch. Direkt buchen — provisionsfrei. Ideal für Kurzurlaub, Wandern und Motorradfahren in der Vulkaneifel.",
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

        {/* Cinematic editorial overlay — three layers ensure legibility on ANY photo */}
        <div aria-hidden className="absolute inset-0 bg-black/25" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Eyebrow with hairlines */}
          <div className="flex items-center gap-4 mb-10 md:mb-14 animate-fade-up">
            <span className="block h-px w-12 md:w-20 bg-white/65" />
            <span
              className="text-[11px] md:text-xs font-medium tracking-[0.24em] uppercase text-white/90"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              Anno 1856 · Vulkaneifel
            </span>
            <span className="block h-px w-12 md:w-20 bg-white/65" />
          </div>

          {/* Display headline — Fraunces, balanced */}
          <h1
            className="font-display text-balance text-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] mb-7 md:mb-9 max-w-4xl animate-fade-up"
            style={{
              animationDelay: "0.15s",
              textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {t("hero.title")}
          </h1>

          {/* Italic subhead */}
          <p
            className="font-display-italic text-balance text-white/95 text-lg md:text-2xl max-w-2xl leading-snug mb-12 md:mb-14 animate-fade-up"
            style={{
              animationDelay: "0.3s",
              textShadow: "0 1px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
            }}
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
              className="group inline-flex items-center gap-3 px-9 py-3.5 bg-white text-zinc-900 text-xs font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 shadow-sm"
            >
              <CalendarCheck className="h-4 w-4" />
              {t("hero.bookDirect")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="tel:+4965731306"
              className="text-white/85 text-sm tracking-wide hover:text-white transition-colors"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
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

      {/* USPs — editorial Hairline-Grid statt Boxen */}
      <section aria-label={t("usps.eyebrow", "Im Haus inbegriffen")} className="bg-background border-y border-border/70">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50">
            {USPS.map((u) => (
              <div
                key={u.key}
                className="group flex items-center gap-3 px-5 py-7 bg-background hover:bg-muted/40 transition-colors"
              >
                <u.icon
                  className="h-5 w-5 text-secondary shrink-0 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <span className="text-[13px] font-medium leading-snug">
                  {t(`usps.${u.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS — editorial cards, kein Schatten, Hairline statt Border */}
      <section id="rooms" className="bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14 md:mb-20">
            <p className="eyebrow">{t("rooms.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 text-balance">
              {t("rooms.title")}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-prose mx-auto leading-relaxed text-pretty">
              {t("rooms.intro")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-10 md:gap-y-14">
            {categories.map((r) => (
              <Link key={r.id} to={`/rooms/${r.id}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden mb-5 bg-muted rounded-md shadow-card group-hover:shadow-elevated transition-shadow duration-500">
                  <HotelImage
                    src={photoForRoomType(r.type)}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3 className="font-display text-xl md:text-2xl group-hover:text-secondary transition-colors">
                    {r.name}
                  </h3>
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-secondary whitespace-nowrap">
                    {t("rooms.from")} {eur(r.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {TYPE_DESCRIPTIONS[r.type] ?? ""}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16 md:mt-20">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-sm uppercase tracking-[0.2em] text-xs px-9 py-6 border-primary/40"
            >
              <Link to="/booking">
                <CalendarCheck className="h-4 w-4" />
                {t("rooms.check")}
                <span className="ml-1">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* RESTAURANT — asymmetrischer Magazin-Spread */}
      <section id="restaurant" className="bg-gradient-to-b from-muted/40 via-muted/20 to-muted/40">
        <div className="grid lg:grid-cols-12 items-stretch">
          {/* Bild bricht aus dem Container aus */}
          <div className="lg:col-span-7 lg:order-last">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[640px] overflow-hidden shadow-card">
              <HotelImage
                src={SCHEND_RESTAURANT}
                alt="Landhaus Restaurant & Terrasse"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 px-6 md:px-12 lg:px-16 py-16 md:py-24 flex flex-col justify-center">
            <p className="eyebrow">{t("restaurant.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-8 text-balance leading-[1.05]">
              {t("restaurant.title")}
            </h2>
            <div className="space-y-5 text-foreground/85 leading-relaxed max-w-prose">
              <p className="drop-cap">{t("restaurant.p1")}</p>
              <p>{t("restaurant.p2")}</p>
              <p>{t("restaurant.p3")}</p>
              <p>{t("restaurant.p4")}</p>
            </div>

            <div className="mt-12">
              <div className="hairline mb-5" />
              <p className="eyebrow mb-4">{t("restaurant.hours")}</p>
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-[140px_1fr] gap-x-6">
                  <span className="font-medium">{t("restaurant.monSat")}</span>
                  <span className="text-muted-foreground">17:30 – 20:00</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-6">
                  <span className="font-medium">{t("restaurant.sun")}</span>
                  <div className="text-muted-foreground">
                    <p>12:00 – 14:00</p>
                    <p>17:30 – 20:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Food-Marquee — Hairline-Top/Bottom, mit weicher Rundung */}
        <div className="overflow-hidden border-y border-border/60 py-6 bg-background">
          <div className="flex w-max animate-marquee gap-4">
            {[...FOOD_PHOTOS, ...FOOD_PHOTOS].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Gericht aus dem Landhaus Restaurant"
                loading="lazy"
                decoding="async"
                className="h-44 md:h-56 w-auto object-cover rounded-md shadow-card"
              />
            ))}
          </div>
        </div>

        {/* Feiern — zweiter Spread, gespiegelt */}
        <div className="grid lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px] overflow-hidden shadow-card">
              <img
                src={feiernImg}
                alt="Festlich gedeckter Saal im Landhotel Schend"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5 px-6 md:px-12 lg:px-16 py-16 md:py-24 flex flex-col justify-center">
            <p className="eyebrow">{t("feiern.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-8 text-balance leading-[1.05]">
              {t("feiern.title")}
            </h2>
            <p className="text-foreground/85 leading-relaxed max-w-prose">{t("feiern.text")}</p>
          </div>
        </div>
      </section>

      {/* PAKETE — editorial cards, Hairline + Display-Title */}
      <section id="pakete" className="bg-gradient-to-b from-muted/30 via-background to-muted/15">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14 md:mb-20">
            <p className="eyebrow">{t("pakete.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 text-balance">
              {t("pakete.title")}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-prose mx-auto leading-relaxed text-pretty">
              {t("pakete.intro")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-10 md:gap-y-14">
            {PAKETE.map((p) => (
              <Link key={p.slug} to={`/pakete/${p.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden mb-5 bg-muted rounded-md shadow-card group-hover:shadow-elevated transition-shadow duration-500">
                  <img
                    src={p.cover}
                    alt={t(`paketDetails.${p.slug}.title`, p.title)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="font-display text-xl md:text-2xl mb-3 group-hover:text-secondary transition-colors text-balance">
                  {t(`paketDetails.${p.slug}.title`, p.title)}
                </h3>
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-secondary inline-flex items-center gap-2 transition-all group-hover:gap-3">
                  {t("pakete.more")}
                  <span>→</span>
                </span>
              </Link>
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
