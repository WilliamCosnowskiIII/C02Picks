# C02Picks Architecture

Living diagram of how app components connect. **Update this file whenever you add, remove, or rewire modules.**

Last updated: 2026-05-30 (v1 — league dashboard MVP)

---

## System overview

```mermaid
flowchart TB
  subgraph devices [Devices]
    iPhone[iPhone Safari PWA]
    Mac[Mac Browser]
  end

  subgraph nextApp [Next.js App]
    layout[app/layout.tsx]
    homePage[app/page.tsx]
    settingsPage[app/settings/page.tsx]
    dashboard[LeagueDashboard]
    leagueCard[LeagueCard]
    platformBadge[PlatformBadge]
    leaguesLib[lib/leagues.ts]
    sleeperLib[lib/sleeper.ts]
    espnLib[lib/espn.ts]
    configLib[config/leagues.ts]
    typesLib[lib/types.ts]
    apiLeagues["/api/leagues"]
    apiSleeper["/api/sleeper/leagues"]
    apiEspn["/api/espn/league"]
  end

  subgraph external [External APIs]
    sleeperApi[Sleeper API]
    espnApi[ESPN Fantasy API]
  end

  subgraph env [Server Config]
    dotenv[".env.local"]
  end

  iPhone --> layout
  Mac --> layout
  layout --> homePage
  layout --> settingsPage
  homePage --> dashboard
  homePage --> leaguesLib
  dashboard --> leagueCard
  leagueCard --> platformBadge
  dashboard -->|"refresh"| apiLeagues
  apiLeagues --> leaguesLib
  apiSleeper --> sleeperLib
  apiEspn --> espnLib
  leaguesLib --> configLib
  leaguesLib --> sleeperLib
  leaguesLib --> espnLib
  settingsPage --> configLib
  configLib --> dotenv
  sleeperLib --> typesLib
  espnLib --> typesLib
  leaguesLib --> typesLib
  sleeperLib --> sleeperApi
  espnLib --> espnApi
  configLib --> typesLib
```

---

## Page and component tree

```mermaid
flowchart TD
  rootLayout["app/layout.tsx\n(metadata, PWA manifest, fonts)"]

  rootLayout --> home["app/page.tsx\n(Server Component)"]
  rootLayout --> settings["app/settings/page.tsx\n(Server Component)"]

  home --> dashboard["LeagueDashboard\n(Client Component)"]
  dashboard -->|"GET /api/leagues"| apiLeagues

  dashboard --> card["LeagueCard"]
  card --> badge["PlatformBadge"]

  settings --> getConfig["getAppConfig()"]
  settings --> getStatus["getConfigStatus()"]
```

---

## Data flow — dashboard load

```mermaid
sequenceDiagram
  participant Browser
  participant HomePage as app/page.tsx
  participant LeaguesLib as lib/leagues.ts
  participant Config as config/leagues.ts
  participant Sleeper as lib/sleeper.ts
  participant ESPN as lib/espn.ts
  participant SleeperAPI as Sleeper API
  participant ESPNAPI as ESPN API

  Browser->>HomePage: GET /
  HomePage->>LeaguesLib: fetchAllLeagues()
  LeaguesLib->>Config: getAppConfig()
  Config-->>LeaguesLib: AppConfig from env

  alt Sleeper username configured
    LeaguesLib->>Sleeper: getUserLeagues(username, season)
    Sleeper->>SleeperAPI: GET /user/{username}
    Sleeper->>SleeperAPI: GET /user/{id}/leagues/nfl/{season}
    Sleeper->>SleeperAPI: GET /league/{id}/rosters
    SleeperAPI-->>Sleeper: league + roster JSON
    Sleeper-->>LeaguesLib: League[]
  end

  loop Each ESPN league ID
    LeaguesLib->>ESPN: getEspnLeague(id, season, cookies)
    ESPN->>ESPNAPI: GET .../leagues/{id}?view=mTeam
    ESPNAPI-->>ESPN: league JSON
    ESPN-->>LeaguesLib: League
  end

  LeaguesLib-->>HomePage: LeaguesResult
  HomePage-->>Browser: LeagueDashboard with initialData

  Note over Browser,ESPNAPI: Refresh button calls GET /api/leagues and repeats via API route
```

---

## Module dependency map

| Module | Imports | Used by |
|--------|---------|---------|
| `lib/types.ts` | — | `sleeper`, `espn`, `leagues`, `config/leagues`, components |
| `config/leagues.ts` | `types` | `lib/leagues`, `settings/page`, `api/leagues` |
| `lib/sleeper.ts` | `types` | `lib/leagues`, `api/sleeper/leagues` |
| `lib/espn.ts` | `types` | `lib/leagues`, `api/espn/league` |
| `lib/leagues.ts` | `config`, `sleeper`, `espn`, `types` | `app/page`, `api/leagues` |
| `lib/dashboard-messages.ts` | `leagues` types | `LeagueDashboard` |
| `components/PlatformBadge.tsx` | `types` | `LeagueCard` |
| `components/LeagueCard.tsx` | `PlatformBadge`, `types` | `LeagueDashboard` |
| `components/LeagueDashboard.tsx` | `LeagueCard`, `leagues` types | `app/page` |
| `app/page.tsx` | `LeagueDashboard`, `leagues` | Next.js router |
| `app/settings/page.tsx` | `config/leagues` | Next.js router |
| `app/api/leagues/route.ts` | `lib/leagues` | HTTP clients, dashboard refresh |
| `app/api/sleeper/leagues/route.ts` | `lib/sleeper` | HTTP clients |
| `app/api/espn/league/route.ts` | `lib/espn` | HTTP clients |

---

## API routes

| Route | Handler | Purpose |
|-------|---------|---------|
| `GET /api/leagues` | `fetchAllLeagues()` | All configured Sleeper + ESPN leagues |
| `GET /api/sleeper/leagues?username=&season=` | `getUserLeagues()` | Sleeper leagues for one user |
| `GET /api/espn/league?leagueId=&season=` | `getEspnLeague()` | Single ESPN league |

---

## Tests

```mermaid
flowchart LR
  testsSleeper[tests/sleeper.test.ts] --> sleeperLib[lib/sleeper.ts]
  testsEspn[tests/espn.test.ts] --> espnLib[lib/espn.ts]
  testsCard[tests/LeagueCard.test.tsx] --> leagueCard[LeagueCard.tsx]
```

---

## File tree (source)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── settings/page.tsx
│   └── api/
│       ├── leagues/route.ts
│       ├── sleeper/leagues/route.ts
│       └── espn/league/route.ts
├── components/
│   ├── LeagueDashboard.tsx
│   ├── LeagueCard.tsx
│   └── PlatformBadge.tsx
├── config/
│   └── leagues.ts
└── lib/
    ├── types.ts
    ├── sleeper.ts
    ├── espn.ts
    ├── leagues.ts
    └── dashboard-messages.ts
```

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-30 | Fix homepage hang: client-side league fetch, Sleeper API timeouts |
| 2026-05-30 | Env fix: Sleeper null-safe league fetch, dashboard empty-state messaging, `.env.local` guidance |
| 2026-05-30 | Initial v1: league dashboard, Sleeper + ESPN clients, PWA shell |
