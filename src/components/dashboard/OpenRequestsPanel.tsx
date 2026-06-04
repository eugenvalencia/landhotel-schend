// Aktions-Panel ganz oben in der Übersicht: alle offenen Anfragen auf einen Blick.
// Klick auf eine Zeile öffnet den Voll-Detail-Dialog (alle Infos -> dann bestätigen).
// Schnell-Buttons (✓/✗) für den geübten Blick bleiben zusätzlich.

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { eur, formatDate } from "@/lib/format";
import { useOpenRequests, notifyRequestsChanged } from "@/hooks/useOpenRequests";
import BookingDetailDialog from "./BookingDetailDialog";

export default function OpenRequestsPanel() {
  const { requests, count, refresh } = useOpenRequests();
  const [busy, setBusy] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  if (count === 0) return null;

  const act = async (id: string, status: "bestaetigt" | "abgelehnt", e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBusy(id);
    const { error } = await supabase.rpc("set_booking_request_status", { p_booking_id: id, p_status: status });
    setBusy(null);
    if (error) { toast.error("Aktion fehlgeschlagen: " + error.message); return; }
    toast.success(status === "bestaetigt" ? "Anfrage bestätigt" : "Anfrage abgelehnt");
    notifyRequestsChanged();
    refresh();
  };

  return (
    <>
      <Card className="shadow-card border-red-500/40 bg-red-500/[0.03]">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <h2 className="font-semibold">
              {count} {count === 1 ? "neue Anfrage" : "neue Anfragen"} — bitte prüfen
            </h2>
          </div>

          <ul className="space-y-2">
            {requests.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setDetailId(r.id)}
                  className="w-full flex flex-wrap items-center justify-between gap-2 rounded-md border bg-card p-3 text-left text-sm hover:border-secondary/60 hover:bg-accent/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate flex items-center gap-2">
                      {r.guest_name}
                      <span className="font-mono text-xs text-muted-foreground">{r.booking_number}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(r.check_in)} – {formatDate(r.check_out)} · {eur(Number(r.total_price))} · Quelle {r.source ?? "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" disabled={busy === r.id} onClick={(e) => act(r.id, "bestaetigt", e)}>
                      {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Bestätigen
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={(e) => act(r.id, "abgelehnt", e)}>
                      <X className="h-4 w-4" /> Ablehnen
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Tipp: Zeile anklicken zeigt alle Details vor dem Bestätigen.</p>
        </CardContent>
      </Card>

      <BookingDetailDialog
        bookingId={detailId}
        open={!!detailId}
        onOpenChange={(o) => !o && setDetailId(null)}
        onChanged={refresh}
      />
    </>
  );
}
