import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, BadgeCheck, ExternalLink } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { cn } from "@/lib/utils";

type Platform = {
  name: string;
  logo: JSX.Element;
  scoreLabel: string;
  scoreLine: string;
  reviews: string;
  href: string;
};

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.1z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

const BookingLogo = () => (
  <div className="h-7 px-2 rounded-sm bg-[#003580] text-white text-xs font-bold flex items-center">
    Booking.com
  </div>
);

const TripadvisorLogo = () => (
  <svg viewBox="0 0 64 24" className="h-7 w-auto" aria-hidden>
    <circle cx="14" cy="12" r="10" fill="#34E0A1" />
    <circle cx="50" cy="12" r="10" fill="#34E0A1" />
    <circle cx="14" cy="12" r="3" fill="#000" />
    <circle cx="50" cy="12" r="3" fill="#000" />
  </svg>
);

const HrsLogo = () => (
  <div className="h-7 px-2 rounded-sm bg-[#E2231A] text-white text-sm font-extrabold tracking-widest flex items-center">
    HRS
  </div>
);

const PLATFORMS: Platform[] = [
  {
    name: "Google",
    logo: <GoogleG />,
    scoreLabel: "4.5 / 5",
    scoreLine: "Sehr gut",
    reviews: "142 Bewertungen",
    href: "https://www.google.com/search?q=Landhotel+Schend",
  },
  {
    name: "Booking.com",
    logo: <BookingLogo />,
    scoreLabel: "8.5 / 10",
    scoreLine: "Sehr gut",
    reviews: "203 Bewertungen",
    href: "https://www.booking.com/",
  },
  {
    name: "Tripadvisor",
    logo: <TripadvisorLogo />,
    scoreLabel: "4.0 / 5",
    scoreLine: "Nr. 1 in Immerath",
    reviews: "89 Bewertungen",
    href: "https://www.tripadvisor.com/",
  },
  {
    name: "HRS",
    logo: <HrsLogo />,
    scoreLabel: "8.7 / 10",
    scoreLine: "Empfehlenswert",
    reviews: "67 Bewertungen",
    href: "https://www.hrs.com/",
  },
];

type Review = {
  stars: number;
  text: string;
  author: string;
  source: string;
  date: string;
};

const REVIEWS: Review[] = [
  {
    stars: 5,
    text:
      "Wunderschönes Hotel in traumhafter Lage. Das Frühstücksbuffet war legendär — so viel Auswahl haben wir selten erlebt. Zimmer sehr sauber und gemütlich.",
    author: "Familie Müller, Köln",
    source: "Google",
    date: "Oktober 2025",
  },
  {
    stars: 5,
    text:
      "Perfekte Lage für Wanderungen in der Vulkaneifel. Das Personal war außerordentlich freundlich und hilfsbereit. Sehr gerne wieder!",
    author: "Thomas K.",
    source: "Booking.com",
    date: "August 2025",
  },
  {
    stars: 4,
    text:
      "Gemütliches Hotel mit hervorragendem Restaurant. Die Eifeler Küche hat uns begeistert. Genügend Motorrad-Parkplätze sind vorhanden und sicher videoüberwacht.",
    author: "Bikergruppe aus München",
    source: "Tripadvisor",
    date: "September 2025",
  },
];

const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5" aria-label={`${n} von 5 Sternen`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i <= n ? "fill-secondary text-secondary" : "text-muted-foreground/25",
        )}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": "https://landhaus-schend.de/#hotel",
  name: "Landhotel Schend",
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
    author: { "@type": "Person", name: r.author },
    publisher: { "@type": "Organization", name: r.source },
    reviewBody: r.text,
    datePublished: r.date,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.5,
    bestRating: 5,
    ratingCount: 501,
    reviewCount: 501,
  },
};

export default function ReviewsSection() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIdx((i) => (i + 1) % REVIEWS.length);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-gradient-to-b from-background via-muted/50 to-background">
      <JsonLd id="reviews" data={reviewsJsonLd} />
      <div className="container mx-auto px-4 py-20 md:py-28">
        {/* Header — mit aggregated Trust-Strip */}
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <p className="eyebrow">Bewertungen</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 text-balance">
            Was unsere Gäste sagen
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            Landhotel Schend — bewertet auf allen großen Plattformen
          </p>
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/25">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" strokeWidth={1.5} />
              ))}
              <Star className="h-3.5 w-3.5 fill-secondary/60 text-secondary" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium text-foreground">
              <strong className="font-bold">4,5</strong> Ø aus
              <strong className="ml-1 font-bold">501</strong> verifizierten Bewertungen
            </span>
            <BadgeCheck className="h-4 w-4 text-secondary" />
          </div>
        </div>

        {/* Platform grid — hairline-divided, sanfte Rundung */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50 mb-20 md:mb-28 border border-border/50 rounded-md overflow-hidden shadow-card">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-background p-7 flex flex-col items-center text-center gap-2 hover:bg-muted/40 transition-colors"
            >
              <div className="h-9 flex items-center justify-center">{p.logo}</div>
              <div className="font-display text-3xl mt-3">{p.scoreLabel}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-secondary">
                {p.scoreLine}
              </div>
              <div className="text-xs text-muted-foreground">{p.reviews}</div>
              <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-primary/70 mt-3 group-hover:text-primary transition-colors">
                Ansehen →
              </span>
            </a>
          ))}
        </div>

        {/* Magazine pull-quote */}
        <div className="max-w-3xl mx-auto text-center">
          <div
            aria-hidden
            className="font-display text-secondary text-[7rem] md:text-[9rem] leading-[0.6] mb-2 opacity-70 select-none"
          >
            “
          </div>

          <blockquote
            key={idx}
            className="font-display text-2xl md:text-3xl lg:text-[2.5rem] leading-snug text-balance text-foreground/90 min-h-[6em] md:min-h-[5em] animate-fade-up"
          >
            {REVIEWS[idx].text}
          </blockquote>

          <div className="hairline mt-12 mb-6 max-w-xs mx-auto" />
          <div className="flex flex-col items-center gap-3">
            <Stars n={REVIEWS[idx].stars} />
            <p className="text-sm text-muted-foreground tracking-wide">
              <span className="text-foreground/90 font-medium">{REVIEWS[idx].author}</span>
              <span className="mx-2 opacity-50">·</span>
              {REVIEWS[idx].source}
              <span className="mx-2 opacity-50">·</span>
              {REVIEWS[idx].date}
            </p>
            <a
              href={PLATFORMS.find((p) => p.name === REVIEWS[idx].source)?.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors mt-1"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Verifiziert auf {REVIEWS[idx].source}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Navigation: arrows + dots */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              type="button"
              onClick={prev}
              aria-label="Vorherige Bewertung"
              className="h-10 w-10 rounded-full border border-border/70 flex items-center justify-center hover:bg-background hover:border-primary/40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Bewertung ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === idx ? "w-8 bg-primary" : "w-1.5 bg-border",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Nächste Bewertung"
              className="h-10 w-10 rounded-full border border-border/70 flex items-center justify-center hover:bg-background hover:border-primary/40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
