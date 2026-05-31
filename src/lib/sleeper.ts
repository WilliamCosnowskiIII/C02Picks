import type { League } from "./types";

const SLEEPER_BASE = "https://api.sleeper.app/v1";

type SleeperUser = {
  user_id: string;
};

type SleeperLeague = {
  league_id: string;
  name: string;
  season: string;
  total_rosters: number;
};

type SleeperRoster = {
  owner_id: string;
  settings: {
    wins?: number;
    losses?: number;
    ties?: number;
  };
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${url} (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function getUserLeagues(
  username: string,
  season: number,
): Promise<League[]> {
  const userResponse = await fetch(`${SLEEPER_BASE}/user/${username}`);
  if (!userResponse.ok) {
    throw new Error(`Sleeper user not found: ${username}`);
  }

  const user = (await userResponse.json()) as SleeperUser;
  const leagues = await fetchJson<SleeperLeague[]>(
    `${SLEEPER_BASE}/user/${user.user_id}/leagues/nfl/${season}`,
  );

  return Promise.all(
    leagues.map(async (league) => {
      const rosters = await fetchJson<SleeperRoster[]>(
        `${SLEEPER_BASE}/league/${league.league_id}/rosters`,
      );
      const myRoster = rosters.find(
        (roster) => roster.owner_id === user.user_id,
      );

      return {
        id: league.league_id,
        platform: "sleeper" as const,
        name: league.name,
        season: Number(league.season),
        teamCount: league.total_rosters,
        myRecord: myRoster
          ? {
              wins: myRoster.settings.wins ?? 0,
              losses: myRoster.settings.losses ?? 0,
              ties: myRoster.settings.ties ?? 0,
            }
          : undefined,
      };
    }),
  );
}
