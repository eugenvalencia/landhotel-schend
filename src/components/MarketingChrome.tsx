import { useLocation } from "react-router-dom";
import ReadingProgressBar from "./ReadingProgressBar";
import SectionDotsNav from "./SectionDotsNav";

// Pfade auf denen Marketing-Chrome (Progress-Bar, Dots, Transitions) NICHT erscheint —
// also alle Tool-/App-Bereiche.
const SUPPRESS_PREFIXES = ["/booking", "/dashboard", "/operator", "/login", "/confirmation", "/booking-confirmation"];

export default function MarketingChrome() {
  const location = useLocation();
  const suppress = SUPPRESS_PREFIXES.some((p) => location.pathname.startsWith(p));
  if (suppress) return null;

  // Section-Dots nur auf der Startseite — andere Marketing-Pages sind eher kurz
  const showDots = location.pathname === "/";

  return (
    <>
      <ReadingProgressBar />
      {showDots && <SectionDotsNav />}
    </>
  );
}
