import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getInitial(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    /* localStorage disabled */
  }
  return "light"; // Default = HELL (überall, Desktop+Mobil); Dunkel/System nur per Wahl
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "light") root.classList.add("light");
  else if (theme === "dark") root.classList.add("dark");
  // "system" → no class, prefers-color-scheme media query takes over
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage disabled */
  }
}

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Helles Design" },
  { value: "system", icon: Monitor, label: "Systemstandard" },
  { value: "dark", icon: Moon, label: "Dunkles Design" },
];

/**
 * Three-way theme switcher: light / system / dark. System uses
 * prefers-color-scheme automatically. Selection persists in
 * localStorage.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => getInitial());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div
      role="radiogroup"
      aria-label="Design-Schema"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border/60 p-0.5 bg-background/60 backdrop-blur-sm",
        className,
      )}
    >
      {OPTIONS.map((o) => {
        const active = theme === o.value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}
