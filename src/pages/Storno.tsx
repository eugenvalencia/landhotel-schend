// Self-Service-Storno-Seite. Aufruf über den Link in der Bestätigungsmail:
//   /storno?b=<booking_id>&t=<notify_token>
// Der Token autorisiert den Zugriff (IDOR-Schutz, serverseitig in den RPCs geprüft).
// Schend storniert IMMER kostenlos & sofort — daher nur zwei Zustände:
// stornierbar (kostenfrei) ODER bereits storniert.
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { notifyBooking } from "@/lib/notify-booking";
import { formatDate } from "@/lib/format";
import { CheckCircle2, AlertTriangle, Phone, Loader2 } from "lucide-react";

const HOTEL_PHONE = "+49 6573 306";
const HOTEL_TEL = "tel:+4965731306";

type Mode = "immediate" | "already_cancelled";

interface Preview {
  booking_number: string;
  guest_name: string;
  room_name: string;
  check_in: string;
  check_out: string;
  request_status: string;
  days_to_arrival: number;
  mode: Mode;
  fee_pct: number;
  reason: string | null;
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col items-center px-4 py-12 md:py-20">
    <div className="w-full max-w-xl">
      <div className="text-center mb-8">
        <img src="/schend-mark.png" alt="Landhaus Schend" className="h-12 md:h-14 w-auto mx-auto mb-4" />
        <p className="eyebrow !text-secondary">★★★ Superior</p>
        <h1 className="font-display text-3xl md:text-4xl mt-2">Landhaus Schend</h1>
        <p className="text-sm text-muted-foreground mt-1">Stornierung</p>
      </div>
      <div className="rounded-lg border bg-card p-6 md:p-8 shadow-card">{children}</div>
      <p className="text-center text-xs text-muted-foreground mt-6">
        Fragen? <a href={HOTEL_TEL} className="underline underline-offset-2 hover:text-foreground">{HOTEL_PHONE}</a>
      </p>
    </div>
  </div>
);

const SummaryRows = ({ p }: { p: Preview }) => (
  <dl className="mt-5 space-y-2 text-sm border-t pt-5">
    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Buchungsnr.</dt><dd className="font-medium">{p.booking_number}</dd></div>
    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Zimmer</dt><dd className="font-medium text-right">{p.room_name}</dd></div>
    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Anreise</dt><dd className="font-medium text-right">{formatDate(p.check_in)}</dd></div>
    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Abreise</dt><dd className="font-medium text-right">{formatDate(p.check_out)}</dd></div>
  </dl>
);

export default function Storno() {
  const [params] = useSearchParams();
  const b = params.get("b") ?? "";
  const t = params.get("t") ?? "";

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    if (!b || !t) { setLoadError(true); setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase.rpc("get_cancellation_preview", { p_booking_id: b, p_token: t });
      if (!active) return;
      if (error || !data) setLoadError(true);
      else setPreview(data as unknown as Preview);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [b, t]);

  const handleCancel = async () => {
    if (!preview) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("cancel_booking", {
        p_booking_id: b, p_token: t, p_reason: reason.trim() || null,
      });
      if (error || !data) throw error ?? new Error("no data");
      const result = (data as unknown as { result: string }).result;
      if (result === "cancelled") {
        // Storno-Bestätigungsmail best-effort auslösen (Token autorisiert genau diese Mail).
        notifyBooking(b, "cancellation", t);
        setDone(true);
      } else {
        // already_cancelled → Zustand übernehmen
        setPreview((prev) => (prev ? { ...prev, mode: "already_cancelled" } : prev));
        toast.message("Diese Buchung ist bereits storniert.");
      }
    } catch {
      toast.error("Stornierung konnte nicht verarbeitet werden. Bitte rufen Sie uns an: " + HOTEL_PHONE);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Shell><div className="flex items-center justify-center gap-3 py-8 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Wird geladen…</div></Shell>;
  }

  if (loadError || !preview) {
    return (
      <Shell>
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
          <h2 className="font-display text-2xl mb-2">Link ungültig</h2>
          <p className="text-muted-foreground text-sm">Dieser Storno-Link ist ungültig oder abgelaufen. Bitte rufen Sie uns an, wir helfen Ihnen gern weiter.</p>
          <Button asChild variant="outline" className="mt-6"><a href={HOTEL_TEL}><Phone className="h-4 w-4" /> {HOTEL_PHONE}</a></Button>
        </div>
      </Shell>
    );
  }

  // Erfolgs-Zustand nach Storno
  if (done) {
    return (
      <Shell>
        <div className="text-center">
          <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-display text-2xl md:text-3xl mb-3">Buchung storniert</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ihre Buchung wurde storniert — es entstehen Ihnen keine Kosten. Eine Bestätigung senden wir an Ihre E-Mail.
          </p>
          <SummaryRows p={preview} />
          <Button asChild className="mt-7"><Link to="/">Zur Startseite</Link></Button>
        </div>
      </Shell>
    );
  }

  // Bereits storniert
  if (preview.mode === "already_cancelled") {
    return (
      <Shell>
        <div className="text-center">
          <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
          <h2 className="font-display text-2xl mb-2">Bereits storniert</h2>
          <p className="text-muted-foreground leading-relaxed">Diese Buchung ist bereits storniert. Es entstehen Ihnen keine Kosten.</p>
          <SummaryRows p={preview} />
          <div className="mt-6"><Button asChild variant="ghost" size="sm"><Link to="/">Zur Startseite</Link></Button></div>
        </div>
      </Shell>
    );
  }

  // Stornierbar — immer kostenfrei und sofort
  return (
    <Shell>
      <h2 className="font-display text-2xl md:text-3xl text-center">Buchung stornieren?</h2>
      <p className="text-center text-muted-foreground text-sm mt-2">
        Liebe(r) {preview.guest_name.split(" ")[0]}, möchten Sie diese Buchung wirklich stornieren?
      </p>

      <SummaryRows p={preview} />

      <div className="mt-5 rounded-md p-4 text-sm leading-relaxed bg-success/10 border border-success/20">
        <strong>Kostenfreie Stornierung.</strong> Bei uns ist die Stornierung jederzeit kostenlos — es fallen keine Kosten an. Der Termin wird sofort wieder freigegeben.
      </div>

      <label className="block mt-5 text-sm">
        <span className="text-muted-foreground">Grund (optional)</span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="z. B. Termin verschoben"
          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button onClick={handleCancel} disabled={submitting} className="flex-1">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Wird verarbeitet…</> : "Jetzt kostenfrei stornieren"}
        </Button>
        <Button asChild variant="outline" className="flex-1"><Link to="/">Abbrechen</Link></Button>
      </div>
    </Shell>
  );
}
