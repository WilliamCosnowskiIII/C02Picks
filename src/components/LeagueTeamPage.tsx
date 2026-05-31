"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RosterView } from "@/components/RosterView";
import type { MyTeam, Platform } from "@/lib/types";

type LeagueTeamPageProps = {
  platform: Platform;
  leagueId: string;
};

export function LeagueTeamPage({ platform, leagueId }: LeagueTeamPageProps) {
  const searchParams = useSearchParams();
  const season = Number(searchParams.get("season"));
  const seasonInvalid = !Number.isFinite(season);
  const [team, setTeam] = useState<MyTeam | null>(null);
  const [loading, setLoading] = useState(!seasonInvalid);
  const [error, setError] = useState<string | null>(
    seasonInvalid ? "Season is required." : null,
  );

  useEffect(() => {
    if (seasonInvalid) {
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    void (async () => {
      try {
        const response = await fetch(
          `/api/league/${platform}/${leagueId}/team?season=${season}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Failed to load team");
        }

        const payload = (await response.json()) as MyTeam;
        if (active) {
          setTeam(payload);
          setError(null);
        }
      } catch (fetchError) {
        if (!active) {
          return;
        }
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          setError("Request timed out. Try again.");
          return;
        }
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong",
        );
      } finally {
        clearTimeout(timeoutId);
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [platform, leagueId, season, seasonInvalid]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to leagues
      </Link>

      {loading && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          Loading your team...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && team && <RosterView team={team} />}
    </main>
  );
}
