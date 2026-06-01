import { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

// Kein externer Stock-Fallback mehr (war ein Unsplash-Foto). Gründe:
//  1) DSGVO/US-Transfer — Unsplash-CDN überträgt Besucher-IP.
//  2) Ehrlichkeit — ein generisches Stockzimmer täuscht ein Zimmer vor, das es
//     nicht zeigt. Ein fehlendes Bild fällt jetzt auf den gebrandeten
//     "LS"-Platzhalter (unten) zurück = klares "Foto folgt" statt Fake.
// Echter Fix: die tatsächlichen Zimmer-Fotos same-origin bereitstellen
// (landhaus-schend.de/pics/02_zimmer/* liefert aktuell HTML statt Bild → fehlt).
const DEFAULT_FALLBACK_SRC: string | undefined = undefined;

/**
 * Renders an <img>; if loading fails, swaps to a fallback image and finally
 * shows a navy "LS" placeholder so we never display a broken image.
 */
export const HotelImage = forwardRef<HTMLImageElement, Props>(function HotelImage(
  { src, alt, className, fallbackSrc = DEFAULT_FALLBACK_SRC, ...rest },
  ref,
) {
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
      ref={ref}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...rest}
    />
  );
});
