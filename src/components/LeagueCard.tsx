import { PlatformBadge } from "@/components/PlatformBadge";
import type { League } from "@/lib/types";

type LeagueCardProps = {
  league: League;
};

function formatRecord(league: League): string {
  if (!league.myRecord) {
    return "Record unavailable";
  }

  const { wins, losses, ties } = league.myRecord;
  return `${wins}-${losses}-${ties}`;
}

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-tight">{league.name}</h2>
        <PlatformBadge platform={league.platform} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Season
          </dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">
            {league.season}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Teams
          </dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">
            {league.teamCount} teams
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Record
          </dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">
            {formatRecord(league)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
