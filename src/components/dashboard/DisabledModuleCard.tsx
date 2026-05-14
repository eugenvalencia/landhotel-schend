import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTenant } from "@/hooks/useTenant";
import type { ModuleDescriptor } from "@/lib/tenant";

interface Props {
  module: ModuleDescriptor;
}

/**
 * Wird angezeigt wenn ein Modul in der Tenant-Config auf `disabled` steht.
 * Sales-Hebel: das Modul ist sichtbar aber grau, mit klarer Aktivieren-CTA.
 *
 * Der Klick logt im Audit-Log einen Aktivierungs-Wunsch — Conexa Support sieht
 * das im Operator-Mode und kann den Schalter manuell umlegen.
 */
export default function DisabledModuleCard({ module }: Props) {
  const { tenant } = useTenant();

  const requestActivation = async () => {
    // Audit-Log-Eintrag schreiben — Operator-Mode picked das später auf.
    // Wir importieren supabase hier dynamisch um den Bundle leichter zu halten.
    if (!tenant) {
      toast.error("Konnte Anfrage nicht senden — Tenant nicht geladen.");
      return;
    }
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await (supabase as any).from("audit_log").insert({
        tenant_id: tenant.id,
        actor_role: "admin",
        action: "feature.activation_requested",
        entity_type: "feature",
        metadata: { feature_key: module.key, requested_at: new Date().toISOString() },
      });
      if (error) throw error;
      toast.success(`Aktivierung von „${module.label}" angefragt. Conexa meldet sich.`);
    } catch (err) {
      toast.error(`Anfrage fehlgeschlagen: ${(err as Error).message ?? "unbekannter Fehler"}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-card border-dashed">
        <CardContent className="p-8 text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display">{module.label}</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {module.shortPitch}
            </p>
          </div>
          {module.whyDisabled && (
            <p className="text-xs text-muted-foreground/80 italic max-w-md mx-auto border-t border-border/60 pt-4">
              {module.whyDisabled}
            </p>
          )}
          <div className="pt-2">
            <Button onClick={requestActivation} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Modul aktivieren lassen
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            Aktivierung erfolgt durch Conexa. Wir melden uns innerhalb von 24 h.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
