import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Loader2,
  Users,
  Star,
  UserPlus,
  Clock,
  Search,
  Crown,
  Mail,
  Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GuestProfileDialog from "./GuestProfileDialog";
import { eur, formatDate } from "@/lib/format";

interface BookingRow {
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  booking_type: "online" | "intern";
  payment_status: string;
  check_in: string;
  check_out: string;
  total_price: number;
  room_id: string;
  created_at: string;
}

interface Room {
  id: string;
  name: string;
  room_type: string | null;
}

type Tier = "vip" | "stammgast" | "wiederkommer" | "neugast";

interface GuestAggregate {
  name: string;
  email: string;
  phone: string;
  count: number;
  totalSpent: number;
  totalNights: number;
  avgNights: number;
  lastStay: string | null;
  firstStay: string | null;
  favRoomName: string | null;
  tier: Tier;
  monthsSinceLastStay: number | null;
}

type FilterMode = "alle" | "vip" | "stammgast" | "neu" | "reaktivieren";
type SortMode = "umsatz" | "buchungen" | "zuletzt" | "name";

const TIER_LABEL: Record<Tier, string> = {
  vip:           "VIP-Stammgast",
  stammgast:     "Stammgast",
  wiederkommer:  "Wiederkommer",
  neugast:       "Neugast",
};
const TIER_BADGE_CLS: Record<Tier, string> = {
  vip:          "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
  stammgast:    "bg-secondary text-secondary-foreground",
  wiederkommer: "bg-sky-500 text-white border-0",
  neugast:      "",
};

function computeTier(count: number): Tier {
  if (count >= 8) return "vip";
  if (count >= 3) return "stammgast";
  if (count === 2) return "wiederkommer";
  return "neugast";
}

const safeLower = (v: string | null | undefined) => (v ?? "").toLowerCase();

export default function GuestsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("alle");
  const [sort, setSort] = useState<SortMode>("umsatz");
  const [loading, setLoading] = useState(true);
  const [profileGuest, setProfileGuest] = useState<{ name: string; email?: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      // Paged-Fetch — Server gibt nur 1000 Rows pro Anfrage
      const pageSize = 1000;
      const all: BookingRow[] = [];
      for (let page = 0; page < 50; page++) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        const { data, error } = await supabase
          .from("bookings")
          .select("guest_name,guest_email,guest_phone,booking_type,payment_status,check_in,check_out,total_price,room_id,created_at")
          .order("check_in", { ascending: false })
          .range(from, to);
        if (error) {
          if (page === 0) toast.error("Gäste konnten nicht geladen werden");
          break;
        }
        if (!data || data.length === 0) break;
        all.push(...(data as BookingRow[]));
        if (data.length < pageSize) break;
      }
      const { data: r } = await supabase.from("rooms").select("id, name, room_type");
      if (!active) return;
      setBookings(all);
      setRooms((r as Room[] | null) ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const roomMap = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), [rooms]);

  const guests = useMemo<GuestAggregate[]>(() => {
    const today = new Date();
    const map = new Map<string, GuestAggregate & { _roomCounts: Map<string, number> }>();

    for (const b of bookings) {
      if (b.booking_type === "intern") continue;
      if (b.payment_status === "cancelled") continue;
      const key = safeLower(b.guest_email || b.guest_name);
      if (!key) continue;

      const nights = Math.max(
        1,
        Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000),
      );

      let g = map.get(key);
      if (!g) {
        g = {
          name: b.guest_name ?? "Unbekannt",
          email: b.guest_email ?? "",
          phone: b.guest_phone ?? "",
          count: 0,
          totalSpent: 0,
          totalNights: 0,
          avgNights: 0,
          lastStay: null,
          firstStay: null,
          favRoomName: null,
          tier: "neugast",
          monthsSinceLastStay: null,
          _roomCounts: new Map(),
        };
        map.set(key, g);
      }
      g.count++;
      g.totalSpent += Number(b.total_price ?? 0);
      g.totalNights += nights;
      // Phone aktualisieren falls leer
      if (!g.phone && b.guest_phone) g.phone = b.guest_phone;

      // Letzter / Erster Aufenthalt
      const ci = b.check_in.slice(0, 10);
      const co = b.check_out.slice(0, 10);
      if (!g.lastStay || co > g.lastStay) g.lastStay = co;
      if (!g.firstStay || ci < g.firstStay) g.firstStay = ci;

      // Lieblingszimmer
      g._roomCounts.set(b.room_id, (g._roomCounts.get(b.room_id) ?? 0) + 1);
    }

    return Array.from(map.values()).map((g) => {
      const favRoomId = [...g._roomCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      const favRoom = favRoomId ? roomMap[favRoomId] : null;
      const tier = computeTier(g.count);
      const months = g.lastStay
        ? Math.round((today.getTime() - new Date(g.lastStay).getTime()) / (30 * 86400000))
        : null;
      return {
        ...g,
        avgNights: g.count > 0 ? Math.round((g.totalNights / g.count) * 10) / 10 : 0,
        favRoomName: favRoom?.name ?? null,
        tier,
        monthsSinceLastStay: months,
      } as GuestAggregate;
    });
  }, [bookings, roomMap]);

  const stats = useMemo(() => {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);
    let totalGuests = 0;
    let stammgaeste = 0;
    let neueDiesesJahr = 0;
    let reaktivieren = 0;
    let totalRevenue = 0;
    for (const g of guests) {
      totalGuests++;
      if (g.tier === "stammgast" || g.tier === "vip") stammgaeste++;
      if (g.firstStay && g.firstStay >= yearStart) neueDiesesJahr++;
      if (g.monthsSinceLastStay !== null && g.monthsSinceLastStay >= 12) reaktivieren++;
      totalRevenue += g.totalSpent;
    }
    return { totalGuests, stammgaeste, neueDiesesJahr, reaktivieren, totalRevenue };
  }, [guests]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let arr = guests.filter((g) => {
      if (filter === "vip" && g.tier !== "vip") return false;
      if (filter === "stammgast" && g.tier !== "stammgast" && g.tier !== "vip") return false;
      if (filter === "neu" && g.tier !== "neugast") return false;
      if (filter === "reaktivieren" && (g.monthsSinceLastStay === null || g.monthsSinceLastStay < 12)) return false;
      if (term) {
        return (
          safeLower(g.name).includes(term) ||
          safeLower(g.email).includes(term) ||
          safeLower(g.phone).includes(term)
        );
      }
      return true;
    });
    arr = arr.sort((a, b) => {
      if (sort === "umsatz") return b.totalSpent - a.totalSpent;
      if (sort === "buchungen") return b.count - a.count;
      if (sort === "zuletzt") return (b.lastStay ?? "").localeCompare(a.lastStay ?? "");
      return a.name.localeCompare(b.name);
    });
    return arr;
  }, [guests, filter, search, sort]);

  const filterButtons: { key: FilterMode; label: string; icon: typeof Users; count: number }[] = [
    { key: "alle",          label: "Alle",                icon: Users,    count: stats.totalGuests },
    { key: "stammgast",     label: "Stammgäste",          icon: Star,     count: stats.stammgaeste },
    { key: "neu",           label: "Neue dieses Jahr",    icon: UserPlus, count: stats.neueDiesesJahr },
    { key: "reaktivieren",  label: "Lange nicht da",      icon: Clock,    count: stats.reaktivieren },
  ];

  return (
    <div className="space-y-4">
      {/* Header-Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Gäste insgesamt"    value={String(stats.totalGuests)}    icon={Users} />
        <StatCard label="Stammgäste"         value={String(stats.stammgaeste)}    icon={Star}     accent="secondary" />
        <StatCard label="Neue dieses Jahr"   value={String(stats.neueDiesesJahr)} icon={UserPlus} accent="emerald" />
        <StatCard label="Gesamt-Umsatz CRM"  value={eur(stats.totalRevenue)}      icon={Crown} />
      </div>

      {/* Filter + Suche + Sortierung */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterButtons.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            onClick={() => setFilter(f.key)}
            className="gap-2"
          >
            <f.icon className="h-3.5 w-3.5" />
            {f.label}
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">{f.count}</Badge>
          </Button>
        ))}
        <div className="relative ml-auto w-64 max-w-full">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Name, E-Mail, Telefon …"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="umsatz">Sortiert: Umsatz</option>
          <option value="buchungen">Sortiert: Buchungen</option>
          <option value="zuletzt">Sortiert: Letzter Besuch</option>
          <option value="name">Sortiert: Name</option>
        </select>
      </div>

      {loading ? (
        <Card className="shadow-card">
          <CardContent className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
            Lade Gäste …
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gast</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aufenthalte</TableHead>
                  <TableHead className="text-right">Gesamt-Umsatz</TableHead>
                  <TableHead className="text-right">Ø Nächte</TableHead>
                  <TableHead>Letzter Besuch</TableHead>
                  <TableHead>Lieblingszimmer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Keine Gäste in dieser Auswahl
                    </TableCell>
                  </TableRow>
                )}
                {filtered.slice(0, 200).map((g) => {
                  const months = g.monthsSinceLastStay;
                  const lastStayLabel = g.lastStay
                    ? `${formatDate(g.lastStay)}${months !== null && months >= 12 ? ` · vor ${Math.floor(months / 12)} J.` : ""}`
                    : "—";
                  return (
                    <TableRow
                      key={`${g.email || g.name}`}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setProfileGuest({ name: g.name, email: g.email })}
                    >
                      <TableCell>
                        <div className="font-medium hover:text-secondary transition-colors">{g.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-3 mt-0.5">
                          {g.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{g.email}</span>}
                          {g.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{g.phone}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={TIER_BADGE_CLS[g.tier]} variant={g.tier === "neugast" ? "outline" : "default"}>
                          {g.tier === "vip" && <Crown className="h-3 w-3 mr-1" />}
                          {g.tier === "stammgast" && <Star className="h-3 w-3 mr-1" />}
                          {TIER_LABEL[g.tier]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{g.count}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{eur(g.totalSpent)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{g.avgNights} N</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {lastStayLabel}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {g.favRoomName ?? "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length > 200 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-3">
                      Erste 200 von {filtered.length} Gästen — Suche oder Filter verfeinert die Liste.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <GuestProfileDialog
        guestKey={profileGuest}
        open={!!profileGuest}
        onOpenChange={(o) => !o && setProfileGuest(null)}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "secondary" | "emerald";
}) {
  const accentCls =
    accent === "secondary" ? "text-secondary" :
    accent === "emerald"   ? "text-emerald-500" :
    "text-muted-foreground";
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className={`h-3.5 w-3.5 ${accentCls}`} />
        </div>
        <p className="text-lg font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
