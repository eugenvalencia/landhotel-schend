import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"   // navy seal on ivory
  | "secondary" // gold-foil emboss
  | "success"   // forest-green seal
  | "rose"      // burgundy seal
  | "ocean"     // muted teal seal
  | "sunset";   // terracotta seal

type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  icon: LucideIcon;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** floating sparkle accent */
  sparkle?: boolean;
  /** subtle continuous float */
  float?: boolean;
};

/**
 * Embossed seal style — circular medallion with thin ring + dotted inner border,
 * cream/ivory ground and monochrome icon in the brand colour. Looks handcrafted,
 * like an old hotel crest or wax-seal stamp, not an AI-generated app icon.
 */
const VARIANT: Record<
  Variant,
  { bg: string; ring: string; icon: string; dot: string; glow: string }
> = {
  primary: {
    bg: "bg-gradient-to-br from-[#fbf8f1] via-[#f3ede0] to-[#e9dfc9]",
    ring: "ring-primary/40",
    icon: "text-primary",
    dot: "border-primary/30",
    glow: "shadow-[0_8px_24px_-12px_rgba(28,42,71,0.45)]",
  },
  secondary: {
    bg: "bg-gradient-to-br from-[#fff8e1] via-[#f3e2a8] to-[#c9a23a]",
    ring: "ring-[#8a6a1f]/45",
    icon: "text-[#5a4310]",
    dot: "border-[#8a6a1f]/35",
    glow: "shadow-[0_8px_24px_-10px_rgba(180,140,40,0.55)]",
  },
  success: {
    bg: "bg-gradient-to-br from-[#f1f7ef] via-[#dde9d3] to-[#b7cea7]",
    ring: "ring-[#2f5d36]/40",
    icon: "text-[#2f5d36]",
    dot: "border-[#2f5d36]/30",
    glow: "shadow-[0_8px_24px_-12px_rgba(47,93,54,0.45)]",
  },
  rose: {
    bg: "bg-gradient-to-br from-[#fbf0ee] via-[#f3d8d4] to-[#dba79f]",
    ring: "ring-[#7a1f2b]/40",
    icon: "text-[#7a1f2b]",
    dot: "border-[#7a1f2b]/30",
    glow: "shadow-[0_8px_24px_-12px_rgba(122,31,43,0.45)]",
  },
  ocean: {
    bg: "bg-gradient-to-br from-[#eef6f7] via-[#cee0e3] to-[#9bbdc2]",
    ring: "ring-[#1f4d56]/40",
    icon: "text-[#1f4d56]",
    dot: "border-[#1f4d56]/30",
    glow: "shadow-[0_8px_24px_-12px_rgba(31,77,86,0.45)]",
  },
  sunset: {
    bg: "bg-gradient-to-br from-[#fbeee2] via-[#f1d2b1] to-[#c98a4f]",
    ring: "ring-[#7a3f12]/40",
    icon: "text-[#7a3f12]",
    dot: "border-[#7a3f12]/30",
    glow: "shadow-[0_8px_24px_-12px_rgba(122,63,18,0.45)]",
  },
};

const SIZE_BOX: Record<Size, string> = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const SIZE_ICON: Record<Size, string> = {
  sm: "h-[18px] w-[18px]",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-9 w-9",
};

const SIZE_INSET: Record<Size, string> = {
  sm: "inset-[5px]",
  md: "inset-[6px]",
  lg: "inset-[7px]",
  xl: "inset-[9px]",
};

export default function FeatureIcon({
  icon: Icon,
  variant = "primary",
  size = "md",
  className,
  sparkle = false,
  float = false,
}: Props) {
  const v = VARIANT[variant];
  return (
    <span
      className={cn(
        "group/seal relative inline-flex items-center justify-center rounded-full",
        "ring-1 ring-inset",
        "transition-all duration-500 ease-out",
        "hover:rotate-[-4deg] hover:scale-[1.06]",
        v.bg,
        v.ring,
        v.glow,
        SIZE_BOX[size],
        float && "animate-float",
        className,
      )}
    >
      {/* inner dashed/dotted ring — like a stamped seal */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute rounded-full border border-dashed",
          v.dot,
          SIZE_INSET[size],
        )}
      />

      {/* top arc highlight (emboss feel) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/55 via-transparent to-transparent"
      />

      {/* bottom inner shadow (depth) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-3px_6px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)]"
      />

      <Icon
        className={cn(
          "relative z-10 transition-transform duration-500 group-hover/seal:scale-110",
          v.icon,
          SIZE_ICON[size],
        )}
        strokeWidth={1.6}
      />

      {sparkle && (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(212,175,55,0.7)] animate-ping-slow"
        />
      )}
    </span>
  );
}
