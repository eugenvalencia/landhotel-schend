import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteOffline from "@/components/SiteOffline";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("404:", location.pathname);
    }
  }, [location.pathname]);

  return <SiteOffline variant="notfound" />;
}
