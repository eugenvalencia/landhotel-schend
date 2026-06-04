// Kleiner roter Punkt + Hinweis, der Demo-/Beispiel-Inhalte markiert.
// Schend soll sehen, was alles geht — diese Inhalte sind aber Beispieldaten
// und werden später entfernt. Zum Aufräumen: einfach <DemoMarker /> entfernen
// (zentral platziert in Dashboard.tsx, wenn ein Modul als demo gerendert wird).

export default function DemoMarker() {
  return (
    <div
      role="note"
      aria-label="Demo-Inhalt — Beispieldaten, werden später entfernt"
      className="mb-4 flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-1.5"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>
      <span className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">Demo-Inhalt</span> — Beispieldaten zur Veranschaulichung, werden später entfernt.
      </span>
    </div>
  );
}
