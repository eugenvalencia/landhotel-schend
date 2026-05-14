import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Building2,
  Clock,
  Eye,
  LogOut,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import OperatorRoute from "@/components/OperatorRoute";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

/**
 * Operator-Mode — Conexa-Admin-Sicht ueber alle Tenants.
 *
 * Designprinzip: AGGREGIERT, nicht voyeuristisch. Du siehst dass Tenant X
 * 17 Buchungen letzte Woche hatte, du siehst NICHT wer da gebucht hat.
 * Fuer Detail-Zugriff braucht es expliziten Access-Request mit Reason —
 * jeder solche Zugriff wird im audit_log mit der Begruendung festgehalten.
 */

interface OperatorRow {
  tenant_id: string;
  slug: string;
  name: string;
  state: string;
  member_count: number;
  booking_count: number;
  guest_count: number;
  last_booking_at: string | null;
  created_at: string;
  features_active: number;
  features_disabled: number;
  features_hidden: number;
}

interface AuditRow {
  id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  tenant_slug: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

function OperatorInner() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<OperatorRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"tenants" | "audit">("tenants");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const [overviewRes, auditRes] = await Promise.all([
        (supabase as any).rpc("get_operator_overview"),
        (supabase as any)
          .from("audit_log_recent")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
      ]);
      if (!active) return;
      if (overviewRes.error) {
        toast.error(`Operator-Overview Fehler: ${overviewRes.error.message}`);
      } else {
        setTenants((overviewRes.data as OperatorRow[] | null) ?? []);
      }
      if (!auditRes.error) {
        setAudit((auditRes.data as AuditRow[] | null) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredTenants = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return tenants;
    return tenants.filter(
      (t) => t.name.toLowerCase().includes(s) || t.slug.toLowerCase().includes(s),
    );
  }, [tenants, search]);

  const totals = useMemo(() => {
    return tenants.reduce(
      (acc, t) => ({
        members: acc.members + t.member_count,
        bookings: acc.bookings + t.booking_count,
        active_features: acc.active_features + t.features_active,
      }),
      { members: 0, bookings: 0, active_features: 0 },
    );
  }, [tenants]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-[hsl(220_28%_8%)] text-white sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/operator" className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span className="font-semibold">Conexa Operator-Mode</span>
            <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px]">
              tenant-uebergreifend
            </Badge>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 hover:text-white">
              <Link to="/dashboard">Zurueck zum Tenant-Dashboard</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Abmelden
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header-Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Tenants</p>
                <Building2 className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{tenants.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">User</p>
                <Users className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{totals.members}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Buchungen gesamt</p>
                <Activity className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{totals.bookings}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Aktive Module</p>
                <ShieldCheck className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{totals.active_features}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab-Switch */}
        <div className="flex gap-2 border-b">
          {[
            { key: "tenants", label: "Tenants" },
            { key: "audit", label: "Audit-Log" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key as "tenants" | "audit")}
              className={
                "px-3 py-2 text-sm border-b-2 -mb-px transition-colors " +
                (tab === t.key
                  ? "border-secondary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "tenants" ? (
          <TenantTable
            rows={filteredTenants}
            loading={loading}
            search={search}
            onSearchChange={setSearch}
          />
        ) : (
          <AuditTable rows={audit} loading={loading} />
        )}
      </main>
    </div>
  );
}

function TenantTable({
  rows,
  loading,
  search,
  onSearchChange,
}: {
  rows: OperatorRow[];
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const [accessRequestTenant, setAccessRequestTenant] = useState<OperatorRow | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestAccess = async () => {
    if (!accessRequestTenant || !reason.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await (supabase as any).rpc("log_operator_access", {
        p_tenant_id: accessRequestTenant.tenant_id,
        p_action: "operator.access_grant",
        p_entity_type: "tenant",
        p_entity_id: accessRequestTenant.tenant_id,
        p_reason: reason.trim(),
      });
      if (error) throw error;
      toast.success(
        `Audit-Eintrag erstellt — Zugriff auf ${accessRequestTenant.name} ist jetzt protokolliert.`,
      );
      setAccessRequestTenant(null);
      setReason("");
    } catch (err) {
      toast.error(`Access-Log fehlgeschlagen: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-secondary" /> Alle Tenants
        </CardTitle>
        <div className="relative w-64 max-w-full">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suchen — Name/Slug"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-6">Lade …</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">Keine Tenants.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-xs text-muted-foreground text-left">
                  <th className="font-medium py-2 px-2">Tenant</th>
                  <th className="font-medium py-2 px-2">Status</th>
                  <th className="font-medium py-2 px-2 text-right">User</th>
                  <th className="font-medium py-2 px-2 text-right">Buchungen</th>
                  <th className="font-medium py-2 px-2 text-right">Module</th>
                  <th className="font-medium py-2 px-2">Letzte Buchung</th>
                  <th className="font-medium py-2 px-2 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.tenant_id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 px-2">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{t.slug}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <Badge variant={t.state === "active" ? "default" : "outline"} className="text-[10px]">
                        {t.state}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{t.member_count}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{t.booking_count}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="text-green-700 font-medium">{t.features_active}</span>
                      <span className="text-muted-foreground"> / </span>
                      <span className="text-muted-foreground">{t.features_disabled}</span>
                      <span className="text-muted-foreground"> / </span>
                      <span className="text-muted-foreground/60">{t.features_hidden}</span>
                    </td>
                    <td className="py-2.5 px-2 text-xs text-muted-foreground">
                      {t.last_booking_at ? formatDate(t.last_booking_at.slice(0, 10)) : "—"}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAccessRequestTenant(t)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="h-3 w-3" /> Zugriff
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
              Module-Spalte: <span className="text-green-700">active</span> / <span>disabled</span> /{" "}
              <span className="opacity-60">hidden</span>. Aggregiert — keine PII.
            </p>
          </div>
        )}
      </CardContent>

      {/* Access-Request-Dialog (Inline-Card statt Modal um leichtgewichtig zu bleiben) */}
      {accessRequestTenant && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-elevated">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-secondary" />
                Tenant-Detailzugriff anfordern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Du moechtest auf <strong>{accessRequestTenant.name}</strong> zugreifen.
                Bitte begruende warum — der Eintrag landet sofort im Audit-Log des Tenants
                und ist fuer den Tenant-Owner sichtbar.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={'z.B. „Support-Ticket #1247 — Buchung verschwunden, vom Kunden gemeldet"'}
                rows={4}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setAccessRequestTenant(null)}>
                  Abbrechen
                </Button>
                <Button onClick={requestAccess} disabled={!reason.trim() || submitting}>
                  Zugriff protokollieren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}

function AuditTable({ rows, loading }: { rows: AuditRow[]; loading: boolean }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-secondary" /> Audit-Log — letzte 200 Eintraege
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-6">Lade …</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">Noch keine Audit-Eintraege.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-xs text-muted-foreground text-left">
                  <th className="font-medium py-2 px-2">Zeit</th>
                  <th className="font-medium py-2 px-2">Tenant</th>
                  <th className="font-medium py-2 px-2">Akteur</th>
                  <th className="font-medium py-2 px-2">Aktion</th>
                  <th className="font-medium py-2 px-2">Grund</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 px-2 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(a.created_at).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-medium">{a.tenant_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{a.tenant_slug ?? ""}</div>
                    </td>
                    <td className="py-2.5 px-2 text-xs">
                      <Badge variant="outline" className="text-[10px] mr-1">
                        {a.actor_role ?? "anon"}
                      </Badge>
                      {a.actor_email ?? "—"}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-xs">{a.action}</td>
                    <td className="py-2.5 px-2 text-xs text-muted-foreground italic">
                      {a.reason ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Operator() {
  return (
    <OperatorRoute>
      <OperatorInner />
    </OperatorRoute>
  );
}
