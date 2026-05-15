import { LockOpen } from "lucide-react";

interface DemoBannerProps {
  /** Kurze Beschreibung was das Modul tut, in einem Satz. */
  description: string;
}

/**
 * Gruener Demo-Banner — zeigt dass das aktuelle Modul Mock-Daten zeigt.
 * Steht oben in jeder Demo-Komponente.
 */
export default function DemoBanner({ description }: DemoBannerProps) {
  return (
    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 mb-5 flex items-start gap-3">
      <LockOpen className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Demo-Modus — Beispieldaten
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description} Schalte das Modul produktiv, sobald du es echt nutzen willst.
        </p>
      </div>
    </div>
  );
}
