import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";


export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const MENU = [
    { label: t("nav.home"), id: "top" },
    { label: t("nav.rooms"), id: "rooms" },
    { label: t("nav.pakete"), id: "pakete" },
    { label: t("nav.gastro"), id: "restaurant" },
    { label: t("nav.about"), id: "about" },
    { label: t("nav.faq"), id: "faq" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          scrolled ? "h-14 md:h-16" : "h-16 md:h-20",
        )}
      >
        <Link to="/" className="flex items-center gap-3 min-w-0" onClick={() => scrollTo("top")}>
          {/* CSS mask-image: the building drawing shows up in `currentColor`, so the
              wrapper's text-foreground colour applies to the mark and the wordmark
              identically — no more sepia-vs-cream mismatch in any theme mode. */}
          <span
            role="img"
            aria-label="Landhotel Schend Logo"
            className={cn(
              "schend-mark shrink-0 text-foreground transition-all duration-500",
              // Sized to match the height of the wordmark + subtitle stack on the right
              // (Landhotel Schend at text-base/lg/xl + subtitle at text-[10/11px], leading-tight).
              scrolled ? "h-7 md:h-8" : "h-9 md:h-10 lg:h-11",
            )}
          />
          <div className="min-w-0">
            <p className="font-display text-primary text-base md:text-lg lg:text-xl leading-tight truncate tracking-tight">
              Landhotel Schend
            </p>
            <p className={cn(
              "text-[10px] xl:text-[11px] tracking-[0.18em] uppercase text-muted-foreground leading-tight truncate transition-all duration-500",
              scrolled ? "hidden" : "hidden xl:block",
            )}>
              {t("nav.subtitle")}
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {MENU.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.id)}
              className="px-2 xl:px-2.5 py-2 text-[11px] xl:text-xs font-semibold text-primary hover:text-secondary transition-colors tracking-[0.08em] whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle className="ml-1.5" />
          <LanguageSwitcher />
          <Button asChild size="sm" className="ml-1.5 rounded-sm h-9 px-4 text-xs tracking-[0.12em] uppercase">
            <Link to="/booking">{t("nav.book")}</Link>
          </Button>
        </nav>

        <button
          aria-label="Menü"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-primary"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {MENU.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.id)}
                className="text-left px-3 py-3 text-sm font-semibold text-primary hover:text-secondary hover:bg-muted rounded-md transition-colors tracking-wider"
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center justify-center gap-3 mt-3 mb-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <Button asChild className="mt-2 h-12 rounded-sm">
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

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2).toUpperCase() || "DE";
  const langs = [
    { code: "DE", name: "Deutsch", Flag: FlagDE },
    { code: "EN", name: "English", Flag: FlagGB },
    { code: "FR", name: "Français", Flag: FlagFR },
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
