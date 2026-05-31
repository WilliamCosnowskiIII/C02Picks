import { PlatformBadge } from "@/components/PlatformBadge";
import type { MyTeam, RosterPlayer } from "@/lib/types";

type RosterViewProps = {
  team: MyTeam;
};

function formatRecord(team: MyTeam): string {
  if (!team.record) {
    return "Record unavailable";
  }

  const { wins, losses, ties } = team.record;
  return `${wins}-${losses}-${ties}`;
}

function PlayerRow({ player }: { player: RosterPlayer }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <div>
        <p className="font-medium">{player.name}</p>
        <p className="text-sm text-zinc-500">
          {player.position}
          {player.nflTeam ? ` · ${player.nflTeam}` : ""}
        </p>
      </div>
      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        {player.slot}
      </span>
    </li>
  );
}

export function RosterView({ team }: RosterViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <PlatformBadge platform={team.platform} />
            <span className="text-sm text-zinc-500">{team.season}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{team.teamName}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{team.leagueName}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Record</p>
          <p className="text-lg font-semibold">{formatRecord(team)}</p>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Starters</h2>
        <ul className="flex flex-col gap-2">
          {team.starters.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Bench</h2>
        {team.bench.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {team.bench.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No bench players.</p>
        )}
      </section>
    </div>
  );
}
