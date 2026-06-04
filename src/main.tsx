import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Selbstheilung nach Deploys: Lädt ein lazy-Programmteil nicht (weil der alte
// Chunk nach einem neuen Build nicht mehr existiert), lädt Vite-Event
// 'vite:preloadError'. Wir laden die Seite dann EINMAL frisch nach (statt
// Crash-Seite). sessionStorage-Flag verhindert eine Reload-Schleife.
window.addEventListener("vite:preloadError", () => {
  if (sessionStorage.getItem("reloadedForChunkError")) return;
  sessionStorage.setItem("reloadedForChunkError", "1");
  window.location.reload();
});
window.addEventListener("load", () => sessionStorage.removeItem("reloadedForChunkError"));

createRoot(document.getElementById("root")!).render(<App />);
