import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSEO } from "@/hooks/useSEO";

const Impressum = () => {
  useSEO({
    title: "Impressum",
    description: "Impressum des Landhaus Schend, Hauptstraße 9, 54552 Immerath. Inhaber Eugen Beimler, USt-ID DE322739324.",
    canonical: "/impressum",
    noindex: true,
  });
  return (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main id="main" className="flex-1 container mx-auto px-4 pt-28 md:pt-32 pb-16 max-w-3xl">
      <p className="eyebrow mb-4">Rechtliches</p>
      <h1 className="font-display text-4xl md:text-5xl mb-12 text-balance leading-[1.05]">Impressum</h1>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Angaben gemäß § 5 DDG</h2>
          <p>
            Eugen Beimler<br />
            Landhaus Schend<br />
            Hauptstraße 9<br />
            54552 Immerath<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Kontakt</h2>
          <p>
            Telefon: <a href="tel:+4965731306" className="text-secondary hover:underline">+49 6573 306</a><br />
            Fax: +49 6573 99815<br />
            E-Mail: <a href="mailto:info@landhaus-schend.de" className="text-secondary hover:underline">info@landhaus-schend.de</a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
            <span className="font-mono">DE322739324</span>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Aufsichtsbehörde</h2>
          <p>
            Verbandsgemeindeverwaltung Daun, Leopoldstraße 29, 54550 Daun
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Eugen Beimler<br />
            Hauptstraße 9<br />
            54552 Immerath
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Verbraucher­streit­beilegung / Universal­schlichtungs­stelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach
            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
            ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
            entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
            Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
            mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
            Verlinkung nicht erkennbar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4">
          Stand: Juni 2026
        </p>
      </div>
    </main>
    <SiteFooter />
  </div>
  );
};

export default Impressum;
