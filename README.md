# C02Picks

A React web app for tracking your Sleeper and ESPN fantasy football leagues in one dashboard. Install it as a PWA on iPhone or use it in any desktop browser on Mac.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for component diagrams, data flow, and module dependencies. Update that doc when changing app structure.

## Features (v1)

- Unified dashboard for Sleeper and ESPN leagues
- League name, platform, season, team count, and your record
- Server-side API proxies for Sleeper and ESPN
- PWA support for iPhone home screen install

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.local.example .env.local
```

3. Fill in `.env.local`:

- `SLEEPER_USERNAME` — your Sleeper handle
- `ESPN_LEAGUE_IDS` — comma-separated ESPN league IDs
- `ESPN_S2` and `ESPN_SWID` — only for private ESPN leagues
- `ESPN_MEMBER_ID` — optional, helps show your ESPN record on private leagues
- `NFL_SEASON` — e.g. `2025`

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Troubleshooting

**Page stuck loading or Settings never opens**

1. Stop all dev servers (`Ctrl+C` in every terminal running `npm run dev`).
2. Kill anything still on port 3000: `lsof -ti :3000 | xargs kill`
3. Start fresh: `npm run dev`
4. Use **http://localhost:3000** (not 3001) unless the terminal says otherwise.

The dev script uses webpack instead of Turbopack for more reliable local development.

**"Loading leagues..." forever**

- Confirm `.env.local` exists (not just `.env.local.example`) and has `SLEEPER_USERNAME`.
- Restart `npm run dev` after editing `.env.local`.
- Click **Refresh** — league data is cached for 60 seconds on the server.

## iPhone install (PWA)

1. Run the app on your Mac (`npm run dev`) or deploy it.
2. On iPhone Safari, open the app URL (use your Mac's local IP during dev).
3. Tap Share → **Add to Home Screen**.

## ESPN cookies (private leagues only)

1. Log into [ESPN Fantasy Football](https://fantasy.espn.com/football/) in Chrome.
2. Open DevTools → Application → Cookies.
3. Copy `espn_s2` and `SWID` into `.env.local`.
4. Restart the dev server.

Cookies stay server-side in `.env.local` and are never sent to the browser.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm test` — run test suite
- `npm run lint` — run ESLint

## API routes

- `GET /api/leagues` — all configured leagues
- `GET /api/sleeper/leagues?username=...&season=2025`
- `GET /api/espn/league?leagueId=...&season=2025`

## Security notes

- ESPN cookies act as your logged-in session. Never commit `.env.local`.
- The MVP is read-only — no trades or roster changes are made.
- Keep the repo private if you deploy with ESPN cookies on a cloud host.

## Roadmap (v2)

- Trade analyzer and waiver wire scout
- Roster analytics and cross-league player view
- Weekly matchups and live scores
