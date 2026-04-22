import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Hotel, CalendarCheck, Phone, Mail, MapPin, Star,
  ParkingCircle, Bike, Waves, UtensilsCrossed, BedDouble, Wifi, Coffee, Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { HotelImage } from "@/components/HotelImage";
import ReviewsSection from "@/components/ReviewsSection";
import LocationSection from "@/components/LocationSection";
import {
  SCHEND_HEROES, SCHEND_RESTAURANT, SCHEND_GALLERY, photoForRoomType,
} from "@/lib/photos";

const USPS = [
  { icon: ParkingCircle, text: "Kostenlose Parkplätze — videoüberwacht" },
  { icon: Bike, text: "Motorrad-Parkplätze vorhanden — videoüberwacht" },
  { icon: Waves, text: "Sauna & Wellness" },
  { icon: UtensilsCrossed, text: "Hauseigenes Restaurant" },
  { icon: BedDouble, text: "21 Zimmer mit Balkon/Terrasse" },
  { icon: Wifi, text: "Kostenloses WLAN" },
  { icon: Coffee, text: "Großes Frühstücksbuffet" },
  { icon: Trophy, text: "Booking.com 8.5 · Tripadvisor #1" },
];

const TYPE_DESCRIPTIONS: Record<string, string> = {
  "Einzelzimmer": "Gemütliches Einzelzimmer mit Blick auf die Vulkaneifel",
  "Doppelzimmer Standard": "Komfortables Doppelzimmer mit Doppelbett und Balkon",
  "Doppelzimmer Komfort": "Geräumiges Zimmer mit zwei Einzelbetten und Terrasse",
  "Familienzimmer": "Großes Familienzimmer für bis zu 4 Personen",
  "Junior Suite": "Elegante Junior Suite mit Kingsize-Bett",
  "Suite": "Unsere schönste Suite mit Wohnbereich und Panoramablick",
  "Eifel-Suite": "Unsere schönste Suite mit Wohnbereich und Panoramablick",
};

type RoomCategory = { id: string; name: string; type: string; price: number };

const Index = () => {
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % SCHEND_HEROES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    supabase
      .from("rooms")
      .select("id, name, room_type, price_per_night")
      .eq("status", "aktiv")
      .order("price_per_night")
      .then(({ data }) => {
        if (!data) return;
        const seen = new Set<string>();
        const cats: RoomCategory[] = [];
        for (const r of data as any[]) {
          if (seen.has(r.room_type)) continue;
          seen.add(r.room_type);
          cats.push({ id: r.id, name: r.room_type, type: r.room_type, price: Number(r.price_per_night) });
        }
        setCategories(cats);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="absolute top-0 inset-x-0 z-30 text-primary-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6" />
            <span className="font-semibold text-lg drop-shadow">Landhotel Schend</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground">
              <Link to="/login">Hotel-Login</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/booking">Jetzt buchen</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center text-primary-foreground overflow-hidden">
        {SCHEND_HEROES.map((src, i) => (
          <HotelImage
            key={src}
            src={src}
            alt="Landhotel Schend in der Vulkaneifel"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === heroIdx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <p className="uppercase tracking-[0.2em] text-sm opacity-90 mb-4">Ihr Urlaubsdomizil in der Vulkaneifel</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow">Willkommen im Landhotel Schend</h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto mb-8">
            Erholen Sie sich in der wunderschönen Vulkaneifel — mit Sauna, Wellness, hauseigenem Restaurant und 21 komfortablen Zimmern.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/booking"><CalendarCheck className="h-5 w-5" /> Jetzt direkt buchen</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-white/10 text-primary-foreground border-white/40 hover:bg-white/20 hover:text-primary-foreground">
              <a href="tel:+4965731306"><Phone className="h-5 w-5" /> +49 6573 306</a>
            </Button>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
          {USPS.map((u) => (
            <div key={u.text} className="flex items-start gap-3">
              <u.icon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{u.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ROOMS */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Unsere Zimmer</p>
          <h2 className="text-3xl md:text-4xl font-bold">Zu Gast im Landhotel Schend</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            21 individuell gestaltete Zimmer und Suiten — alle mit Balkon oder Terrasse und Blick in die Vulkaneifel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((r) => (
            <Link
              key={r.id}
              to={`/rooms/${r.id}`}
              className="group rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <HotelImage
                  src={photoForRoomType(r.type)}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{r.name}</h3>
                  <span className="text-sm font-semibold text-secondary">ab {eur(r.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{TYPE_DESCRIPTIONS[r.type] ?? ""}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/booking"><CalendarCheck className="h-5 w-5" /> Verfügbarkeit prüfen</Link>
          </Button>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* RESTAURANT */}
      <section className="bg-muted">
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-xl overflow-hidden shadow-elevated order-last md:order-first aspect-[4/3]">
            <HotelImage src={SCHEND_RESTAURANT} alt="Landhaus Restaurant & Terrasse" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Kulinarik</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Landhaus Restaurant & Terrasse</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Genießen Sie die Eifeler Landküche in unserem hauseigenen Restaurant mit gemütlicher Terrasse.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-secondary" /> Regionale Spezialitäten</p>
              <p className="flex items-center gap-2"><Coffee className="h-4 w-4 text-secondary" /> Großes Frühstücksbuffet</p>
              <p className="flex items-center gap-2"><Star className="h-4 w-4 text-secondary" /> Halbpension auf Wunsch</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.2em] text-xs text-secondary mb-2">Galerie</p>
          <h2 className="text-3xl md:text-4xl font-bold">Eindrücke aus der Vulkaneifel</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {SCHEND_GALLERY.map((src) => (
            <div key={src} className="aspect-[4/3] rounded-xl overflow-hidden shadow-card">
              <HotelImage src={src} alt="Landhotel Schend Eindruck" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Kontakt & Anfahrt</h2>
          <p className="opacity-90 mb-8">Wir freuen uns auf Ihren Besuch in der Vulkaneifel.</p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a href="tel:+4965731306" className="flex flex-col items-center gap-2 hover:opacity-90">
              <Phone className="h-6 w-6" />
              <span className="font-medium">+49 6573 306</span>
            </a>
            <a href="mailto:info@landhaus-schend.de" className="flex flex-col items-center gap-2 hover:opacity-90 break-all">
              <Mail className="h-6 w-6" />
              <span className="font-medium">info@landhaus-schend.de</span>
            </a>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-6 w-6" />
              <span className="font-medium">54552 Immerath<br />Vulkaneifel</span>
            </div>
          </div>
          <div className="mt-10">
            <Button asChild size="lg" variant="secondary">
              <Link to="/booking"><CalendarCheck className="h-5 w-5" /> Jetzt buchen</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-card">
        © {new Date().getFullYear()} Landhotel Schend · Vulkaneifel · landhaus-schend.de
      </footer>
    </div>
  );
};

export default Index;
