import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export default function GuestsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Keine Gäste</TableCell></TableRow>
              )}
              {guests.map((g, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="text-muted-foreground">{g.email}</TableCell>
                  <TableCell className="text-muted-foreground">{g.phone}</TableCell>
                  <TableCell className="text-right">{g.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
