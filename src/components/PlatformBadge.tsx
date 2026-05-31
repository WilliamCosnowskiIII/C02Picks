import type { Platform } from "@/lib/types";

const platformStyles: Record<
  Platform,
  { label: string; className: string }
> = {
  sleeper: {
    label: "Sleeper",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  espn: {
    label: "ESPN",
    className: "bg-red-500/15 text-red-700 dark:text-red-300",
  },
};

type PlatformBadgeProps = {
  platform: Platform;
};

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const style = platformStyles[platform];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  );
}
