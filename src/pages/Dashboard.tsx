import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DisabledModuleCard from "@/components/dashboard/DisabledModuleCard";

import OverviewTab from "@/components/dashboard/OverviewTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import GuestsTab from "@/components/dashboard/GuestsTab";
import ReviewsTab from "@/components/dashboard/ReviewsTab";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import PricingTab from "@/components/dashboard/PricingTab";
import HousekeepingTab from "@/components/dashboard/HousekeepingTab";
import ChannelManagerTab from "@/components/dashboard/ChannelManagerTab";
import InternalBookingsTab from "@/components/dashboard/InternalBookingsTab";
import HyperlocalConciergeTab from "@/components/dashboard/HyperlocalConciergeTab";

import { useTenant } from "@/hooks/useTenant";
import { applyTenantBranding } from "@/lib/applyTenantBranding";
import {
  MODULE_CATALOG,
  getFeatureState,
  type FeatureKey,
} from "@/lib/tenant";

/**
 * Map vom URL-Pfad (z.B. "calendar") auf die Komponente.
 * Wir matchen über `ModuleDescriptor.path` damit die Sidebar-Links und die
 * Routing-Map garantiert in sync bleiben.
 */
const MODULE_COMPONENTS: Partial<Record<FeatureKey, React.ComponentType>> = {
  calendar: CalendarTab,
  internal_bookings: InternalBookingsTab,
  housekeeping_mobile: HousekeepingTab,
  guest_profiles: GuestsTab,
  hyperlocal_concierge: HyperlocalConciergeTab,
  online_payments: () => <PaymentsPlaceholder />,
  channel_manager: ChannelManagerTab,
  voice_concierge: () => <VoicePlaceholder />,
  reviews_inbox: ReviewsTab,
  daily_briefing: () => <BriefingPlaceholder />,
  guest_messaging: () => <MessagingPlaceholder />,
  analytics_revenue: AnalyticsTab,
  datev_export: () => <DatevPlaceholder />,
  compliance_vault: () => <CompliancePlaceholder />,
  anomaly_detection: () => <AnomalyPlaceholder />,
};

// kleine Stubs für noch nicht gebaute Module — solange `disabled` werden sie nicht angezeigt
function Placeholder({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-2">
      <h2 className="text-2xl font-display">{title}</h2>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}
const PaymentsPlaceholder    = () => <Placeholder title="Online-Zahlungen" sub="Stripe-Integration kommt nach Aktivierung." />;
const VoicePlaceholder       = () => <Placeholder title="Telefon-KI" sub="Vapi-Voice-Agent kommt nach Aktivierung." />;
const BriefingPlaceholder    = () => <Placeholder title="Daily Briefing" sub="Morgen-Übersicht kommt nach Aktivierung." />;
const MessagingPlaceholder   = () => <Placeholder title="Nachrichten" sub="E-Mail/WhatsApp-Inbox kommt nach Aktivierung." />;
const DatevPlaceholder       = () => <Placeholder title="DATEV-Export" sub="Monatlicher Export kommt nach Aktivierung." />;
const CompliancePlaceholder  = () => <Placeholder title="Compliance-Vault" sub="AVV, TOM, Subprozessoren kommt nach Aktivierung." />;
const AnomalyPlaceholder     = () => <Placeholder title="Anomalie-Watch" sub="Fraud-Erkennung kommt nach Aktivierung." />;

// ---------- Wrapper: header + sidebar + outlet ----------
function DashboardShell({ children, activePath }: { children: React.ReactNode; activePath: string }) {
  const navigate = useNavigate();
  const { tenant } = useTenant();

  // Tenant-Branding ins CSS-Custom-Property-System
  useEffect(() => {
    applyTenantBranding(tenant?.branding);
    return () => applyTenantBranding(null);
  }, [tenant]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <header className="bg-primary text-primary-foreground sticky top-0 z-30">
        <div className="px-3 md:px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Mobile-Sidebar-Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
                <DashboardSidebar activePath={activePath} />
              </SheetContent>
            </Sheet>
            <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
              <span
                role="img"
                aria-label={tenant?.name ? `${tenant.name} Logo` : "Logo"}
                className="schend-mark shrink-0 h-6 text-primary-foreground"
              />
              <span className="font-semibold truncate">
                {tenant?.name ?? "Conexa OS"} <span className="opacity-60">· Dashboard</span>
              </span>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Abmelden</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar activePath={activePath} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-3 md:px-6 py-5 md:py-6 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

// ---------- Übersichts-Page (Default-Route) ----------
function DashboardOverview() {
  return (
    <DashboardShell activePath="overview">
      <OverviewTab />
    </DashboardShell>
  );
}

// ---------- Modul-Page (per URL-Slug) ----------
function DashboardModule() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const { tenant, loading } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar-Match: was hat die Sidebar selektiert?
  const moduleDescriptor = MODULE_CATALOG.find((m) => m.path === moduleSlug);

  useEffect(() => {
    if (loading) return;
    if (!moduleDescriptor) {
      // unbekannter Slug → zurück zur Übersicht
      navigate("/dashboard", { replace: true });
      return;
    }
    if (tenant) {
      const state = getFeatureState(tenant.features, moduleDescriptor.key);
      if (state === "hidden") {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [loading, tenant, moduleDescriptor, navigate, location.pathname]);

  if (!moduleDescriptor) return null;

  const state = tenant ? getFeatureState(tenant.features, moduleDescriptor.key) : "hidden";
  const Component = MODULE_COMPONENTS[moduleDescriptor.key];

  return (
    <DashboardShell activePath={moduleDescriptor.path}>
      {state === "disabled" || !Component ? (
        <DisabledModuleCard module={moduleDescriptor} />
      ) : (
        <Component />
      )}
    </DashboardShell>
  );
}

// ---------- Default-Export: Routing-Komponente, die in App.tsx unter /dashboard/* lebt ----------
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export { DashboardOverview, DashboardModule };
