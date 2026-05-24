import { Link } from "react-router-dom";
import { useState, useRef, useCallback } from "react";

interface MegaItem {
  label: string;
  to: string;
  hint?: string;
}

interface MegaMenuProps {
  // Trigger-Button-Label (z.B. "ZIMMER")
  label: string;
  // Welche Section anchored werden soll wenn man auf den Trigger selbst klickt
  anchorId?: string;
  // Items für das Dropdown
  items: MegaItem[];
  // Optionales Preview-Bild rechts im Dropdown (URL)
  previewImage?: string;
  previewCaption?: string;
  // Click-Handler für Anchor-Items (übergibt den anchorId)
  onAnchorClick?: (id: string) => void;
}

// Editorial Mega-Menu mit Hover-Open, schließt sich nach 150ms Cursor-Verlust.
// Dropdown enthält links eine schmale Item-Liste, rechts ein Preview-Bild
// als Magazine-Style-Akzent. Nur lg+ — Mobile nutzt die normale Burger-Navigation.
export default function HeaderMegaMenu({
  label,
  anchorId,
  items,
  previewImage,
  previewCaption,
  onAnchorClick,
}: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  }, [cancelClose]);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => {
          if (anchorId && onAnchorClick) onAnchorClick(anchorId);
        }}
        aria-haspopup="true"
        aria-expanded={open}
        className="nav-underline px-2 xl:px-2.5 py-2 text-[11px] xl:text-xs font-semibold text-primary hover:text-secondary transition-colors tracking-[0.08em] whitespace-nowrap"
      >
        {label}
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 transition-all duration-200 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
        }`}
      >
        <div
          className={`bg-background/95 backdrop-blur-xl border border-border/60 rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden flex ${
            previewImage ? "w-[440px]" : "min-w-[260px]"
          }`}
        >
          {/* Items column */}
          <ul className="flex-1 p-3">
            {items.map((it) => (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className="block px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-display text-sm text-primary group-hover:text-secondary transition-colors">
                    {it.label}
                  </p>
                  {it.hint && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {it.hint}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Preview image */}
          {previewImage && (
            <Link
              to={items[0]?.to ?? "/"}
              className="relative w-40 shrink-0 overflow-hidden group"
              aria-label={previewCaption || items[0]?.label}
            >
              <img
                src={previewImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              {previewCaption && (
                <span className="absolute bottom-3 left-3 right-3 text-[10px] tracking-[0.18em] uppercase text-white/95 font-medium">
                  {previewCaption}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
