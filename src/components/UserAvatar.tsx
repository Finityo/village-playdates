/**
 * UserAvatar — renders profile photos, preset emoji avatars, or initials fallback.
 *
 * avatar_url can be:
 *   - a real HTTPS URL  → renders <img>
 *   - "preset:🌸"       → renders the emoji in a coloured circle
 *   - null / undefined  → renders initials or a generic icon
 */
import { cn } from "@/lib/utils";

import avatarCat from "@/assets/avatars/avatar-cat.png";
import avatarFox from "@/assets/avatars/avatar-fox.png";
import avatarBunny from "@/assets/avatars/avatar-bunny.png";
import avatarOwl from "@/assets/avatars/avatar-owl.png";
import avatarBear from "@/assets/avatars/avatar-bear.png";
import avatarPanda from "@/assets/avatars/avatar-panda.png";

const PRESET_AVATAR_MAP: Record<string, string> = {
  cat: avatarCat, fox: avatarFox, bunny: avatarBunny,
  owl: avatarOwl, bear: avatarBear, panda: avatarPanda,
};

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  displayName: string | null | undefined;
  userId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Deterministic pastel from userId
function getBgColor(userId?: string) {
  const colors = [
    "hsl(330,60%,88%)", "hsl(45,80%,85%)", "hsl(142,45%,85%)",
    "hsl(204,65%,85%)", "hsl(270,45%,88%)", "hsl(0,55%,88%)",
  ];
  if (!userId) return colors[0];
  const idx = userId.charCodeAt(0) % colors.length;
  return colors[idx];
}

const SIZE_MAP = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
  xl: "w-24 h-24 text-2xl",
};

const EMOJI_SIZE_MAP = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-5xl",
};

export function UserAvatar({ avatarUrl, displayName, userId, size = "md", className }: UserAvatarProps) {
  const sizeClass = SIZE_MAP[size];
  const emojiSizeClass = EMOJI_SIZE_MAP[size];

  const baseClass = cn("rounded-full flex-shrink-0 flex items-center justify-center font-bold overflow-hidden", sizeClass, className);

  // Preset animal avatar
  if (avatarUrl?.startsWith("preset-avatar:")) {
    const id = avatarUrl.replace("preset-avatar:", "");
    const src = PRESET_AVATAR_MAP[id];
    if (src) {
      return (
        <div className={cn(baseClass, "bg-card")}>
          <img src={src} alt={id} className="w-full h-full object-cover" />
        </div>
      );
    }
  }

  // Real uploaded photo
  if (avatarUrl && !avatarUrl.startsWith("preset:")) {
    return (
      <div className={cn(baseClass, "bg-muted")}>
        <img src={avatarUrl} alt={displayName ?? "User"} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Preset emoji avatar
  if (avatarUrl?.startsWith("preset:")) {
    const emoji = avatarUrl.replace("preset:", "");
    return (
      <div className={baseClass} style={{ background: getBgColor(userId) }}>
        <span className={emojiSizeClass}>{emoji}</span>
      </div>
    );
  }

  // Initials fallback
  return (
    <div className={baseClass} style={{ background: getBgColor(userId) }}>
      <span className="text-foreground/70">{getInitials(displayName)}</span>
    </div>
  );
}
