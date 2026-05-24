import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Bei jedem Pfad-Wechsel mountet der Wrapper-Div neu (key-Reset) und
// triggert die CSS-Animation `page-fade-in`. Subtil: 6px translateY +
// opacity, 0.45s ease-out. Ohne Library, kein Fade-out (würde das
// Routing blockieren), nur Fade-in der neuen Route.
export default function PageFadeIn({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-fade-in">
      {children}
    </div>
  );
}
