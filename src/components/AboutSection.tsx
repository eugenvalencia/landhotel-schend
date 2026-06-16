import type { CSSProperties } from "react";
import { HotelImage } from "@/components/HotelImage";
import { useReveal } from "@/hooks/useMagnetic";

const TIMELINE = [
  { year: "1856", event: "Grundhaus erbaut — Gasthaus & Poststelle" },
  { year: "1954", event: "Eheleute Schneiders übernehmen" },
  { year: "1970", event: "Erste 3 Gästezimmer mit Warmwasser" },
  { year: "1976", event: "Tochter Roswitha steigt ein" },
  { year: "1993", event: "Übernahme durch die Tochter" },
  { year: "1997", event: "Neueröffnung als „Landhaus Schend\"" },
  { year: "1999", event: "Erste 3-Sterne-Klassifizierung" },
  { year: "Heute", event: "21 Zimmer, ★★★ Superior, 5. Generation" },
];

const VALUES = [
  {
    num: "01",
    title: "Herzlichkeit",
    text: "Persönlicher Service mit familiärer Atmosphäre — wir kennen unsere Gäste mit Namen.",
  },
  {
    num: "02",
    title: "Qualität",
    text: "Regionale Eifeler Küche und liebevoll gestaltete Zimmer mit Charakter.",
  },
  {
    num: "03",
    title: "Tradition",
    text: "Über 165 Jahre Gastfreundschaft in Familienhand, generationsübergreifend gepflegt.",
  },
];

export default function AboutSection() {
  const timelineRef = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="bg-gradient-to-b from-background via-muted/15 to-background">
      {/* History — asymmetric magazine spread */}
      <div className="grid lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-6">
          <div className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[680px] overflow-hidden shadow-elevated">
            <HotelImage
              src="/fotos/landhaus-schend-zeichnung-innenhof-historisch.jpg"
              alt="Bleistift-Zeichnung des Landhaus Schend in Immerath mit Innenhof und Eingang"
              className="w-full h-full object-cover object-center contrast-110"
            />
          </div>
        </div>

        <div className="lg:col-span-6 px-6 md:px-12 lg:px-16 py-16 md:py-24 flex flex-col justify-center">
          <p className="eyebrow">Über uns</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-10 text-balance leading-[1.05]">
            Die Geschichte des Landhotels
          </h2>

          <div className="space-y-5 text-foreground/85 leading-relaxed max-w-prose">
            <p className="drop-cap">
              Anno 1856 wurde das Grundhaus erbaut und diente bereits damals als
              Gasthaus und zeitweise auch als Poststelle für den Ort.
            </p>
            <p>
              <span className="font-display text-primary">1954</span> übernahmen die
              Eheleute Änni und Leo Schneiders die elterliche Dorfgaststätte sowie
              den kleinbäuerlichen Selbstversorgungsbetrieb.{" "}
              <span className="font-display text-primary">1970</span> erweiterten sie
              den Betrieb um drei Gästezimmer mit fließendem Warm- und Kaltwasser.
            </p>
            <p>
              Seit <span className="font-display text-primary">1976</span> arbeiteten
              Tochter Roswitha und Ehemann Reinhold im Betrieb mit, den die beiden{" "}
              <span className="font-display text-primary">1993</span> übernahmen. Nach
              dem Tod der Eltern entschlossen sie sich für umfangreiche Umbaumaßnahmen:
              Das alte Ökonomiegebäude wurde abgerissen und ein neues Gästehaus mit 22
              Betten errichtet.
            </p>
            <p>
              Zwei Jahre später, <span className="font-display text-primary">1997</span>,
              eröffneten sie das neue Gebäude unter dem Namen „Landhaus Schend". Seit{" "}
              <span className="font-display text-primary">1999</span> ist das Landhaus
              Schend mit 3 Sternen der Deutschen Hotelklassifizierung ausgezeichnet.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline — 1856 bis heute, sepia-Linie mit Marker-Punkten */}
      <div
        ref={timelineRef}
        className="tl-reveal container mx-auto px-4 py-16 md:py-24 border-t border-border/40"
      >
        <div className="text-center mb-12 md:mb-16">
          <p className="eyebrow">165+ Jahre Gastfreundschaft</p>
          <h3 className="font-display text-2xl md:text-3xl lg:text-4xl mt-4 text-balance">
            <span className="font-display-italic font-light">Vom</span> Gasthaus 1856{" "}
            <span className="font-display-italic font-light">bis</span> heute
          </h3>
        </div>

        {/* Desktop Timeline — horizontal */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          <div
            aria-hidden
            className="tl-line absolute left-0 right-0 top-1.5 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
          />
          <span aria-hidden className="tl-glint" />
          <ol className="relative grid grid-cols-8 gap-2">
            {TIMELINE.map((item, i) => (
              <li
                key={item.year}
                className="tl-item flex flex-col items-center text-center"
                style={{ "--i": i } as CSSProperties}
              >
                <span
                  aria-hidden
                  className="block h-3 w-3 rounded-full bg-secondary ring-4 ring-background relative z-10 transition-transform hover:scale-125"
                />
                <p className="font-display text-secondary text-xl lg:text-2xl mt-4 mb-2">
                  {item.year}
                </p>
                <p className="text-[10px] lg:text-[11px] text-muted-foreground leading-tight tracking-wide px-1">
                  {item.event}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile Timeline — vertical */}
        <div className="md:hidden max-w-md mx-auto">
          <ol className="relative border-l-2 border-secondary/30 ml-3 space-y-6 pl-6">
            {TIMELINE.map((item, i) => (
              <li
                key={item.year}
                className="tl-item relative"
                style={{ "--i": i } as CSSProperties}
              >
                <span
                  aria-hidden
                  className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full bg-secondary ring-4 ring-background"
                />
                <p className="font-display text-secondary text-xl">{item.year}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.event}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Philosophy — no box wrapping, editorial typography */}
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <p className="eyebrow">Was uns ausmacht</p>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 mb-8 text-balance">
            Unsere Philosophie
          </h3>
          <p className="text-foreground/85 leading-relaxed text-base md:text-lg text-pretty">
            Das Wohl unserer Gäste liegt uns am Herzen. Sie zu begeistern und zu
            verwöhnen ist die Philosophie unseres Hauses, die wir schon seit Bestehen
            pflegen und an unsere Mitarbeiter weitergeben — herzlich, persönlich und
            authentisch eifelerisch.
          </p>
        </div>

        {/* Three values as numbered editorial column */}
        <div className="grid md:grid-cols-3 gap-px bg-border/50 max-w-5xl mx-auto border border-border/50 rounded-md overflow-hidden shadow-card">
          {VALUES.map((v) => (
            <div key={v.num} className="bg-background px-8 py-12 text-center">
              <p className="font-display text-secondary text-3xl mb-5">{v.num}</p>
              <h4 className="font-display text-xl mb-3">{v.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
