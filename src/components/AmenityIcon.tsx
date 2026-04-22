import { Wifi, Tv, Bath, Sun, Wine, Sofa, PawPrint, type LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  WLAN: Wifi,
  TV: Tv,
  Bad: Bath,
  Balkon: Sun,
  Minibar: Wine,
  Wohnbereich: Sofa,
  Haustier: PawPrint,
};

export function AmenityIcon({ name }: { name: string }) {
  const Icon = map[name];
  if (!Icon) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title={name}>
      <Icon className="h-3.5 w-3.5" />
      {name}
    </span>
  );
}
