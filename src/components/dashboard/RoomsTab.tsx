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
import { HotelImage } from "@/components/HotelImage";
import { supabase } from "@/integrations/supabase/client";
import { eur, toISODate, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BedDouble, Edit, Upload, X, Plus, Trash2, Lock, Unlock, CalendarDays, Loader2, Phone } from "lucide-react";

const ALL_AMENITIES = ["WLAN", "TV", "Bad", "Balkon", "Minibar", "Wohnbereich", "Haustier"];

// amenities/photos kommen aus JSONB — bei alten Seed-Daten manchmal als Objekt
// statt Array. Sicher zu einem Array machen, sonst crasht .includes()/.map().
const toArr = (v: unknown): any[] =>
  Array.isArray(v) ? v : (v && typeof v === "object" ? Object.values(v as object) : []);

// Leeres Zimmer für „Neues Zimmer". Default-Preismodus „pro Person" passt zum
// häufigsten Schend-Fall (Doppelzimmer 57 €/Person); pro Zimmer ist 1 Klick weg.
const blankRoom = () => ({
  name: "", room_type: "Doppelzimmer", bed_description: "Doppelbett",
  max_persons: 2, price_per_night: 57, price_per_person: true,
  single_use_price: null as number | null, status: "aktiv",
  amenities: [] as string[], photos: [] as string[], description: "",
});

export default function RoomsTab() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  // Bestehende Zimmer öffnen GESPERRT (schreibgeschützt) — schützt Preise/
  // Ausstattung vor versehentlichem Ändern. Erst „Entsperren" macht editierbar.
  const [locked, setLocked] = useState(true);

  // --- Rezeptions-Board (Status + Direktbuchung) ---
  const [bookings, setBookings] = useState<any[]>([]);
  const [boardDate, setBoardDate] = useState<string>(toISODate(new Date()));
  const [quickRoom, setQuickRoom] = useState<any | null>(null);
  const [quickForm, setQuickForm] = useState({ guest_name: "", guest_phone: "", check_in: "", check_out: "", persons: 2, notes: "" });
  const [quickSaving, setQuickSaving] = useState(false);

  const openEdit = (r: any) => {
    setEditing({ ...r, amenities: toArr(r.amenities), photos: toArr(r.photos) });
    setNewAmenity("");
    setLocked(true);
  };
  const openNew = () => {
    setEditing(blankRoom());
    setNewAmenity("");
    setLocked(false); // Neues Zimmer ist sofort editierbar
  };
  // Bei bestehendem Zimmer + gesperrt sind alle Felder schreibgeschützt.
  const readOnly = !!editing?.id && locked;

  const addAmenity = () => {
    const a = newAmenity.trim();
    if (!a) return;
    const list = toArr(editing?.amenities);
    if (!list.includes(a)) setEditing({ ...editing, amenities: [...list, a] });
    setNewAmenity("");
  };

  const load = async () => {
    const [{ data: r }, { data: b }] = await Promise.all([
      supabase.from("rooms").select("*").order("room_number"),
      supabase.from("bookings")
        .select("id, room_id, guest_name, check_in, check_out, persons, payment_status, request_status")
        .neq("payment_status", "cancelled"),
    ]);
    setRooms(r ?? []);
    setBookings((b as any[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  // Belegung am gewählten Tag: check_in <= Tag < check_out (Abreisetag = wieder frei).
  const occupantFor = (roomId: string) =>
    bookings.find((b) => b.room_id === roomId && b.check_in <= boardDate && b.check_out > boardDate) ?? null;

  const addDaysIso = (iso: string, days: number) => {
    const [y, m, d] = iso.split("-").map(Number);
    return toISODate(new Date(y, (m || 1) - 1, (d || 1) + days));
  };

  const openQuick = (room: any) => {
    setQuickRoom(room);
    setQuickForm({
      guest_name: "", guest_phone: "",
      check_in: boardDate, check_out: addDaysIso(boardDate, 1),
      persons: Math.min(2, room.max_persons || 2), notes: "",
    });
  };

  const submitQuick = async () => {
    if (!quickRoom) return;
    if (!quickForm.guest_name.trim()) { toast.error("Bitte Gastname eingeben"); return; }
    if (quickForm.check_out <= quickForm.check_in) { toast.error("Abreise muss nach Anreise liegen"); return; }
    setQuickSaving(true);
    const { error } = await supabase.rpc("create_internal_booking", {
      p_room_id: quickRoom.id,
      p_guest_name: quickForm.guest_name.trim(),
      p_guest_phone: quickForm.guest_phone.trim() || null,
      p_check_in: quickForm.check_in,
      p_check_out: quickForm.check_out,
      p_persons: quickForm.persons,
      p_notes: quickForm.notes.trim() || null,
    });
    setQuickSaving(false);
    if (error) { toast.error("Buchung fehlgeschlagen: " + error.message); return; }
    toast.success("Buchung angelegt — steht jetzt in Kalender & Buchungen.");
    window.dispatchEvent(new Event("schend:requests-changed")); // andere Ansichten auffrischen
    setQuickRoom(null);
    load();
  };

  const save = async () => {
    if (!editing) return;
    if (!String(editing.name ?? "").trim()) { toast.error("Bitte einen Namen vergeben"); return; }
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = editing;
    // Numerik normalisieren — leere Felder sauber als Zahl/NULL
    rest.price_per_night = Number(rest.price_per_night) || 0;
    rest.max_persons = Number(rest.max_persons) || 1;
    rest.price_per_person = !!rest.price_per_person;
    rest.single_use_price =
      rest.single_use_price === "" || rest.single_use_price == null ? null : Number(rest.single_use_price);

    let error;
    if (id) {
      ({ error } = await supabase.from("rooms").update(rest).eq("id", id));
    } else {
      // Neues Zimmer: room_number automatisch (max+1), tenant_id von bestehendem Zimmer
      // ableiten (Single-Tenant Schend; rooms.tenant_id ist NOT NULL ohne Default).
      const nextNr = rooms.reduce((m, r) => Math.max(m, Number(r.room_number) || 0), 0) + 1;
      const tenant_id = rooms.find((r) => r.tenant_id)?.tenant_id ?? null;
      if (!tenant_id) {
        setSaving(false);
        toast.error("Kein Tenant gefunden — bitte zuerst ein bestehendes Zimmer öffnen.");
        return;
      }
      ({ error } = await supabase.from("rooms").insert({ ...rest, room_number: nextNr, tenant_id }));
    }
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(id ? "Zimmer gespeichert" : "Zimmer angelegt");
    setEditing(null);
    load();
  };

  const remove = async (room: any) => {
    if (!window.confirm(`Zimmer „${room.name}" wirklich löschen?`)) return;
    const { error } = await supabase.from("rooms").delete().eq("id", room.id);
    if (error) {
      // ON DELETE RESTRICT: Zimmer mit Buchungen lässt sich nicht löschen.
      toast.error("Löschen nicht möglich (vermutlich bestehende Buchungen). Tipp: Status auf 'Inaktiv' setzen.");
      return;
    }
    toast.success("Zimmer gelöscht");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-secondary shrink-0" />
          <span className="text-muted-foreground">Belegung am</span>
          <input
            type="date"
            value={boardDate}
            onChange={(e) => setBoardDate(e.target.value || boardDate)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          />
          {boardDate !== toISODate(new Date()) && (
            <Button size="sm" variant="ghost" className="h-9" onClick={() => setBoardDate(toISODate(new Date()))}>Heute</Button>
          )}
          <span className="text-xs text-muted-foreground hidden sm:inline">· {rooms.length} Zimmer</span>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> Neues Zimmer
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((r) => {
          const occ = occupantFor(r.id);
          const inactive = r.status !== "aktiv";
          return (
          <Card key={r.id} className="shadow-card overflow-hidden">
            <div className="aspect-[4/3] bg-accent flex items-center justify-center overflow-hidden">
              {r.photos?.[0] ? (
                <HotelImage src={r.photos[0]} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                <BedDouble className="h-10 w-10 text-secondary/40" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-1 gap-2">
                <h3 className="font-semibold">{r.name}</h3>
                {/* Status für den gewählten Tag */}
                {inactive
                  ? <Badge variant="secondary" className="shrink-0">{r.status}</Badge>
                  : occ
                    ? <Badge className="bg-red-500 hover:bg-red-500 text-white shrink-0">Belegt</Badge>
                    : <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white shrink-0">Frei</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{r.room_type}</p>
              <p className="text-sm mt-1">
                {eur(Number(r.price_per_night))} / Nacht
                <span className="text-xs text-muted-foreground"> {r.price_per_person ? "pro Person" : "pro Zimmer"}</span>
              </p>
              {occ && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {occ.guest_name} · bis {formatDate(occ.check_out)}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {!occ && !inactive ? (
                  <>
                    <Button size="sm" className="flex-1" onClick={() => openQuick(r)}>
                      <CalendarDays className="h-4 w-4" /> Buchen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(r)} aria-label="Zimmer bearbeiten">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(r)}>
                    <Edit className="h-4 w-4" /> Bearbeiten
                  </Button>
                )}
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(r)} aria-label="Zimmer löschen">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Zimmer bearbeiten" : "Neues Zimmer"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              {editing.id && (
                <div className={cn(
                  "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm",
                  locked ? "border-red-500/40 bg-red-500/5" : "border-emerald-500/40 bg-emerald-500/5",
                )}>
                  <span className="flex items-center gap-2">
                    {locked
                      ? <><Lock className="h-4 w-4 text-red-500" /> Geschützt — Einstellungen schreibgeschützt</>
                      : <><Unlock className="h-4 w-4 text-emerald-600" /> Entsperrt — Änderungen möglich</>}
                  </span>
                  <Button size="sm" variant={locked ? "default" : "outline"} onClick={() => setLocked((v) => !v)}>
                    {locked ? <><Unlock className="h-4 w-4" /> Entsperren</> : <><Lock className="h-4 w-4" /> Sperren</>}
                  </Button>
                </div>
              )}
              <fieldset disabled={readOnly} className="space-y-4 border-0 p-0 m-0 min-w-0 disabled:opacity-60">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input className="mt-1.5" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div>
                  <Label>Typ</Label>
                  <Select value={editing.room_type} onValueChange={(v) => setEditing({ ...editing, room_type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Typ wählen" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doppelzimmer">Doppelzimmer</SelectItem>
                      <SelectItem value="Familienzimmer">Familienzimmer</SelectItem>
                      {editing.room_type && !["Doppelzimmer", "Familienzimmer"].includes(editing.room_type) && (
                        <SelectItem value={editing.room_type}>{editing.room_type}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                  <label className="flex items-center gap-2 text-xs mt-2 cursor-pointer">
                    <Checkbox
                      checked={!!editing.price_per_person}
                      onCheckedChange={(c) => setEditing({ ...editing, price_per_person: !!c })}
                    />
                    Preis gilt <strong>pro Person</strong> (sonst pro Zimmer)
                  </label>
                </div>
                <div>
                  <Label>Preis bei Einzelbelegung (€, optional)</Label>
                  <Input
                    type="number" step="0.01" className="mt-1.5"
                    placeholder="z. B. 80 — leer = kein Sonderpreis"
                    value={editing.single_use_price ?? ""}
                    onChange={(e) => setEditing({ ...editing, single_use_price: e.target.value === "" ? null : parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Pauschalpreis/Nacht, wenn nur 1 Person bucht.</p>
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
                  {Array.from(new Set([...ALL_AMENITIES, ...toArr(editing.amenities)])).map((a) => (
                    <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={toArr(editing.amenities).includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                      {a}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    className="h-9"
                    placeholder="Eigene Ausstattung hinzufügen (z. B. Klimaanlage)"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addAmenity}>
                    <Plus className="h-4 w-4" /> Hinzufügen
                  </Button>
                </div>
              </div>
              <div>
                <Label>Fotos</Label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(editing.photos ?? []).map((p: string) => (
                    <div key={p} className="relative aspect-square rounded-md overflow-hidden border group">
                      <HotelImage src={p} alt="Zimmerfoto" className="w-full h-full object-cover" />
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
              </fieldset>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Abbrechen</Button>
            <Button onClick={save} disabled={saving || readOnly} title={readOnly ? "Erst entsperren" : undefined}>
              {saving ? "Speichern…" : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Direktbuchung vom Board (z. B. telefonische Anfrage) */}
      <Dialog open={!!quickRoom} onOpenChange={(o) => !o && setQuickRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{quickRoom ? `${quickRoom.name} buchen` : "Buchen"}</DialogTitle>
          </DialogHeader>
          {quickRoom && (() => {
            const nights = Math.max(1, Math.round(
              (new Date(quickForm.check_out).getTime() - new Date(quickForm.check_in).getTime()) / 86400000));
            const rate = quickForm.persons <= 1 && quickRoom.single_use_price != null
              ? Number(quickRoom.single_use_price)
              : quickRoom.price_per_person ? Number(quickRoom.price_per_night) * quickForm.persons : Number(quickRoom.price_per_night);
            return (
              <div className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  {quickRoom.room_type} · max. {quickRoom.max_persons} Personen · Direktbuchung (sofort bestätigt)
                </p>
                <div>
                  <Label>Gastname</Label>
                  <Input className="mt-1.5" value={quickForm.guest_name} placeholder="Vor- und Nachname"
                    onChange={(e) => setQuickForm({ ...quickForm, guest_name: e.target.value })} />
                </div>
                <div>
                  <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Telefon (optional)</Label>
                  <Input className="mt-1.5" value={quickForm.guest_phone} placeholder="z. B. +49 …"
                    onChange={(e) => setQuickForm({ ...quickForm, guest_phone: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Anreise</Label>
                    <Input type="date" className="mt-1.5" value={quickForm.check_in}
                      onChange={(e) => setQuickForm({ ...quickForm, check_in: e.target.value,
                        check_out: e.target.value >= quickForm.check_out ? addDaysIso(e.target.value, 1) : quickForm.check_out })} />
                  </div>
                  <div>
                    <Label>Abreise</Label>
                    <Input type="date" className="mt-1.5" value={quickForm.check_out} min={addDaysIso(quickForm.check_in, 1)}
                      onChange={(e) => setQuickForm({ ...quickForm, check_out: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Personen</Label>
                  <Select value={String(quickForm.persons)} onValueChange={(v) => setQuickForm({ ...quickForm, persons: Number(v) })}>
                    <SelectTrigger className="mt-1.5 w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.max(quickRoom.max_persons || 2, 1) }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Person" : "Personen"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md bg-accent p-3 flex justify-between font-medium">
                  <span>{nights} {nights === 1 ? "Nacht" : "Nächte"} · {quickForm.persons} P.</span>
                  <span>{eur(rate * nights)}</span>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickRoom(null)} disabled={quickSaving}>Abbrechen</Button>
            <Button onClick={submitQuick} disabled={quickSaving}>
              {quickSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />} Buchung anlegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
