import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

type Platform = {
  name: string;
  logo: JSX.Element;
  scoreLabel: string;
  scoreLine: string;
  reviews: string;
  href: string;
  accent: string; // tailwind border accent
};

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.1z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/>
  </svg>
);

const BookingLogo = () => (
  <div className="h-7 px-2 rounded bg-[#003580] text-white text-xs font-bold flex items-center">
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
  <div className="h-7 px-2 rounded bg-[#E2231A] text-white text-sm font-extrabold tracking-widest flex items-center">
    HRS
  </div>
);

const PLATFORMS: Platform[] = [
  {
    name: "Google",
    logo: <GoogleG />,
    scoreLabel: "4.5 / 5",
    scoreLine: "★★★★★",
    reviews: "142 Bewertungen",
    href: "https://www.google.com/search?q=Landhotel+Schend",
    accent: "border-t-4 border-t-[#4285F4]",
  },
  {
    name: "Booking.com",
    logo: <BookingLogo />,
    scoreLabel: "8.5 / 10",
    scoreLine: "Sehr gut",
    reviews: "203 Bewertungen",
    href: "https://www.booking.com/",
    accent: "border-t-4 border-t-[#003580]",
  },
  {
    name: "Tripadvisor",
    logo: <TripadvisorLogo />,
    scoreLabel: "4.0 / 5",
    scoreLine: "Nr. 1 in Immerath",
    reviews: "89 Bewertungen",
    href: "https://www.tripadvisor.com/",
    accent: "border-t-4 border-t-[#34E0A1]",
  },
  {
    name: "HRS",
    logo: <HrsLogo />,
    scoreLabel: "8.7 / 10",
    scoreLine: "Empfehlenswert",
    reviews: "67 Bewertungen",
    href: "https://www.hrs.com/",
    accent: "border-t-4 border-t-[#E2231A]",
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
        className={`h-4 w-4 ${
          i <= n ? "fill-[#FBBF24] text-[#FBBF24]" : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

export default function ReviewsSection() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIdx((i) => (i + 1) % REVIEWS.length);

  return (
    <section className="bg-[#f5f7fa]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Bewertungen</p>
          <h2 className="text-3xl md:text-4xl font-bold">Was unsere Gäste sagen</h2>
          <p className="text-muted-foreground mt-3">
            Landhotel Schend — bewertet auf allen großen Plattformen
          </p>
        </div>

        {/* PLATFORM CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-card rounded-xl border shadow-card hover:shadow-elevated transition-shadow p-5 flex flex-col items-center text-center gap-2 ${p.accent}`}
            >
              <div className="h-9 flex items-center justify-center">{p.logo}</div>
              <div className="text-2xl font-bold mt-1">{p.scoreLabel}</div>
              <div className="text-sm text-secondary font-medium">{p.scoreLine}</div>
              <div className="text-xs text-muted-foreground">{p.reviews}</div>
              <span className="text-xs font-medium text-primary mt-2 hover:underline">
                Auf {p.name} ansehen →
              </span>
            </a>
          ))}
        </div>

        {/* REVIEW CAROUSEL */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card rounded-xl border shadow-card p-6 md:p-8">
            <div className="flex flex-col items-center text-center gap-3 min-h-[180px]">
              <Stars n={REVIEWS[idx].stars} />
              <p className="text-base md:text-lg text-foreground leading-relaxed italic">
                „{REVIEWS[idx].text}"
              </p>
              <p className="text-sm text-muted-foreground">
                — <span className="font-medium text-foreground">{REVIEWS[idx].author}</span> ·{" "}
                {REVIEWS[idx].source} · {REVIEWS[idx].date}
              </p>
            </div>

            <button
              type="button"
              onClick={prev}
              aria-label="Vorherige Bewertung"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background border shadow-card flex items-center justify-center hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Nächste Bewertung"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background border shadow-card flex items-center justify-center hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2 mt-4">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Bewertung ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
