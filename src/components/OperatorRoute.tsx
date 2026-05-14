import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsOperator } from "@/hooks/useIsOperator";

/**
 * Gate fuer den Operator-Mode. Nur User mit Rolle `conexa_admin` duerfen rein.
 * Alle anderen — auch Tenant-Admins — werden weggeleitet.
 */
export default function OperatorRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isOperator, loading: opLoading } = useIsOperator();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || opLoading) return;
    if (!user) {
      navigate("/login");
    } else if (!isOperator) {
      navigate("/dashboard");
    }
  }, [user, isOperator, authLoading, opLoading, navigate]);

  if (authLoading || opLoading || !user || !isOperator) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Operator-Mode wird geladen …
      </div>
    );
  }
  return <>{children}</>;
}
