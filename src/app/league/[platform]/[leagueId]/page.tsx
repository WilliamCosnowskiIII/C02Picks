import { Suspense } from "react";
import { LeagueTeamPage } from "@/components/LeagueTeamPage";
import type { Platform } from "@/lib/types";

type PageProps = {
  params: Promise<{
    platform: string;
    leagueId: string;
  }>;
};

function isPlatform(value: string): value is Platform {
  return value === "sleeper" || value === "espn";
}

export default async function Page({ params }: PageProps) {
  const { platform, leagueId } = await params;

  if (!isPlatform(platform)) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-600">Unsupported platform.</p>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-zinc-500">Loading your team...</p>
        </main>
      }
    >
      <LeagueTeamPage platform={platform} leagueId={leagueId} />
    </Suspense>
  );
}
