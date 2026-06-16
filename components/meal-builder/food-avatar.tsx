import { cn } from "@/lib/utils/cn";

const AVATAR_COLORS = [
  "from-brand-100 to-brand-200 text-brand-800",
  "from-blue-100 to-blue-200 text-blue-800",
  "from-teal-100 to-teal-200 text-teal-800",
  "from-rose-100 to-rose-200 text-rose-800",
  "from-amber-100 to-amber-200 text-amber-800",
];

function colorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
}

interface FoodAvatarProps {
  name: string;
  className?: string;
}

export function FoodAvatar({ name, className }: FoodAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const palette = AVATAR_COLORS[colorIndex(name)];

  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold",
        palette,
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
