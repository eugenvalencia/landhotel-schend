import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Footer is always dark slate regardless of theme — keeps a strong editorial
 * page-foot anchor in both light and dark modes.
 * NOTE: The Star link to /login is the discreet admin entry — must remain
 *       opacity-50 and unlabelled. Do not surface it.
 */
export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[hsl(220_22%_13%)] text-[hsl(38_30%_92%)]">
      <div className="container mx-auto px-4 py-20 md:py-24 grid gap-12 md:gap-16 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-5">
          <p className="font-display text-3xl md:text-4xl leading-tight tracking-tight">
            Landhotel Schend
          </p>
          <p className="text-[11px] tracking-[0.22em] uppercase text-[hsl(38_30%_92%)]/55 mt-2">
            Anno 1856 · Vulkaneifel
          </p>
          <p className="text-sm text-[hsl(38_30%_92%)]/75 mt-6 leading-relaxed max-w-md">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3">
          <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-secondary mb-5">
            {t("footer.quick")}
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary transition-colors">
                {t("footer.home")}
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-secondary transition-colors">
                {t("footer.bookRoom")}
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-secondary transition-colors">
                {t("footer.gastro")}
              </Link>
            </li>
            <li>
              <a href="tel:+4965731306" className="hover:text-secondary transition-colors">
                {t("footer.contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-secondary mb-5">
            {t("footer.contactTitle")}
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={1.5} />
              <a href="tel:+4965731306" className="hover:text-secondary transition-colors">
                +49 6573 306
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={1.5} />
              <a
                href="mailto:info@landhaus-schend.de"
                className="hover:text-secondary transition-colors break-all"
              >
                info@landhaus-schend.de
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-60" strokeWidth={1.5} />
              <span className="leading-relaxed">
                Hauptstraße 9
                <br />
                54552 Immerath
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip — alles in einer Zeile */}
      <div className="border-t border-[hsl(38_30%_92%)]/12">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[hsl(38_30%_92%)]/65">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Landhotel Schend · landhaus-schend.de</p>
            <span className="hidden sm:inline text-[hsl(38_30%_92%)]/25">·</span>
            <p className="text-[11px] tracking-wide text-[hsl(38_30%_92%)]/55">
              Powered by{" "}
              <a
                href="https://www.conexadigital.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary underline-offset-2 hover:underline transition-colors"
              >
                CONEXA DIGITAL
              </a>
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/impressum" className="hover:text-secondary transition-colors">
              {t("footer.impressum")}
            </Link>
            <Link to="/datenschutz" className="hover:text-secondary transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link
              to="/login"
              aria-label="Admin"
              className="opacity-40 hover:opacity-100 text-[hsl(38_30%_92%)]/60 hover:text-[#d4af37] transition-all duration-300"
            >
              <Star className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
