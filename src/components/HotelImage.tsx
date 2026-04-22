import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

/**
 * Renders an <img>; if loading fails, shows a navy placeholder with "LS"
 * (Landhotel Schend) initials. Used so we never fall back to generic stock.
 */
export function HotelImage({ src, alt, className, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
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
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
