import eifel1 from "@/assets/eifel-1.jpg";
import eifel2 from "@/assets/eifel-2.jpg";
import eifel3 from "@/assets/eifel-3.jpg";
import eifel4 from "@/assets/eifel-4.jpg";
import eifel5 from "@/assets/eifel-5.jpg";

export default function EifelRegionSection() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Headline */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Region</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Urlaubsregion Eifel</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Unser Hotel schmiegt sich in die Kratermulde eines erloschenen Vulkans.
            Erleben Sie die Einzigartigkeit unserer Gesundheitslandschaft Vulkaneifel.
          </p>
        </div>

        {/* Collage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-14">
          <img
            src={eifel1}
            alt="Eifel Maar – Kratersee im Wald"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-lg shadow-card row-span-2 md:h-[33rem]"
          />
          <img
            src={eifel2}
            alt="Aussichtsplattform in der Eifel bei Sonnenuntergang"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-lg shadow-card md:col-span-2"
          />
          <img
            src={eifel3}
            alt="Schilf am Maar in der Vulkaneifel"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-lg shadow-card row-span-2 md:h-[33rem]"
          />
          <img
            src={eifel4}
            alt="Ruderboote am Maar"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-lg shadow-card"
          />
          <img
            src={eifel5}
            alt="Panorama der Vulkaneifel"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-lg shadow-card"
          />
        </div>

        {/* Freizeittipps */}
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Freizeittipps & Ausflugsziele</h3>
          <p className="uppercase tracking-[0.18em] text-xs text-secondary mb-6">
            Lebendige Erdgeschichte
          </p>
          <div className="space-y-5 text-muted-foreground text-base leading-relaxed text-left md:text-center">
            <p>
              Immerath und das gleichnamige Maar, der Kratersee eines vor zehntausenden Jahren
              ausgebrochenen Vulkans, öffnen Ihnen Fenster in die Erdgeschichte. Die einstigen
              Dimensionen des Vulkans lassen sich nur mehr erahnen bei Touren durch die vielfach
              unberührt wirkende Natur.
            </p>
            <p>
              Attraktive Rad- und Wander- oder auch Nordic-Walking-Wege bieten dafür optimale
              Voraussetzungen. Allen voran der Maare-Mosel-Radweg und der Premium-Wanderweg
              Eifelsteig.
            </p>
          </div>

          <h4 className="text-xl md:text-2xl font-semibold mt-10 mb-5">Vielfalt im Dreiländereck</h4>
          <div className="space-y-5 text-muted-foreground text-base leading-relaxed text-left md:text-center">
            <p>
              Familienfreundliche Touren führen zu Sehenswertem wie in Immerath zum Schulmuseum
              und zum Parcours der Sinne. In der näheren Umgebung gibt es weitere Eifelmaare zu
              entdecken und Häuser, die wie das Maarmuseum in Manderscheid oder das Vulkanhaus in
              Strohn über sie informieren.
            </p>
            <p>
              Ein eindrucksvoller Überblick bietet sich Ihnen von der Vulkano-Infoplattform auf
              der Steineberger Ley. Besuchen Sie den Wildpark Daun, die Eifelrennstrecke
              Nürburgring – oder auch ein Freibad – und starten Sie zu Tagesausflügen an die
              Mosel, nach Luxemburg oder Belgien.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
