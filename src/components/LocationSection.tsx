import { Phone, Mail, Globe, MapPin, Car, Map, Train, Plane, Navigation, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FeatureIcon from "@/components/FeatureIcon";

const HOTEL_ADDRESS = "Landhotel Schend, Hauptstraße 9, 54552 Immerath, Deutschland";
const HOTEL_LAT = 50.1303;
const HOTEL_LNG = 6.9594;

const ENCODED_ADDRESS = encodeURIComponent(HOTEL_ADDRESS);
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_ADDRESS}`;
const MAP_SRC = `https://www.google.com/maps?q=${ENCODED_ADDRESS}&output=embed&z=15`;
const APPLE_MAPS = `https://maps.apple.com/?q=${ENCODED_ADDRESS}&ll=${HOTEL_LAT},${HOTEL_LNG}`;

export default function LocationSection() {
  const [copied, setCopied] = useState(false);

  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${HOTEL_LAT}, ${HOTEL_LNG}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section className="bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Anreise</p>
          <h2 className="text-3xl md:text-4xl font-bold">So finden Sie zu uns</h2>
          <p className="text-muted-foreground mt-3">
            Landhotel Schend · Hauptstraße 9 · 54552 Immerath · Vulkaneifel
          </p>
        </div>

        {/* MAP */}
        <div className="rounded-xl overflow-hidden shadow-elevated border mb-8 relative">
          <iframe
            src={MAP_SRC}
            title="Landhotel Schend, Hauptstraße 9, 54552 Immerath – auf Google Maps"
            className="w-full h-[320px] md:h-[440px] block"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* ROUTE BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Button asChild size="lg">
            <a href={ROUTE_URL} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-5 w-5" /> Route mit Google Maps
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={APPLE_MAPS} target="_blank" rel="noopener noreferrer">
              <Map className="h-5 w-5" /> Apple Maps
            </a>
          </Button>
          <Button variant="ghost" size="lg" onClick={copyCoords} aria-label="GPS-Koordinaten kopieren">
            {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            {HOTEL_LAT}, {HOTEL_LNG}
          </Button>
        </div>

        {/* INFO CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="group bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FeatureIcon icon={MapPin} variant="rose" size="sm" />
              <h3 className="font-semibold">Adresse</h3>
            </div>
            <address className="not-italic text-sm text-muted-foreground leading-relaxed">
              Landhotel Schend<br />
              Hauptstraße 9<br />
              54552 Immerath<br />
              Vulkaneifel · Deutschland
            </address>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
              <span className="font-semibold">Höhe:</span> 400 m ü. NHN<br />
              <span className="font-semibold">GPS:</span> {HOTEL_LAT}° N, {HOTEL_LNG}° E
            </p>
          </div>

          <div className="group bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FeatureIcon icon={Phone} variant="success" size="sm" sparkle />
              <h3 className="font-semibold">Kontakt</h3>
            </div>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+4965731306" className="hover:underline">+49 6573 306</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@landhaus-schend.de" className="hover:underline break-all">
                  info@landhaus-schend.de
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

          <div className="group bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FeatureIcon icon={Car} variant="primary" size="sm" />
              <h3 className="font-semibold">Entfernungen</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-1.5">
                  Deutschland
                </p>
                <ul className="space-y-1">
                  <li><span className="font-medium text-foreground">Cochem</span> (Mosel) · ca. 40 Min</li>
                  <li><span className="font-medium text-foreground">Trier</span> · ca. 60 Min</li>
                  <li><span className="font-medium text-foreground">Nürburgring</span> · ca. 45 Min</li>
                  <li><span className="font-medium text-foreground">Köln</span> · ca. 90 Min</li>
                  <li><span className="font-medium text-foreground">Düsseldorf</span> · ca. 100 Min</li>
                  <li><span className="font-medium text-foreground">Frankfurt</span> · ca. 120 Min</li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-1.5">
                  Benelux
                </p>
                <ul className="space-y-1">
                  <li><span className="font-medium text-foreground">Luxemburg-Stadt</span> · ca. 90 Min</li>
                  <li><span className="font-medium text-foreground">Lüttich</span> (Liège) · ca. 100 Min</li>
                  <li><span className="font-medium text-foreground">Maastricht</span> · ca. 110 Min</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ANREISE-DETAILS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="group bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FeatureIcon icon={Car} variant="primary" size="md" />
              <h3 className="font-semibold">Mit dem Auto</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">A1 / A48</strong> Köln ↔ Trier — Abfahrt Daun, dann B257 ca. 8 km nach Immerath
              </li>
              <li>
                <strong className="text-foreground">A60</strong> aus Belgien/Niederlande — Abfahrt Hillesheim, über B421 / B257
              </li>
              <li>
                Kostenlose, videoüberwachte Parkplätze direkt am Hotel — auch Stellplätze für Motorräder
              </li>
            </ul>
          </div>

          <div className="group bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FeatureIcon icon={Train} variant="ocean" size="md" />
              <h3 className="font-semibold">Mit der Bahn</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Bahnhof Wittlich Hbf</strong> · ca. 25 km — IC/RE-Verbindung Köln ↔ Trier
              </li>
              <li>
                <strong className="text-foreground">Bahnhof Gerolstein</strong> · ca. 30 km — Eifelbahn aus Köln
              </li>
              <li>
                Letzte Etappe gerne per Taxi (Vorab-Reservierung über uns möglich)
              </li>
            </ul>
          </div>

          <div className="group bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FeatureIcon icon={Plane} variant="sunset" size="md" float />
              <h3 className="font-semibold">Mit dem Flugzeug</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Flughafen Frankfurt-Hahn</strong> · ca. 70 km
              </li>
              <li>
                <strong className="text-foreground">Flughafen Luxemburg</strong> · ca. 90 km
              </li>
              <li>
                <strong className="text-foreground">Flughafen Köln/Bonn</strong> · ca. 110 km
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
