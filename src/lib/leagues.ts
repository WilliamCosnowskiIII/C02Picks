import { getAppConfig } from "@/config/leagues";
import { getEspnLeague } from "@/lib/espn";
import { getUserLeagues } from "@/lib/sleeper";
import type { League } from "@/lib/types";

export type LeagueError = {
  platform: "sleeper" | "espn";
  id: string;
  message: string;
};

export type LeaguesResult = {
  leagues: League[];
  errors: LeagueError[];
  config: {
    sleeperConfigured: boolean;
    espnConfigured: boolean;
    season: number;
    sleeperUsername?: string;
  };
};

export async function fetchAllLeagues(): Promise<LeaguesResult> {
  const config = getAppConfig();
  const leagues: League[] = [];
  const errors: LeagueError[] = [];

  if (config.sleeperUsername) {
    try {
      const sleeperLeagues = await getUserLeagues(
        config.sleeperUsername,
        config.season,
      );
      leagues.push(...sleeperLeagues);
    } catch (error) {
      errors.push({
        platform: "sleeper",
        id: config.sleeperUsername,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch Sleeper leagues",
      });
    }
  }

  for (const leagueId of config.espnLeagueIds) {
    try {
      const league = await getEspnLeague(
        leagueId,
        config.season,
        config.espnCookies,
        config.espnMemberId,
      );
      leagues.push(league);
    } catch (error) {
      errors.push({
        platform: "espn",
        id: String(leagueId),
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch ESPN league",
      });
    }
  }

  return {
    leagues,
    errors,
    config: {
      sleeperConfigured: Boolean(config.sleeperUsername),
      espnConfigured: config.espnLeagueIds.length > 0,
      season: config.season,
      sleeperUsername: config.sleeperUsername,
    },
  };
}
