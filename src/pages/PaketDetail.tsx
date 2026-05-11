import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Check, Phone } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { findPaket, PAKETE } from "@/lib/pakete";

const PaketDetail = () => {
  const { slug = "" } = useParams();
  const paket = findPaket(slug);

  if (!paket) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Paket nicht gefunden</h1>
          <Button asChild>
            <Link to="/#pakete">
              <ArrowLeft className="h-4 w-4" /> Zurück zu den Paketen
            </Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative pt-20 md:pt-24 bg-muted">
        <div className="container mx-auto px-4 py-10">
          <Link
            to="/#pakete"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Alle Pakete
          </Link>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-elevated">
              <img src={paket.cover} alt={paket.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">
                Pakete & Angebote
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{paket.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{paket.intro}</p>
              {paket.price && (
                <p className="text-2xl font-semibold text-secondary mb-6">{paket.price}</p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/booking">
                    <CalendarCheck className="h-5 w-5" /> Jetzt buchen
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:+4965731306">
                    <Phone className="h-5 w-5" /> +49 6573 306
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Beschreibung</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ihr Aufenthalt im Detail</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{paket.details}</p>
          </div>
        </div>
        <aside className="rounded-xl bg-accent/40 p-6 h-fit">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-4">
            Im Paket enthalten
          </p>
          <ul className="space-y-3">
            {paket.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm">
                <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* GALLERY */}
      <section className="container mx-auto px-4 pb-16">
        <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Eindrücke</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Fotos zum Paket</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {paket.gallery.map((src, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden shadow-card">
              <img
                src={src}
                alt={`${paket.title} – Bild ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* WEITERE PAKETE */}
      <section className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Weitere Pakete</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Auch interessant</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAKETE.filter((p) => p.slug !== paket.slug)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.slug}
                  to={`/pakete/${p.slug}`}
                  className="group rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-elevated transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default PaketDetail;
