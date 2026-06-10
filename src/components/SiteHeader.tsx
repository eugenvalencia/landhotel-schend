import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderWeather from "@/components/HeaderWeather";
import HeaderMegaMenu from "@/components/HeaderMegaMenu";
import { PAKETE } from "@/lib/pakete";

// Das Hotel hat genau zwei Zimmer-Arten — KEINE Einzelzimmer, KEINE Suiten.
const ROOMS_MEGA = [
  { label: "Doppelzimmer", to: "/rooms/8e3d91a0-0711-4cdf-a580-c2debb684d0c", hint: "Komfortabel, mit Balkon — ab 57 € pro Person" },
  { label: "Familienzimmer", to: "/rooms/2dffe866-7b1a-42d5-8ea9-29c9f2975994", hint: "Zwei getrennte Räume, bis 4 Personen — ab 170 €" },
];

const PAKETE_MEGA = PAKETE.slice(0, 5).map((p) => ({
  label: p.title,
  to: `/pakete/${p.slug}`,
  hint: p.price ? `${p.price.replace(/^ab\s+/i, "ab ")}` : undefined,
}));


export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const MENU: { label: string; id?: string; href?: string }[] = [
    { label: t("nav.home"), id: "top" },
    { label: t("nav.rooms"), id: "rooms" },
    { label: t("nav.pakete"), id: "pakete" },
    { label: t("nav.gastro"), href: "/restaurant" }, // eigene Page für Tagesgäste + SEO
    { label: t("nav.about"), id: "about" },
    { label: t("nav.faq"), id: "faq" },
  ];

  useEffect(() => {
    // WICHTIG: Lenis (Smooth-Scroll) feuert KEINE nativen window-"scroll"-Events —
    // ein scroll-Listener liefe nie. Stattdessen pro Frame (rAF) die Position
    // pollen; das funktioniert mit Lenis, nativem Scroll und reduced-motion.
    // React-State nur bei echtem Wechsel setzen (kein Re-Render pro Frame).
    //
    // Desktop (>=lg, volle Nav) = Header IMMER fest oben.
    // Mobil/Tablet (Hamburger) = beim aktiven Runterscrollen darf er weichen,
    // kommt aber sofort zurueck beim Hochscrollen ODER beim Stehenbleiben
    // (Scroll-Stop), damit er beim Lesen jederzeit greifbar ist.
    let lastY = window.scrollY;
    let curScrolled = lastY > 20;
    let curHidden = false;
    let rafId = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const isMobile = () => window.matchMedia("(max-width: 1023px)").matches;

    const applyScrolled = (v: boolean) => {
      if (v !== curScrolled) { curScrolled = v; setScrolled(v); }
    };
    const applyHidden = (v: boolean) => {
      if (v !== curHidden) { curHidden = v; setHidden(v); }
    };

    const tick = () => {
      const y = window.scrollY;
      applyScrolled(y > 20);

      if (!isMobile() || open || y < 120) {
        applyHidden(false);            // Desktop / Menü offen / ganz oben: immer da
      } else if (y > lastY + 6) {
        applyHidden(true);             // mobil, aktiv runter: ausblenden
      } else if (y < lastY - 4) {
        applyHidden(false);            // mobil, hoch: einblenden
      }

      if (Math.abs(y - lastY) > 0.5) {
        // bewegt sich noch -> Idle-Timer neu setzen
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => applyHidden(false), 220); // Scroll-Stop = einblenden
      }
      lastY = y;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
    };
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      // Index-Chunk lädt lazy — auf das Ziel warten statt fixem 80ms-Timeout,
      // der mit dem Chunk-Mount racet und sonst oben statt bei #faq landet.
      scrollToWhenReady(id);
    } else {
      scrollTo(id);
    }
  };

  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Nach Cross-Page-Navigation per rAF auf das Anchor-Element pollen (bis ~1s),
  // bis der lazy geladene Index-Chunk gemountet ist.
  const scrollToWhenReady = (id: string, attempts = 0) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (attempts < 60) {
      requestAnimationFrame(() => scrollToWhenReady(id, attempts + 1));
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-background/55 backdrop-blur-xl backdrop-saturate-150 border-b border-white/30 shadow-[0_8px_30px_rgb(0_0_0_/0.08)]"
          : "bg-background border-b border-transparent",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      {/* subtle gradient sheen — only when scrolled */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
          "bg-gradient-to-b from-white/40 via-white/10 to-transparent",
        )}
      />
      <div
        className={cn(
          "container mx-auto px-4 flex items-center justify-between gap-4 transition-all duration-500 relative z-10",
          scrolled ? "h-16 md:h-[68px]" : "h-16 md:h-20",
        )}
      >
        <Link to="/" className="group flex items-center gap-3 min-w-0" onClick={() => scrollTo("top")}>
          {/* Logo bleibt beim Scroll prominent — Brand-Wiedererkennung > Platz sparen.
              Subtle hover-scale für Lebendigkeit. */}
          <span
            role="img"
            aria-label="Landhotel Schend Logo"
            className={cn(
              "schend-mark shrink-0 text-foreground transition-all duration-500 group-hover:scale-105",
              scrolled ? "h-8 md:h-9" : "h-9 md:h-10 lg:h-11",
            )}
          />
          <div className="min-w-0">
            <p className="font-display text-primary text-base md:text-lg lg:text-xl leading-tight truncate tracking-tight">
              Landhotel Schend
            </p>
            <p className={cn(
              "text-[10px] xl:text-[11px] tracking-[0.18em] uppercase text-muted-foreground leading-tight truncate transition-all duration-500",
              "hidden xl:block",
            )}>
              {t("nav.subtitle")}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4 lg:gap-5">
        <nav className="hidden lg:flex items-center gap-0.5">
          {MENU.map((item) => {
            if (item.id === "rooms") {
              return (
                <HeaderMegaMenu
                  key={item.label}
                  label={item.label}
                  anchorId="rooms"
                  items={ROOMS_MEGA}
                  onAnchorClick={handleNav}
                />
              );
            }
            if (item.id === "pakete") {
              return (
                <HeaderMegaMenu
                  key={item.label}
                  label={item.label}
                  anchorId="pakete"
                  items={PAKETE_MEGA}
                  onAnchorClick={handleNav}
                />
              );
            }
            return item.href ? (
              <Link
                key={item.label}
                to={item.href}
                className="nav-underline px-2 xl:px-2.5 py-2 text-[11px] xl:text-xs font-semibold text-primary hover:text-secondary transition-colors tracking-[0.08em] whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => item.id && handleNav(item.id)}
                className="nav-underline px-2 xl:px-2.5 py-2 text-[11px] xl:text-xs font-semibold text-primary hover:text-secondary transition-colors tracking-[0.08em] whitespace-nowrap"
              >
                {item.label}
              </button>
            );
          })}
          <HeaderWeather />
          <ThemeToggle className="ml-1.5" />
          <LanguageSwitcher />
          {/* Phone-Pill — direkt anrufen ohne Scroll, wichtig für 60+ */}
          <a
            href="tel:+4965731306"
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-secondary/40 text-[11px] xl:text-xs font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all whitespace-nowrap"
            aria-label="Hotel anrufen +49 6573 306"
          >
            <Phone className="h-3 w-3" strokeWidth={2} />
            <span className="hidden xl:inline">+49 6573 306</span>
            <span className="xl:hidden">06573 306</span>
          </a>
        </nav>

        {/* Tablet: Wetter sichtbar machen, weil die Nav verborgen ist */}
        <div className="hidden md:flex lg:hidden items-center gap-3">
          <HeaderWeather />
          <a
            href="tel:+4965731306"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-secondary/40 text-[11px] font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
            aria-label="Hotel anrufen +49 6573 306"
          >
            <Phone className="h-3 w-3" strokeWidth={2} />
            06573 306
          </a>
        </div>

          <button
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-3 -mr-2 text-primary rounded-md hover:bg-muted transition-colors"
          >
            {open ? <X className="h-7 w-7" strokeWidth={2} /> : <Menu className="h-7 w-7" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background animate-fade-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {/* Phone-Link prominent oben — wichtigste 60+ Action */}
            <a
              href="tel:+4965731306"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-4 mb-2 bg-secondary/10 border border-secondary/25 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Phone className="h-5 w-5 text-secondary" strokeWidth={1.75} />
              <div>
                <p className="text-base font-semibold tracking-tight">+49 6573 306</p>
                <p className="text-xs text-muted-foreground">Direkt anrufen — wir sind für Sie da</p>
              </div>
            </a>

            {MENU.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="text-left px-4 py-4 text-base font-semibold text-primary hover:text-secondary hover:bg-muted rounded-md transition-colors tracking-wide"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => item.id && handleNav(item.id)}
                  className="text-left px-4 py-4 text-base font-semibold text-primary hover:text-secondary hover:bg-muted rounded-md transition-colors tracking-wide"
                >
                  {item.label}
                </button>
              ),
            )}
            <div className="flex items-center justify-center gap-3 mt-3 mb-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <Button asChild className="mt-3 h-14 rounded-sm text-base">
              <Link to="/booking" onClick={() => setOpen(false)}>{t("nav.book")}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

const FlagDE = () => (
  <svg viewBox="0 0 5 3" className="w-full h-full block" preserveAspectRatio="none" aria-hidden>
    <rect width="5" height="1" y="0" fill="#000" />
    <rect width="5" height="1" y="1" fill="#DD0000" />
    <rect width="5" height="1" y="2" fill="#FFCE00" />
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="w-full h-full block" preserveAspectRatio="none" aria-hidden>
    <clipPath id="gb-c"><rect width="60" height="30" /></clipPath>
    <g clipPath="url(#gb-c)">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb-c)" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 3 2" className="w-full h-full block" preserveAspectRatio="none" aria-hidden>
    <rect width="1" height="2" x="0" fill="#0055A4" />
    <rect width="1" height="2" x="1" fill="#fff" />
    <rect width="1" height="2" x="2" fill="#EF4135" />
  </svg>
);

const FlagNL = () => (
  <svg viewBox="0 0 3 2" className="w-full h-full block" preserveAspectRatio="none" aria-hidden>
    <rect width="3" height="0.667" y="0" fill="#AE1C28" />
    <rect width="3" height="0.667" y="0.667" fill="#fff" />
    <rect width="3" height="0.667" y="1.333" fill="#21468B" />
  </svg>
);

const LANGS = [
  { code: "DE", name: "Deutsch", Flag: FlagDE },
  { code: "EN", name: "English", Flag: FlagGB },
  { code: "FR", name: "Français", Flag: FlagFR },
  { code: "NL", name: "Nederlands", Flag: FlagNL },
];

/**
 * Sprachwahl als dezenter Dropdown (Globe + Kürzel) statt einer Reihe aus vier
 * Flaggen — editorial-ruhiger und konventionell (Flaggen ≠ Sprachen). Flaggen
 * bleiben klein im aufgeklappten Menü als sekundärer Hinweis.
 */
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const lang = i18n.language?.slice(0, 2).toUpperCase() || "DE";
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const choose = (code: string) => {
    const c = code.toLowerCase();
    i18n.changeLanguage(c);
    try { localStorage.setItem("lang", c); } catch { /* localStorage disabled */ }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative ml-1.5">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Sprache wählen"
        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[11px] xl:text-xs font-semibold tracking-[0.12em] text-primary hover:text-secondary transition-colors"
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />
        {current.code}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
          strokeWidth={2}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-border bg-background/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0_0_0_/0.12)] py-1 z-50 animate-fade-up"
        >
          {LANGS.map((l) => {
            const active = l.code === current.code;
            return (
              <li key={l.code}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(l.code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                    active ? "text-secondary font-semibold" : "text-foreground/85",
                  )}
                >
                  <span className="h-3.5 w-5 overflow-hidden rounded-[2px] border border-border/60 shrink-0">
                    <l.Flag />
                  </span>
                  <span className="flex-1">{l.name}</span>
                  {active && <Check className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
