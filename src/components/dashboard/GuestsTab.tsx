import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import GuestProfileDialog from "./GuestProfileDialog";

export default function GuestsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [profileGuest, setProfileGuest] = useState<{ name: string; email?: string | null } | null>(null);

  useEffect(() => {
    supabase.from("bookings").select("*").then(({ data }) => setBookings(data ?? []));
  }, []);

  const guests = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; count: number }>();
    bookings.forEach((b) => {
      if (b.booking_type === "intern") return;
      const key = (b.guest_email || b.guest_name).toLowerCase();
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { name: b.guest_name, email: b.guest_email ?? "", phone: b.guest_phone ?? "", count: 1 });
    });
    return Array.from(map.values()).filter((g) =>
      !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [bookings, search]);

  return (
    <div className="space-y-4">
      <Input placeholder="Suche Name oder E-Mail…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
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
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Keine Gäste</TableCell></TableRow>
              )}
              {guests.map((g, i) => (
                <TableRow key={i} className="cursor-pointer hover:bg-muted/50" onClick={() => setProfileGuest({ name: g.name, email: g.email })}>
                  <TableCell>
                    <button className="font-medium text-left hover:text-secondary hover:underline transition-colors">
                      {g.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{g.email}</TableCell>
                  <TableCell className="text-muted-foreground">{g.phone}</TableCell>
                  <TableCell className="text-right">{g.count}</TableCell>
                  <TableCell className="text-right">
                    {g.count >= 3 ? (
                      <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Stammgast</Badge>
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

      <GuestProfileDialog
        guestKey={profileGuest}
        open={!!profileGuest}
        onOpenChange={(o) => !o && setProfileGuest(null)}
      />
    </div>
  );
}
