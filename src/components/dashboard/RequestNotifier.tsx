// Spielt einen dezenten Ton + zeigt eine Browser-Benachrichtigung, wenn eine
// NEUE Buchungsanfrage reinkommt — damit Schends Team es auch bemerkt, wenn das
// Dashboard im Hintergrund läuft. Genau EINMAL gemountet (in Dashboard), damit
// es nicht doppelt pingt. Ton ist asset-frei (WebAudio-Chime).

import { useEffect, useRef } from "react";
import { useOpenRequests } from "@/hooks/useOpenRequests";

function playChime(ctx: AudioContext | null) {
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      const t = now + i * 0.13;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.4);
    });
  } catch {
    /* ignore */
  }
}

export default function RequestNotifier() {
  const { count } = useOpenRequests();
  const prev = useRef<number | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Audio-Kontext bei erster Interaktion entsperren (Browser-Autoplay-Policy)
    const unlock = () => {
      if (!audioCtx.current) {
        try {
          const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtx.current = new AC();
        } catch {
          /* ignore */
        }
      }
      audioCtx.current?.resume?.();
    };
    window.addEventListener("pointerdown", unlock, { once: true });

    // Benachrichtigungs-Erlaubnis anfragen (für Hintergrund-Hinweis)
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    // Beim ersten Laden nur Baseline setzen — kein Ping für bestehende Anfragen
    if (prev.current === null) {
      prev.current = count;
      return;
    }
    if (count > prev.current) {
      const delta = count - prev.current;
      playChime(audioCtx.current);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("Neue Buchungsanfrage", {
            body:
              delta === 1
                ? "Es liegt 1 neue Anfrage vor — bitte im Dashboard prüfen."
                : `Es liegen ${delta} neue Anfragen vor — bitte im Dashboard prüfen.`,
            icon: "/conexa-icon-white.svg",
          });
        } catch {
          /* ignore */
        }
      }
    }
    prev.current = count;
  }, [count]);

  return null;
}
