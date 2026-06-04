// Globaler, schlanker Banner unter dem Header — auf JEDER Dashboard-Sektion
// sichtbar, sobald offene Anfragen existieren. Klick führt zur Buchungsliste.
// Aktualisiert sich selbst (Poll + Fenster-Fokus + nach jeder Aktion).

import { Link } from "react-router-dom";
import { useOpenRequests } from "@/hooks/useOpenRequests";

export default function OpenRequestsBanner() {
  const { count } = useOpenRequests();
  if (count === 0) return null;
  return (
    <Link
      to="/dashboard/bookings"
      className="mb-4 flex items-center gap-2.5 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm hover:bg-red-500/15 transition-colors"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>
      <span className="font-semibold text-foreground">
        {count} {count === 1 ? "neue Anfrage" : "neue Anfragen"}
      </span>
      <span className="text-muted-foreground hidden sm:inline">— bitte prüfen &amp; bestätigen</span>
      <span className="ml-auto text-xs uppercase tracking-[0.15em] text-red-600 dark:text-red-400 font-medium">
        Ansehen →
      </span>
    </Link>
  );
}
