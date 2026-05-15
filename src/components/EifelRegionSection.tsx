import eifel1 from "@/assets/eifel-1.jpg";
import eifel2 from "@/assets/eifel-2.jpg";
import eifel3 from "@/assets/eifel-3.jpg";
import eifel4 from "@/assets/eifel-4.jpg";
import eifel5 from "@/assets/eifel-5.jpg";
import WeatherCard from "@/components/WeatherCard";
import PartnerRecommendations from "@/components/PartnerRecommendations";

export default function EifelRegionSection() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-20 md:py-28">
        {/* Editorial headline */}
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <p className="eyebrow">Region</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-6 text-balance leading-[1.05]">
            Urlaubsregion Eifel
          </h2>
          <p className="text-foreground/85 text-base md:text-lg leading-relaxed text-pretty">
            Unser Hotel schmiegt sich in die Kratermulde eines erloschenen Vulkans.
            Erleben Sie die Einzigartigkeit unserer Gesundheitslandschaft Vulkaneifel.
          </p>
        </div>

        {/* Live-Wetter Immerath — Conversion-Trigger: "schaut, wie schoen es ist" */}
        <div className="max-w-4xl mx-auto mb-6">
          <WeatherCard defaultMode="hotel" allowGpsToggle />
        </div>

        {/* Schend-Partner — kuratiert mit Konflikt-Filter */}
        <PartnerRecommendations />

        {/* Photo mosaic — sanfte Rundung, ruhige Schatten */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-20 md:mb-24">
          <img
            src={eifel1}
            alt="Eifel Maar – Kratersee im Wald"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover row-span-2 md:h-[33rem] rounded-md shadow-card"
          />
          <img
            src={eifel2}
            alt="Aussichtsplattform in der Eifel bei Sonnenuntergang"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover md:col-span-2 rounded-md shadow-card"
          />
          <img
            src={eifel3}
            alt="Schilf am Maar in der Vulkaneifel"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover row-span-2 md:h-[33rem] rounded-md shadow-card"
          />
          <img
            src={eifel4}
            alt="Ruderboote am Maar"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-md shadow-card"
          />
          <img
            src={eifel5}
            alt="Panorama der Vulkaneifel"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover rounded-md shadow-card"
          />
        </div>

        {/* Editorial body — single column, generous prose width */}
        <div className="max-w-prose mx-auto space-y-12">
          <div>
            <p className="eyebrow">Lebendige Erdgeschichte</p>
            <h3 className="font-display text-3xl md:text-4xl mt-3 mb-7 text-balance">
              Freizeittipps & Ausflugsziele
            </h3>
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p className="drop-cap">
                Immerath und das gleichnamige Maar, der Kratersee eines vor zehntausenden
                Jahren ausgebrochenen Vulkans, öffnen Ihnen Fenster in die Erdgeschichte.
                Die einstigen Dimensionen des Vulkans lassen sich nur mehr erahnen bei
                Touren durch die vielfach unberührt wirkende Natur.
              </p>
              <p>
                Attraktive Rad- und Wander- oder auch Nordic-Walking-Wege bieten dafür
                optimale Voraussetzungen. Allen voran der Maare-Mosel-Radweg und der
                Premium-Wanderweg Eifelsteig.
              </p>
            </div>
          </div>

          <div className="hairline" />

          <div>
            <h4 className="font-display text-2xl md:text-3xl mb-6 text-balance">
              Vielfalt im Dreiländereck
            </h4>
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Familienfreundliche Touren führen zu Sehenswertem wie in Immerath zum
                Schulmuseum und zum Parcours der Sinne. In der näheren Umgebung gibt
                es weitere Eifelmaare zu entdecken und Häuser, die wie das Maarmuseum
                in Manderscheid oder das Vulkanhaus in Strohn über sie informieren.
              </p>
              <p>
                Ein eindrucksvoller Überblick bietet sich Ihnen von der Vulkano-Infoplattform
                auf der Steineberger Ley. Besuchen Sie den Wildpark Daun, die
                Eifelrennstrecke Nürburgring – oder auch ein Freibad – und starten Sie
                zu Tagesausflügen an die Mosel, nach Luxemburg oder Belgien.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
