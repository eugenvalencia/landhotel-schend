import { HotelImage } from "@/components/HotelImage";
import historyPhoto from "@/assets/landhotel-history-bw.jpg";

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
  return (
    <section id="about" className="bg-background">
      {/* History — asymmetric magazine spread */}
      <div className="grid lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-6">
          <div className="aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[680px] overflow-hidden shadow-elevated">
            <HotelImage
              src={historyPhoto}
              alt="Historisches Schwarz-Weiß Foto des Landhotels Schend in Immerath, ca. 1950er Jahre"
              className="w-full h-full object-cover sepia-[0.18] contrast-110"
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
