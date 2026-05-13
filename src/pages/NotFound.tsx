import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("404:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-4">
        <h1 className="mb-4 text-5xl md:text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 text-lg md:text-xl text-muted-foreground">
          {t("notFound.message", "Diese Seite existiert leider nicht.")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          {t("notFound.back", "Zurück zur Startseite")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
