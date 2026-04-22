import { HotelImage } from "@/components/HotelImage";
import historyPhoto from "@/assets/landhotel-history-bw.jpg";
import { Heart, Sparkles, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* History */}
        <div>
          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Über uns</p>
            <h2 className="text-3xl md:text-4xl font-bold">Die Geschichte des Landhotels</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden shadow-elevated aspect-[4/3] bg-muted">
              <HotelImage
                src={historyPhoto}
                alt="Historisches Schwarz-Weiß Foto des Landhotels Schend in Immerath, ca. 1950er Jahre"
                className="w-full h-full object-cover sepia-[0.15] contrast-110"
              />
            </div>
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                <span className="font-semibold text-primary">Anno 1856</span> wurde das Grundhaus erbaut und diente bereits damals
                als Gasthaus und zeitweise auch als Poststelle für den Ort.
              </p>
              <p>
                <span className="font-semibold text-primary">1954</span> übernahmen die Eheleute Änni und Leo Schneiders die
                elterliche Dorfgaststätte sowie den kleinbäuerlichen Selbstversorgungsbetrieb.{" "}
                <span className="font-semibold text-primary">1970</span> erweiterten sie den Betrieb um drei Gästezimmer, die
                mit fließendem Warm- und Kaltwasser ausgestattet wurden. Außerdem wurde die Dorfgaststätte modernisiert.
              </p>
              <p>
                Seit <span className="font-semibold text-primary">1976</span> arbeiteten Tochter Roswitha und Ehemann Reinhold
                im Betrieb mit, den die beiden <span className="font-semibold text-primary">1993</span> übernahmen. Nach dem
                Tod der Eltern stand das Ehepaar Schend vor der Wahl, den Betrieb aufzugeben oder zu investieren. Sie
                entschlossen sich für Letzteres und begannen umfangreiche Umbaumaßnahmen: Das alte Ökonomiegebäude wurde
                abgerissen und ein neues Gästehaus mit 22 Betten sowie einem Speiseraum errichtet.
              </p>
              <p>
                Zwei Jahre später, <span className="font-semibold text-primary">1997</span>, konnten sie das neue Gebäude unter
                dem Namen „Landhaus Schend" eröffnen. In den folgenden Jahren wurde durch weitere Baumaßnahmen die
                Bettenzahl auf 44 erhöht, ein Lift integriert sowie ein moderner Speisesaal und ein gemütliches Kaminzimmer
                geschaffen. Seit <span className="font-semibold text-primary">1999</span> ist das Landhaus Schend mit
                3 Sternen der Deutschen Hotelklassifizierung ausgezeichnet.
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-muted rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Was uns ausmacht</p>
            <h3 className="text-2xl md:text-3xl font-bold">Unsere Philosophie</h3>
          </div>
          <p className="max-w-3xl mx-auto text-center text-foreground/90 leading-relaxed text-base md:text-lg">
            Das Wohl unserer Gäste liegt uns am Herzen. Sie zu begeistern und zu verwöhnen ist die Philosophie unseres
            Hauses, die wir schon seit Bestehen pflegen und an unsere Mitarbeiter weitergeben. Wir verstehen unsere
            Aufgabe als Gastgeber mit Leidenschaft — herzlich, persönlich und authentisch eifelerisch.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mt-10">
            {[
              { icon: Heart, title: "Herzlichkeit", text: "Persönlicher Service mit familiärer Atmosphäre." },
              { icon: Sparkles, title: "Qualität", text: "Regionale Küche und liebevoll gestaltete Zimmer." },
              { icon: Users, title: "Tradition", text: "Über 165 Jahre Gastfreundschaft in Familienhand." },
            ].map((v) => (
              <div key={v.title} className="bg-card rounded-xl p-5 border shadow-card text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <v.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold mb-1">{v.title}</h4>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
