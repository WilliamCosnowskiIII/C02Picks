import { NextResponse } from "next/server";
import { getEspnLeague } from "@/lib/espn";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueId = Number(searchParams.get("leagueId"));
  const season = Number(searchParams.get("season"));
  const espnS2 = searchParams.get("espnS2") ?? process.env.ESPN_S2;
  const swid = searchParams.get("swid") ?? process.env.ESPN_SWID;
  const memberId =
    searchParams.get("memberId") ?? process.env.ESPN_MEMBER_ID ?? undefined;

  if (!Number.isFinite(leagueId)) {
    return NextResponse.json(
      { error: "leagueId query parameter is required" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(season)) {
    return NextResponse.json(
      { error: "season query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const league = await getEspnLeague(
      leagueId,
      season,
      espnS2 && swid ? { espnS2, swid } : undefined,
      memberId ?? undefined,
    );
    return NextResponse.json({ league });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch ESPN league";
    const status = message.includes("Failed to fetch") ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
