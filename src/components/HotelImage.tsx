import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK_SRC =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80";

/**
 * Renders an <img>; if loading fails, shows a navy placeholder with "LS"
 * (Landhotel Schend) initials. Used so we never fall back to generic stock.
 */
export function HotelImage({ src, alt, className, fallbackSrc = DEFAULT_FALLBACK_SRC, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    setFailed(false);
    setUsedFallback(false);
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (!usedFallback && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setUsedFallback(true);
      return;
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground font-bold tracking-widest",
          className,
        )}
      >
        <span className="text-2xl md:text-4xl">LS</span>
      </div>
    );
  }
  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...rest}
    />
  );
}
