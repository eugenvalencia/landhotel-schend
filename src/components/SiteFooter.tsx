import { Link } from "react-router-dom";
import { Hotel, Phone, Mail, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hotel className="h-6 w-6" />
            <span className="font-bold tracking-wide">LANDHOTEL SCHEND</span>
          </div>
          <p className="text-sm text-primary-foreground/80">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-secondary">{t("footer.quick")}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-secondary transition-colors">{t("footer.home")}</Link></li>
            <li><Link to="/booking" className="hover:text-secondary transition-colors">{t("footer.bookRoom")}</Link></li>
            <li><Link to="/" className="hover:text-secondary transition-colors">{t("footer.gastro")}</Link></li>
            <li><a href="tel:+4965731306" className="hover:text-secondary transition-colors">{t("footer.contact")}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-secondary">{t("footer.contactTitle")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:+4965731306" className="hover:text-secondary">+49 6573 306</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:info@landhotel-schend.de" className="hover:text-secondary break-all">info@landhotel-schend.de</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Immerath<br />54552 Vulkaneifel</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/75">
          <p>© {new Date().getFullYear()} Landhotel Schend · landhaus-schend.de</p>
          <div className="flex items-center gap-4">
            <Link to="/impressum" className="hover:text-secondary">{t("footer.impressum")}</Link>
            <Link to="/datenschutz" className="hover:text-secondary">{t("footer.privacy")}</Link>
            <Link
              to="/login"
              aria-label="Admin"
              className="opacity-50 hover:opacity-100 text-primary-foreground/60 hover:text-[#d4af37] transition-all duration-300"
            >
              <Star className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4 text-center text-xs text-primary-foreground/60">
          Powered by{" "}
          <a
            href="https://www.conexadigital.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary underline-offset-2 hover:underline"
          >
            CONEXA DIGITAL
          </a>
        </div>
      </div>
    </footer>
  );
}
