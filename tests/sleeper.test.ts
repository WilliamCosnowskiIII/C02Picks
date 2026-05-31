import { afterEach, describe, expect, it, vi } from "vitest";
import { getUserLeagues } from "@/lib/sleeper";

describe("getUserLeagues", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and normalizes Sleeper leagues for a username", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user_id: "user123", display_name: "testuser" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            league_id: "111",
            name: "Champions League",
            season: "2025",
            total_rosters: 12,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            roster_id: 1,
            owner_id: "user123",
            settings: { wins: 5, losses: 2, ties: 0 },
          },
        ],
      });

    vi.stubGlobal("fetch", fetchMock);

    const leagues = await getUserLeagues("testuser", 2025);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.sleeper.app/v1/user/testuser",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.sleeper.app/v1/user/user123/leagues/nfl/2025",
    );
    expect(leagues).toEqual([
      {
        id: "111",
        platform: "sleeper",
        name: "Champions League",
        season: 2025,
        teamCount: 12,
        myRecord: { wins: 5, losses: 2, ties: 0 },
      },
    ]);
  });

  it("throws when the Sleeper user lookup fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    await expect(getUserLeagues("missing", 2025)).rejects.toThrow(
      "Sleeper user not found: missing",
    );
  });
});
