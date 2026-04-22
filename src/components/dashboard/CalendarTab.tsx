import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toISODate, formatDateShort } from "@/lib/format";

type Room = { id: string; room_number: number; name: string };
type Booking = {
  id: string; room_id: string; guest_name: string; check_in: string; check_out: string;
  booking_type: "online" | "intern"; payment_status: string;
};

export default function CalendarTab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [internOpen, setInternOpen] = useState(false);
  const [internForm, setInternForm] = useState({ room_id: "", guest_name: "", check_in: "", check_out: "", notes: "" });

  const loadAll = async () => {
    const [{ data: r }, { data: b }] = await Promise.all([
      supabase.from("rooms").select("id,room_number,name").order("room_number"),
      supabase.from("bookings").select("id,room_id,guest_name,check_in,check_out,booking_type,payment_status"),
    ]);
    setRooms((r as any) ?? []);
    setBookings((b as any) ?? []);
  };

  useEffect(() => { loadAll(); }, []);

  const { days, monthLabel } = useMemo(() => {
    const now = new Date();
    const ref = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
    const days: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(ref.getFullYear(), ref.getMonth(), i));
    const monthLabel = ref.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
    return { days, monthLabel };
  }, [monthOffset]);

  const cellState = (roomId: string, day: Date): { type: "free" | "online" | "intern"; booking?: Booking } => {
    const iso = toISODate(day);
    const b = bookings.find(
      (x) => x.room_id === roomId && x.payment_status !== "cancelled" && x.check_in <= iso && x.check_out > iso
    );
    if (!b) return { type: "free" };
    return { type: b.booking_type === "intern" ? "intern" : "online", booking: b };
  };

  const submitIntern = async () => {
    if (!internForm.room_id || !internForm.guest_name || !internForm.check_in || !internForm.check_out) {
      toast.error("Bitte alle Felder ausfüllen");
      return;
    }
    if (internForm.check_out <= internForm.check_in) {
      toast.error("Abreise muss nach Anreise liegen");
      return;
    }
    const { error } = await supabase.from("bookings").insert({
      room_id: internForm.room_id,
      guest_name: internForm.guest_name,
      check_in: internForm.check_in,
      check_out: internForm.check_out,
      total_price: 0,
      booking_type: "intern",
      payment_status: "paid",
      notes: internForm.notes,
    });
    if (error) {
      toast.error("Fehler: " + error.message);
      return;
    }
    toast.success("Interne Buchung erstellt");
    setInternOpen(false);
    setInternForm({ room_id: "", guest_name: "", check_in: "", check_out: "", notes: "" });
    loadAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonthOffset((o) => o - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold text-lg capitalize min-w-[180px] text-center">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={() => setMonthOffset((o) => o + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => setMonthOffset(0)}>Heute</Button>
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-free))] border" /> Frei</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-paid))] border" /> Bezahlt</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--cal-intern))] border" /> Intern</span>
          <Button size="sm" onClick={() => setInternOpen(true)}><Plus className="h-4 w-4" /> Intern eintragen</Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                <th className="sticky left-0 bg-muted z-10 text-left font-medium p-2 min-w-[120px] border-b border-r">Zimmer</th>
                {days.map((d) => (
                  <th key={d.toISOString()} className={cn("font-medium p-1 text-center min-w-[36px] border-b", (d.getDay() === 0 || d.getDay() === 6) && "bg-accent/40")}>
                    <div className="text-[10px] text-muted-foreground uppercase">{d.toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2)}</div>
                    <div>{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td className="sticky left-0 bg-card z-10 p-2 font-medium border-b border-r whitespace-nowrap">{r.name}</td>
                  {days.map((d) => {
                    const s = cellState(r.id, d);
                    const cls =
                      s.type === "free" ? "bg-[hsl(var(--cal-free))]" :
                      s.type === "online" ? "bg-[hsl(var(--cal-paid))]" :
                      "bg-[hsl(var(--cal-intern))]";
                    return (
                      <td
                        key={d.toISOString()}
                        className={cn("border-b border-r/50 h-9 text-center align-middle", cls)}
                        title={s.booking ? `${s.booking.guest_name} (${formatDateShort(s.booking.check_in)}–${formatDateShort(s.booking.check_out)})` : "Frei"}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={internOpen} onOpenChange={setInternOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Intern eintragen</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Zimmer</Label>
              <Select value={internForm.room_id} onValueChange={(v) => setInternForm({ ...internForm, room_id: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Zimmer wählen" /></SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Name</Label>
              <Input className="mt-1.5" value={internForm.guest_name} onChange={(e) => setInternForm({ ...internForm, guest_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Anreise</Label>
                <Input className="mt-1.5" type="date" value={internForm.check_in} onChange={(e) => setInternForm({ ...internForm, check_in: e.target.value })} />
              </div>
              <div>
                <Label>Abreise</Label>
                <Input className="mt-1.5" type="date" value={internForm.check_out} onChange={(e) => setInternForm({ ...internForm, check_out: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Notiz</Label>
              <Textarea className="mt-1.5" value={internForm.notes} onChange={(e) => setInternForm({ ...internForm, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInternOpen(false)}>Abbrechen</Button>
            <Button onClick={submitIntern}>Eintragen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
