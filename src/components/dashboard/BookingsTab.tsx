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
import { Trash2, Loader2, Check, X } from "lucide-react";
import GuestProfileDialog from "./GuestProfileDialog";
import BookingDetailDialog from "./BookingDetailDialog";
import { notifyRequestsChanged } from "@/hooks/useOpenRequests";

type RequestStatus = "angefragt" | "bestaetigt" | "abgelehnt";

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
  // Stufe A — Anfrage-Modus + Quellen-Tracking. Optional, weil ältere Buchungen
  // (vor der Migration) die Spalten evtl. noch nicht tragen.
  source?: string | null;
  request_status?: RequestStatus | null;
};

const REQUEST_META: Record<RequestStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  angefragt: { label: "Angefragt", variant: "secondary" },
  bestaetigt: { label: "Bestätigt", variant: "default" },
  abgelehnt: { label: "Abgelehnt", variant: "outline" },
};

type RoomRow = { id: string; name: string };

const safeLower = (v: string | null | undefined) => (v ?? "").toLowerCase();

export default function BookingsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRequest, setFilterRequest] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [profileGuest, setProfileGuest] = useState<{ name: string; email?: string | null } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<BookingRow | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

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

  // Auto-Refresh: beim Mount, alle 30 s, bei Fenster-Fokus und sofort nach jeder
  // Aktion (Event) — damit neue Anfragen OHNE manuelles Neuladen erscheinen.
  useEffect(() => {
    load();
    const onWake = () => load();
    const id = setInterval(onWake, 30000);
    window.addEventListener("focus", onWake);
    window.addEventListener("schend:requests-changed", onWake);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onWake);
      window.removeEventListener("schend:requests-changed", onWake);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomMap = useMemo(
    () => Object.fromEntries(rooms.map((r) => [r.id, r.name])),
    [rooms],
  );

  // Echte Quellen-Auswertung (Direkt vs OTA) aus den geladenen Buchungen —
  // belegt Schends Provisionsfrei-Versprechen. Stornierte zählen nicht mit.
  const sourceSummary = useMemo(() => {
    const counts = new Map<string, number>();
    bookings
      .filter((b) => b.payment_status !== "cancelled")
      .forEach((b) => {
        const s = (b.source ?? "Direkt") || "Direkt";
        counts.set(s, (counts.get(s) ?? 0) + 1);
      });
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, n]) => sum + n, 0);
    const direct = counts.get("Direkt") ?? 0;
    return { entries, total, directPct: total ? Math.round((direct / total) * 100) : 0 };
  }, [bookings]);

  const openRequests = useMemo(
    () => bookings.filter((b) => b.request_status === "angefragt").length,
    [bookings],
  );

  const setRequestStatus = async (b: BookingRow, status: "bestaetigt" | "abgelehnt") => {
    setActioningId(b.id);
    const { error } = await supabase.rpc("set_booking_request_status", {
      p_booking_id: b.id,
      p_status: status,
    });
    setActioningId(null);
    if (error) {
      toast.error("Aktion fehlgeschlagen: " + error.message);
      return;
    }
    toast.success(status === "bestaetigt" ? "Anfrage bestätigt" : "Anfrage abgelehnt");
    notifyRequestsChanged();
    load();
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "all" && b.payment_status !== filterStatus) return false;
    if (filterType !== "all" && b.booking_type !== filterType) return false;
    if (filterRequest !== "all" && (b.request_status ?? "") !== filterRequest) return false;
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
    notifyRequestsChanged();
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
        <Select value={filterRequest} onValueChange={setFilterRequest}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Anfragen</SelectItem>
            <SelectItem value="angefragt">Angefragt{openRequests > 0 ? ` (${openRequests})` : ""}</SelectItem>
            <SelectItem value="bestaetigt">Bestätigt</SelectItem>
            <SelectItem value="abgelehnt">Abgelehnt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Echte Quellen-Auswertung — Direkt vs OTA (belegt Provisionsfreiheit) */}
      {sourceSummary.total > 0 && (
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Buchungsquellen ({sourceSummary.total} aktiv)</div>
                <div className="text-2xl font-bold mt-0.5">
                  {sourceSummary.directPct}% <span className="text-sm font-normal text-muted-foreground">direkt &amp; provisionsfrei</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {sourceSummary.entries.map(([name, n]) => (
                  <Badge key={name} variant={name === "Direkt" ? "default" : "secondary"} className="font-normal">
                    {name}: {n}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Card
                key={b.id}
                className="shadow-card cursor-pointer hover:border-secondary/50 transition-colors"
                onClick={() => setDetailId(b.id)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setProfileGuest({ name: b.guest_name, email: b.guest_email }); }}
                        className="font-semibold text-left hover:text-secondary hover:underline transition-colors"
                      >
                        {b.guest_name}
                      </button>
                      <div className="text-xs font-mono text-muted-foreground">{b.booking_number}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {b.request_status && REQUEST_META[b.request_status] && (
                        <Badge variant={REQUEST_META[b.request_status].variant}>
                          {REQUEST_META[b.request_status].label}
                        </Badge>
                      )}
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
                  </div>
                  <div className="text-sm text-muted-foreground">{roomMap[b.room_id] ?? "—"}</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    <div><span className="text-muted-foreground">Anreise:</span> {formatDate(b.check_in)}</div>
                    <div><span className="text-muted-foreground">Abreise:</span> {formatDate(b.check_out)}</div>
                    <div><span className="text-muted-foreground">Preis:</span> {eur(Number(b.total_price))}</div>
                    <div><span className="text-muted-foreground">Quelle:</span> {b.source ?? "—"}</div>
                  </div>
                  {b.request_status === "angefragt" && (
                    <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={actioningId === b.id}
                        onClick={() => setRequestStatus(b, "bestaetigt")}
                      >
                        {actioningId === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Bestätigen
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={actioningId === b.id}
                        onClick={() => setRequestStatus(b, "abgelehnt")}
                      >
                        <X className="h-4 w-4" /> Ablehnen
                      </Button>
                    </div>
                  )}
                  {b.payment_status !== "cancelled" && b.request_status !== "angefragt" && (
                    <div className="pt-1" onClick={(e) => e.stopPropagation()}>
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
                    <TableHead>Quelle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Anfrage</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground py-8">Keine Buchungen</TableCell>
                    </TableRow>
                  )}
                  {filtered.map((b) => (
                    <TableRow
                      key={b.id}
                      onClick={() => setDetailId(b.id)}
                      className="cursor-pointer hover:bg-accent/40"
                    >
                      <TableCell className="font-mono text-xs">{b.booking_number}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
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
                      <TableCell className="text-sm text-muted-foreground">{b.source ?? "—"}</TableCell>
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
                        {b.request_status && REQUEST_META[b.request_status] ? (
                          <Badge variant={REQUEST_META[b.request_status].variant}>
                            {REQUEST_META[b.request_status].label}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {b.request_status === "angefragt" ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={actioningId === b.id}
                              onClick={() => setRequestStatus(b, "bestaetigt")}
                              title="Anfrage bestätigen"
                              className="text-success hover:text-success"
                            >
                              {actioningId === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={actioningId === b.id}
                              onClick={() => setRequestStatus(b, "abgelehnt")}
                              title="Anfrage ablehnen"
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          b.payment_status !== "cancelled" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setPendingCancel(b)}
                              title="Stornieren"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )
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

      <BookingDetailDialog
        bookingId={detailId}
        open={!!detailId}
        onOpenChange={(o) => !o && setDetailId(null)}
        onChanged={load}
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
