import type { EspnCookies, League } from "./types";

const ESPN_BASE =
  "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons";

type EspnTeam = {
  id: number;
  location?: string;
  nickname?: string;
  record?: {
    overall?: {
      wins?: number;
      losses?: number;
      ties?: number;
    };
  };
};

type EspnMember = {
  id: string;
  teamId?: number;
};

type EspnLeagueResponse = {
  id: number;
  settings?: {
    name?: string;
  };
  seasonId?: number;
  teams?: EspnTeam[];
  members?: EspnMember[];
};

function buildEspnUrl(leagueId: number, season: number): string {
  return `${ESPN_BASE}/${season}/segments/0/leagues/${leagueId}?view=mTeam`;
}

function buildHeaders(cookies?: EspnCookies): HeadersInit {
  if (!cookies?.espnS2 || !cookies.swid) {
    return {};
  }

  return {
    Cookie: `espn_s2=${cookies.espnS2}; SWID=${cookies.swid}`,
  };
}

function findMyTeam(
  teams: EspnTeam[] | undefined,
  members: EspnMember[] | undefined,
  myMemberId?: string,
): EspnTeam | undefined {
  if (!teams?.length) {
    return undefined;
  }

  if (myMemberId) {
    const member = members?.find((entry) => entry.id === myMemberId);
    if (member?.teamId) {
      return teams.find((team) => team.id === member.teamId);
    }
  }

  return undefined;
}

export async function getEspnLeague(
  leagueId: number,
  season: number,
  cookies?: EspnCookies,
  myMemberId?: string,
): Promise<League> {
  const response = await fetch(buildEspnUrl(leagueId, season), {
    headers: buildHeaders(cookies),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ESPN league ${leagueId}`);
  }

  const data = (await response.json()) as EspnLeagueResponse;
  const myTeam = findMyTeam(data.teams, data.members, myMemberId);
  const record = myTeam?.record?.overall;

  return {
    id: String(data.id),
    platform: "espn",
    name: data.settings?.name ?? `ESPN League ${leagueId}`,
    season: data.seasonId ?? season,
    teamCount: data.teams?.length ?? 0,
    myRecord: record
      ? {
          wins: record.wins ?? 0,
          losses: record.losses ?? 0,
          ties: record.ties ?? 0,
        }
      : undefined,
  };
}
