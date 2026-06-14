import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSEO } from "@/hooks/useSEO";

const AGB = () => {
  useSEO({
    title: "AGB",
    description: "Allgemeine Geschäftsbedingungen für Beherbergungsverträge mit dem Landhotel Schend, Immerath.",
    canonical: "/agb",
    noindex: true,
  });
  return (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main id="main" className="flex-1 container mx-auto px-4 pt-28 md:pt-32 pb-16 max-w-3xl">
      <p className="eyebrow mb-4">Rechtliches</p>
      <h1 className="font-display text-4xl md:text-5xl mb-12 text-balance leading-[1.05]">
        Allgemeine Geschäftsbedingungen
      </h1>

      <div className="space-y-10 text-foreground/90 leading-relaxed">

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 1 Geltungsbereich</h2>
          <p>
            (1) Diese Allgemeinen Geschäftsbedingungen gelten für Verträge über die mietweise
            Überlassung von Hotelzimmern zur Beherbergung sowie alle für den Gast erbrachten
            weiteren Leistungen und Lieferungen des Hotels (Beherbergungsvertrag).
          </p>
          <p className="mt-3">
            (2) Die Unter- oder Weitervermietung der überlassenen Zimmer sowie deren Nutzung zu
            anderen als Beherbergungszwecken bedürfen der vorherigen schriftlichen Zustimmung des
            Hotels.
          </p>
          <p className="mt-3">
            (3) Allgemeine Geschäftsbedingungen des Gastes finden nur Anwendung, wenn dies vorher
            ausdrücklich schriftlich vereinbart wurde.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 2 Vertragsschluss, Vertragspartner, Haftung</h2>
          <p>
            (1) Der Vertrag kommt durch die Annahme der Buchungs-Anfrage des Gastes durch das
            Hotel zustande. Die Annahme bedarf der Bestätigung in Textform (E-Mail) oder
            mündlich. Es steht dem Hotel frei, die Buchung schriftlich (E-Mail) zu bestätigen.
          </p>
          <p className="mt-3">
            (2) Vertragspartner sind das Hotel (Landhotel Schend, Inhaber Eugen Beimler) und der
            Gast. Hat ein Dritter für den Gast bestellt, haftet er dem Hotel gegenüber zusammen
            mit dem Gast als Gesamtschuldner für alle Verpflichtungen aus dem Beherbergungsvertrag.
          </p>
          <p className="mt-3">
            (3) Das Hotel haftet für seine Verpflichtungen aus dem Vertrag in allen Fällen, in
            denen ihm, seinen gesetzlichen Vertretern oder Erfüllungsgehilfen Vorsatz oder grobe
            Fahrlässigkeit zur Last fällt sowie bei Verletzung wesentlicher Vertragspflichten
            (Kardinalpflichten). Im Übrigen ist die Haftung des Hotels — gleich aus welchem
            Rechtsgrund — auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
          </p>
          <p className="mt-3">
            (4) Für eingebrachte Sachen haftet das Hotel nach Maßgabe der gesetzlichen
            Bestimmungen, also bis zum Hundertfachen des Zimmerpreises, höchstens 3.500 EUR, für
            Geld, Wertpapiere und Kostbarkeiten bis zu 800 EUR. Geld, Wertpapiere und
            Kostbarkeiten können bis zu einem Höchstwert von 8.000 EUR im Hotelsafe / an der
            Rezeption hinterlegt werden.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 3 Leistungen, Preise, Zahlung</h2>
          <p>
            (1) Das Hotel ist verpflichtet, die vom Gast gebuchten Zimmer bereitzuhalten und die
            vereinbarten Leistungen zu erbringen.
          </p>
          <p className="mt-3">
            (2) Der Gast ist verpflichtet, die für die Zimmerüberlassung und die von ihm in
            Anspruch genommenen weiteren Leistungen geltenden bzw. vereinbarten Preise des Hotels
            zu zahlen. Dies gilt auch für vom Gast veranlasste Leistungen und Auslagen des Hotels
            an Dritte.
          </p>
          <p className="mt-3">
            (3) Die vereinbarten Preise schließen die jeweilige gesetzliche Mehrwertsteuer ein.
            Eine etwaige kommunale Bettensteuer / Kurtaxe wird separat ausgewiesen und ist —
            sofern erhoben — vom Gast zusätzlich zu entrichten.
          </p>
          <p className="mt-3">
            (4) <strong>Die Zahlung erfolgt vor Ort bei An- oder Abreise</strong> (bar, EC- oder
            Kreditkarte). Über die Website werden keine Online-Zahlungen, Anzahlungen oder
            Kreditkartendaten erhoben. Bei Gruppen- oder Sonderbuchungen kann das Hotel vor Anreise
            eine angemessene schriftliche Reservierungsbestätigung oder Anzahlung vereinbaren; dies
            wird dem Gast vorab gesondert mitgeteilt.
          </p>
          <p className="mt-3">
            (5) Rechnungen des Hotels sind sofort nach Erhalt ohne Abzug zur Zahlung fällig.
            Bei Zahlungsverzug ist das Hotel berechtigt, Verzugszinsen in gesetzlicher Höhe zu
            verlangen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 4 Rücktritt des Gastes (Stornierung)</h2>
          <p>
            (1) Eine Stornierung der Buchung durch den Gast bedarf der schriftlichen Zustimmung
            des Hotels. Erfolgt diese nicht, so ist der vereinbarte Preis aus dem Vertrag auch
            dann zu zahlen, wenn der Gast vertragliche Leistungen nicht in Anspruch nimmt.
          </p>
          <p className="mt-3">
            (2) Sofern zwischen Hotel und Gast ein Termin zum kostenfreien Rücktritt vom Vertrag
            schriftlich vereinbart wurde, kann der Gast bis dahin vom Vertrag zurücktreten, ohne
            Zahlungs- oder Schadensersatzansprüche des Hotels auszulösen.
          </p>
          <p className="mt-3">
            (3) Sofern eine Möglichkeit zum kostenfreien Rücktritt nicht vereinbart oder bereits
            abgelaufen ist, behält sich das Hotel folgende Stornopauschalen vor:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>bis 14 Tage vor Anreise: kostenfreie Stornierung</li>
            <li>13 bis 7 Tage vor Anreise: 50 % des vereinbarten Zimmerpreises</li>
            <li>6 bis 1 Tag vor Anreise: 80 % des vereinbarten Zimmerpreises</li>
            <li>am Anreisetag oder bei Nichtanreise (No-Show): 90 % des vereinbarten Zimmerpreises</li>
          </ul>
          <p className="mt-3">
            (4) Dem Gast steht der Nachweis frei, dass dem Hotel kein oder ein wesentlich
            geringerer Schaden entstanden ist. Das Hotel ist verpflichtet, sich um anderweitige
            Vermietung der nicht in Anspruch genommenen Zimmer zu bemühen, um Ausfälle zu
            vermeiden.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 5 Rücktritt des Hotels</h2>
          <p>
            (1) Das Hotel ist berechtigt, vom Vertrag zurückzutreten, wenn die vereinbarte
            Vorauszahlung oder Sicherheitsleistung trotz Mahnung mit angemessener Nachfristsetzung
            nicht erbracht wird.
          </p>
          <p className="mt-3">
            (2) Bei höherer Gewalt oder sonstigen unvorhersehbaren, vom Hotel nicht zu
            vertretenden Umständen, welche die Erfüllung des Vertrages unmöglich machen, ist das
            Hotel zum kostenfreien Rücktritt berechtigt.
          </p>
          <p className="mt-3">
            (3) Das Hotel kann ferner aus sachlich gerechtfertigtem Grund vom Vertrag
            außerordentlich zurücktreten, insbesondere bei begründetem Verdacht, dass die
            Inanspruchnahme der Hotel-Leistung den reibungslosen Geschäftsbetrieb, die
            Sicherheit oder das Ansehen des Hotels gefährden könnte.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 6 Zimmerbereitstellung, Übergabe und Rückgabe</h2>
          <p>
            (1) Der Gast hat keinen Anspruch auf die Bereitstellung bestimmter Zimmer.
          </p>
          <p className="mt-3">
            (2) Gebuchte Zimmer stehen dem Gast ab 15:00 Uhr des vereinbarten Anreisetages zur
            Verfügung. Der Gast hat keinen Anspruch auf frühere Bereitstellung.
          </p>
          <p className="mt-3">
            (3) Am vereinbarten Abreisetag sind die Zimmer dem Hotel bis 11:00 Uhr geräumt zur
            Verfügung zu stellen. Danach kann das Hotel über die durch die verspätete Räumung des
            Zimmers hinausgehende Nutzung des Zimmers bis 18:00 Uhr 50 % des vollen
            Logispreises, ab 18:00 Uhr 100 % in Rechnung stellen. Vertragliche Ansprüche des
            Gastes werden hierdurch nicht begründet.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 7 Haustiere</h2>
          <p>
            Haustiere (insbesondere Hunde) dürfen nach vorheriger Absprache mit dem Hotel
            mitgebracht werden. Es wird ein Reinigungs-/Hygiene-Zuschlag erhoben, dessen Höhe
            sich nach der jeweils aktuellen Preisliste richtet.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 8 Hausordnung</h2>
          <p>
            Im Hotel gelten insbesondere folgende Regeln: Nachtruhe ab 22:00 Uhr; in allen
            Innenbereichen besteht Rauchverbot. Eine ausführliche Hausordnung mit weiteren Hinweisen
            (z.&nbsp;B. zu Frühstücks- und Check-out-Zeiten) liegt im Hotel aus und kann an der
            Rezeption eingesehen werden. Änderungen der Hausordnung gelten nur, soweit sie für den
            Gast zumutbar und mit seinen berechtigten Interessen vereinbar sind.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl mb-3">§ 9 Schlussbestimmungen</h2>
          <p>
            (1) Änderungen oder Ergänzungen des Vertrages, der Antragsannahme oder dieser
            Geschäftsbedingungen sollen in Textform erfolgen.
          </p>
          <p className="mt-3">
            (2) Erfüllungsort und Zahlungsort ist der Sitz des Hotels.
          </p>
          <p className="mt-3">
            (3) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Verbraucher-Schutz­vorschriften
            zwingenden Rechts bleiben unberührt.
          </p>
          <p className="mt-3">
            (4) Sollten einzelne Bestimmungen dieser Allgemeinen Geschäftsbedingungen unwirksam
            oder nichtig sein oder werden, so wird dadurch die Wirksamkeit der übrigen
            Bestimmungen nicht berührt. Im Übrigen gelten die gesetzlichen Vorschriften.
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

export default AGB;
