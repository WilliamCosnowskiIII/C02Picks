import { NextResponse } from "next/server";
import { getUserLeagues } from "@/lib/sleeper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const season = Number(searchParams.get("season"));

  if (!username?.trim()) {
    return NextResponse.json(
      { error: "username query parameter is required" },
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
    const leagues = await getUserLeagues(username.trim(), season);
    return NextResponse.json({ leagues });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Sleeper leagues";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
