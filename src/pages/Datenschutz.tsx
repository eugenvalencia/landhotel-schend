import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSEO } from "@/hooks/useSEO";

const Datenschutz = () => {
  useSEO({
    title: "Datenschutz",
    description: "Datenschutzerklärung gemäß DSGVO für die Website des Landhotel Schend.",
    canonical: "/datenschutz",
    noindex: true,
  });
  return (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main className="flex-1 container mx-auto px-4 pt-32 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Datenschutzerklärung</h1>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">1. Datenschutz auf einen Blick</h2>
          <h3 className="font-semibold mt-4 mb-1">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten
            sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche
            Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
            Datenschutzerklärung.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">2. Verantwortliche Stelle</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
            Eugen Beimler<br />
            Landhotel Schend<br />
            Hauptstraße 9<br />
            54552 Immerath<br />
            Telefon: <a href="tel:+4965731306" className="text-secondary hover:underline">+49 6573 306</a><br />
            E-Mail: <a href="mailto:info@landhaus-schend.de" className="text-secondary hover:underline">info@landhaus-schend.de</a>
          </p>
          <p className="mt-3">
            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
            gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
            Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">3. Hosting</h2>
          <p>
            Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
          </p>
          <h3 className="font-semibold mt-4 mb-1">IONOS</h3>
          <p>
            Anbieter ist die IONOS SE, Elgendorfer Str. 57, 56410 Montabaur (nachfolgend „IONOS"). Wenn
            Sie unsere Website besuchen, erfasst IONOS verschiedene Logfiles inklusive Ihrer
            IP-Adressen. Details entnehmen Sie der Datenschutzerklärung von IONOS:{" "}
            <a
              href="https://www.ionos.de/terms-gtc/terms-privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline break-all"
            >
              https://www.ionos.de/terms-gtc/terms-privacy
            </a>
            .
          </p>
          <p className="mt-3">
            Die Verwendung von IONOS erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben
            ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">4. Allgemeine Hinweise und Pflichtinformationen</h2>
          <h3 className="font-semibold mt-4 mb-1">Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
            behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
            Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>
          <p className="mt-3">
            Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
            Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
            Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir
            sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
          </p>

          <h3 className="font-semibold mt-4 mb-1">Hinweis zur verantwortlichen Stelle</h3>
          <p>Siehe Abschnitt 2.</p>

          <h3 className="font-semibold mt-4 mb-1">Speicherdauer</h3>
          <p>
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
            wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
            Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder
            eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir
            keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen
            Daten haben.
          </p>

          <h3 className="font-semibold mt-4 mb-1">SSL- bzw. TLS-Verschlüsselung</h3>
          <p>
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
            Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
            daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem
            Schloss-Symbol in Ihrer Browserzeile.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">5. Ihre Rechte</h2>
          <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren
              Herkunft, Empfänger und den Zweck der Datenverarbeitung</li>
            <li>Berichtigung oder Löschung dieser Daten</li>
            <li>Widerruf einer einmal erteilten Einwilligung mit Wirkung für die Zukunft</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
            <li>Beschwerde bei der zuständigen Aufsichtsbehörde</li>
          </ul>
          <p className="mt-3">
            Hierzu sowie zu weiteren Fragen zum Thema personenbezogener Daten können Sie sich jederzeit
            an uns wenden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">6. Datenerfassung auf dieser Website</h2>
          <h3 className="font-semibold mt-4 mb-1">Cookies</h3>
          <p>
            Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und
            richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die
            Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem
            Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht.
          </p>
          <p className="mt-3">
            Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs, zur
            Bereitstellung bestimmter, von Ihnen erwünschter Funktionen oder zur Optimierung der
            Website erforderlich sind (z. B. Cookies zur Messung des Webpublikums), werden auf
            Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine andere Rechtsgrundlage
            angegeben wird. Soweit eine Einwilligung zur Speicherung von Cookies abgefragt wurde,
            erfolgt die Speicherung der betreffenden Cookies ausschließlich auf Grundlage dieser
            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); die Einwilligung ist jederzeit widerrufbar.
          </p>
          <p className="mt-3">
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
            werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle
            oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des
            Browsers aktivieren.
          </p>

          <h3 className="font-semibold mt-4 mb-1">Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p className="mt-3">
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
          </p>

          <h3 className="font-semibold mt-4 mb-1">Anfrage per E-Mail oder Telefon</h3>
          <p>
            Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller
            daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung
            Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne
            Ihre Einwilligung weiter.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4">
          Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long" })}
        </p>
      </div>
    </main>
    <SiteFooter />
  </div>
  );
};

export default Datenschutz;
