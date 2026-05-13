import { useEffect } from "react";

type Props = {
  id: string;
  data: Record<string, unknown>;
};

/**
 * Injects a <script type="application/ld+json"> tag into <head>.
 * Crawlers and LLMs (ChatGPT, Perplexity, Gemini) read these for rich results.
 */
export default function JsonLd({ id, data }: Props) {
  useEffect(() => {
    const elementId = `jsonld-${id}`;
    let script = document.getElementById(elementId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = elementId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      const el = document.getElementById(elementId);
      if (el) el.remove();
    };
  }, [id, data]);

  return null;
}
