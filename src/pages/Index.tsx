import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hotel, CalendarCheck, ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6" />
            <span className="font-semibold text-lg">Landhotel Schend</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/login">Hotel-Login</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/booking">Jetzt buchen</Link>
            </Button>
          </nav>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <p className="uppercase tracking-widest text-sm opacity-80 mb-4">Vulkaneifel · Deutschland</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Landhotel Schend</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Direkt buchen, ohne Provision. 21 individuell gestaltete Zimmer im Herzen der Vulkaneifel.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base">
            <Link to="/booking">
              <CalendarCheck className="h-5 w-5" />
              Verfügbarkeit prüfen
            </Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Hotel, title: "21 Zimmer", text: "Vom gemütlichen Einzelzimmer bis zur Eifel-Suite." },
          { icon: CalendarCheck, title: "Direkt & einfach", text: "Buchen Sie online in wenigen Minuten – ohne Wartezeit." },
          { icon: ShieldCheck, title: "Sichere Zahlung", text: "Geprüfter Bezahlvorgang mit sofortiger Bestätigung." },
        ].map((f, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-card">
            <f.icon className="h-8 w-8 text-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Landhotel Schend · Vulkaneifel
      </footer>
    </div>
  );
};

export default Index;
