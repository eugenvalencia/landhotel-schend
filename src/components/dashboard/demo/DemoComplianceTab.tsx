import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileText, AlertTriangle, Check } from "lucide-react";
import DemoBanner from "../DemoBanner";

const SUBPROCESSORS = [
  { name: "Hetzner Online GmbH",  service: "Hosting / Server",       region: "DE (Nuernberg)", avv: true,  iso: "ISO 27001 + C5"  },
  { name: "Supabase EU",          service: "Datenbank / Auth",       region: "EU (Frankfurt)", avv: true,  iso: "SOC 2 Type II"   },
  { name: "Stripe Payments Europe",service:"Online-Zahlungen",       region: "IE (Dublin)",    avv: true,  iso: "PCI DSS Level 1" },
  { name: "Vapi AI",              service: "Voice-Concierge",        region: "US",             avv: true,  iso: "SOC 2 Type I"    },
  { name: "DeepSeek",             service: "AI / Konversation",      region: "DE-Hosting via Hetzner", avv: true,  iso: "—" },
  { name: "Resend",               service: "Transaktions-E-Mails",   region: "EU",             avv: true,  iso: "ISO 27001"       },
];

const DOCUMENTS = [
  { name: "Datenschutzerklaerung",          status: "aktuell",  version: "v3.2", date: "15.04.2026" },
  { name: "Auftragsverarbeitungs-Vertrag",  status: "aktuell",  version: "v2.8", date: "01.05.2026" },
  { name: "TOM-Dokumentation",              status: "aktuell",  version: "v2.1", date: "01.05.2026" },
  { name: "Loeschkonzept",                  status: "review",   version: "v1.4", date: "10.03.2026" },
  { name: "Verfahrensverzeichnis",          status: "aktuell",  version: "v2.0", date: "01.05.2026" },
  { name: "Notfall-Plan / Breach-Response", status: "aktuell",  version: "v1.5", date: "10.04.2026" },
];

export default function DemoComplianceTab() {
  return (
    <div>
      <DemoBanner description="Alle DSGVO-Pflicht-Dokumente, AVV-Vertraege mit Subprozessoren, TOM-Massnahmen — fuer dich + dein Steuerbuero + Pruefungen jederzeit abrufbar." />

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
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-secondary" /> Dokumente</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {DOCUMENTS.map((d) => (
                <li key={d.name} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">Version {d.version} · {d.date}</div>
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
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary" /> Subprozessoren</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {SUBPROCESSORS.map((p) => (
                <li key={p.name} className="py-2.5 text-sm">
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
    </div>
  );
}
