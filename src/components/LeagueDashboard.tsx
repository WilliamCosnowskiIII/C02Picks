"use client";

import { useState } from "react";
import Link from "next/link";
import { LeagueCard } from "@/components/LeagueCard";
import type { LeaguesResult } from "@/lib/leagues";

type LeagueDashboardProps = {
  initialData: LeaguesResult;
};

export function LeagueDashboard({ initialData }: LeagueDashboardProps) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured =
    data.config.sleeperConfigured || data.config.espnConfigured;

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);

    try {
      const response = await fetch("/api/leagues");
      if (!response.ok) {
        throw new Error("Failed to load leagues");
      }

      const payload = (await response.json()) as LeaguesResult;
      setData(payload);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Something went wrong",
      );
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            C02Picks
          </p>
          <h1 className="text-3xl font-bold tracking-tight">My Leagues</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Sleeper and ESPN leagues in one dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={refreshing}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!isConfigured && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <h2 className="text-lg font-semibold">No leagues configured yet</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Add your Sleeper username and ESPN league IDs in{" "}
            <Link href="/settings" className="font-medium underline">
              Settings
            </Link>
            , then create a `.env.local` file using the example template.
          </p>
        </div>
      )}

      {isConfigured && data.leagues.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <h2 className="text-lg font-semibold">No leagues found</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Check your configuration and try refreshing.
          </p>
        </div>
      )}

      {data.leagues.length > 0 && (
        <section className="grid gap-4 sm:grid-cols-2">
          {data.leagues.map((league) => (
            <LeagueCard key={`${league.platform}-${league.id}`} league={league} />
          ))}
        </section>
      )}

      {data.errors.length > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="font-semibold text-amber-900 dark:text-amber-200">
            Some leagues could not be loaded
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-300">
            {data.errors.map((entry) => (
              <li key={`${entry.platform}-${entry.id}`}>
                {entry.platform.toUpperCase()} {entry.id}: {entry.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
