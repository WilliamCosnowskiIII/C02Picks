import { NextResponse } from "next/server";
import { fetchAllLeagues } from "@/lib/leagues";

export async function GET() {
  const result = await fetchAllLeagues();
  return NextResponse.json(result);
}
