import { NextResponse } from "next/server";
import { fetchAllLeagues, type LeaguesResult } from "@/lib/leagues";

const CACHE_TTL_MS = 60_000;

let cache: { data: LeaguesResult; fetchedAt: number } | null = null;

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }

  const result = await fetchAllLeagues();
  cache = { data: result, fetchedAt: now };

  return NextResponse.json(result);
}
