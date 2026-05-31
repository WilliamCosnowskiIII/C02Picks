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

export type RosterPlayer = {
  id: string;
  name: string;
  position: string;
  nflTeam?: string;
  slot: string;
  isStarter: boolean;
};

export type MyTeam = {
  leagueId: string;
  platform: Platform;
  leagueName: string;
  teamName: string;
  season: number;
  record?: LeagueRecord;
  starters: RosterPlayer[];
  bench: RosterPlayer[];
};
