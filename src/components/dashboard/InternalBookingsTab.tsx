import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, NotebookPen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";

/**
 * Notizbuch-Modus: Hausinterne Buchungen ohne Steuer-Spur.
 *
 * Schend's Notizbuch-Workflow digital abgebildet — Familie kommt für 3 Tage,
 * Reservierung wird erfasst, Zimmer ist im Kalender blockiert, aber:
 *   - booking_type = "intern"
 *   - total_price  = 0
 *   - payment_status = "paid" (damit Kalender es als "kein offener Betrag" zeigt)
 *
 * Dadurch landet die Buchung im internen Kalender, aber nicht in Revenue-Reports.
 */

type Room = { id: string; name: string };

type InternalBookingRow = {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  notes: string | null;
  room_id: string;
  rooms?: { name: string } | null;
};

const PRESETS = [
  "Familie Schend",
  "Wartung / Handwerker",
  "Privat — Eugen",
  "Saisonpause",
];

export default function InternalBookingsTab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [list, setList] = useState<InternalBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    guest_name: PRESETS[0],
    room_id: "",
    check_in: "",
    check_out: "",
    notes: "",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      const [rRes, bRes] = await Promise.all([
        supabase.from("rooms").select("id, name").eq("status", "aktiv").order("name"),
        supabase
          .from("bookings")
          .select("id, guest_name, check_in, check_out, notes, room_id, rooms(name)")
          .eq("booking_type", "intern")
          .order("check_in", { ascending: false })
          .limit(50),
      ]);
      if (!active) return;
      setRooms((rRes.data as Room[] | null) ?? []);
      setList((bRes.data as unknown as InternalBookingRow[] | null) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const canSubmit = useMemo(
    () => form.guest_name.trim() && form.room_id && form.check_in && form.check_out && form.check_in < form.check_out,
    [form],
  );

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        guest_name: form.guest_name.trim(),
        room_id: form.room_id,
        check_in: form.check_in,
        check_out: form.check_out,
        notes: form.notes.trim() || null,
        booking_type: "intern",
        total_price: 0,
        payment_status: "paid",
        booking_number: "INT" + Date.now().toString().slice(-8),
      } as never);
      if (error) throw error;
      toast.success("Interne Buchung eingetragen.");
      setDialogOpen(false);
      setForm({ guest_name: PRESETS[0], room_id: "", check_in: "", check_out: "", notes: "" });
      // Liste neu laden
      const { data } = await supabase
        .from("bookings")
        .select("id, guest_name, check_in, check_out, notes, room_id, rooms(name)")
        .eq("booking_type", "intern")
        .order("check_in", { ascending: false })
        .limit(50);
      setList((data as unknown as InternalBookingRow[] | null) ?? []);
    } catch (err) {
      toast.error(`Speichern fehlgeschlagen: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-secondary" /> Notizbuch
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Hausinterne Buchungen — Familienbesuch, Handwerker, Saisonpause.
            Zimmer ist im Kalender blockiert, aber kein Umsatz, kein Steuer-Eintrag.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Neuer Eintrag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Interne Buchung</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Wer / Anlass</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESETS.map((p) => (
                    <Badge
                      key={p}
                      variant={form.guest_name === p ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setForm((f) => ({ ...f, guest_name: p }))}
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
                <Input
                  value={form.guest_name}
                  onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))}
                  placeholder="z.B. Familie Müller (Bekannte)"
                />
              </div>

              <div className="space-y-2">
                <Label>Zimmer</Label>
                <Select value={form.room_id} onValueChange={(v) => setForm((f) => ({ ...f, room_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zimmer wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Anreise</Label>
                  <Input
                    type="date"
                    value={form.check_in}
                    onChange={(e) => setForm((f) => ({ ...f, check_in: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Abreise</Label>
                  <Input
                    type="date"
                    value={form.check_out}
                    onChange={(e) => setForm((f) => ({ ...f, check_out: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notiz (optional)</Label>
                <Textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Reinigung am Vortag erledigt, Kaffeemaschine läuft"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={submit} disabled={!canSubmit || submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Eintragen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Letzte interne Buchungen</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Lade …</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Noch keine internen Buchungen. „Neuer Eintrag" rechts oben.
            </p>
          ) : (
            <ul className="divide-y">
              {list.map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">{b.guest_name}</div>
                    <div className="text-muted-foreground text-xs">
                      {b.rooms?.name ?? "Zimmer"} · {formatDate(b.check_in)} → {formatDate(b.check_out)}
                    </div>
                    {b.notes && <div className="text-xs text-muted-foreground italic">{b.notes}</div>}
                  </div>
                  <Badge variant="outline" className="text-[10px]">intern</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
