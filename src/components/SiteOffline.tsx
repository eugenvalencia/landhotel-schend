// Charmante Fallback-Seite fuer Crashes, Suspense-Loading und 404.
// Inspiriert von "Nu pogodi" — Wolf jagt Hasen, Werkzeug in der Hand.
// Keine Router-Hooks und keine Datenquellen, damit's auch dann rendert
// wenn drumherum alles brennt.

type Props = {
  variant?: "error" | "loading" | "notfound";
  title?: string;
  message?: string;
};

const COPY = {
  error: {
    title: "Da ist was schief gelaufen",
    message:
      "Unsere kleinen Helfer fangen das gerade ein. Bitte einen Moment — oder zurueck zur Startseite.",
  },
  loading: {
    title: "Einen Moment",
    message: "Wir polieren die Vulkaneifel-Aussicht. Gleich da.",
  },
  notfound: {
    title: "Diese Seite gibt's nicht",
    message:
      "Vielleicht ist sie umgezogen — oder unsere Helfer haben sie noch nicht gefunden.",
  },
};

export default function SiteOffline({ variant = "error", title, message }: Props) {
  const defaults = COPY[variant];
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="w-full max-w-2xl text-center relative">
        <p className="eyebrow mb-5 text-secondary">Landhotel Schend</p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-primary mb-5 text-balance">
          {title ?? defaults.title}
        </h1>
        <p className="text-foreground/80 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10 text-pretty">
          {message ?? defaults.message}
        </p>

        <Cartoon />

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-primary/40 px-7 h-11 text-xs uppercase tracking-[0.18em] text-foreground hover:bg-primary/5 transition-colors"
          >
            Zur Startseite
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary text-primary-foreground px-7 h-11 text-xs uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
          >
            Nochmal versuchen
          </button>
        </div>
      </div>
    </div>
  );
}

function Cartoon() {
  return (
    <div className="relative h-32 md:h-40 w-full max-w-xl mx-auto" aria-hidden>
      {/* Horizont-Linie */}
      <div className="absolute bottom-6 left-0 right-0 h-px bg-foreground/15" />

      {/* Eifel-Silhouette dezent */}
      <svg
        className="absolute bottom-6 left-0 right-0 w-full opacity-15"
        height="36"
        viewBox="0 0 600 36"
        preserveAspectRatio="none"
      >
        <path
          d="M0,36 L60,18 L120,28 L190,10 L260,24 L330,8 L410,22 L490,14 L600,28 L600,36 Z"
          fill="currentColor"
        />
      </svg>

      {/* Hase (rennt vor) */}
      <svg
        className="absolute bottom-6 h-16 md:h-20 text-secondary"
        viewBox="0 0 80 80"
        style={{ animation: "schend-runner 6s linear infinite" }}
      >
        <g fill="currentColor">
          {/* Ohren */}
          <rect x="22" y="6" width="6" height="22" rx="3" />
          <rect x="34" y="4" width="6" height="24" rx="3" />
          {/* Koerper */}
          <ellipse cx="36" cy="46" rx="22" ry="14" />
          {/* Kopf */}
          <circle cx="30" cy="32" r="11" />
          {/* Auge */}
          <circle cx="26" cy="30" r="1.6" fill="#0d0d0d" />
          {/* Nase */}
          <circle cx="20" cy="34" r="1.6" />
          {/* Schwanz */}
          <circle cx="58" cy="44" r="3.5" />
          {/* Beine — werden via CSS gewackelt */}
          <g style={{ transformOrigin: "32px 60px", animation: "schend-leg 0.35s ease-in-out infinite alternate" }}>
            <rect x="28" y="56" width="5" height="14" rx="2" />
          </g>
          <g style={{ transformOrigin: "44px 60px", animation: "schend-leg 0.35s ease-in-out infinite alternate-reverse" }}>
            <rect x="42" y="56" width="5" height="14" rx="2" />
          </g>
        </g>
        {/* Werkzeug — kleiner Schraubenschluessel im Arm */}
        <g fill="currentColor" opacity="0.85" transform="translate(8 38) rotate(-25)">
          <rect x="0" y="0" width="14" height="3" rx="1.5" />
          <circle cx="-1" cy="1.5" r="3" />
          <rect x="-3" y="-0.5" width="1.5" height="4" rx="0.5" fill="#0d0d0d" opacity="0.6" />
        </g>
      </svg>

      {/* Wolf (jagt) */}
      <svg
        className="absolute bottom-6 h-20 md:h-24 text-primary"
        viewBox="0 0 100 90"
        style={{ animation: "schend-runner 6s linear infinite", animationDelay: "1.8s" }}
      >
        <g fill="currentColor">
          {/* Schwanz */}
          <path d="M82 38 Q98 30 92 22 Q88 30 78 44 Z" />
          {/* Koerper */}
          <ellipse cx="48" cy="54" rx="28" ry="16" />
          {/* Kopf + Schnauze */}
          <path d="M14 52 Q4 50 10 38 Q18 30 30 36 L34 52 Z" />
          {/* Ohr */}
          <path d="M28 30 L24 18 L34 28 Z" />
          {/* Auge */}
          <circle cx="22" cy="42" r="1.8" fill="#fafaf7" />
          {/* Beine */}
          <g style={{ transformOrigin: "40px 70px", animation: "schend-leg 0.35s ease-in-out infinite alternate" }}>
            <rect x="36" y="64" width="6" height="18" rx="2" />
          </g>
          <g style={{ transformOrigin: "56px 70px", animation: "schend-leg 0.35s ease-in-out infinite alternate-reverse" }}>
            <rect x="54" y="64" width="6" height="18" rx="2" />
          </g>
          <g style={{ transformOrigin: "70px 70px", animation: "schend-leg 0.35s ease-in-out infinite alternate" }}>
            <rect x="68" y="64" width="6" height="18" rx="2" />
          </g>
        </g>
        {/* Hammer in der Pfote */}
        <g transform="translate(2 36) rotate(15)" fill="currentColor" opacity="0.9">
          <rect x="0" y="6" width="12" height="2.5" rx="1" />
          <rect x="-3" y="2" width="5" height="10" rx="1" />
        </g>
      </svg>

      <style>{`
        @keyframes schend-runner {
          0%   { left: -90px;  transform: translateX(0) translateY(0); }
          48%  { transform: translateX(0) translateY(-4px); }
          50%  { transform: translateX(0) translateY(0); }
          100% { left: calc(100% + 20px); transform: translateX(0) translateY(0); }
        }
        @keyframes schend-leg {
          from { transform: rotate(-22deg); }
          to   { transform: rotate(22deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="schend-runner"] { animation: none !important; left: 30% !important; }
          [style*="schend-leg"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
