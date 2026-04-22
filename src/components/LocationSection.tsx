import { Phone, Mail, Globe, MapPin, Car, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROUTE_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Landhotel+Schend+Immerath+Vulkaneifel";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500!2d6.7891!3d50.1847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLandhotel+Schend+Immerath+Vulkaneifel!5e0!3m2!1sde!2sde!4v1";

export default function LocationSection() {
  return (
    <section className="bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Anreise</p>
          <h2 className="text-3xl md:text-4xl font-bold">Anreise & Lage</h2>
          <p className="text-muted-foreground mt-3">
            Landhotel Schend · Immerath · Vulkaneifel
          </p>
        </div>

        {/* MAP */}
        <div className="rounded-xl overflow-hidden shadow-elevated border mb-8">
          <iframe
            src={MAP_SRC}
            title="Landhotel Schend auf Google Maps"
            className="w-full h-[300px] md:h-[450px] block"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* INFO CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-muted rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <MapPin className="h-5 w-5 text-primary" /> Adresse
            </h3>
            <address className="not-italic text-sm text-muted-foreground leading-relaxed">
              Landhotel Schend<br />
              Immerath<br />
              54552 Vulkaneifel<br />
              Deutschland
            </address>
          </div>

          <div className="bg-muted rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Phone className="h-5 w-5 text-primary" /> Kontakt
            </h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+4965731306" className="hover:underline">+49 6573 306</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@landhotel-schend.de" className="hover:underline break-all">
                  info@landhotel-schend.de
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="https://landhaus-schend.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  landhaus-schend.de
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-muted rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Car className="h-5 w-5 text-primary" /> Entfernungen
            </h3>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li>🚗 Köln: ca. 90 Min</li>
              <li>🚗 Frankfurt: ca. 120 Min</li>
              <li>🚗 Düsseldorf: ca. 100 Min</li>
              <li>🏎️ Nürburgring: ca. 45 Min</li>
            </ul>
          </div>
        </div>

        {/* ROUTE BUTTON */}
        <div className="text-center">
          <Button asChild size="lg" className="w-full md:w-auto">
            <a href={ROUTE_URL} target="_blank" rel="noopener noreferrer">
              <Map className="h-5 w-5" /> Route berechnen
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
