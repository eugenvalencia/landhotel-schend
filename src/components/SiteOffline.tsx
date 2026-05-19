// Charmante Fallback-Seite fuer Crashes, Suspense-Loading und 404.
// Wolf jagt Hase nach links durch das Bild — Hommage an "Nu pogodi"
// (eigene Zeichnung im Geiste der Vorlage, keine 1:1-Kopie der Soyuzmultfilm-IP).
//
// Charakter-Treue zum Original:
//   Wolf  — grau, schwarze wirre Haare unter Bowler-Hut, rosa Hemd ueber Bauch,
//           schwarze Hose, gelber Hauerzahn, Schurken-Look (Hooligan)
//   Hase  — klein, hellbraun, gruener Rollkragen mit weissem Dreieck,
//           weisser Guertel, weisse Schuhe, dunkelgruene Shorts, blaue Augen

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
    <div className="relative h-44 md:h-52 w-full max-w-2xl mx-auto" aria-hidden>
      {/* Vulkaneifel-Silhouette im Hintergrund */}
      <svg
        className="absolute bottom-14 left-0 right-0 w-full opacity-25"
        height="44"
        viewBox="0 0 600 44"
        preserveAspectRatio="none"
      >
        <path
          d="M0,44 L50,18 L110,32 L180,8 L260,28 L340,6 L420,24 L500,12 L600,32 L600,44 Z"
          fill="#5d6c4e"
        />
      </svg>

      {/* Boden-Linie */}
      <div className="absolute bottom-12 left-0 right-0 h-px bg-foreground/20" />
      <div className="absolute bottom-10 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      {/* HASE — laeuft vor, panisch nach hinten schauend */}
      <svg
        className="absolute bottom-12 h-24 md:h-28"
        viewBox="0 0 100 130"
        style={{
          right: "-110px",
          animation: "schend-runner 7s linear infinite",
        }}
      >
        {/* Schatten */}
        <ellipse cx="50" cy="125" rx="22" ry="2.5" fill="#000" opacity="0.2" />

        {/* HINTERES BEIN (im Sprung nach hinten gestreckt) */}
        <g style={{ transformOrigin: "60px 100px", animation: "schend-leg-back 0.28s ease-in-out infinite alternate" }}>
          <path d="M52 92 Q72 88 78 100 Q72 110 54 104 Z" fill="#d8c6a8" />
          <ellipse cx="70" cy="106" rx="9" ry="3.5" fill="#ffffff" />
          <ellipse cx="70" cy="105" rx="9" ry="1.2" fill="#e8e2d4" />
        </g>

        {/* DUNKELGRUENE SHORTS */}
        <path d="M28 78 Q24 95 38 100 L60 100 Q74 95 70 78 Z" fill="#1f5d3a" />
        {/* Shorts-Fuge */}
        <line x1="49" y1="80" x2="49" y2="100" stroke="#143d24" strokeWidth="1.2" />

        {/* WEISSER GUERTEL — klassisches Detail */}
        <rect x="26" y="74" width="46" height="6" fill="#f5f1e8" />
        <rect x="44" y="74" width="6" height="6" fill="#b9905a" />
        <rect x="46" y="76" width="2" height="2" fill="#1a1d2c" />

        {/* GRUENER ROLLKRAGEN-PULLI */}
        <path d="M22 62 Q22 50 30 46 L66 46 Q76 50 76 62 L76 76 Q76 78 74 78 L24 78 Q22 78 22 76 Z" fill="#2f7a4f" />
        {/* Rollkragen am Hals */}
        <ellipse cx="34" cy="44" rx="11" ry="6" fill="#246238" />
        <ellipse cx="34" cy="42" rx="9" ry="4" fill="#2f7a4f" />

        {/* WEISSES UMGEKEHRTES DREIECK auf der Brust — Markenzeichen */}
        <path d="M44 54 L60 54 L52 70 Z" fill="#f5f1e8" />

        {/* Schwanzpuschel */}
        <circle cx="74" cy="76" r="6" fill="#f5f1e8" />

        {/* VORDERE PFOTE (im Sprung nach vorn ausgestreckt) */}
        <g style={{ transformOrigin: "26px 70px", animation: "schend-arm-front 0.36s ease-in-out infinite alternate" }}>
          <path d="M26 64 Q14 58 8 64 Q10 72 24 72 Z" fill="#d8c6a8" />
          {/* Drei kleine Finger */}
          <path d="M8 64 L4 62 M9 66 L4 66 M10 68 L6 70" stroke="#a8957a" strokeWidth="0.8" />
        </g>

        {/* KOPF — rund, etwas tropfenfoermig zur Schnauze hin */}
        <ellipse cx="28" cy="36" rx="15" ry="14" fill="#d8c6a8" />

        {/* Schnauze (helleres Fell) */}
        <ellipse cx="16" cy="42" rx="7" ry="5" fill="#ece1c9" />
        {/* Nase */}
        <ellipse cx="11" cy="41" rx="2" ry="1.6" fill="#1a1d2c" />

        {/* WANGEN-FELL */}
        <ellipse cx="22" cy="46" rx="4" ry="2" fill="#ece1c9" opacity="0.6" />

        {/* AUGE — gross, blaues Iris, panisch nach hinten schauend */}
        <circle cx="32" cy="34" r="5" fill="#ffffff" />
        <circle cx="35" cy="35" r="3" fill="#3a6fa8" />
        <circle cx="36" cy="34" r="1.2" fill="#ffffff" />
        {/* Augenbraue — hochgezogen vor Schreck */}
        <path d="M28 27 Q34 24 38 26" stroke="#1a1d2c" strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* MAUL — leicht geoeffnet vor Schreck */}
        <ellipse cx="14" cy="46" rx="3" ry="2" fill="#a8503a" />
        <ellipse cx="14" cy="45" rx="2" ry="1" fill="#d8c6a8" />

        {/* SCHNURRHAARE */}
        <path d="M9 43 L2 41 M9 45 L2 45 M9 47 L2 49" stroke="#a8957a" strokeWidth="0.5" />

        {/* OHREN — lang, aufrecht, eines im Wind nach hinten geneigt */}
        <path d="M22 22 Q18 4 22 0 Q28 6 26 22 Z" fill="#d8c6a8" />
        <path d="M23 20 Q21 8 24 4 Q26 10 25 20 Z" fill="#f5c8d0" opacity="0.85" />

        <path d="M34 22 Q42 14 46 4 Q46 18 38 24 Z" fill="#d8c6a8" />
        <path d="M35 22 Q40 16 43 8 Q43 18 38 22 Z" fill="#f5c8d0" opacity="0.85" />

        {/* Schweiss-Tropfen ueber dem Kopf */}
        <ellipse cx="44" cy="14" rx="2" ry="3.5" fill="#7fc1ff" />
        <ellipse cx="42" cy="13" rx="0.6" ry="1" fill="#a8dfff" />
      </svg>

      {/* WOLF — Hooligan-Look, Bauch, jagt mit Krallen */}
      <svg
        className="absolute bottom-12 h-28 md:h-32"
        viewBox="0 0 140 140"
        style={{
          right: "-220px",
          animation: "schend-runner 7s linear infinite",
          animationDelay: "0.9s",
        }}
      >
        {/* Schatten */}
        <ellipse cx="70" cy="135" rx="34" ry="3" fill="#000" opacity="0.22" />

        {/* HINTERES BEIN — schwarze Hose, gestreckt */}
        <g style={{ transformOrigin: "94px 110px", animation: "schend-leg-back 0.28s ease-in-out infinite alternate" }}>
          <path d="M86 96 L92 130 L104 130 L102 96 Z" fill="#1a1d2c" />
          {/* Hosen-Falte */}
          <line x1="94" y1="98" x2="97" y2="128" stroke="#000" strokeWidth="0.8" opacity="0.5" />
          {/* SCHUH */}
          <ellipse cx="98" cy="132" rx="11" ry="3" fill="#000" />
          <path d="M88 132 Q90 128 100 128 Q108 128 108 132 Z" fill="#1f2435" />
        </g>

        {/* ROSA HEMD MIT BAUCH — Hooligan-Charakter, ausgebeult */}
        <path
          d="M28 70
             Q22 56 38 52
             L92 52
             Q108 56 108 72
             L112 100
             Q108 110 96 110
             L44 110
             Q28 110 26 100
             Q24 88 28 70 Z"
          fill="#d97296"
        />
        {/* Bauch-Auswoelbung */}
        <ellipse cx="70" cy="92" rx="42" ry="18" fill="#d97296" />
        <ellipse cx="70" cy="95" rx="40" ry="14" fill="#c5618a" opacity="0.3" />

        {/* Knopfleiste */}
        <line x1="70" y1="56" x2="70" y2="106" stroke="#a8456c" strokeWidth="1.3" />
        <circle cx="70" cy="64" r="1.6" fill="#a8456c" />
        <circle cx="70" cy="76" r="1.6" fill="#a8456c" />
        <circle cx="70" cy="88" r="1.6" fill="#a8456c" />
        <circle cx="70" cy="100" r="1.6" fill="#a8456c" />

        {/* Krawatte */}
        <path d="M66 52 L74 52 L72 64 Z" fill="#d83a5e" />
        <path d="M68 64 L76 64 L72 84 Z" fill="#d83a5e" />
        <ellipse cx="70" cy="52" rx="4" ry="1.5" fill="#a82846" />

        {/* VORDERE HOSE */}
        <g style={{ transformOrigin: "46px 110px", animation: "schend-leg-front 0.28s ease-in-out infinite alternate-reverse" }}>
          <path d="M40 96 L36 130 L52 130 L50 96 Z" fill="#1a1d2c" />
          <line x1="44" y1="98" x2="46" y2="128" stroke="#000" strokeWidth="0.8" opacity="0.5" />
          {/* SCHUH */}
          <ellipse cx="44" cy="132" rx="11" ry="3" fill="#000" />
          <path d="M34 132 Q36 128 46 128 Q54 128 54 132 Z" fill="#1f2435" />
        </g>

        {/* VORDERE PFOTE — graue Hand mit Krallen, greift nach dem Hasen */}
        <g style={{ transformOrigin: "32px 68px", animation: "schend-arm-grab 0.4s ease-in-out infinite alternate-reverse" }}>
          {/* Ärmel-Manschette */}
          <ellipse cx="32" cy="68" rx="5" ry="6" fill="#a8456c" />
          {/* Unterarm grau */}
          <path d="M30 64 Q14 60 6 66 Q8 76 26 76 Z" fill="#6e7484" />
          {/* Pfote */}
          <ellipse cx="8" cy="70" rx="6" ry="4" fill="#6e7484" />
          {/* KRALLEN — drei spitze, hervorgestreckt */}
          <path d="M3 67 L0 64 M2 70 L-2 70 M3 73 L0 76" stroke="#1a1d2c" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* Hintere Pfote (im Hemd-Bereich) */}
        <ellipse cx="98" cy="76" rx="10" ry="6" fill="#6e7484" />
        <ellipse cx="106" cy="78" rx="5" ry="3" fill="#6e7484" />

        {/* KOPF — grauer Wolf */}
        <ellipse cx="38" cy="34" rx="22" ry="20" fill="#6e7484" />

        {/* Backe leicht heller */}
        <ellipse cx="32" cy="40" rx="10" ry="6" fill="#8088a0" opacity="0.4" />

        {/* SCHNAUZE — lang, hervorstehend */}
        <path d="M20 38 Q6 36 2 46 Q8 54 24 50 Z" fill="#6e7484" />
        <ellipse cx="14" cy="44" rx="6" ry="4" fill="#8088a0" />
        {/* Nase — schwarz, glaenzend */}
        <ellipse cx="4" cy="44" rx="3" ry="2.2" fill="#1a1d2c" />
        <ellipse cx="3" cy="43" rx="0.8" ry="0.5" fill="#5a5e72" />

        {/* MAUL — boese grinsen */}
        <path d="M6 48 Q14 54 26 50" stroke="#1a1d2c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* GELBER HAUERZAHN — klassisches Detail */}
        <path d="M11 49 L11 54 L14 54 L14 49 Z" fill="#f0d97a" stroke="#a88a3a" strokeWidth="0.4" />
        <path d="M18 49 L18 52 L20 52 L20 49 Z" fill="#f5f1e8" />

        {/* AUGE — gemein, fokussiert auf Hasen */}
        <ellipse cx="32" cy="28" rx="5" ry="4" fill="#ffffff" />
        <ellipse cx="26" cy="30" rx="2.6" ry="3.2" fill="#1a1d2c" />
        <circle cx="26" cy="28" r="0.8" fill="#ffffff" />

        {/* Augenbraue — schwer, gerunzelt */}
        <path d="M22 20 Q28 16 36 22" stroke="#1a1d2c" strokeWidth="2.4" fill="none" strokeLinecap="round" />

        {/* OHR — gespitzt nach hinten */}
        <path d="M46 18 L56 2 L54 22 Z" fill="#6e7484" />
        <path d="M48 18 L54 10 L52 20 Z" fill="#f5c8d0" opacity="0.7" />

        {/* WIRRE SCHWARZE HAARE — unter und um den Hut */}
        <path d="M18 18 Q22 8 28 12 Q32 4 38 14 Q44 6 48 16 Q54 10 56 22 L52 28 Q46 22 42 24 Q36 18 32 22 Q26 16 22 24 Q18 22 18 18 Z" fill="#1a1d2c" />
        {/* Haare die unter dem Hut hervorschauen — wirr */}
        <path d="M20 22 L16 28 M24 22 L20 32 M30 20 L28 30 M42 22 L46 30 M48 24 L52 30" stroke="#1a1d2c" strokeWidth="1.6" strokeLinecap="round" />

        {/* BOWLER-HUT — Halbkugel + duenne Krempe */}
        <ellipse cx="38" cy="14" rx="24" ry="3.5" fill="#0e1018" />
        <path d="M20 14 Q20 -2 38 -2 Q56 -2 56 14 Z" fill="#1a1d2c" />
        {/* Hut-Band */}
        <rect x="20" y="11" width="36" height="3" fill="#0e1018" />
        {/* Glanz auf der Hut-Kuppel */}
        <ellipse cx="32" cy="6" rx="6" ry="2" fill="#3a3e4f" opacity="0.6" />

        {/* Schweisstropfen vor lauter Anstrengung */}
        <ellipse cx="62" cy="22" rx="2" ry="4" fill="#7fc1ff" />
        <ellipse cx="60" cy="20" rx="0.6" ry="1.2" fill="#a8dfff" />
      </svg>

      <style>{`
        @keyframes schend-runner {
          0%   { right: -120px; transform: translateY(0); }
          15%  { transform: translateY(-5px); }
          30%  { transform: translateY(0); }
          45%  { transform: translateY(-5px); }
          60%  { transform: translateY(0); }
          100% { right: calc(100% + 30px); transform: translateY(0); }
        }
        @keyframes schend-leg-back  { from { transform: rotate(-36deg); } to { transform: rotate(30deg); } }
        @keyframes schend-leg-front { from { transform: rotate(-32deg); } to { transform: rotate(36deg); } }
        @keyframes schend-arm-front { from { transform: rotate(-14deg); } to { transform: rotate(22deg); } }
        @keyframes schend-arm-grab  { from { transform: rotate(-8deg); }  to { transform: rotate(14deg); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="schend-runner"] { animation: none !important; right: 30% !important; }
          [style*="schend-leg"], [style*="schend-arm"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
