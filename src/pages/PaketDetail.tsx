import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Check, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { findPaket, PAKETE } from "@/lib/pakete";
import { useSEO } from "@/hooks/useSEO";
import JsonLd from "@/components/JsonLd";

const PaketDetail = () => {
  const { slug = "" } = useParams();
  const paket = findPaket(slug);
  const { t } = useTranslation();

  useSEO({
    title: paket ? t(`paketDetails.${paket.slug}.title`, paket.title) : "Paket",
    description: paket ? t(`paketDetails.${paket.slug}.intro`, paket.intro) : undefined,
    canonical: paket ? `/pakete/${paket.slug}` : undefined,
    ogImage: paket?.cover,
  });

  if (!paket) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 pt-32 pb-24 text-center">
          <p className="eyebrow mb-4">Hier scheint nichts zu sein</p>
          <h1 className="font-display text-5xl md:text-6xl mb-8">404</h1>
          <Button
            asChild
            variant="outline"
            className="rounded-sm uppercase tracking-[0.18em] text-xs px-7"
          >
            <Link to="/#pakete">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              {t("pakete.back")}
            </Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const title = t(`paketDetails.${paket.slug}.title`, paket.title);
  const intro = t(`paketDetails.${paket.slug}.intro`, paket.intro);
  const details = t(`paketDetails.${paket.slug}.details`, paket.details);
  const highlights = t(`paketDetails.${paket.slug}.highlights`, {
    returnObjects: true,
    defaultValue: paket.highlights,
  }) as string[];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://landhaus-schend.de/" },
      { "@type": "ListItem", position: 2, name: "Pakete", item: "https://landhaus-schend.de/#pakete" },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://landhaus-schend.de/pakete/${paket.slug}`,
      },
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: intro,
    image: paket.cover,
    brand: { "@type": "Organization", name: "Landhaus Schend" },
    offers: paket.price
      ? {
          "@type": "Offer",
          price: paket.price.replace(/[^\d,.]/g, "").replace(",", "."),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://landhaus-schend.de/pakete/${paket.slug}`,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd id="breadcrumb-paket" data={breadcrumbJsonLd} />
      <JsonLd id="paket-product" data={productJsonLd} />
      <SiteHeader />

      {/* Hero / Intro */}
      <section className="bg-gradient-to-b from-muted/40 via-background to-muted/20 pt-24 md:pt-28">
        <div className="container mx-auto px-4 pb-16 md:pb-20">
          <Link
            to="/#pakete"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("pakete.back")}
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="aspect-[4/3] rounded-md overflow-hidden shadow-elevated">
              <img
                src={paket.cover}
                alt={title}
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">{t("pakete.eyebrow")}</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-6 text-balance leading-[1.05]">
                {title}
              </h1>
              <p className="text-foreground/85 text-lg leading-relaxed mb-7 text-pretty max-w-prose">
                {intro}
              </p>
              {paket.price && (
                <p className="font-display text-2xl md:text-3xl text-secondary mb-8">
                  {paket.price}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-8"
                >
                  <Link to="/booking">
                    <CalendarCheck className="h-4 w-4" strokeWidth={1.5} />
                    {t("pakete.bookNow")}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-sm uppercase tracking-[0.18em] text-xs h-12 px-8 border-primary/40"
                >
                  <a href="tel:+4965731306">
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                    +49 6573 306
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beschreibung + Inklusiv-Spalte */}
      <section className="container mx-auto px-4 py-20 md:py-24 grid lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2">
          <p className="eyebrow">{t("pakete.description")}</p>
          <h2 className="font-display text-3xl md:text-4xl mt-4 mb-7 text-balance">
            {t("pakete.descriptionTitle")}
          </h2>
          <p className="text-foreground/85 text-base md:text-lg leading-relaxed max-w-prose drop-cap">
            {details}
          </p>
        </div>

        <aside>
          <p className="eyebrow mb-5">{t("pakete.included")}</p>
          <div className="hairline mb-5" />
          <ul className="space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-foreground/90">
                <Check className="h-4 w-4 text-secondary shrink-0 mt-1" strokeWidth={1.5} />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Galerie */}
      <section className="container mx-auto px-4 pb-20 md:pb-24">
        <p className="eyebrow">{t("pakete.photos")}</p>
        <h2 className="font-display text-3xl md:text-4xl mt-4 mb-10 text-balance">
          {t("pakete.photosTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {paket.gallery.map((src, i) => (
            <div key={i} className="aspect-[4/3] rounded-md overflow-hidden shadow-card">
              <img
                src={src}
                alt={`${title} – ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1500ms] ease-out"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Weitere Pakete */}
      <section className="bg-gradient-to-b from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4 py-20 md:py-24">
          <p className="eyebrow">{t("pakete.otherEyebrow")}</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 mb-12 text-balance">
            {t("pakete.otherTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-10 md:gap-y-14">
            {PAKETE.filter((p) => p.slug !== paket.slug).slice(0, 3).map((p) => {
              const pTitle = t(`paketDetails.${p.slug}.title`, p.title);
              return (
                <Link key={p.slug} to={`/pakete/${p.slug}`} className="group block">
                  <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden mb-5 rounded-md shadow-card group-hover:shadow-elevated transition-shadow duration-500">
                    <img
                      src={p.cover}
                      alt={pTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="font-display text-xl md:text-2xl mb-3 group-hover:text-secondary transition-colors text-balance">
                    {pTitle}
                  </h3>
                  <span className="text-xs font-medium tracking-[0.2em] uppercase text-secondary inline-flex items-center gap-2 transition-all group-hover:gap-3">
                    {t("pakete.more")}
                    <span>→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default PaketDetail;
