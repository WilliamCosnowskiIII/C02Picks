import { NextResponse } from "next/server";
import { fetchMyTeam } from "@/lib/team";
import type { Platform } from "@/lib/types";

type RouteContext = {
  params: Promise<{
    platform: string;
    leagueId: string;
  }>;
};

function isPlatform(value: string): value is Platform {
  return value === "sleeper" || value === "espn";
}

export async function GET(request: Request, context: RouteContext) {
  const { platform, leagueId } = await context.params;
  const { searchParams } = new URL(request.url);
  const season = Number(searchParams.get("season"));

  if (!isPlatform(platform)) {
    return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

  if (!Number.isFinite(season)) {
    return NextResponse.json(
      { error: "season query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const team = await fetchMyTeam(platform, leagueId, season);
    return NextResponse.json(team);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch team";
    const status = message.includes("not configured") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
