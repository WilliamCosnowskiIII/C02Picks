import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeagueCard } from "@/components/LeagueCard";

describe("LeagueCard", () => {
  it("renders league details and record", () => {
    render(
      <LeagueCard
        league={{
          id: "111",
          platform: "sleeper",
          name: "Champions League",
          season: 2025,
          teamCount: 12,
          myRecord: { wins: 5, losses: 2, ties: 0 },
        }}
      />,
    );

    expect(screen.getByText("Champions League")).toBeInTheDocument();
    expect(screen.getByText("Sleeper")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("12 teams")).toBeInTheDocument();
    expect(screen.getByText("5-2-0")).toBeInTheDocument();
  });

  it("shows placeholder when record is unavailable", () => {
    render(
      <LeagueCard
        league={{
          id: "336358",
          platform: "espn",
          name: "Work League",
          season: 2025,
          teamCount: 10,
        }}
      />,
    );

    expect(screen.getByText("Record unavailable")).toBeInTheDocument();
  });
});
