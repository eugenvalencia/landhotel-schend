import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("404:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-32 md:py-40">
        <div className="text-center max-w-xl">
          <p className="eyebrow mb-5">Hier scheint nichts zu sein</p>
          <h1 className="font-display text-[5.5rem] md:text-[8rem] leading-[0.95] text-primary mb-6">
            404
          </h1>
          <p className="text-foreground/85 text-lg leading-relaxed mb-10 text-pretty">
            {t(
              "notFound.message",
              "Die gesuchte Seite existiert leider nicht — vielleicht wurde sie verschoben oder umbenannt.",
            )}
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-8 border-primary/40"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              {t("notFound.back", "Zurück zur Startseite")}
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
