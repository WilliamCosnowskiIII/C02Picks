import type { LeaguesResult } from "@/lib/leagues";

export function getEmptyLeaguesMessage(data: LeaguesResult): string | null {
  const isConfigured =
    data.config.sleeperConfigured || data.config.espnConfigured;

  if (!isConfigured || data.leagues.length > 0 || data.errors.length > 0) {
    return null;
  }

  const messages: string[] = [];

  if (data.config.sleeperConfigured && data.config.sleeperUsername) {
    messages.push(
      `Connected to Sleeper as ${data.config.sleeperUsername}, but no NFL leagues found for ${data.config.season}.`,
    );
  }

  if (data.config.espnConfigured) {
    messages.push(`No ESPN leagues loaded for ${data.config.season}.`);
  }

  messages.push("Check NFL_SEASON or join a league on Sleeper.");

  return messages.join(" ");
}
