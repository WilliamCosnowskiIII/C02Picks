import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RosterView } from "@/components/RosterView";
import type { MyTeam } from "@/lib/types";

const sampleTeam: MyTeam = {
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
  ],
  bench: [
    {
      id: "p2",
      name: "Bench Player",
      position: "WR",
      nflTeam: "DAL",
      slot: "BN",
      isStarter: false,
    },
  ],
};

describe("RosterView", () => {
  it("renders team name, record, starters, and bench", () => {
    render(<RosterView team={sampleTeam} />);

    expect(screen.getByText("Test Squad")).toBeInTheDocument();
    expect(screen.getByText("Champions League")).toBeInTheDocument();
    expect(screen.getByText("5-2-0")).toBeInTheDocument();
    expect(screen.getByText("Patrick Mahomes")).toBeInTheDocument();
    expect(screen.getByText("Bench Player")).toBeInTheDocument();
    expect(screen.getByText("Starters")).toBeInTheDocument();
    expect(screen.getByText("Bench")).toBeInTheDocument();
  });
});
