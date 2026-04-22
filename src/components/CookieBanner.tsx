import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "schend_cookie_consent_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = (choice: "all" | "settings") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-4xl bg-card border shadow-elevated rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-foreground flex-1">
          Wir verwenden Cookies, um Ihnen ein optimales Erlebnis zu bieten. Weitere Informationen finden Sie in unseren{" "}
          <Link to="/datenschutz" className="text-secondary underline hover:no-underline font-medium">
            Datenschutzhinweisen
          </Link>
          .
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => dismiss("settings")} className="flex-1 sm:flex-none">
            Einstellungen
          </Button>
          <Button variant="destructive" size="sm" onClick={() => dismiss("all")} className="flex-1 sm:flex-none">
            Alle auswählen
          </Button>
        </div>
      </div>
    </div>
  );
}
