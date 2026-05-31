export type Platform = "sleeper" | "espn";

export type LeagueRecord = {
  wins: number;
  losses: number;
  ties: number;
};

export type League = {
  id: string;
  platform: Platform;
  name: string;
  season: number;
  teamCount: number;
  myRecord?: LeagueRecord;
};

export type EspnCookies = {
  espnS2: string;
  swid: string;
};
