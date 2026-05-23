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
import { useMagnetic, useSpotlight, useReveal } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";
import {
  SCHEND_HEROES, SCHEND_RESTAURANT, SCHEND_RESTAURANT_GALLERY, galleryForRoomType,
} from "@/lib/photos";
import food0 from "@/assets/food-0.jpg";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import feiernImg from "@/assets/feiern.jpg";
import { PAKETE } from "@/lib/pakete";

// Mische Speisen (lokale Assets) mit Restaurant-Stimmungen (Server)
// damit das Marquee abwechslungsreich wirkt
const FOOD_PHOTOS = [
  food0,
  SCHEND_RESTAURANT_GALLERY[1],
  food1,
  SCHEND_RESTAURANT_GALLERY[2],
  food2,
  SCHEND_RESTAURANT_GALLERY[3],
  food3,
  SCHEND_RESTAURANT_GALLERY[4],
];
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
  const magneticPrimary = useMagnetic<HTMLAnchorElement>(0.18, 12);
  const magneticSecondary = useMagnetic<HTMLAnchorElement>(0.15, 10);

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
    let active = true;
    supabase
      .from("rooms")
      .select("id, name, room_type, price_per_night")
      .eq("status", "aktiv")
      .order("price_per_night")
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        const seen = new Set<string>();
        const cats: RoomCategory[] = [];
        for (const r of data) {
          if (seen.has(r.room_type)) continue;
          seen.add(r.room_type);
          cats.push({ id: r.id, name: r.room_type, type: r.room_type, price: Number(r.price_per_night) });
        }
        setCategories(cats);
      });
    return () => {
      active = false;
    };
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
              // Ken-Burns: subtiler Zoom über 14s, jedes Bild alterniert in/out für Variation.
              i % 2 === 0 ? "ken-burns-in" : "ken-burns-out",
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
              Anno 1856{" "}
              <Link
                to="/login"
                aria-label="·"
                style={{ color: "inherit", textDecoration: "none", cursor: "text" }}
              >
                ·
              </Link>{" "}
              Vulkaneifel
            </span>
            <span className="block h-px w-12 md:w-20 bg-white/65" />
          </div>

          {/* Display headline — Fraunces, balanced. Mobile bewusst kleiner für 60+ Lesbarkeit. */}
          <h1
            className="font-display text-balance text-white text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] mb-7 md:mb-9 max-w-4xl animate-fade-up"
            style={{
              animationDelay: "0.15s",
              textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {t("hero.title")}
          </h1>

          {/* Italic subhead */}
          <p
            className="font-display-italic text-balance text-white/95 text-lg md:text-2xl max-w-2xl leading-snug mb-9 md:mb-11 animate-fade-up"
            style={{
              animationDelay: "0.3s",
              textShadow: "0 1px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {t("hero.text")}
          </p>

          {/* Trust-Pills — subtle proof line, white-on-overlay */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mb-10 md:mb-12 animate-fade-up text-white/80"
            style={{
              animationDelay: "0.4s",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            <span className="text-[11px] md:text-xs tracking-[0.15em] uppercase font-medium">
              <span className="text-secondary">★</span> Tripadvisor #1
            </span>
            <span className="text-white/40" aria-hidden>·</span>
            <span className="text-[11px] md:text-xs tracking-[0.15em] uppercase font-medium">
              8,5 / 10 Booking
            </span>
            <span className="text-white/40" aria-hidden>·</span>
            <span className="text-[11px] md:text-xs tracking-[0.15em] uppercase font-medium">
              165 Jahre Familie
            </span>
            <span className="text-white/40 hidden sm:inline" aria-hidden>·</span>
            <span className="hidden sm:inline text-[11px] md:text-xs tracking-[0.15em] uppercase font-medium">
              21 Zimmer mit Balkon
            </span>
          </div>

          {/* Primary + Secondary CTA + phone link */}
          <div
            className="flex flex-col items-center gap-5 animate-fade-up"
            style={{ animationDelay: "0.55s" }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                ref={magneticPrimary}
                to="/booking"
                className="glow-border group inline-flex items-center justify-center gap-3 px-9 py-4 min-h-[56px] bg-white text-zinc-900 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 shadow-sm"
              >
                <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                {t("hero.bookDirect")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                ref={magneticSecondary}
                href="#restaurant"
                className="group inline-flex items-center justify-center gap-3 px-9 py-4 min-h-[56px] border border-white/60 text-white text-xs sm:text-sm font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-white/10 hover:border-white transition-all duration-300"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                Im Restaurant essen
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
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
            {categories.map((r, idx) => {
              // Pro Karte ein anderes Foto: jede Zimmer-Card zeigt eine andere Sichtrichtung
              // aus der Galerie ihres Typs (Index rotiert über die Karten-Reihenfolge).
              const gallery = galleryForRoomType(r.type);
              const cardPhoto = gallery[idx % gallery.length] ?? gallery[0];
              return (
              <Link key={r.id} to={`/rooms/${r.id}`} className="group block">
                <div
                  className="spotlight aspect-[3/4] sm:aspect-[4/5] overflow-hidden mb-5 rounded-md shadow-card group-hover:shadow-elevated transition-shadow duration-500"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                  }}
                >
                  <HotelImage
                    src={cardPhoto}
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
              );
            })}
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

      {/* RESTAURANT — asymmetrischer Magazin-Spread + Tagesgäste-Hook */}
      <section id="restaurant" className="bg-gradient-to-b from-muted/40 via-muted/20 to-muted/40">
        {/* Tagesgäste-Banner — Einheimische und Vorbeireisende ansprechen */}
        <div className="bg-secondary/8 border-b border-border/60">
          <div className="container mx-auto px-4 py-4 md:py-5">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-foreground">
                <UtensilsCrossed className="h-4 w-4 text-secondary shrink-0" strokeWidth={1.75} />
                Auch ohne Übernachtung — Tagesgäste herzlich willkommen
              </span>
              <a
                href="tel:+4965731306"
                className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors underline underline-offset-4 decoration-secondary/40 hover:decoration-foreground"
              >
                Tisch reservieren: +49 6573 306 →
              </a>
            </div>
          </div>
        </div>

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
          <div className="flex w-max animate-marquee">
            {Array.from({ length: 4 }).flatMap((_, copy) =>
              FOOD_PHOTOS.map((src, i) => (
                <img
                  key={`${copy}-${i}`}
                  src={src}
                  alt="Gericht aus dem Landhaus Restaurant"
                  loading="lazy"
                  decoding="async"
                  className="h-44 md:h-56 w-auto object-cover rounded-md shadow-card mr-4"
                />
              )),
            )}
          </div>
        </div>

        {/* Specials der Woche — drei Stempel-Karten für Aktionen */}
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="text-center mb-10 md:mb-12">
            <p className="eyebrow">Im Restaurant</p>
            <h3 className="font-display text-2xl md:text-3xl mt-3 text-balance">
              Was Sie diese Saison erwartet
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 max-w-5xl mx-auto">
            <div className="bg-background p-6 md:p-8 flex flex-col">
              <p className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-secondary mb-3 font-medium">
                Wochen-Hit
              </p>
              <h4 className="font-display text-xl md:text-2xl mb-3 leading-tight">
                Hamburgertag
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Ein Mal pro Woche unser Eifeler Burger mit Heim­pommes — Treffpunkt
                für Einheimische und Hotelgäste.
              </p>
              <div className="hairline mt-6 mb-3" />
              <p className="text-xs text-muted-foreground">
                Tag und Uhrzeit erfragen — wir freuen uns über Reservierung.
              </p>
            </div>
            <div className="bg-background p-6 md:p-8 flex flex-col">
              <p className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-secondary mb-3 font-medium">
                Eifeler Klassiker
              </p>
              <h4 className="font-display text-xl md:text-2xl mb-3 leading-tight">
                Halbpension nach Eifeler Art
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                3-Gang-Menü mit regionalen Zutaten — wildgerichte im Herbst,
                Spargel im Frühjahr, eigene Forellen wenn die Bäche zulassen.
              </p>
              <div className="hairline mt-6 mb-3" />
              <p className="text-xs text-muted-foreground">
                +23 €/Person/Tag — zur Übernachtung zubuchbar.
              </p>
            </div>
            <div className="bg-background p-6 md:p-8 flex flex-col">
              <p className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-secondary mb-3 font-medium">
                Für Gruppen
              </p>
              <h4 className="font-display text-xl md:text-2xl mb-3 leading-tight">
                Festtafel & Feiern
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Hochzeiten, runde Geburtstage, Firmenessen — der Festsaal fasst
                bis 80 Gäste, eingerichtet wie aus Großmutters Zeit.
              </p>
              <div className="hairline mt-6 mb-3" />
              <p className="text-xs text-muted-foreground">
                Auf Anfrage, gerne mit individuellem Menü.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <a
              href="tel:+4965731306"
              className="inline-flex items-center gap-3 px-7 py-3.5 min-h-[52px] bg-primary text-primary-foreground rounded-sm text-xs sm:text-sm font-medium tracking-[0.2em] uppercase hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              Reservieren · +49 6573 306
            </a>
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
                <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden mb-5 rounded-md shadow-card group-hover:shadow-elevated transition-shadow duration-500">
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
