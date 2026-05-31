import type { MyTeam, RosterPlayer } from "./types";

const SLEEPER_BASE = "https://api.sleeper.app/v1";
const FETCH_TIMEOUT_MS = 10_000;

type SleeperUser = {
  user_id: string;
  display_name?: string;
};

type SleeperLeagueDetail = {
  name: string;
  season: string;
  roster_positions: string[];
};

type SleeperRoster = {
  owner_id: string;
  starters: string[];
  players: string[];
  settings: {
    wins?: number;
    losses?: number;
    ties?: number;
  };
};

type SleeperLeagueUser = {
  user_id: string;
  display_name?: string;
  metadata?: {
    team_name?: string;
  };
};

type SleeperPlayerRecord = {
  player_id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  team?: string;
};

let playersCache: Record<string, SleeperPlayerRecord> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${url} (${response.status})`);
  }
  return response.json() as Promise<T>;
}

async function getSleeperUser(username: string): Promise<SleeperUser> {
  const response = await fetch(`${SLEEPER_BASE}/user/${username}`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Sleeper user not found: ${username}`);
  }
  return response.json() as Promise<SleeperUser>;
}

async function getSleeperPlayersMap(): Promise<Record<string, SleeperPlayerRecord>> {
  if (playersCache) {
    return playersCache;
  }

  playersCache = await fetchJson<Record<string, SleeperPlayerRecord>>(
    `${SLEEPER_BASE}/players/nfl`,
  );
  return playersCache;
}

function getPlayerName(player?: SleeperPlayerRecord): string {
  if (!player) {
    return "Unknown Player";
  }
  if (player.full_name) {
    return player.full_name;
  }
  return [player.first_name, player.last_name].filter(Boolean).join(" ") || "Unknown Player";
}

function mapPlayer(
  playerId: string,
  slot: string,
  isStarter: boolean,
  playersMap: Record<string, SleeperPlayerRecord>,
): RosterPlayer {
  const player = playersMap[playerId];

  return {
    id: playerId,
    name: getPlayerName(player),
    position: player?.position ?? slot,
    nflTeam: player?.team,
    slot,
    isStarter,
  };
}

function buildRosterPlayers(
  roster: SleeperRoster,
  rosterPositions: string[],
  playersMap: Record<string, SleeperPlayerRecord>,
): { starters: RosterPlayer[]; bench: RosterPlayer[] } {
  const starterIds = new Set(roster.starters);

  const starters = roster.starters.map((playerId, index) =>
    mapPlayer(
      playerId,
      rosterPositions[index] ?? "FLEX",
      true,
      playersMap,
    ),
  );

  const bench = roster.players
    .filter((playerId) => !starterIds.has(playerId))
    .map((playerId) => mapPlayer(playerId, "BN", false, playersMap));

  return { starters, bench };
}

export async function getSleeperMyTeam(
  leagueId: string,
  username: string,
  season: number,
): Promise<MyTeam> {
  const user = await getSleeperUser(username);
  const league = await fetchJson<SleeperLeagueDetail>(
    `${SLEEPER_BASE}/league/${leagueId}`,
  );
  const rosters = await fetchJson<SleeperRoster[]>(
    `${SLEEPER_BASE}/league/${leagueId}/rosters`,
  );
  const roster = rosters.find((entry) => entry.owner_id === user.user_id);

  if (!roster) {
    throw new Error(`No roster found for ${username} in league ${leagueId}`);
  }

  const leagueUsers = await fetchJson<SleeperLeagueUser[]>(
    `${SLEEPER_BASE}/league/${leagueId}/users`,
  );
  const leagueUser = leagueUsers.find((entry) => entry.user_id === user.user_id);
  const playersMap = await getSleeperPlayersMap();
  const { starters, bench } = buildRosterPlayers(
    roster,
    league.roster_positions,
    playersMap,
  );

  return {
    leagueId,
    platform: "sleeper",
    leagueName: league.name,
    teamName:
      leagueUser?.metadata?.team_name ??
      leagueUser?.display_name ??
      user.display_name ??
      username,
    season: Number(league.season) || season,
    record: {
      wins: roster.settings.wins ?? 0,
      losses: roster.settings.losses ?? 0,
      ties: roster.settings.ties ?? 0,
    },
    starters,
    bench,
  };
}

export function clearSleeperPlayersCacheForTests() {
  playersCache = null;
}
