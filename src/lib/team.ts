import { getAppConfig } from "@/config/leagues";
import { getSleeperMyTeam } from "@/lib/sleeper-team";
import type { MyTeam, Platform } from "@/lib/types";

export async function fetchMyTeam(
  platform: Platform,
  leagueId: string,
  season: number,
): Promise<MyTeam> {
  const config = getAppConfig();

  if (platform === "sleeper") {
    if (!config.sleeperUsername) {
      throw new Error("SLEEPER_USERNAME is not configured");
    }
    return getSleeperMyTeam(leagueId, config.sleeperUsername, season);
  }

  throw new Error(`Team view for ${platform} is not supported yet`);
}
