import { describe, expect, it } from "vitest";
import { getEmptyLeaguesMessage } from "@/lib/dashboard-messages";
import type { LeaguesResult } from "@/lib/leagues";

function makeResult(overrides: Partial<LeaguesResult> = {}): LeaguesResult {
  return {
    leagues: [],
    errors: [],
    config: {
      sleeperConfigured: false,
      espnConfigured: false,
      season: 2025,
    },
    ...overrides,
  };
}

describe("getEmptyLeaguesMessage", () => {
  it("returns null when nothing is configured", () => {
    expect(getEmptyLeaguesMessage(makeResult())).toBeNull();
  });

  it("returns a Sleeper-specific message when connected but empty", () => {
    const message = getEmptyLeaguesMessage(
      makeResult({
        config: {
          sleeperConfigured: true,
          espnConfigured: false,
          season: 2025,
          sleeperUsername: "TreyCoz",
        },
      }),
    );

    expect(message).toContain("Connected to Sleeper as TreyCoz");
    expect(message).toContain("no NFL leagues found for 2025");
  });

  it("returns null when leagues loaded successfully", () => {
    expect(
      getEmptyLeaguesMessage(
        makeResult({
          leagues: [
            {
              id: "1",
              platform: "sleeper",
              name: "Test",
              season: 2025,
              teamCount: 10,
            },
          ],
          config: {
            sleeperConfigured: true,
            espnConfigured: false,
            season: 2025,
            sleeperUsername: "TreyCoz",
          },
        }),
      ),
    ).toBeNull();
  });

  it("returns null when errors are present", () => {
    expect(
      getEmptyLeaguesMessage(
        makeResult({
          errors: [{ platform: "sleeper", id: "TreyCoz", message: "Failed" }],
          config: {
            sleeperConfigured: true,
            espnConfigured: false,
            season: 2025,
            sleeperUsername: "TreyCoz",
          },
        }),
      ),
    ).toBeNull();
  });
});
