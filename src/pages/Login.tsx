import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hotel, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("admin@landhotel-schend.de");
  const [password, setPassword] = useState("Demo2026");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/dashboard");
  }, [user, isAdmin, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("Login fehlgeschlagen: " + error.message);
      return;
    }
    toast.success("Willkommen zurück!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-primary mb-2">
            <Hotel className="h-6 w-6" />
            <span className="font-semibold">Landhotel Schend</span>
          </Link>
          <CardTitle>Hotel-Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              <LogIn className="h-4 w-4" /> {busy ? "Anmelden..." : "Anmelden"}
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Demo: admin@landhotel-schend.de / Demo2026
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
