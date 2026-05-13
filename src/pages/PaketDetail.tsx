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
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">404</h1>
          <Button asChild>
            <Link to="/#pakete"><ArrowLeft className="h-4 w-4" /> {t("pakete.back")}</Link>
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
      { "@type": "ListItem", position: 3, name: title, item: `https://landhaus-schend.de/pakete/${paket.slug}` },
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: intro,
    image: paket.cover,
    brand: { "@type": "Organization", name: "Landhotel Schend" },
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

      <section className="relative pt-20 md:pt-24 bg-muted">
        <div className="container mx-auto px-4 py-10">
          <Link to="/#pakete" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> {t("pakete.back")}
          </Link>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-elevated">
              <img src={paket.cover} alt={title} decoding="async" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("pakete.eyebrow")}</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{intro}</p>
              {paket.price && <p className="text-2xl font-semibold text-secondary mb-6">{paket.price}</p>}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/booking"><CalendarCheck className="h-5 w-5" /> {t("pakete.bookNow")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:+4965731306"><Phone className="h-5 w-5" /> +49 6573 306</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("pakete.description")}</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pakete.descriptionTitle")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{details}</p>
          </div>
        </div>
        <aside className="rounded-xl bg-accent/40 p-6 h-fit">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-4">{t("pakete.included")}</p>
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm">
                <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("pakete.photos")}</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("pakete.photosTitle")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {paket.gallery.map((src, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden shadow-card">
              <img src={src} alt={`${title} – ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">{t("pakete.otherEyebrow")}</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("pakete.otherTitle")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAKETE.filter((p) => p.slug !== paket.slug).slice(0, 3).map((p) => {
              const pTitle = t(`paketDetails.${p.slug}.title`, p.title);
              return (
                <Link key={p.slug} to={`/pakete/${p.slug}`} className="group rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-elevated transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.cover} alt={pTitle} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">{pTitle}</h3>
                  </div>
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
