import {
  Phone, Mail, Globe, MapPin, Car, Map, Train, Plane, Navigation, Copy, Check,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HOTEL_ADDRESS = "Landhotel Schend, Hauptstraße 9, 54552 Immerath, Deutschland";
const HOTEL_LAT = 50.1303;
const HOTEL_LNG = 6.9594;

const ENCODED_ADDRESS = encodeURIComponent(HOTEL_ADDRESS);
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_ADDRESS}`;
const MAP_SRC = `https://www.google.com/maps?q=${ENCODED_ADDRESS}&output=embed&z=15`;
const APPLE_MAPS = `https://maps.apple.com/?q=${ENCODED_ADDRESS}&ll=${HOTEL_LAT},${HOTEL_LNG}`;

const DISTANCES_DE: { name: string; time: string }[] = [
  { name: "Cochem", time: "~ 40 Min" },
  { name: "Trier", time: "~ 60 Min" },
  { name: "Nürburgring", time: "~ 45 Min" },
  { name: "Köln", time: "~ 90 Min" },
  { name: "Düsseldorf", time: "~ 100 Min" },
  { name: "Frankfurt", time: "~ 120 Min" },
];

const DISTANCES_BENELUX: { name: string; time: string }[] = [
  { name: "Luxemburg-Stadt", time: "~ 90 Min" },
  { name: "Lüttich", time: "~ 100 Min" },
  { name: "Maastricht", time: "~ 110 Min" },
];

export default function LocationSection() {
  const [copied, setCopied] = useState(false);
  const [mapConsent, setMapConsent] = useState(false);

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
    <section className="bg-background">
      <div className="container mx-auto px-4 py-20 md:py-28">
        {/* Editorial header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="eyebrow">Anreise</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-5 text-balance leading-[1.05]">
            So finden Sie zu uns
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Landhotel Schend · Hauptstraße 9 · 54552 Immerath · Vulkaneifel
          </p>
        </div>

        {/* Map — DSGVO-Zwei-Klick: das Google-Maps-iframe lädt erst nach
            ausdrücklicher Zustimmung. Ohne Consent wird keine Besucher-IP an
            Google (USA) übertragen. */}
        <div className="border border-border/70 rounded-md overflow-hidden shadow-card mb-10">
          {mapConsent ? (
            <iframe
              src={MAP_SRC}
              title="Landhotel Schend, Hauptstraße 9, 54552 Immerath – auf Google Maps"
              className="w-full h-[360px] md:h-[480px] block"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-[360px] md:h-[480px] flex flex-col items-center justify-center gap-4 bg-muted/40 px-6 text-center">
              <Map className="h-8 w-8 text-secondary" strokeWidth={1.25} />
              <p className="font-display text-xl text-foreground">Karte von Google Maps</p>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Beim Laden der Karte werden Daten — u.&nbsp;a. Ihre IP-Adresse — an
                Google übertragen, auch in die USA. Erst nach Ihrer Zustimmung wird
                die interaktive Karte geladen. Mehr dazu in unseren{" "}
                <Link
                  to="/datenschutz"
                  className="text-secondary underline hover:no-underline"
                >
                  Datenschutzhinweisen
                </Link>
                .
              </p>
              <Button
                onClick={() => setMapConsent(true)}
                size="lg"
                variant="outline"
                className="rounded-sm uppercase tracking-[0.18em] text-xs px-7 border-primary/40 mt-1"
              >
                <Map className="h-4 w-4" strokeWidth={1.5} /> Karte laden
              </Button>
            </div>
          )}
        </div>

        {/* Route actions — editorial outline buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-20 md:mb-24">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-sm uppercase tracking-[0.18em] text-xs px-7 border-primary/40"
          >
            <a href={ROUTE_URL} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" strokeWidth={1.5} /> Google Maps
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-sm uppercase tracking-[0.18em] text-xs px-7 border-primary/40"
          >
            <a href={APPLE_MAPS} target="_blank" rel="noopener noreferrer">
              <Map className="h-4 w-4" strokeWidth={1.5} /> Apple Maps
            </a>
          </Button>
          <button
            onClick={copyCoords}
            aria-label="GPS-Koordinaten kopieren"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-700" strokeWidth={1.5} />
            ) : (
              <Copy className="h-4 w-4" strokeWidth={1.5} />
            )}
            {HOTEL_LAT}, {HOTEL_LNG}
          </button>
        </div>

        {/* Info row 1: Address · Contact · Distances */}
        <div className="grid md:grid-cols-3 gap-px bg-border/50 mb-3 border border-border/50 rounded-md overflow-hidden shadow-card">
          {/* Adresse */}
          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="h-4 w-4 text-secondary" strokeWidth={1.5} />
              <p className="eyebrow">Adresse</p>
            </div>
            <address className="not-italic text-foreground/85 leading-relaxed">
              Landhotel Schend
              <br />
              Hauptstraße 9
              <br />
              54552 Immerath
              <br />
              Vulkaneifel · Deutschland
            </address>
            <div className="hairline-strong opacity-50 my-5" />
            <p className="text-xs text-muted-foreground leading-relaxed space-y-1">
              <span className="block">
                <span className="text-foreground/85 font-medium">Höhe</span> · 400 m ü. NHN
              </span>
              <span className="block">
                <span className="text-foreground/85 font-medium">GPS</span>{" "}
                · {HOTEL_LAT}° N, {HOTEL_LNG}° E
              </span>
            </p>
          </div>

          {/* Kontakt */}
          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-5">
              <Phone className="h-4 w-4 text-secondary" strokeWidth={1.5} />
              <p className="eyebrow">Kontakt</p>
            </div>
            <ul className="space-y-3 text-foreground/85">
              <li className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <a href="tel:+4965731306" className="hover:text-secondary transition-colors">
                  +49 6573 306
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <a
                  href="mailto:info@landhaus-schend.de"
                  className="hover:text-secondary transition-colors break-all"
                >
                  info@landhaus-schend.de
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <a
                  href="https://landhaus-schend.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  www.landhaus-schend.de
                </a>
              </li>
            </ul>
          </div>

          {/* Entfernungen */}
          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-5">
              <Car className="h-4 w-4 text-secondary" strokeWidth={1.5} />
              <p className="eyebrow">Entfernungen</p>
            </div>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary mb-2">
                  Deutschland
                </p>
                <ul className="space-y-1 text-foreground/85">
                  {DISTANCES_DE.map((d) => (
                    <li key={d.name} className="flex justify-between gap-3">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-muted-foreground">{d.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hairline-strong opacity-50" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary mb-2">
                  Benelux
                </p>
                <ul className="space-y-1 text-foreground/85">
                  {DISTANCES_BENELUX.map((d) => (
                    <li key={d.name} className="flex justify-between gap-3">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-muted-foreground">{d.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info row 2: Anreise mit Auto · Bahn · Flugzeug */}
        <div className="grid md:grid-cols-3 gap-px bg-border/50 border border-border/50">
          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-5">
              <Car className="h-4 w-4 text-secondary" strokeWidth={1.5} />
              <p className="eyebrow">Mit dem Auto</p>
            </div>
            <ul className="text-sm text-foreground/85 space-y-3 leading-relaxed">
              <li>
                <strong className="font-medium">A1 / A48</strong> Köln ↔ Trier — Abfahrt Daun,
                dann B257 ca. 8 km nach Immerath
              </li>
              <li>
                <strong className="font-medium">A60</strong> aus Belgien / Niederlande —
                Abfahrt Hillesheim, über B421 / B257
              </li>
              <li>
                Kostenlose Parkplätze direkt am Hotel — auch Stellplätze
                für Motorräder
              </li>
            </ul>
          </div>

          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-5">
              <Train className="h-4 w-4 text-secondary" strokeWidth={1.5} />
              <p className="eyebrow">Mit der Bahn</p>
            </div>
            <ul className="text-sm text-foreground/85 space-y-3 leading-relaxed">
              <li>
                <strong className="font-medium">Bahnhof Wittlich Hbf</strong> · ca. 25 km —
                IC / RE Köln ↔ Trier
              </li>
              <li>
                <strong className="font-medium">Bahnhof Gerolstein</strong> · ca. 30 km —
                Eifelbahn aus Köln
              </li>
              <li>
                Letzte Etappe gerne per Taxi — Vorab-Reservierung über uns möglich
              </li>
            </ul>
          </div>

          <div className="bg-background p-8 md:p-10">
            <div className="flex items-center gap-2 mb-5">
              <Plane className="h-4 w-4 text-secondary" strokeWidth={1.5} />
              <p className="eyebrow">Mit dem Flugzeug</p>
            </div>
            <ul className="text-sm text-foreground/85 space-y-3 leading-relaxed">
              <li>
                <strong className="font-medium">Flughafen Frankfurt-Hahn</strong> · ca. 70 km
              </li>
              <li>
                <strong className="font-medium">Flughafen Luxemburg</strong> · ca. 90 km
              </li>
              <li>
                <strong className="font-medium">Flughafen Köln/Bonn</strong> · ca. 110 km
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
