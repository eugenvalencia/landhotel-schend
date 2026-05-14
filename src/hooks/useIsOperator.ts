import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Liefert ob der eingeloggte User die Rolle `conexa_admin` hat.
 *
 * Wir koennten das in useAuth merge'n, aber Operator-Modus ist orthogonal
 * zu "ist Admin in deinem eigenen Tenant". Getrenntes Hook = keine
 * False-Positive-Bypasses falls jemand isAdmin + Operator verwechselt.
 */
export function useIsOperator() {
  const { user, loading: authLoading } = useAuth();
  const [isOperator, setIsOperator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsOperator(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "conexa_admin")
        .maybeSingle();
      if (cancelled) return;
      setIsOperator(!!data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isOperator, loading };
}
