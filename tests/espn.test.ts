import { afterEach, describe, expect, it, vi } from "vitest";
import { getEspnLeague } from "@/lib/espn";

describe("getEspnLeague", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and normalizes a public ESPN league", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 336358,
        settings: { name: "Work League" },
        seasonId: 2025,
        teams: [
          {
            id: 1,
            location: "Team",
            nickname: "Alpha",
            record: {
              overall: { wins: 4, losses: 3, ties: 0 },
            },
          },
          {
            id: 2,
            location: "Team",
            nickname: "Beta",
            record: {
              overall: { wins: 3, losses: 4, ties: 0 },
            },
          },
        ],
        members: [{ id: "abc", teamId: 1 }],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const league = await getEspnLeague(336358, 2025);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2025/segments/0/leagues/336358?view=mTeam",
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(league).toEqual({
      id: "336358",
      platform: "espn",
      name: "Work League",
      season: 2025,
      teamCount: 2,
    });
  });

  it("includes cookies when provided for private leagues", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123456,
        settings: { name: "Private League" },
        seasonId: 2025,
        teams: [],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await getEspnLeague(123456, 2025, {
      espnS2: "cookie-value",
      swid: "{GUID}",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          Cookie: "espn_s2=cookie-value; SWID={GUID}",
        },
      }),
    );
  });

  it("throws when ESPN returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    );

    await expect(getEspnLeague(999, 2025)).rejects.toThrow(
      "Failed to fetch ESPN league 999",
    );
  });
});
