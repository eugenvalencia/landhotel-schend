import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GuestProfileDialog from "./GuestProfileDialog";

type BookingRow = {
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  booking_type: "online" | "intern";
  payment_status: string;
};

type GuestAggregate = {
  name: string;
  email: string;
  phone: string;
  count: number;
};

const safeLower = (v: string | null | undefined) => (v ?? "").toLowerCase();

export default function GuestsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileGuest, setProfileGuest] = useState<{ name: string; email?: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("guest_name,guest_email,guest_phone,booking_type,payment_status");
      if (!active) return;
      if (error) {
        toast.error("Gäste konnten nicht geladen werden");
      }
      setBookings((data as BookingRow[] | null) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const guests = useMemo<GuestAggregate[]>(() => {
    const map = new Map<string, GuestAggregate>();
    bookings.forEach((b) => {
      if (b.booking_type === "intern") return;
      if (b.payment_status === "cancelled") return;
      const key = safeLower(b.guest_email || b.guest_name);
      if (!key) return;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, {
          name: b.guest_name ?? "Unbekannt",
          email: b.guest_email ?? "",
          phone: b.guest_phone ?? "",
          count: 1,
        });
      }
    });
    const term = search.trim().toLowerCase();
    const arr = Array.from(map.values());
    if (!term) return arr;
    return arr.filter(
      (g) =>
        safeLower(g.name).includes(term) ||
        safeLower(g.email).includes(term) ||
        safeLower(g.phone).includes(term),
    );
  }, [bookings, search]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Suche Name, E-Mail oder Telefon …"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

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
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead className="text-right">Buchungen</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Keine Gäste
                    </TableCell>
                  </TableRow>
                )}
                {guests.map((g) => (
                  <TableRow
                    key={`${g.email || g.name}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setProfileGuest({ name: g.name, email: g.email })}
                  >
                    <TableCell>
                      <button className="font-medium text-left hover:text-secondary hover:underline transition-colors">
                        {g.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{g.email || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{g.phone || "—"}</TableCell>
                    <TableCell className="text-right">{g.count}</TableCell>
                    <TableCell className="text-right">
                      {g.count >= 3 ? (
                        <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                          Stammgast
                        </Badge>
                      ) : (
                        <Badge variant="outline">Neugast</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
