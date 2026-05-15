import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  NotebookPen,
  Sparkles,
  Users,
  Compass,
  MessageSquare,
  Star,
  PhoneCall,
  Globe,
  CreditCard,
  Coffee,
  LineChart,
  ShieldAlert,
  FileSpreadsheet,
  ShieldCheck,
  Lock,
  LockOpen,
  TrendingUp,
  Receipt,
  ClipboardList,
  Wrench,
  ScanLine,
  Users2,
  Banknote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTenant } from "@/hooks/useTenant";
import {
  MODULE_CATALOG,
  MODULE_GROUP_LABEL,
  getFeatureState,
  type ModuleDescriptor,
} from "@/lib/tenant";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar,
  NotebookPen,
  Sparkles,
  Users,
  Compass,
  MessageSquare,
  Star,
  PhoneCall,
  Globe,
  CreditCard,
  Coffee,
  LineChart,
  ShieldAlert,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  Receipt,
  ClipboardList,
  Wrench,
  ScanLine,
  Users2,
  Banknote,
};

interface SidebarItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  disabled?: boolean;
  demo?: boolean;
}

function SidebarItem({ to, label, icon: Icon, active, disabled, demo }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-md transition-colors",
        "border border-transparent",
        active &&
          "bg-sidebar-accent text-sidebar-primary-foreground border-sidebar-border/40 shadow-[inset_2px_0_0_0_hsl(var(--sidebar-primary))]",
        !active && !disabled && "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        disabled && "text-sidebar-foreground/40 hover:bg-sidebar-accent/30",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active && "text-sidebar-primary")} />
      <span className="truncate">{label}</span>
      {disabled && <Lock className="h-3 w-3 ml-auto opacity-60" aria-label="Modul gesperrt" />}
      {!disabled && demo && (
        <LockOpen
          className="h-3 w-3 ml-auto text-emerald-400"
          aria-label="Demo-Modul freigeschaltet"
        />
      )}
    </Link>
  );
}

interface DashboardSidebarProps {
  /** Aktueller Modul-Pfad (z.B. "calendar"). */
  activePath: string;
  /** Basis-Pfad vor dem Modul-Pfad (z.B. "/dashboard"). */
  basePath?: string;
}

export default function DashboardSidebar({ activePath, basePath = "/dashboard" }: DashboardSidebarProps) {
  const { tenant, loading } = useTenant();
  const location = useLocation();

  const visibleModules = useMemo(() => {
    if (!tenant) return [];
    return MODULE_CATALOG.filter((m) => getFeatureState(tenant.features, m.key) !== "hidden");
  }, [tenant]);

  const grouped = useMemo(() => {
    const groups: Record<string, ModuleDescriptor[]> = {};
    for (const m of visibleModules) {
      (groups[m.group] ||= []).push(m);
    }
    return groups;
  }, [visibleModules]);

  // Order der Gruppen folgt der Definition in MODULE_GROUP_LABEL
  const groupOrder = Object.keys(MODULE_GROUP_LABEL) as Array<keyof typeof MODULE_GROUP_LABEL>;

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {/* Übersicht — kein Feature-Flag, immer da */}
        <SidebarItem
          to={`${basePath}`}
          label="Übersicht"
          icon={LayoutDashboard}
          active={activePath === "" || activePath === "overview"}
        />

        {loading && (
          <div className="text-xs text-sidebar-foreground/60 px-3 py-2">Lade Module …</div>
        )}

        {!loading &&
          groupOrder.map((groupKey) => {
            const items = grouped[groupKey];
            if (!items || items.length === 0) return null;
            return (
              <div key={groupKey} className="space-y-1">
                <div className="px-3 text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50 font-medium">
                  {MODULE_GROUP_LABEL[groupKey]}
                </div>
                <ul className="space-y-0.5">
                  {items.map((m) => {
                    const state = tenant ? getFeatureState(tenant.features, m.key) : "hidden";
                    const config = tenant?.features[m.key] as Record<string, unknown> | undefined;
                    const isDemo = config?.demo === true;
                    const Icon = ICON_MAP[m.iconName] ?? LayoutDashboard;
                    return (
                      <li key={m.key}>
                        <SidebarItem
                          to={`${basePath}/${m.path}`}
                          label={m.label}
                          icon={Icon}
                          active={activePath === m.path}
                          disabled={state === "disabled"}
                          demo={isDemo}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border/60">
        {tenant ? (
          <>
            <div className="flex items-center gap-2.5">
              <span
                role="img"
                aria-label={`${tenant.name} Logo`}
                className="schend-mark shrink-0 h-5 text-sidebar-foreground/80"
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-sidebar-foreground/85 truncate">{tenant.name}</div>
                <div className="text-[10px] text-sidebar-foreground/45">Tenant · Pilot</div>
              </div>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-sidebar-border/30 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-sidebar-primary/15 text-sidebar-primary text-[8px] font-bold tracking-wider">
                C
              </span>
              <span className="text-[10px] text-sidebar-foreground/55 tracking-wider uppercase">
                Powered by Conexa OS
              </span>
            </div>
          </>
        ) : (
          <div className="text-[11px] text-sidebar-foreground/50">Conexa OS</div>
        )}
      </div>
    </aside>
  );
}
