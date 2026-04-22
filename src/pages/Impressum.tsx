import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const Impressum = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Impressum</h1>
      <p className="text-muted-foreground">Diese Seite wird bald verfügbar sein.</p>
    </main>
    <SiteFooter />
  </div>
);

export default Impressum;
