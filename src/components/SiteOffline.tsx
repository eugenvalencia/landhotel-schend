// Charmante Fallback-Seite fuer Crashes, Suspense-Loading und 404.
// Wolf jagt Hase nach links durch das Bild — Hommage an "Nu pogodi"
// (eigenes Zeichen, keine 1:1-Kopie der Soyuzmultfilm-IP).
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

/**
 * Cartoon-Sequenz: Hase rennt vor, Wolf hinterher — beide von rechts nach links.
 * Charakter-Palette:
 *   Hase  — Fell #d8c6a8, Pulli #2f7a4f mit weissem Dreieck, Shorts #1f5d3a
 *   Wolf  — Fell #6e7484, Hut/Hose #1a1d2c, Hemd #d97296, Krawatte #d83a5e
 * Beide haben Schatten und animierte Beine, der Wolf streckt die Pfoten nach
 * dem Hasen aus.
 */
function Cartoon() {
  return (
    <div className="relative h-40 md:h-48 w-full max-w-2xl mx-auto" aria-hidden>
      {/* Himmel-Glow */}
      <div className="absolute inset-x-0 bottom-12 h-px bg-foreground/10" />

      {/* Vulkaneifel-Silhouette */}
      <svg
        className="absolute bottom-12 left-0 right-0 w-full opacity-20"
        height="40"
        viewBox="0 0 600 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 L60,20 L120,30 L190,10 L260,26 L330,8 L410,24 L490,14 L600,30 L600,40 Z"
          fill="#5d6c4e"
        />
      </svg>

      {/* Bodenschatten unter den Charakteren */}
      <div className="absolute bottom-10 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

      {/* Hase (laeuft vor, panisch) */}
      <svg
        className="absolute bottom-10 h-20 md:h-24"
        viewBox="0 0 100 110"
        style={{
          right: "-110px",
          animation: "schend-runner 7s linear infinite",
        }}
      >
        {/* Schatten am Boden */}
        <ellipse cx="50" cy="105" rx="22" ry="2.5" fill="#000" opacity="0.18" />

        {/* Hintere Pfote */}
        <g style={{ transformOrigin: "62px 92px", animation: "schend-leg-back 0.3s ease-in-out infinite alternate" }}>
          <path d="M55 84 Q72 78 70 94 Q66 100 56 96 Z" fill="#d8c6a8" />
          <ellipse cx="62" cy="96" rx="7" ry="3" fill="#c9b292" />
        </g>

        {/* Shorts (dunkelgruen) */}
        <path d="M28 70 Q28 86 42 88 L60 88 Q72 86 70 70 Z" fill="#1f5d3a" />

        {/* Pulli (gruen mit weissem Dreieck) */}
        <ellipse cx="46" cy="58" rx="22" ry="18" fill="#2f7a4f" />
        <path d="M40 50 L52 50 L46 62 Z" fill="#f5f1e8" />

        {/* Schwanz */}
        <circle cx="74" cy="68" r="5" fill="#f5f1e8" />

        {/* Vordere Pfote (greift nach vorn) */}
        <g style={{ transformOrigin: "30px 70px", animation: "schend-arm-front 0.4s ease-in-out infinite alternate" }}>
          <path d="M30 64 Q22 58 16 64 Q18 70 28 70 Z" fill="#d8c6a8" />
        </g>

        {/* Kopf (links, schaut zurueck mit Panik) */}
        <ellipse cx="26" cy="42" rx="14" ry="13" fill="#d8c6a8" />

        {/* Schnauze */}
        <ellipse cx="16" cy="46" rx="6" ry="4" fill="#e8d8b8" />
        <circle cx="13" cy="45" r="1.5" fill="#1a1d2c" />

        {/* Auge (schaut nach hinten, weit aufgerissen) */}
        <circle cx="28" cy="40" r="3.5" fill="#fff" />
        <circle cx="30" cy="41" r="2" fill="#3a6fa8" />
        <circle cx="30.5" cy="40" r="0.8" fill="#fff" />

        {/* Maul (offen vor Schreck) */}
        <path d="M14 50 Q18 53 22 51" stroke="#a8503a" strokeWidth="1.2" fill="none" />

        {/* Ohren — eines aufrecht, eines im Wind nach hinten */}
        <path d="M22 30 Q20 14 24 8 Q28 16 26 30 Z" fill="#d8c6a8" />
        <path d="M24 28 Q23 18 26 12 Q27 20 26 28 Z" fill="#f5c8d0" opacity="0.7" />
        <path d="M32 30 Q40 22 44 14 Q44 24 38 32 Z" fill="#d8c6a8" />
        <path d="M34 30 Q40 24 42 18 Q42 25 38 30 Z" fill="#f5c8d0" opacity="0.7" />

        {/* Schweiss-Tropfen */}
        <ellipse cx="22" cy="20" rx="1.5" ry="3" fill="#7fc1ff" opacity="0.85" />
      </svg>

      {/* Wolf (jagt, schon nah dran) */}
      <svg
        className="absolute bottom-10 h-24 md:h-28"
        viewBox="0 0 120 120"
        style={{
          right: "-200px",
          animation: "schend-runner 7s linear infinite",
          animationDelay: "0.9s",
        }}
      >
        {/* Schatten */}
        <ellipse cx="60" cy="115" rx="30" ry="3" fill="#000" opacity="0.2" />

        {/* Hintere Beine (schwarze Hose) */}
        <g style={{ transformOrigin: "80px 100px", animation: "schend-leg-back 0.3s ease-in-out infinite alternate" }}>
          <path d="M72 88 L78 110 L88 110 L86 88 Z" fill="#1a1d2c" />
          <ellipse cx="83" cy="112" rx="8" ry="2.5" fill="#0e1018" />
        </g>

        {/* Rosa Hemd (Korpus) */}
        <path
          d="M30 60 Q28 50 38 46 L80 46 Q92 50 90 64 L92 88 Q90 96 80 96 L40 96 Q30 96 28 88 Z"
          fill="#d97296"
        />

        {/* Hemd-Detail: Knopfleiste */}
        <line x1="60" y1="50" x2="60" y2="92" stroke="#a8456c" strokeWidth="1.2" />
        <circle cx="60" cy="58" r="1.5" fill="#a8456c" />
        <circle cx="60" cy="70" r="1.5" fill="#a8456c" />
        <circle cx="60" cy="82" r="1.5" fill="#a8456c" />

        {/* Krawatte */}
        <path d="M56 46 L64 46 L62 56 Z" fill="#d83a5e" />
        <path d="M58 56 L66 56 L62 76 Z" fill="#d83a5e" />

        {/* Vordere Hose */}
        <g style={{ transformOrigin: "40px 100px", animation: "schend-leg-front 0.3s ease-in-out infinite alternate-reverse" }}>
          <path d="M36 88 L34 110 L46 110 L44 88 Z" fill="#1a1d2c" />
          <ellipse cx="40" cy="112" rx="8" ry="2.5" fill="#0e1018" />
        </g>

        {/* Vordere Pfote (greift nach Hasen) */}
        <g style={{ transformOrigin: "32px 60px", animation: "schend-arm-front 0.4s ease-in-out infinite alternate-reverse" }}>
          <path d="M30 60 Q14 56 8 62 Q10 70 26 70 Z" fill="#6e7484" />
          {/* Krallen */}
          <path d="M8 62 L4 60 M10 64 L4 66 M12 68 L8 72" stroke="#1a1d2c" strokeWidth="1" />
        </g>

        {/* Hintere Pfote (im Hemd-Bereich) */}
        <path d="M85 70 Q98 66 102 74 Q98 80 88 78 Z" fill="#6e7484" />

        {/* Kopf (graues Fell) */}
        <ellipse cx="34" cy="34" rx="20" ry="18" fill="#6e7484" />

        {/* Schnauze */}
        <path d="M18 38 Q8 36 4 44 Q8 50 22 46 Z" fill="#6e7484" />
        <ellipse cx="6" cy="43" rx="3" ry="2" fill="#1a1d2c" />

        {/* Maul (boese grinsen, Zaehne) */}
        <path d="M8 46 Q18 52 26 48" stroke="#1a1d2c" strokeWidth="1.5" fill="none" />
        <path d="M14 48 L14 51 L16 51 Z M19 48 L19 51 L21 51 Z" fill="#fff" />

        {/* Auge (boeser Blick auf Hasen) */}
        <circle cx="28" cy="30" r="4" fill="#fff" />
        <ellipse cx="22" cy="31" rx="2.2" ry="2.8" fill="#1a1d2c" />
        <circle cx="22" cy="29.5" r="0.6" fill="#fff" />

        {/* Augenbraue (gerunzelt) */}
        <path d="M18 24 L30 27" stroke="#1a1d2c" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Ohr (gespitzt nach hinten) */}
        <path d="M40 22 L50 8 L48 24 Z" fill="#6e7484" />
        <path d="M42 22 L48 14 L46 22 Z" fill="#f5c8d0" opacity="0.7" />

        {/* Schwarzes wirres Haar (Stirn) */}
        <path d="M22 18 Q26 12 32 16 Q36 10 42 18 Q46 14 50 22 L46 26 Q40 22 36 24 Q30 20 26 24 Q22 22 22 18 Z" fill="#1a1d2c" />

        {/* BOWLER HUT */}
        <ellipse cx="36" cy="14" rx="20" ry="3" fill="#1a1d2c" />
        <path d="M22 14 Q22 4 36 4 Q50 4 50 14 Z" fill="#1a1d2c" />
        <ellipse cx="36" cy="13" rx="14" ry="2" fill="#2a2d40" />

        {/* Schweiss (Verfolgung anstrengend) */}
        <ellipse cx="55" cy="18" rx="2" ry="4" fill="#7fc1ff" opacity="0.85" />
      </svg>

      {/* Animation-Definitionen */}
      <style>{`
        @keyframes schend-runner {
          0%   { right: -110px; transform: translateY(0); }
          15%  { transform: translateY(-3px); }
          30%  { transform: translateY(0); }
          45%  { transform: translateY(-3px); }
          60%  { transform: translateY(0); }
          100% { right: calc(100% + 30px); transform: translateY(0); }
        }
        @keyframes schend-leg-back {
          from { transform: rotate(-32deg); }
          to   { transform: rotate(28deg); }
        }
        @keyframes schend-leg-front {
          from { transform: rotate(-28deg); }
          to   { transform: rotate(32deg); }
        }
        @keyframes schend-arm-front {
          from { transform: rotate(-12deg); }
          to   { transform: rotate(18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="schend-runner"] { animation: none !important; right: 30% !important; }
          [style*="schend-leg"], [style*="schend-arm"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
