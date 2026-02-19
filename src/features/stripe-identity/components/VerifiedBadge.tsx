/**
 * Stripe Identity — VerifiedBadge Component
 *
 * A small "Verified ✓" shield badge. Drop it next to any user's name
 * when profile.verified === true.
 *
 * Usage:
 *   import { VerifiedBadge } from "@/features/stripe-identity/components/VerifiedBadge";
 *   {profile.verified && <VerifiedBadge />}
 *
 * Sizes: "sm" (default) | "md" | "lg"
 */

import { Shield } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  /** Show full "ID Verified" label (default: false — shows just "Verified") */
  showFullLabel?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    container: "px-2 py-0.5 text-[10px] gap-0.5",
    icon: "h-2.5 w-2.5",
  },
  md: {
    container: "px-2.5 py-1 text-xs gap-1",
    icon: "h-3 w-3",
  },
  lg: {
    container: "px-3 py-1.5 text-sm gap-1.5",
    icon: "h-3.5 w-3.5",
  },
};

export function VerifiedBadge({
  size = "md",
  showFullLabel = false,
  className = "",
}: VerifiedBadgeProps) {
  const cfg = SIZE_CONFIG[size];

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full bg-primary/10 text-primary border border-primary/20 ${cfg.container} ${className}`}
      title="Identity verified by Stripe"
    >
      <Shield className={cfg.icon} fill="currentColor" />
      {showFullLabel ? "ID Verified" : "Verified"}
    </span>
  );
}
