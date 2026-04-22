import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { eur, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import GuestProfileDialog from "./GuestProfileDialog";

export default function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [profileGuest, setProfileGuest] = useState<{ name: string; email?: string | null } | null>(null);

  const load = async () => {
    const [{ data: b }, { data: r }] = await Promise.all([
      supabase.from("bookings").select("*").order("check_in", { ascending: false }),
      supabase.from("rooms").select("id,name"),
    ]);
    setBookings(b ?? []);
    setRooms(r ?? []);
  };

  useEffect(() => { load(); }, []);

  const roomMap = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r.name])), [rooms]);

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "all" && b.payment_status !== filterStatus) return false;
    if (filterType !== "all" && b.booking_type !== filterType) return false;
    if (search && !b.guest_name.toLowerCase().includes(search.toLowerCase()) && !b.booking_number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cancel = async (id: string) => {
    if (!confirm("Buchung wirklich stornieren?")) return;
    const { error } = await supabase.from("bookings").update({ payment_status: "cancelled" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Buchung storniert");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Suche Name oder Buchungsnr…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="paid">Bezahlt</SelectItem>
            <SelectItem value="pending">Ausstehend</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="intern">Intern</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <Card className="shadow-card"><CardContent className="text-center text-muted-foreground py-8">Keine Buchungen</CardContent></Card>
        )}
        {filtered.map((b) => (
          <Card key={b.id} className="shadow-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    onClick={() => setProfileGuest({ name: b.guest_name, email: b.guest_email })}
                    className="font-semibold text-left hover:text-secondary hover:underline transition-colors"
                  >
                    {b.guest_name}
                  </button>
                  <div className="text-xs font-mono text-muted-foreground">{b.booking_number}</div>
                </div>
                <Badge variant={b.payment_status === "paid" ? "default" : b.payment_status === "cancelled" ? "destructive" : "secondary"}>
                  {b.payment_status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{roomMap[b.room_id] ?? "—"}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <div><span className="text-muted-foreground">Anreise:</span> {formatDate(b.check_in)}</div>
                <div><span className="text-muted-foreground">Abreise:</span> {formatDate(b.check_out)}</div>
                <div><span className="text-muted-foreground">Preis:</span> {eur(Number(b.total_price))}</div>
                <div><span className="text-muted-foreground">Typ:</span> {b.booking_type}</div>
              </div>
              {b.payment_status !== "cancelled" && (
                <div className="pt-1">
                  <Button size="sm" variant="outline" onClick={() => cancel(b.id)} className="w-full">
                    <Trash2 className="h-4 w-4" /> Stornieren
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: table */}
      <Card className="shadow-card hidden md:block">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buchungsnr.</TableHead>
                <TableHead>Gast</TableHead>
                <TableHead>Zimmer</TableHead>
                <TableHead>Anreise</TableHead>
                <TableHead>Abreise</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Keine Buchungen</TableCell></TableRow>
              )}
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.booking_number}</TableCell>
                  <TableCell>{b.guest_name}</TableCell>
                  <TableCell>{roomMap[b.room_id] ?? "—"}</TableCell>
                  <TableCell>{formatDate(b.check_in)}</TableCell>
                  <TableCell>{formatDate(b.check_out)}</TableCell>
                  <TableCell>{eur(Number(b.total_price))}</TableCell>
                  <TableCell><Badge variant={b.booking_type === "intern" ? "secondary" : "default"}>{b.booking_type}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={b.payment_status === "paid" ? "default" : b.payment_status === "cancelled" ? "destructive" : "secondary"}>
                      {b.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {b.payment_status !== "cancelled" && (
                      <Button size="icon" variant="ghost" onClick={() => cancel(b.id)} title="Stornieren">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
