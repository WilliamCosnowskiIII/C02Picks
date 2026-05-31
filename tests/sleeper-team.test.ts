import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearSleeperPlayersCacheForTests,
  getSleeperMyTeam,
} from "@/lib/sleeper-team";

describe("getSleeperMyTeam", () => {
  afterEach(() => {
    clearSleeperPlayersCacheForTests();
    vi.restoreAllMocks();
  });

  it("returns starters and bench for the user's roster", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user_id: "user123", display_name: "testuser" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "Champions League",
          season: "2025",
          roster_positions: ["QB", "RB", "BN"],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            owner_id: "user123",
            starters: ["p1", "p2"],
            players: ["p1", "p2", "p3"],
            settings: { wins: 5, losses: 2, ties: 0 },
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            user_id: "user123",
            display_name: "testuser",
            metadata: { team_name: "Test Squad" },
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          p1: {
            player_id: "p1",
            full_name: "Patrick Mahomes",
            position: "QB",
            team: "KC",
          },
          p2: {
            player_id: "p2",
            full_name: "Christian McCaffrey",
            position: "RB",
            team: "SF",
          },
          p3: {
            player_id: "p3",
            full_name: "Bench Player",
            position: "WR",
            team: "DAL",
          },
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const team = await getSleeperMyTeam("111", "testuser", 2025);

    expect(team).toEqual({
      leagueId: "111",
      platform: "sleeper",
      leagueName: "Champions League",
      teamName: "Test Squad",
      season: 2025,
      record: { wins: 5, losses: 2, ties: 0 },
      starters: [
        {
          id: "p1",
          name: "Patrick Mahomes",
          position: "QB",
          nflTeam: "KC",
          slot: "QB",
          isStarter: true,
        },
        {
          id: "p2",
          name: "Christian McCaffrey",
          position: "RB",
          nflTeam: "SF",
          slot: "RB",
          isStarter: true,
        },
      ],
      bench: [
        {
          id: "p3",
          name: "Bench Player",
          position: "WR",
          nflTeam: "DAL",
          slot: "BN",
          isStarter: false,
        },
      ],
    });
  });

  it("throws when the user has no roster in the league", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user_id: "user123" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "Champions League",
          season: "2025",
          roster_positions: ["QB"],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            owner_id: "other-user",
            starters: ["p1"],
            players: ["p1"],
            settings: { wins: 1, losses: 0, ties: 0 },
          },
        ],
      });

    vi.stubGlobal("fetch", fetchMock);

    await expect(getSleeperMyTeam("111", "testuser", 2025)).rejects.toThrow(
      "No roster found for testuser in league 111",
    );
  });
});
