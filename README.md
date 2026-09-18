# Workout Split Builder

Workout Split Builder helps athletes create, organize, schedule, and complete
weekly workout routines.

**Live site:** Not deployed yet.
**API:** Planned for a later phase.
**Demo video:** (link)

> **This project is currently running in demo mode.** The React interface uses a
> browser-side mock API backed by `localStorage`, so it works without Express or
> PostgreSQL. Backend integration is planned for a later phase.

![A screenshot of the main screen](docs/assets/screenshot.png)

## What it does

- Browse and search an exercise library
- Filter exercises by muscle group, equipment, and difficulty
- Build, edit, schedule, and complete workouts

## Built with

React and Vite on the front end. Week 1 uses a single API abstraction with a
mock/localStorage implementation. Express and PostgreSQL integration are planned
for a later phase and are not implemented yet.

## Demo mode

This repository can run two ways, chosen by one environment variable at **build**
time.

**Demo mode is the default.** Only the exact string `false` turns it off, so a
forgotten or mistyped variable leaves you on the simulated backend with a visible
notice rather than on a silently broken build.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset, or `true` | The client answers its own requests from `localStorage`. No server, no database, nothing shared between visitors. This is what the template ships with, so the GitHub Pages link works on day one. |
| `false` | Reserved for the later Express/PostgreSQL integration; it is not implemented yet. |

**Demo mode is the current Week 1 implementation.** It keeps the interface
usable while the Express API and PostgreSQL database remain planned work.

GitHub Pages serves files and cannot run Node, so the API and the database can
never live there. They go somewhere else:

| Piece | Options |
| --- | --- |
| **API** | Render, Railway, Fly.io, Koyeb, a VPS, or [self-hosted behind a tunnel](../content/extending-your-app/11-self-hosting.md) |
| **Database** | Neon, Supabase, Railway, Aiven, or your own PostgreSQL |

`content/extending-your-app/` in your course workspace walks through all of it.
Page 10 is the decision page if you do not know which to pick.

## Running it yourself

**The client only, in demo mode.** No database needed.

    cd client
    npm install
    cp .env.example .env        # VITE_USE_MOCK_API stays true
    npm run dev                 # http://localhost:5173

**The Express/PostgreSQL stack.** Planned for a later phase. Do not run or
configure it yet; the current application is intentionally client-only demo mode.

## Environment variables

No runtime environment variables are required for the current demo mode.
Future server variables are retained below as planning notes only.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server, later phase | PostgreSQL connection string |
| `CORS_ORIGINS` | server | comma-separated origins allowed to call the API |
| `NODE_ENV` | server | `production` on your host |
| `PORT` | server | **set by the host**, do not set it yourself |
| `VITE_USE_MOCK_API` | client, at build time | only `false` turns demo mode off; unset means on |
| `VITE_API_BASE_URL` | client, later phase | Future API base URL |

Every `VITE_` value is compiled into the built JavaScript and is **public**.
Never put a key, a password or a connection string in one.

## Deploying

**Client, to GitHub Pages.** Already wired up in
`.github/workflows/deploy-pages.yml`. Two one-time steps:

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.** Without
   this the workflow goes green and publishes nothing.
2. Nothing else is required for the current demo mode. The first deploy works
  without an API.

The repository must be **public** for Pages to serve it on a free account.

**API and database.** Planned for a later phase and not implemented yet.

## Project structure

    client/          React front end, built by Vite
      src/api/       ONE interface, two implementations, chosen by a variable
      src/components/
    server/          Reserved for the later Express API phase
      db/            pool, schema.sql, seed.sql, and a runner for them
    compose.yml      only if you self-host
    docs/            your planning documents and weekly reports

## Architecture

The React/Vite client talks to one interface in `client/src/api/index.js`.
Week 1 selects the mock implementation, which persists demo data in browser
`localStorage`; components do not know which implementation is active. Express
and PostgreSQL integration are planned for a later phase and are not implemented
yet.

## What I would do next

1. Connect the API abstraction to an Express service.
2. Add PostgreSQL persistence behind that service.
3. Deploy and document the full stack.

## Author

Your name, and a link. Course and section.

## Licence

MIT, see [LICENSE](LICENSE). Put your own name in it.
