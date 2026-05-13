import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { eur, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import GuestProfileDialog from "./GuestProfileDialog";

type BookingRow = {
  id: string;
  booking_number: string;
  room_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: "paid" | "pending" | "cancelled";
  booking_type: "online" | "intern";
};

type RoomRow = { id: string; name: string };

const safeLower = (v: string | null | undefined) => (v ?? "").toLowerCase();

export default function BookingsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [profileGuest, setProfileGuest] = useState<{ name: string; email?: string | null } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<BookingRow | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: b, error: bErr }, { data: r, error: rErr }] = await Promise.all([
      supabase.from("bookings").select("*").order("check_in", { ascending: false }),
      supabase.from("rooms").select("id,name"),
    ]);
    if (bErr || rErr) {
      toast.error("Daten konnten nicht geladen werden");
      setLoading(false);
      return;
    }
    setBookings((b as BookingRow[] | null) ?? []);
    setRooms((r as RoomRow[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await load();
      if (!active) return;
    })();
    return () => {
      active = false;
    };
  }, []);

  const roomMap = useMemo(
    () => Object.fromEntries(rooms.map((r) => [r.id, r.name])),
    [rooms],
  );

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "all" && b.payment_status !== filterStatus) return false;
    if (filterType !== "all" && b.booking_type !== filterType) return false;
    if (search) {
      const term = search.toLowerCase();
      const match =
        safeLower(b.guest_name).includes(term) ||
        safeLower(b.booking_number).includes(term) ||
        safeLower(b.guest_email).includes(term);
      if (!match) return false;
    }
    return true;
  });

  const confirmCancel = async () => {
    if (!pendingCancel) return;
    setCancelling(true);
    const { error } = await supabase
      .from("bookings")
      .update({ payment_status: "cancelled" })
      .eq("id", pendingCancel.id);
    setCancelling(false);
    if (error) {
      toast.error("Stornierung fehlgeschlagen: " + error.message);
      return;
    }
    toast.success("Buchung storniert");
    setPendingCancel(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Suche Name, E-Mail oder Buchungsnr…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
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

      {loading && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
            Lade Buchungen …
          </CardContent>
        </Card>
      )}

      {!loading && (
        <>
          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 && (
              <Card className="shadow-card">
                <CardContent className="text-center text-muted-foreground py-8">Keine Buchungen</CardContent>
              </Card>
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
                    <Badge
                      variant={
                        b.payment_status === "paid"
                          ? "default"
                          : b.payment_status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
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
                      <Button size="sm" variant="outline" onClick={() => setPendingCancel(b)} className="w-full">
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
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">Keine Buchungen</TableCell>
                    </TableRow>
                  )}
                  {filtered.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.booking_number}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => setProfileGuest({ name: b.guest_name, email: b.guest_email })}
                          className="hover:text-secondary hover:underline transition-colors text-left"
                        >
                          {b.guest_name}
                        </button>
                      </TableCell>
                      <TableCell>{roomMap[b.room_id] ?? "—"}</TableCell>
                      <TableCell>{formatDate(b.check_in)}</TableCell>
                      <TableCell>{formatDate(b.check_out)}</TableCell>
                      <TableCell>{eur(Number(b.total_price))}</TableCell>
                      <TableCell>
                        <Badge variant={b.booking_type === "intern" ? "secondary" : "default"}>
                          {b.booking_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            b.payment_status === "paid"
                              ? "default"
                              : b.payment_status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {b.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {b.payment_status !== "cancelled" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setPendingCancel(b)}
                            title="Stornieren"
                          >
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
        </>
      )}

      <GuestProfileDialog
        guestKey={profileGuest}
        open={!!profileGuest}
        onOpenChange={(o) => !o && setProfileGuest(null)}
      />

      <AlertDialog open={!!pendingCancel} onOpenChange={(o) => !o && setPendingCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buchung wirklich stornieren?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel && (
                <>
                  <strong>{pendingCancel.guest_name}</strong> · {pendingCancel.booking_number}
                  <br />
                  {formatDate(pendingCancel.check_in)} – {formatDate(pendingCancel.check_out)}
                  <br />
                  Der Zeitraum wird im Kalender wieder freigegeben.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Stornieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
