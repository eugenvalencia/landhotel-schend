import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const DEMO_EMAIL = "admin@landhotel-schend.de";
const DEMO_PASSWORD = "Demo2026";

export default function Login() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const demoMode =
    import.meta.env.DEV ||
    import.meta.env.VITE_DEMO_MODE === "1" ||
    searchParams.get("demo") === "1";
  const [email, setEmail] = useState(demoMode ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(demoMode ? DEMO_PASSWORD : "");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/dashboard");
  }, [user, isAdmin, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Login fehlgeschlagen: " + error.message);
        return;
      }
      if (!data.session) {
        toast.error("Login fehlgeschlagen: keine Session zurückerhalten");
        return;
      }
      toast.success("Willkommen zurück!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[login] supabase signIn threw:", err);
      toast.error("Verbindungsfehler: " + msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-muted/40 to-background px-4 py-12">
      <Card className="w-full max-w-md shadow-elevated border-border/40">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-flex items-center justify-center gap-3 text-primary mb-4 hover:opacity-80 transition-opacity">
            <img
              src="/schend-logo-black.svg"
              alt="Landhotel Schend Logo"
              className="h-10 w-auto dark:hidden"
            />
            <img
              src="/schend-logo-white.svg"
              alt="Landhotel Schend Logo"
              className="hidden h-10 w-auto dark:block"
            />
            <span className="font-display text-xl">Landhotel Schend</span>
          </Link>
          <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-secondary mb-2">
            Hotelier-Bereich
          </p>
          <CardTitle className="font-display text-3xl">Anmelden</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Für Familie Beimler und Mitarbeitende
          </p>
        </CardHeader>
        <CardContent>
          {demoMode && (
            <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
              <div className="font-semibold text-primary mb-1">Demo-Zugangsdaten</div>
              <div><span className="text-muted-foreground">E-Mail:</span> {DEMO_EMAIL}</div>
              <div><span className="text-muted-foreground">Passwort:</span> {DEMO_PASSWORD}</div>
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12" disabled={busy}>
              <LogIn className="h-4 w-4" /> {busy ? "Anmelden..." : "Anmelden"}
            </Button>
          </form>

          <div className="hairline mt-8 mb-5" />
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-secondary transition-colors">
              ← Zurück zur Website
            </Link>
            <p className="text-[10px] tracking-wider uppercase opacity-70 mt-1">
              Verschlüsselt · Supabase Auth · EU-Hosting
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
