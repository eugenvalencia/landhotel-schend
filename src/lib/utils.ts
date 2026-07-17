import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { KeyboardEvent } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tastatur-Aktivierung für klickbare Nicht-Button-Elemente (z. B. <li onClick>):
 * löst dieselbe Aktion bei Enter/Leertaste aus. Zusammen mit role="button" +
 * tabIndex={0} macht das solche Elemente tastatur-zugänglich (a11y).
 */
export function activateOnKey(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}
