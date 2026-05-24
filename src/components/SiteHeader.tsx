import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderWeather from "@/components/HeaderWeather";
import HeaderMegaMenu from "@/components/HeaderMegaMenu";
import { PAKETE } from "@/lib/pakete";
import { SCHEND_HEROES } from "@/lib/photos";

const ROOMS_MEGA = [
  { label: "Einzelzimmer", to: "/rooms/d47bcebd-a254-4880-8952-72a2929d2520", hint: "Gemütlich für Reisende — ab 65 €" },
  { label: "Doppelzimmer Standard", to: "/rooms/8e3d91a0-0711-4cdf-a580-c2debb684d0c", hint: "Komfort mit Doppelbett und Balkon — ab 95 €" },
  { label: "Doppelzimmer Komfort", to: "/rooms/5af7abab-0811-4e14-9b71-923c3afafbeb", hint: "Geräumig mit Terrasse — ab 105 €" },
  { label: "Familienzimmer", to: "/rooms/2dffe866-7b1a-42d5-8ea9-29c9f2975994", hint: "Bis 4 Personen — ab 145 €" },
  { label: "Junior Suite & Eifel-Suite", to: "/rooms/06183ce9-3314-4f82-aab9-40e8c7d32d86", hint: "Wohnbereich und Panoramablick — ab 165 €" },
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
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);
        // Auto-hide: scrolling down past 120px hides header, scrolling up shows it.
        // Mobile-Menü offen oder ganz oben? Immer sichtbar.
        if (open || y < 120) setHidden(false);
        else if (y > lastY + 6) setHidden(true);
        else if (y < lastY - 4) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollTo(id), 80);
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
                  previewImage={SCHEND_HEROES[1]}
                  previewCaption="21 Zimmer mit Balkon"
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
                  previewImage="/fotos/maar-blick-mit-kindern-landhotel-schend.jpg"
                  previewCaption="Eifel-Auszeit"
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
            {/* Saison-Hint */}
            <p className="text-center text-xs text-muted-foreground mt-3 mb-1">
              Saison März – September · Sonst geschlossen
            </p>
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

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2).toUpperCase() || "DE";
  const langs = [
    { code: "DE", name: "Deutsch", Flag: FlagDE },
    { code: "EN", name: "English", Flag: FlagGB },
    { code: "FR", name: "Français", Flag: FlagFR },
    { code: "NL", name: "Nederlands", Flag: FlagNL },
  ];
  return (
    <div className="ml-1.5 flex items-center gap-1.5">
      {langs.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => {
              const code = l.code.toLowerCase();
              i18n.changeLanguage(code);
              try { localStorage.setItem("lang", code); } catch { /* localStorage disabled */ }
            }}
            aria-label={l.name}
            title={l.name}
            className={cn(
              "h-4 w-6 overflow-hidden rounded-sm border border-border transition-all duration-200 hover:scale-110 hover:shadow-md",
              active && "ring-2 ring-secondary ring-offset-1 ring-offset-background shadow-md"
            )}
          >
            <l.Flag />
          </button>
        );
      })}
    </div>
  );
}
