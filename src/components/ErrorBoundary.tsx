import { Component, type ReactNode } from "react";
import SiteOffline from "./SiteOffline";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: unknown };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string }) {
    // Crashes landen so wenigstens in der Browser-Konsole — kein Sentry, dafuer
    // sieht der Hotelier in der Live-Demo eine schoene Seite statt schwarz.
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) return <SiteOffline variant="error" />;
    return this.props.children;
  }
}
