import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, FileText, AlertTriangle, Check, Download, Eye } from "lucide-react";
import DemoBanner from "../DemoBanner";

interface Subprocessor {
  name: string;
  service: string;
  region: string;
  avv: boolean;
  iso: string;
  description: string;
  dataCategories: string[];
}

interface DocItem {
  name: string;
  status: "aktuell" | "review";
  version: string;
  date: string;
  pages: number;
  description: string;
  excerpt: string;
}

const SUBPROCESSORS: Subprocessor[] = [
  {
    name: "Hetzner Online GmbH", service: "Hosting / Server", region: "DE (Nuernberg)", avv: true, iso: "ISO 27001 + C5",
    description: "Hauptserver, Datenbank-Backups, Application-Hosting.",
    dataCategories: ["Stamm-Datenbank", "Backups (Snapshot)", "App-Logs"],
  },
  {
    name: "Supabase EU", service: "Datenbank / Auth", region: "EU (Frankfurt)", avv: true, iso: "SOC 2 Type II",
    description: "Managed PostgreSQL fuer Buchungsdaten + User-Auth.",
    dataCategories: ["Buchungen", "Gast-Stammdaten", "Authentifizierung", "Audit-Log"],
  },
  {
    name: "Stripe Payments Europe", service: "Online-Zahlungen", region: "IE (Dublin)", avv: true, iso: "PCI DSS Level 1",
    description: "Karten-/PayPal-/Apple-Pay-Verarbeitung. Karten-Daten werden NIE auf Conexa-Servern gespeichert.",
    dataCategories: ["Zahlungsabwicklung", "Kartendaten (token-only)"],
  },
  {
    name: "Vapi AI", service: "Voice-Concierge", region: "US", avv: true, iso: "SOC 2 Type I",
    description: "Telefon-KI-Agent. Audio wird nach Transkription geloescht.",
    dataCategories: ["Anrufaufzeichnungen (temporaer)", "Transkripte"],
  },
  {
    name: "DeepSeek", service: "AI / Konversation", region: "DE-Hosting via Hetzner", avv: true, iso: "—",
    description: "LLM fuer Antwortvorschlaege und RAG-Concierge.",
    dataCategories: ["Prompts (anonymisiert)", "RAG-Index"],
  },
  {
    name: "Resend", service: "Transaktions-E-Mails", region: "EU", avv: true, iso: "ISO 27001",
    description: "Versand Bestaetigungs-, Rechnungs- und Pre-Stay-E-Mails.",
    dataCategories: ["Empfaenger-Adresse", "Mail-Body", "Delivery-Logs"],
  },
];

const DOCUMENTS: DocItem[] = [
  {
    name: "Datenschutzerklaerung", status: "aktuell", version: "v3.2", date: "15.04.2026", pages: 14,
    description: "Welche Daten wir erheben, wofuer und auf welcher Rechtsgrundlage.",
    excerpt: "1. Verantwortlicher\nLandhaus Schend GbR, Hauptstrasse 12, 54552 Immerath.\nGeschaeftsfuehrung: Eugen Neifer.\n\n2. Welche Daten erheben wir?\n• Stammdaten (Name, Adresse, Kontakt) zur Buchungsabwicklung\n• Zahlungsdaten — direkt an Stripe (PCI DSS), bei uns nur Token\n• Anrufdaten ueber Vapi (Transkripte, Audio nach 30 Tagen geloescht)\n• Cookies & Site-Statistik (Plausible, ohne PII)\n\n3. Rechtsgrundlage\nArt. 6 Abs. 1 lit. b DSGVO (Vertrag), lit. a (Einwilligung Marketing), lit. f (berechtigtes Interesse Statistik)\n\n4. Speicherdauer\n• Buchungen: 10 Jahre (Steuer-Aufbewahrungspflicht)\n• Marketing-Profile: 24 Monate ohne Aktivitaet → automatische Loeschung\n…",
  },
  {
    name: "Auftragsverarbeitungs-Vertrag", status: "aktuell", version: "v2.8", date: "01.05.2026", pages: 22,
    description: "AVV-Vertrag zwischen Conexa Digital S.L. (Auftragnehmer) und Landhaus Schend (Auftraggeber).",
    excerpt: 'Praeambel\nDer Auftraggeber (Landhaus Schend GbR) verarbeitet im Rahmen seines Hotelbetriebes personenbezogene Daten. Conexa Digital S.L. (Auftragnehmer) stellt die Software-Plattform „Conexa OS" als SaaS bereit und verarbeitet hierbei personenbezogene Daten im Auftrag.\n\n§ 1 Gegenstand und Dauer\n(1) Gegenstand des Vertrags ist die Verarbeitung von Daten gemaess Art. 4 Nr. 8 DSGVO durch den Auftragnehmer im Rahmen der vereinbarten Leistungen.\n…\n\n§ 5 Technische und organisatorische Massnahmen\nDie TOM sind in Anlage 2 dokumentiert (separate Datei TOM v2.1).\n\n§ 6 Subunternehmer\nDie aktuellen Subprozessoren sind im Tenant-Dashboard unter Compliance-Vault einsehbar und werden 4 Wochen vor jeder Aenderung dem Auftraggeber mitgeteilt.\n…',
  },
  {
    name: "TOM-Dokumentation", status: "aktuell", version: "v2.1", date: "01.05.2026", pages: 18,
    description: "Technische und organisatorische Massnahmen nach Art. 32 DSGVO.",
    excerpt: "1. Vertraulichkeit\n• Zutrittskontrolle: 2-Faktor-Auth fuer Server-Zugang, Hardware-Tokens fuer Conexa-Mitarbeiter\n• Zugangskontrolle: SSO mit Auth0 + Rollen-Modell (admin/staff/readonly)\n• Zugriffskontrolle: Row-Level-Security pro Tenant, vollstaendiges Audit-Log\n\n2. Integritaet\n• Verschluesselung: TLS 1.3 in Transit, AES-256 at Rest (Hetzner Volume Encryption)\n• Backups: taegliche Full-Backups, 30 Tage retention, geografisch getrennt\n\n3. Verfuegbarkeit\n• Monitoring: 24/7 via Grafana, SLA 99.5%\n• Wiederherstellung: RTO 4h, RPO 1h\n…",
  },
  {
    name: "Loeschkonzept", status: "review", version: "v1.4", date: "10.03.2026", pages: 8,
    description: "Wann werden welche Daten geloescht oder anonymisiert.",
    excerpt: "Zweck\nDieses Dokument legt fest, welche personenbezogenen Daten in welchem Zustand fuer welchen Zeitraum aufbewahrt und wann sie geloescht werden.\n\nKategorien\n1. Buchungsbelege → 10 Jahre (§ 147 AO)\n2. Stammdaten Gast (nicht-buchungs-bezogen) → 24 Monate nach letzter Aktivitaet\n3. Marketing-Profile → 24 Monate ohne Newsletter-Click\n4. Anruf-Audio → 30 Tage, Transkript 90 Tage\n5. Server-Logs → 30 Tage\n6. Backups → 30 Tage rollend\n\nPRUEFUNG FAELLIG: letzte Aktualisierung > 6 Monate. Bitte mit Rechtsabteilung absprechen ob Verlaengerung Marketing-Profil-Aufbewahrung sinnvoll.\n…",
  },
  {
    name: "Verfahrensverzeichnis", status: "aktuell", version: "v2.0", date: "01.05.2026", pages: 16,
    description: "Verzeichnis der Verarbeitungstaetigkeiten nach Art. 30 DSGVO.",
    excerpt: "Verarbeitung 1: Online-Buchungsabwicklung\nZweck: Hotelreservierung, Vertragsabwicklung\nKategorien Daten: Name, Anschrift, Geburtsdatum, Reisedaten, Zahlungsdaten\nEmpfaenger: Hotel-Personal, Stripe (Zahlungsabwickler), Steuerbuero (DATEV-Export)\nLoeschfrist: 10 Jahre nach Vertragsende\nTOM: TLS, RLS, Audit-Log\n\nVerarbeitung 2: Marketing-Kommunikation\n…",
  },
  {
    name: "Notfall-Plan / Breach-Response", status: "aktuell", version: "v1.5", date: "10.04.2026", pages: 6,
    description: "Wer macht was bei einem Datenschutzvorfall? 72-Stunden-Meldepflicht-Workflow.",
    excerpt: "Erkennung\n• Audit-Log-Alarm bei ungewoehnlichen Zugriffen\n• Stripe-Webhook bei Card-Testing-Patterns\n• Operator-Mode-Alert bei Tenant-uebergreifenden Zugriff ohne Reason\n\nReaktion (in dieser Reihenfolge)\n1. Sofort: Datenfluss stoppen (Tenant pausieren wenn noetig)\n2. < 2h: Incident-Team aktivieren (Eugen + DSB)\n3. < 24h: Forensik-Snapshot ziehen\n4. < 72h: Meldung an LDI Rheinland-Pfalz wenn meldepflichtig (Art. 33 DSGVO)\n5. Information der Betroffenen wenn hohes Risiko (Art. 34 DSGVO)\n6. Nachbereitung: Root-Cause-Analyse + Massnahmen\n…",
  },
];

export default function DemoComplianceTab() {
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subprocessor | null>(null);

  return (
    <div>
      <DemoBanner description="Alle DSGVO-Pflicht-Dokumente, AVV-Vertraege mit Subprozessoren, TOM-Massnahmen — fuer dich + dein Steuerbuero + Pruefungen jederzeit abrufbar. Klick auf einen Eintrag zeigt Inhalt." />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-secondary" /> Compliance-Vault
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Versionierte Pflicht-Dokumente + Subprozessoren-Liste. Stand: 15.05.2026.
          </p>
        </div>
        <Badge variant="default" className="gap-1.5"><Check className="h-3 w-3" />Compliant</Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-secondary" /> Dokumente</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {DOCUMENTS.map((d) => (
                <li
                  key={d.name}
                  onClick={() => setSelectedDoc(d)}
                  className="py-2.5 flex items-center justify-between gap-3 text-sm cursor-pointer hover:bg-muted/40 -mx-2 px-2 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">Version {d.version} · {d.pages} S. · {d.date}</div>
                  </div>
                  {d.status === "review" ? (
                    <Badge variant="outline" className="gap-1 text-[10px]"><AlertTriangle className="h-3 w-3" /> Pruefung faellig</Badge>
                  ) : (
                    <Badge variant="default" className="gap-1 text-[10px]"><Check className="h-3 w-3" /> aktuell</Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary" /> Subprozessoren</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {SUBPROCESSORS.map((p) => (
                <li
                  key={p.name}
                  onClick={() => setSelectedSub(p)}
                  className="py-2.5 text-sm cursor-pointer hover:bg-muted/40 -mx-2 px-2 rounded"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{p.name}</div>
                    <span className="text-xs text-muted-foreground">{p.region}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {p.service} · {p.iso} {p.avv ? "· AVV liegt vor" : ""}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <DocPreviewDialog doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      <SubprocessorDialog sub={selectedSub} onClose={() => setSelectedSub(null)} />
    </div>
  );
}

function DocPreviewDialog({ doc, onClose }: { doc: DocItem | null; onClose: () => void }) {
  if (!doc) return null;
  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" /> {doc.name}
          </DialogTitle>
        </DialogHeader>
        <div className="text-xs text-muted-foreground flex items-center gap-3 -mt-1">
          <span>Version {doc.version}</span>
          <span>·</span>
          <span>{doc.pages} Seiten</span>
          <span>·</span>
          <span>Stand: {doc.date}</span>
        </div>
        <p className="text-sm text-muted-foreground">{doc.description}</p>
        <div className="border rounded-md bg-muted/30 px-4 py-3 max-h-[340px] overflow-y-auto">
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">{doc.excerpt}</pre>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Schliessen</Button>
          <Button onClick={() => alert("Demo: in produktiv wuerde das PDF jetzt heruntergeladen.")} className="gap-2">
            <Download className="h-4 w-4" /> PDF herunterladen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubprocessorDialog({ sub, onClose }: { sub: Subprocessor | null; onClose: () => void }) {
  if (!sub) return null;
  return (
    <Dialog open={!!sub} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sub.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{sub.service}</Badge>
            <Badge variant="outline">{sub.region}</Badge>
            <Badge variant="outline">{sub.iso}</Badge>
            {sub.avv && <Badge variant="default" className="gap-1"><Check className="h-3 w-3" />AVV</Badge>}
          </div>
          <p className="text-muted-foreground leading-relaxed">{sub.description}</p>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Datenkategorien</p>
            <ul className="space-y-1">
              {sub.dataCategories.map((c) => (
                <li key={c} className="flex items-center gap-2"><Eye className="h-3 w-3 text-muted-foreground" /> {c}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end pt-1">
            <Button variant="ghost" onClick={onClose}>Schliessen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
