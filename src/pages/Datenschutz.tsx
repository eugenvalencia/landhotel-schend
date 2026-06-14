import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSEO } from "@/hooks/useSEO";

const Datenschutz = () => {
  useSEO({
    title: "Datenschutz",
    description: "Datenschutzerklärung gemäß DSGVO für das Landhotel Schend, Hauptstraße 9, 54552 Immerath.",
    canonical: "/datenschutz",
    noindex: true,
  });
  return (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main id="main" className="flex-1 container mx-auto px-4 pt-28 md:pt-32 pb-16 max-w-3xl">
      <p className="eyebrow mb-4">Rechtliches</p>
      <h1 className="font-display text-4xl md:text-5xl mb-12 text-balance leading-[1.05]">Datenschutzerklärung</h1>

      <div className="space-y-10 text-foreground/90 leading-relaxed">

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">1. Datenschutz auf einen Blick</h2>
          <h3 className="font-semibold mt-4 mb-1">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie unsere Website besuchen oder eine
            Zimmer-Anfrage senden. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können. Ausführliche Informationen finden Sie in
            den nachfolgenden Abschnitten.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">2. Verantwortliche Stelle</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist (Art. 4 Nr. 7 DSGVO):
          </p>
          <p className="mt-3">
            Eugen Beimler<br />
            Landhotel Schend<br />
            Hauptstraße 9<br />
            54552 Immerath<br />
            Telefon: <a href="tel:+4965731306" className="text-secondary hover:underline">+49 6573 306</a><br />
            E-Mail: <a href="mailto:info@landhaus-schend.de" className="text-secondary hover:underline">info@landhaus-schend.de</a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">3. Datenschutzbeauftragter</h2>
          <p>
            Aufgrund unserer Betriebsgröße sind wir nicht zur Bestellung eines
            Datenschutzbeauftragten verpflichtet (§ 38 BDSG). Bei datenschutzrechtlichen
            Anliegen wenden Sie sich bitte direkt an die unter Ziffer 2 genannte
            verantwortliche Stelle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">4. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht (Art. 15-22 DSGVO):
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten (Art. 15)</li>
            <li>unrichtige Daten berichtigen zu lassen (Art. 16)</li>
            <li>die Löschung Ihrer Daten zu verlangen (Art. 17)</li>
            <li>die Einschränkung der Verarbeitung zu verlangen (Art. 18)</li>
            <li>die Datenübertragbarkeit zu verlangen (Art. 20)</li>
            <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21)</li>
            <li>eine erteilte Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3) — die Rechtmäßigkeit
              der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt</li>
            <li>sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77)</li>
          </ul>
          <p className="mt-4">
            <strong>Zuständige Aufsichtsbehörde:</strong><br />
            Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz<br />
            Hintere Bleiche 34, 55116 Mainz<br />
            <a href="https://www.datenschutz.rlp.de" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">www.datenschutz.rlp.de</a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">5. Allgemeine Hinweise und Pflichtinformationen</h2>

          <h3 className="font-semibold mt-4 mb-1">Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
            behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
            Datenschutzvorschriften (DSGVO, BDSG, TDDDG) sowie dieser Datenschutzerklärung.
          </p>

          <h3 className="font-semibold mt-4 mb-1">SSL- bzw. TLS-Verschlüsselung</h3>
          <p>
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
            Inhalte (z.B. Buchungs-Anfragen) eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
            Verbindung erkennen Sie daran, dass die Adresszeile des Browsers „https://" zeigt.
          </p>

          <h3 className="font-semibold mt-4 mb-1">Speicherdauer</h3>
          <p>
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
            wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
            Datenverarbeitung entfällt. Gesetzliche Aufbewahrungspflichten bleiben unberührt
            (insbesondere § 257 HGB, § 147 AO — bis zu 10 Jahre für Buchungsbelege).
          </p>

          <h3 className="font-semibold mt-4 mb-1">Empfänger / Auftragsverarbeiter</h3>
          <p>
            Eine Übermittlung personenbezogener Daten an Dritte erfolgt nur, soweit dies zur
            Vertragserfüllung erforderlich ist oder eine gesetzliche Verpflichtung besteht.
            Auftragsverarbeiter (Art. 28 DSGVO) — siehe Ziffer 6.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">6. Auftragsverarbeiter und eingebundene Dienste</h2>

          <h3 className="font-semibold mt-4 mb-1">a) Hosting & CDN</h3>
          <p>
            Diese Website wird auf einer Infrastruktur betrieben, die unser Auftragsverarbeiter
            <strong> Conexa Digital</strong> (Conexadigital, Inhaber Eugen Neifer) verwaltet. Die
            Auslieferung der Inhalte erfolgt zusätzlich über das Content Delivery Network von
            <strong> Cloudflare Inc.</strong> (101 Townsend St, San Francisco, CA 94107, USA).
            Cloudflare erhebt dabei verarbeitungstechnisch notwendige Server-Log-Daten
            (insb. IP-Adresse, Zeitstempel, Browsertyp). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an sicherem und schnellem Webhosting).
            Drittlandtransfer USA: gestützt auf EU-Standard­datenschutz­klauseln (Art. 46 Abs. 2 lit. c DSGVO).
            Cloudflare ist DPF-zertifiziert (Data Privacy Framework).
          </p>

          <h3 className="font-semibold mt-4 mb-1">b) Backend / Buchungsanfragen — Supabase</h3>
          <p>
            Ihre Buchungs-Anfrage wird in einer
            verschlüsselten Datenbank des Anbieters <strong>Supabase Inc.</strong>
            (970 Toa Payoh North, #07-04, Singapore 318992) gespeichert. Die Server-Region ist
            <strong> Frankfurt/Deutschland (eu-central-1)</strong>. Mit Supabase besteht ein
            Auftragsverarbeitungsvertrag nach Art. 28 DSGVO sowie EU-SCC für etwaigen
            Konzernzugriff aus den USA. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
            Maßnahmen, Vertragsanbahnung).
          </p>

          <h3 className="font-semibold mt-4 mb-1">c) E-Mail-Versand & -Empfang — IONOS</h3>
          <p>
            E-Mail-Korrespondenz an <em>info@landhaus-schend.de</em> wird über die Mail-Infrastruktur
            der <strong>IONOS SE</strong> (Elgendorfer Str. 57, 56410 Montabaur) abgewickelt.
            IONOS erfasst dabei verarbeitungstechnisch notwendige Daten (Absender, Zeitstempel,
            E-Mail-Inhalt). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) oder
            Art. 6 Abs. 1 lit. f DSGVO bei sonstigen Anfragen.
            Datenschutz IONOS:
            {" "}
            <a
              href="https://www.ionos.de/terms-gtc/terms-privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline break-all"
            >
              ionos.de/terms-gtc/terms-privacy
            </a>
          </p>

          <h3 className="font-semibold mt-4 mb-1">d) Karten-Darstellung — Google Maps</h3>
          <p>
            Zur Anfahrt-Darstellung binden wir <strong>Google Maps</strong> ein (Anbieter:
            Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; Mutterkonzern
            Google LLC, USA). Die Karte wird <strong>erst nach Ihrem ausdrücklichen Klick</strong>
            („Karte laden") geladen — vorher werden keine Daten an Google übertragen. Mit dem Laden
            werden u.&nbsp;a. Ihre IP-Adresse und Nutzungsdaten an Google übermittelt, auch in die USA.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Klick). Den USA-Transfer
            stützt Google auf den EU-US Data Privacy Framework bzw. EU-Standardvertragsklauseln.
            Die vollständige Adresse steht als Text daneben — Sie müssen die Karte nicht laden.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">7. Datenerfassung auf dieser Website</h2>

          <h3 className="font-semibold mt-4 mb-1">Cookies und lokale Speicherung</h3>
          <p>
            Unsere Internetseiten verwenden so genannte „Cookies" und ähnliche Speicher-Techniken
            (localStorage). Konkret speichern wir:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Theme-Präferenz</strong> (<code>theme</code>, localStorage) — speichert, ob Sie
              die Seite hell oder dunkel anzeigen. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG (technisch
              erforderlich für die von Ihnen gewählte Darstellung).
            </li>
            <li>
              <strong>Barrierefreiheits-Komfort</strong> (<code>schend_a11y_v1</code>, localStorage) —
              speichert Ihre Einstellungen zu Schriftgröße, Kontrast und reduzierter Bewegung.
              Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.
            </li>
            <li>
              <strong>Start-Animation</strong> (<code>schend_splash_done</code>, sessionStorage) —
              merkt sich für die Dauer Ihres Besuchs, dass die Begrüßungs-Animation bereits gezeigt
              wurde. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.
            </li>
          </ul>
          <p className="mt-3">
            Wir nutzen <strong>kein Tracking</strong>, <strong>keine Werbe-Cookies</strong> und keine
            Drittanbieter-Analytics. Sie können Ihre Browser-Einstellungen so anpassen, dass
            Cookies / localStorage komplett blockiert werden — das kann jedoch die Funktion der
            Website einschränken (z.B. gehen Ihre Theme- und Komfort-Einstellungen verloren).
          </p>

          <h3 className="font-semibold mt-4 mb-1">Server-Log-Dateien</h3>
          <p>
            Unser Hosting-Anbieter (siehe Ziffer 6 a) erhebt und speichert automatisch
            Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse (gekürzt nach Verarbeitung)</li>
          </ul>
          <p className="mt-3">
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Betriebs­sicherheit).
            Speicherdauer: 7 Tage, danach automatische Löschung bzw. Anonymisierung.
          </p>

          <h3 className="font-semibold mt-4 mb-1">Zimmer-Anfrage / Booking-Formular</h3>
          <p>
            Über das Buchungsformular erheben wir folgende Daten:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Name (Vor- und Nachname)</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer (optional)</li>
            <li>Anreise- und Abreise-Datum</li>
            <li>Zimmer-Typ und Anzahl Gäste</li>
            <li>etwaige Sonderwünsche (Freitext)</li>
          </ul>
          <p className="mt-3">
            <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage, Vertragsanbahnung, Zimmer-Reservierung
            und Kommunikation rund um Ihren Aufenthalt.
            <br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung und
            -durchführung).
            <br />
            <strong>Speicherdauer:</strong> Bis zur vollständigen Abwicklung der Anfrage / des
            Aufenthalts. Buchungsrelevante Belege (Rechnungen) werden nach § 257 HGB / § 147 AO bis
            zu 10 Jahre aufbewahrt.
          </p>
          <p className="mt-3"><strong>Empfänger / Auftragsverarbeiter:</strong></p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Supabase Inc.</strong> — Datenbank-Hosting (Server-Region Frankfurt/Deutschland), siehe Ziffer 6 b.</li>
            <li><strong>Conexa Digital</strong> (Inhaber Eugen Neifer) — technischer Dienstleister für den Betrieb der Buchungs-Technik sowie die Weiterleitung Ihrer Anfrage an unsere Rezeption; betrieben auf Server-Infrastruktur der <strong>Hetzner Online GmbH</strong> (Standort Deutschland) als Sub-Auftragsverarbeiter. Über Annahme oder Ablehnung Ihrer Anfrage entscheidet ausschließlich ein Mensch.</li>
            <li><strong>Resend</strong> (Resend Inc., USA; Versand über EU-Region) — Versand der Bestätigungs-E-Mail an Sie. Übermittelt werden Ihre E-Mail-Adresse und die Eckdaten Ihrer Anfrage. USA-Transfer gestützt auf EU-Standard­vertrags­klauseln.</li>
          </ul>
          <p className="mt-3">Mit allen genannten Dienstleistern bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO. Eine Weitergabe an sonstige Dritte erfolgt nicht.</p>

          <h3 className="font-semibold mt-4 mb-1">Anfrage per E-Mail, Telefon oder Fax</h3>
          <p>
            Wenn Sie uns per E-Mail (info@landhaus-schend.de), Telefon (+49 6573 306) oder Fax
            (+49 6573 99815) kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden
            personenbezogenen Daten (Name, Anfrage-Inhalt, Kontaktdaten) zum Zwecke der Bearbeitung
            bei uns gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bei
            Vertragsanbahnung, sonst Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            zügiger Bearbeitung). Daten werden nicht ohne Ihre Einwilligung weitergegeben.
          </p>

        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">8. Meldepflicht bei Übernachtung</h2>
          <p>
            Aufgrund des Bundesmeldegesetzes (BMG) sind wir verpflichtet, bei ausländischen Gästen
            erweiterte Meldedaten zu erheben (§§ 29 und 30 BMG). Für deutsche Staatsangehörige
            entfällt seit dem 01.01.2025 die Meldescheinpflicht. Die erhobenen Daten werden ein
            Jahr nach der Abreise aufbewahrt und anschließend gelöscht. Rechtsgrundlage:
            Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">9. Keine automatisierte Entscheidungsfindung</h2>
          <p>
            Eine ausschließlich automatisierte Entscheidung im Sinne von Art. 22 DSGVO (Entscheidung
            ohne menschliches Zutun mit rechtlicher Wirkung Ihnen gegenüber) findet nicht statt. Sie
            werden ausschließlich durch menschliche Sachbearbeitung betreut.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">10. Aktualität dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, falls sich rechtliche
            Anforderungen oder unsere Verarbeitungen ändern. Die jeweils aktuelle Fassung finden
            Sie stets auf dieser Seite. Wesentliche Änderungen werden zusätzlich auf der Startseite
            angekündigt.
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

export default Datenschutz;
