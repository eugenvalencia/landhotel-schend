import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, UtensilsCrossed, ArrowLeft, Mail, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { HotelImage } from "@/components/HotelImage";
import JsonLd from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";
import { SCHEND_RESTAURANT, SCHEND_RESTAURANT_GALLERY } from "@/lib/photos";
import food0 from "@/assets/food-0.jpg";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";

const FOOD_PHOTOS = [
  food0, SCHEND_RESTAURANT_GALLERY[1], food1, SCHEND_RESTAURANT_GALLERY[2],
  food2, SCHEND_RESTAURANT_GALLERY[3], food3, SCHEND_RESTAURANT_GALLERY[4],
];

// Restaurant-Schema (zusätzlich zum Hotel-Schema im Index)
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://landhaus-schend.de/restaurant#restaurant",
  name: "Landhaus Restaurant & Terrasse",
  alternateName: "Restaurant Landhaus Schend",
  url: "https://landhaus-schend.de/restaurant",
  description:
    "Hauseigenes Eifeler Restaurant des Landhotels Schend in Immerath/Vulkaneifel. Regional-typische Küche, auch für Tagesgäste offen. Halbpension, Festtafel für Hochzeiten und Familienfeiern bis 70 Personen.",
  telephone: "+49-6573-306",
  email: "info@landhaus-schend.de",
  servesCuisine: ["Eifeler Landküche", "Deutsch", "Regional"],
  acceptsReservations: "True",
  priceRange: "€€",
  image: SCHEND_RESTAURANT,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hauptstraße 9",
    addressLocality: "Immerath",
    addressRegion: "Rheinland-Pfalz",
    postalCode: "54552",
    addressCountry: "DE",
  },
  geo: { "@type": "GeoCoordinates", latitude: 50.1303, longitude: 6.9594 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday","Friday","Saturday"], opens: "17:30", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "12:00", closes: "14:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "17:30", closes: "20:00" },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    target: { "@type": "EntryPoint", urlTemplate: "tel:+4965731306" },
  },
};

export default function Restaurant() {
  useSEO({
    title: "Landhaus Restaurant — Eifeler Küche im Landhaus Schend Immerath",
    description:
      "Hauseigenes Eifeler Restaurant in Immerath/Vulkaneifel. Auch für Tagesgäste offen — Halbpension, Festtafel für Hochzeiten und Feiern bis 70 Personen. Tisch reservieren: +49 6573 306.",
    canonical: "/restaurant",
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <JsonLd id="restaurant-page" data={restaurantJsonLd} />

      <main id="main">
        {/* HERO — kompakt, image-heavy */}
        <section className="relative h-[60vh] min-h-[420px] max-h-[680px] overflow-hidden">
          <HotelImage
            src={SCHEND_RESTAURANT}
            alt="Landhaus Restaurant & Terrasse im Landhaus Schend"
            loading="eager"
            decoding="sync"
            className="absolute inset-0 w-full h-full object-cover ken-burns-in"
          />
          <div aria-hidden className="absolute inset-0 bg-black/35" />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
          />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div className="flex items-center gap-4 mb-7 animate-fade-up">
              <span className="block h-px w-12 md:w-20 bg-white/65" />
              <span
                className="text-[11px] md:text-xs font-medium tracking-[0.24em] uppercase text-white/90"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                Eifeler Landküche · Anno 1856
              </span>
              <span className="block h-px w-12 md:w-20 bg-white/65" />
            </div>
            <h1
              className="font-display text-balance text-white text-[2.5rem] sm:text-5xl md:text-7xl leading-[0.95] mb-5 max-w-3xl animate-fade-up"
              style={{
                animationDelay: "0.15s",
                textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              Landhaus Restaurant
            </h1>
            <p
              className="font-display-italic text-balance text-white/95 text-lg md:text-2xl max-w-xl leading-snug mb-8 animate-fade-up"
              style={{
                animationDelay: "0.3s",
                textShadow: "0 1px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              Regional. Ehrlich. Auch ohne Übernachtung.
            </p>
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-fade-up"
              style={{ animationDelay: "0.45s" }}
            >
              <a
                href="tel:+4965731306"
                className="glow-border group inline-flex items-center justify-center gap-3 px-9 py-4 min-h-[56px] bg-white text-zinc-900 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 shadow-sm"
              >
                <Phone className="h-5 w-5" />
                Tisch reservieren
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 min-h-[56px] border border-white/60 text-white text-xs sm:text-sm font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-white/10 hover:border-white transition-all"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                <ArrowLeft className="h-4 w-4" />
                Zum Hotel
              </Link>
            </div>
          </div>
        </section>

        {/* TAGESGÄSTE-Banner */}
        <section className="animate-pulse-banner border-y border-border/60">
          <div className="container mx-auto px-4 py-5 md:py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-foreground">
                <UtensilsCrossed className="h-4 w-4 text-secondary shrink-0" strokeWidth={1.75} />
                Auch ohne Übernachtung — Einheimische und Vorbeireisende herzlich willkommen
              </span>
            </div>
          </div>
        </section>

        {/* DREI-SPALTEN: Öffnungszeiten · Küche · Reservierung */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-px bg-border/50 max-w-5xl mx-auto border border-border/40 rounded-md overflow-hidden shadow-card">
            {/* Öffnungszeiten */}
            <div className="bg-background p-8 flex flex-col">
              <Clock className="h-6 w-6 text-secondary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl md:text-2xl mb-5 leading-tight">
                Öffnungszeiten
              </h3>
              <div className="space-y-3 text-sm flex-1">
                <div>
                  <p className="font-medium">Donnerstag – Samstag</p>
                  <p className="text-muted-foreground">17:30 – 20:00 Uhr</p>
                </div>
                <div>
                  <p className="font-medium">Sonntag</p>
                  <p className="text-muted-foreground">12:00 – 14:00 Uhr</p>
                  <p className="text-muted-foreground">17:30 – 20:00 Uhr</p>
                </div>
                <div>
                  <p className="font-medium">Ruhetag: Montag, Dienstag, Mittwoch</p>
                  <p className="text-muted-foreground">
                    Kein À-la-carte — Hausgäste erhalten mit Voranmeldung ihr Halbpensions-Menü. An Feiertagen ist das Restaurant für Sie geöffnet.
                  </p>
                </div>
              </div>
            </div>

            {/* Küche */}
            <div className="bg-background p-8 flex flex-col">
              <UtensilsCrossed className="h-6 w-6 text-secondary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl md:text-2xl mb-5 leading-tight">
                Unsere Küche
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground flex-1">
                <li>Eifeler Landküche — regional, ehrlich</li>
                <li>Frische Zutaten von Eifeler Höfen</li>
                <li>3-Gang-Menü (Halbpension auf Wunsch)</li>
                <li>Wildgerichte im Herbst, Spargel im Frühjahr</li>
              </ul>
              <p className="text-xs text-muted-foreground italic mt-5">
                Unsere Speisekarte wechselt wöchentlich — das aktuelle Menü geben wir morgens bekannt.
              </p>
            </div>

            {/* Festtafel */}
            <div className="bg-background p-8 flex flex-col">
              <Users className="h-6 w-6 text-secondary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl md:text-2xl mb-5 leading-tight">
                Festtafel & Feiern
              </h3>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                Unser Festsaal fasst bis 70 Gäste und ist eingerichtet wie aus
                Großmutters Zeit. Hochzeiten, runde Geburtstage, Firmenessen — wir
                gestalten mit Ihnen individuell.
              </p>
              <p className="text-xs text-muted-foreground italic mt-5">
                Anfrage telefonisch oder per Email.
              </p>
            </div>
          </div>
        </section>

        {/* FOOD-MARQUEE */}
        <section className="overflow-hidden border-y border-border/60 py-6 bg-muted/20">
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
        </section>

        {/* KONTAKT / ANFAHRT — zweispaltig editorial */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <p className="eyebrow">Reservieren</p>
              <h2 className="font-display text-3xl md:text-4xl mt-3 mb-8 leading-tight">
                Tisch sichern
              </h2>
              <div className="space-y-5">
                <a
                  href="tel:+4965731306"
                  className="flex items-center gap-4 group"
                >
                  <Phone className="h-5 w-5 text-secondary shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-2xl font-semibold tabular-nums tracking-tight group-hover:text-secondary transition-colors">
                      +49 6573 306
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Wir nehmen persönlich ab
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:info@landhaus-schend.de?subject=Tischreservierung"
                  className="flex items-center gap-4 group"
                >
                  <Mail className="h-5 w-5 text-secondary shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-display text-xl group-hover:text-secondary transition-colors break-all">
                      info@landhaus-schend.de
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Antwort innerhalb von 24 Stunden
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <p className="eyebrow">Anfahrt</p>
              <h2 className="font-display text-3xl md:text-4xl mt-3 mb-8 leading-tight">
                So finden Sie uns
              </h2>
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-xl leading-tight">
                    Hauptstraße 9<br />
                    54552 Immerath
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vulkaneifel · Rheinland-Pfalz
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Köln · ca. 90 Min</li>
                <li>Frankfurt · ca. 120 Min</li>
                <li>Nürburgring · ca. 45 Min</li>
                <li>Luxemburg · ca. 90 Min</li>
              </ul>
              <div className="mt-6">
                <a
                  href="https://www.google.com/maps?q=Landhotel+Schend+Hauptstraße+9+54552+Immerath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors underline underline-offset-4 decoration-secondary/40"
                >
                  In Google Maps öffnen →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FEIERN-FOTO-Spread */}
        <section className="grid lg:grid-cols-12 items-stretch bg-muted/30">
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[480px] overflow-hidden">
              <img
                src="/fotos/festsaal-mit-sektempfang-landhotel-schend-vulkaneifel.jpg"
                alt="Festlich gedeckter Saal im Landhaus Schend"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 px-6 md:px-12 lg:px-16 py-16 md:py-20 flex flex-col justify-center">
            <p className="eyebrow">Festsaal bis 70 Personen</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 mb-6 text-balance leading-tight">
              Ihre Feier in unserem Hause
            </h2>
            <p className="text-foreground/85 leading-relaxed max-w-prose mb-6">
              Vom intimen Geburtstag bis zur Hochzeit mit 70 Gästen — wir gestalten
              gemeinsam mit Ihnen das passende Menü und kümmern uns um jedes Detail.
              Tisch- und Saaldekoration, persönliche Menükarten, individuelle
              Wünsche — alles geht.
            </p>
            <a
              href="tel:+4965731306"
              className="inline-flex items-center gap-3 px-7 py-3.5 min-h-[52px] self-start bg-primary text-primary-foreground rounded-sm text-xs sm:text-sm font-medium tracking-[0.2em] uppercase hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              Anfrage besprechen
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
