import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { toast } from "sonner";
import { BedDouble, Edit, Upload, X } from "lucide-react";

const ALL_AMENITIES = ["WLAN", "TV", "Bad", "Balkon", "Minibar", "Wohnbereich", "Haustier"];

export default function RoomsTab() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => supabase.from("rooms").select("*").order("room_number").then(({ data }) => setRooms(data ?? []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, created_at, updated_at, ...rest } = editing;
    const { error } = await supabase.from("rooms").update(rest).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Zimmer gespeichert");
    setEditing(null);
    load();
  };

  const handleUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    const fileName = `${editing.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("room-photos").upload(fileName, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("room-photos").getPublicUrl(fileName);
    setEditing({ ...editing, photos: [...(editing.photos ?? []), data.publicUrl] });
    setUploading(false);
  };

  const removePhoto = (url: string) => {
    setEditing({ ...editing, photos: (editing.photos ?? []).filter((p: string) => p !== url) });
  };

  const toggleAmenity = (a: string) => {
    const list = editing.amenities ?? [];
    setEditing({ ...editing, amenities: list.includes(a) ? list.filter((x: string) => x !== a) : [...list, a] });
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((r) => (
          <Card key={r.id} className="shadow-card overflow-hidden">
            <div className="aspect-[4/3] bg-accent flex items-center justify-center overflow-hidden">
              {r.photos?.[0] ? (
                <img src={r.photos[0]} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                <BedDouble className="h-10 w-10 text-secondary/40" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold">{r.name}</h3>
                <Badge variant={r.status === "aktiv" ? "default" : "secondary"}>{r.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{r.room_type}</p>
              <p className="text-sm mt-1">{eur(Number(r.price_per_night))} / Nacht</p>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setEditing({ ...r })}>
                <Edit className="h-4 w-4" /> Bearbeiten
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Zimmer bearbeiten</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input className="mt-1.5" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div>
                  <Label>Typ</Label>
                  <Input className="mt-1.5" value={editing.room_type} onChange={(e) => setEditing({ ...editing, room_type: e.target.value })} />
                </div>
                <div>
                  <Label>Bettenbeschreibung</Label>
                  <Input className="mt-1.5" value={editing.bed_description} onChange={(e) => setEditing({ ...editing, bed_description: e.target.value })} />
                </div>
                <div>
                  <Label>Max. Personen</Label>
                  <Input type="number" className="mt-1.5" value={editing.max_persons} onChange={(e) => setEditing({ ...editing, max_persons: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label>Preis / Nacht (€)</Label>
                  <Input type="number" step="0.01" className="mt-1.5" value={editing.price_per_night} onChange={(e) => setEditing({ ...editing, price_per_night: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktiv">Aktiv</SelectItem>
                      <SelectItem value="wartung">Wartung</SelectItem>
                      <SelectItem value="inaktiv">Inaktiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea className="mt-1.5" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <Label>Ausstattung</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                  {ALL_AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={(editing.amenities ?? []).includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Fotos</Label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(editing.photos ?? []).map((p: string) => (
                    <div key={p} className="relative aspect-square rounded-md overflow-hidden border group">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removePhoto(p)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-accent">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                  </label>
                </div>
                {uploading && <p className="text-xs text-muted-foreground mt-2">Hochladen…</p>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Abbrechen</Button>
            <Button onClick={save}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
