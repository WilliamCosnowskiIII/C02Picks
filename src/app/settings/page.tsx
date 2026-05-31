import Link from "next/link";
import { getAppConfig, getConfigStatus } from "@/config/leagues";

export default function SettingsPage() {
  const config = getAppConfig();
  const status = getConfigStatus(config);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          League configuration is loaded from environment variables on the
          server.
        </p>
      </header>

      {!status.sleeperConfigured && !status.espnConfigured && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="font-semibold text-amber-900 dark:text-amber-200">
            Configuration not loaded
          </h2>
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
            Put your values in{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">.env.local</code>
            , not{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">.env.local.example</code>
            . Copy the example file, rename it, fill in your details, then restart{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">npm run dev</code>.
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Current status</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Season</dt>
            <dd className="font-medium">{status.season}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Sleeper username</dt>
            <dd className="font-medium">
              {status.sleeperConfigured ? config.sleeperUsername : "Not set"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">ESPN leagues</dt>
            <dd className="font-medium">{status.espnLeagueCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">ESPN cookies</dt>
            <dd className="font-medium">
              {status.espnAuthConfigured ? "Configured" : "Not set"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Setup</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            Copy <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.env.local.example</code>{" "}
            to <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.env.local</code> in the
            project root.
          </li>
          <li>
            Set `SLEEPER_USERNAME` to your Sleeper handle to auto-load all NFL
            leagues for the season.
          </li>
          <li>
            Set `ESPN_LEAGUE_IDS` to a comma-separated list of ESPN league IDs.
          </li>
          <li>
            For private ESPN leagues, add `ESPN_S2` and `ESPN_SWID` cookies from
            your browser after logging into ESPN Fantasy.
          </li>
          <li>
            Optionally set `ESPN_MEMBER_ID` so the dashboard can show your ESPN
            record on private leagues.
          </li>
          <li>Restart the dev server after changing environment variables.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Example `.env.local`</h2>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/40 p-4 text-xs leading-6">
{`SLEEPER_USERNAME=your_sleeper_username
ESPN_LEAGUE_IDS=123456,789012
ESPN_S2=your_espn_s2_cookie
ESPN_SWID=your_swid_cookie
ESPN_MEMBER_ID=your_espn_member_id
NFL_SEASON=2025`}
        </pre>
      </section>
    </main>
  );
}
