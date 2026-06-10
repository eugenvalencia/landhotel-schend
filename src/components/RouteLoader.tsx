// Ruhiger Route-Ladefallback (Suspense) — bewusst KEINE Cartoon-Figur, damit
// beim Laden der Lazy-Chunks kein Zeichentrick-Effekt aufblitzt. Die charmante
// Wolf-jagt-Hase-Seite (SiteOffline) bleibt echten 404/Fehlern vorbehalten.
export default function RouteLoader() {
  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center gap-5"
      role="status"
      aria-label="Wird geladen"
    >
      <span
        className="schend-mark h-12 w-auto text-secondary/90 motion-safe:animate-pulse"
        style={{ aspectRatio: "2048 / 871" }}
        aria-hidden="true"
      />
      <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        Einen Moment
      </span>
    </div>
  );
}
