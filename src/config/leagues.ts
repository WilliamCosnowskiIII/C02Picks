import type { EspnCookies } from "@/lib/types";

export type AppConfig = {
  sleeperUsername?: string;
  espnLeagueIds: number[];
  espnCookies?: EspnCookies;
  espnMemberId?: string;
  season: number;
};

function parseLeagueIds(value: string | undefined): number[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id) && id > 0);
}

export function getAppConfig(): AppConfig {
  const espnS2 = process.env.ESPN_S2;
  const swid = process.env.ESPN_SWID;

  return {
    sleeperUsername: process.env.SLEEPER_USERNAME?.trim() || undefined,
    espnLeagueIds: parseLeagueIds(process.env.ESPN_LEAGUE_IDS),
    espnCookies:
      espnS2 && swid
        ? {
            espnS2,
            swid,
          }
        : undefined,
    espnMemberId: process.env.ESPN_MEMBER_ID?.trim() || undefined,
    season: Number(process.env.NFL_SEASON ?? new Date().getFullYear()),
  };
}

export function getConfigStatus(config: AppConfig) {
  return {
    sleeperConfigured: Boolean(config.sleeperUsername),
    espnConfigured: config.espnLeagueIds.length > 0,
    espnAuthConfigured: Boolean(config.espnCookies),
    season: config.season,
    espnLeagueCount: config.espnLeagueIds.length,
  };
}
