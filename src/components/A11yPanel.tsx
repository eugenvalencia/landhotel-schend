import { useEffect, useRef, useState, useCallback } from "react";
import { Accessibility, X, Type, Contrast, ZapOff, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Eigenes Barrierefreiheits-Komfort-Panel — kein Drittanbieter-Overlay.
 *
 * Settings (persistiert in localStorage):
 * - Schriftgröße: 100% / 115% / 130% (3 Stufen)
 * - Hoher Kontrast (Override --foreground / --muted-foreground / --border)
 * - Bewegung reduzieren (animation/transition near-zero)
 *
 * Layout:
 * - FAB: bottom-left, 48x48 touch-target (WCAG 2.5.5)
 * - Panel auf Mobile (<768px): Bottom-Sheet (slide-up)
 * - Panel auf Tablet/Desktop: Side-Panel rechts, 360px
 *
 * Wirkt global durch HTML-Root-Klassen + CSS-Variablen — Setup in index.css.
 */

const STORAGE_KEY = "schend_a11y_v1";
type FontSize = "default" | "large" | "larger";
interface A11yState {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}
const DEFAULT_STATE: A11yState = {
  fontSize: "default",
  highContrast: false,
  reducedMotion: false,
};

function applyToRoot(state: A11yState) {
  const html = document.documentElement;
  html.classList.toggle("a11y-large", state.fontSize === "large");
  html.classList.toggle("a11y-larger", state.fontSize === "larger");
  html.classList.toggle("a11y-high-contrast", state.highContrast);
  html.classList.toggle("a11y-reduced-motion", state.reducedMotion);
}

function loadState(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_STATE;
}

function saveState(state: A11yState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export default function A11yPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Init from storage + prefers-reduced-motion media query as default
  useEffect(() => {
    const initial = loadState();
    // Honor OS-level reduced motion as initial default (only if user never set it)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        initial.reducedMotion = true;
      }
    } catch {
      /* ignore */
    }
    setState(initial);
    applyToRoot(initial);
  }, []);

  // Apply + persist on change
  useEffect(() => {
    applyToRoot(state);
    saveState(state);
  }, [state]);

  // ESC closes, focus trap-lite, restore focus on close
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      "button, [href], input, [tabindex]:not([tabindex='-1'])"
    );
    firstFocusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setState((s) => ({ ...s, fontSize }));
  }, []);
  const toggleContrast = useCallback(() => {
    setState((s) => ({ ...s, highContrast: !s.highContrast }));
  }, []);
  const toggleMotion = useCallback(() => {
    setState((s) => ({ ...s, reducedMotion: !s.reducedMotion }));
  }, []);
  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("a11y.openPanel")}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="fixed left-4 md:left-6 z-40 h-12 w-12 md:h-[52px] md:w-[52px] rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary transition-colors
                   bottom-[max(5rem,calc(env(safe-area-inset-bottom)+5rem))] md:bottom-6"
      >
        <Accessibility className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Panel + Backdrop */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/30 z-[70] motion-reduce:bg-foreground/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel: bottom-sheet on mobile, side-panel on md+ */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
            className="fixed z-[71] bg-card text-card-foreground shadow-elevated border border-border
                       inset-x-0 bottom-0 rounded-t-2xl max-h-[85vh] overflow-y-auto
                       md:inset-x-auto md:bottom-6 md:left-6 md:w-[360px] md:rounded-2xl md:max-h-[80vh]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-center justify-between gap-3 rounded-t-2xl">
              <h2
                id="a11y-panel-title"
                className="font-display text-xl flex items-center gap-2"
              >
                <Accessibility className="h-5 w-5 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                {t("a11y.title")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("a11y.close")}
                className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-6">
              {/* Schriftgröße */}
              <fieldset>
                <legend className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Type className="h-4 w-4 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                  {t("a11y.fontSize")}
                </legend>
                <div
                  role="radiogroup"
                  aria-label={t("a11y.fontSize")}
                  className="grid grid-cols-3 gap-2"
                >
                  <FontButton
                    active={state.fontSize === "default"}
                    onClick={() => setFontSize("default")}
                    label={t("a11y.fontDefault")}
                    sizeClass="text-base"
                  />
                  <FontButton
                    active={state.fontSize === "large"}
                    onClick={() => setFontSize("large")}
                    label={t("a11y.fontLarge")}
                    sizeClass="text-lg"
                  />
                  <FontButton
                    active={state.fontSize === "larger"}
                    onClick={() => setFontSize("larger")}
                    label={t("a11y.fontLarger")}
                    sizeClass="text-2xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("a11y.fontHelp")}
                </p>
              </fieldset>

              {/* Hoher Kontrast */}
              <div className="flex items-start justify-between gap-3">
                <label htmlFor="a11y-contrast" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Contrast className="h-4 w-4 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                    {t("a11y.contrast")}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {t("a11y.contrastHelp")}
                  </span>
                </label>
                <Toggle
                  id="a11y-contrast"
                  checked={state.highContrast}
                  onChange={toggleContrast}
                  ariaLabel={t("a11y.contrast")}
                />
              </div>

              {/* Animationen reduzieren */}
              <div className="flex items-start justify-between gap-3">
                <label htmlFor="a11y-motion" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <ZapOff className="h-4 w-4 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                    {t("a11y.motion")}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {t("a11y.motionHelp")}
                  </span>
                </label>
                <Toggle
                  id="a11y-motion"
                  checked={state.reducedMotion}
                  onChange={toggleMotion}
                  ariaLabel={t("a11y.motion")}
                />
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={reset}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {t("a11y.reset")}
              </button>

              {/* Statement-Link */}
              <p className="text-xs text-muted-foreground border-t border-border pt-4 mt-2">
                {t("a11y.statementHint")}{" "}
                <a
                  href="/barrierefreiheit"
                  className="text-secondary hover:underline font-medium"
                >
                  {t("a11y.statementLink")}
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ---------- Subcomponents ---------- */

interface FontButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  sizeClass: string;
}
function FontButton({ active, onClick, label, sizeClass }: FontButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={
        "rounded-lg border px-3 py-3 font-display flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-secondary transition-colors " +
        (active
          ? "border-secondary bg-secondary/10 text-foreground"
          : "border-border bg-card hover:bg-muted text-foreground")
      }
    >
      <span className={sizeClass} aria-hidden="true">
        A
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </button>
  );
}

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}
function Toggle({ id, checked, onChange, ariaLabel }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={
        "relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 " +
        (checked ? "bg-secondary" : "bg-muted-foreground/30")
      }
    >
      <span
        className={
          "absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform " +
          (checked ? "translate-x-5" : "translate-x-0.5")
        }
        aria-hidden="true"
      />
    </button>
  );
}
