# AI usage

## 1. How I used AI

### 2026-09-18 - Project architecture and implementation planning

- Tool: VS Code AI assistant / ChatGPT
- What I asked for: I asked for help reviewing the professor's final-project template and planning how to adapt the React client into my Workout Split Builder project while keeping the required API abstraction.
- What it gave back: It analyzed the existing template structure and suggested keeping the React/Vite client, API boundary, mock API, and HTTP API structure while replacing the HAUnted-specific interface.
- What I kept, what I changed, and why: I kept the required React/Vite and API architecture because it matched the professor's template. I changed the application content to fit my Workout Split Builder requirements.
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398

### 2026-09-18 - Workout Split Builder client

- Tool: VS Code AI assistant
- What I asked for: I asked for the client to be implemented as a Workout Split Builder with a dashboard, exercise library, workout builder, schedule, start workout, and settings.
- What it gave back: It implemented the main React interface, workout interactions, exercise search and filters, scheduling, workout completion, settings, and local persistence using the existing API abstraction.
- What I kept, what I changed, and why: I kept the core implementation after testing it in the browser. I reviewed the generated behavior and required it to stay within the project scope instead of adding unrelated features such as authentication or social features.
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398

### 2026-09-18 - API and local data layer

- Tool: VS Code AI assistant
- What I asked for: I asked for the Workout Split Builder to use the template's API boundary instead of having the React UI directly depend on the mock or HTTP implementation.
- What it gave back: It updated the API files and seed data so the application could work in demo/mock mode while keeping the HTTP API implementation available for the later Express/PostgreSQL stage.
- What I kept, what I changed, and why: I kept the API abstraction because it follows the professor's template architecture. I also tested that the UI used the API interface rather than importing the mock or HTTP implementation directly.
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398

### 2026-09-18 - Requirements and bug audit

- Tool: VS Code AI assistant
- What I asked for: I asked for an audit of the implementation against the project requirements and the existing architecture.
- What it gave back: The audit identified issues involving workout ID comparison, workout deletion and schedule state, and outdated HAUnted documentation.
- What I kept, what I changed, and why: I kept the audit findings that were supported by testing and corrected the identified issues. I did not add unrelated features.
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398

### 2026-09-19 - README documentation

- Tool: VS Code AI assistant / ChatGPT
- What I asked for: I asked for help updating the README so that it described Workout Split Builder instead of the original HAUnted example and documented the current Week 1 state.
- What it gave back: It helped structure the README around the project's purpose, setup, features, project structure, screenshots, and current limitations.
- What I kept, what I changed, and why: I kept the project-specific documentation and changed outdated template references so the README accurately described the Workout Split Builder.
- Commit: https://github.com/Keane03/workout-split-builder/commit/e92bfb0d4d7d71748dc74b1ad0bd95254f5216e7

### 2026-09-19 - Documentation screenshots

- Tool: ChatGPT / VS Code
- What I asked for: I asked for help organizing screenshots of the completed Week 1 client for the project documentation.
- What it gave back: It helped identify the application screens that should be documented, including the Dashboard, Exercise Library, Schedule, Settings, Start Workout, and Workout Builder.
- What I kept, what I changed, and why: I kept the screenshots that represented the actual application screens and added them to the public repository's documentation folder.
- Commit: https://github.com/Keane03/workout-split-builder/commit/ef49872e030d3527aa81b34e8263e3fdb8f66b6f

## 2. Where the AI got it wrong

### Case 1 - Workout ID comparison

- What it gave me: The generated implementation compared workout IDs strictly without normalizing their types.
- What was wrong with it: Workout IDs could come from different sources with different types, which could cause an existing workout not to be found correctly.
- What I did instead: I changed the comparison to normalize the IDs before comparing them and verified the application again.
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398

### Case 2 - Workout deletion and schedule state

- What it gave me: The generated delete behavior removed the workout but did not correctly update the schedule state held by the application.
- What was wrong with it: A deleted workout could remain assigned in the in-memory schedule until the application state was refreshed.
- What I did instead: I updated the application state when a workout was deleted so related schedule information was also handled correctly.
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398

### Case 3 - Outdated template documentation

- What it gave me: Some documentation still contained references to the original HAUnted/sighting example from the professor's template.
- What was wrong with it: The documentation did not accurately describe Workout Split Builder.
- What I did instead: I revised the README and project documentation to describe the actual Workout Split Builder application and its current Week 1 state.
- Commit: https://github.com/Keane03/workout-split-builder/commit/e92bfb0d4d7d71748dc74b1ad0bd95254f5216e7

## 3. Who wrote what

### Written by me

#### `client/src/styles.css`

- **Commit:** `8700007` — Build Week 1 Workout Split Builder client
- **Contribution:** I personally wrote most of the styling used by the Workout Split Builder interface.
- **What it does:** This file controls the layout, dashboard cards, sidebar, exercise cards, buttons, forms, responsive layout, spacing, and general visual design of the application.
- **Why I built it this way:** I wanted the application to have a consistent workout-dashboard design while keeping the styling in one main CSS file that I could easily adjust.

#### `client/src/utils/workoutStats.js`

- **Commit:** `80b5ee9` — Add workout statistics utilities
- **Contribution:** I wrote the workout statistics utility functions.
- **What it does:** It calculates total workouts, completed workouts, completion percentage, total exercises, estimated workout time, and finds a workout for a given day.
- **Why I built it this way:** I separated the calculations from `App.jsx` so the dashboard code is easier to read and the functions can be reused.

#### `client/src/utils/exerciseFilters.js`

- **Commit:** `6536dbc` — Add reusable exercise filtering utilities
- **Contribution:** I wrote the exercise filtering utility functions.
- **What it does:** It filters the exercise list by search text, muscle group, equipment, and difficulty.
- **Why I built it this way:** Keeping each filter in a small function makes the filtering logic easier to understand, test, and reuse.

### AI-assisted integration

- **File:** `client/src/App.jsx`
- **Commits:** `80b5ee9`, `6536dbc`
- **Contribution:** AI helped me connect my utility functions to the existing React application.
- **What I understand:** The imported utility functions receive the current workout or exercise arrays, process them, and return values that the dashboard and Exercise Library display.

### Backend

The Week 2 Node.js, Express, PostgreSQL, validation, CORS, and Basic Authentication work was mostly AI-assisted. I reviewed the structure, tested the database scripts and API routes, corrected problems found during testing, and documented the AI assistance in this file.

### The AI-written part I understand best

- **File:** `client/src/App.jsx`
- **Commit:** `8700007` — Build Week 1 Workout Split Builder client
- **What it does:** `App.jsx` controls the main application state and switches between the Dashboard, Exercise Library, Workout Builder, Schedule, Start Workout, and Settings screens.
- **Why we kept it:** I tested the interface and understand how the application state, API functions, dashboard calculations, filtering utilities, and screens are connected.

## Week 2 AI Use

### Entry 7 — PostgreSQL Database and Workout API

- **Date:** 2026-09-23
- **Tool:** ChatGPT
- **What I asked:** I asked for help moving Workout Split Builder from the Week 1 mock/local-storage setup toward a Node.js, Express, and PostgreSQL backend.
- **What AI gave:** AI suggested a PostgreSQL schema, seed data, repository structure, database connection setup, and Express routes for exercises and workouts.
- **What I kept, changed, and why:** I used the suggested backend structure as a starting point, then tested the schema, seed scripts, and API structure locally. I kept the parts that matched the project requirements and adjusted the project around the existing frontend structure.
- **Commit:** `1b5b978` — Build Week 2 database and workout API

### Entry 8 — Security Configuration

- **Date:** 2026-09-24
- **Tool:** ChatGPT
- **What I asked:** I asked for help checking the project against the security requirements given for the final project.
- **What AI gave:** AI identified areas involving environment variables, database credentials, GitHub Actions, parameterized queries, error handling, and public repository security.
- **What I kept, changed, and why:** I applied the security changes that matched the requirements, including safer environment configuration and GitHub Actions changes. I also checked that real `.env` files remained ignored by Git.
- **Commit:** `c6e69ea` — Harden project security configuration

### Entry 9 — Backend Validation and CORS

- **Date:** 2026-09-25
- **Tool:** ChatGPT
- **What I asked:** I asked for help improving server-side validation and restricting which browser origins could call the API.
- **What AI gave:** AI suggested validation for route IDs and workout input, together with an allowlisted CORS configuration.
- **What I kept, changed, and why:** I kept the validation and CORS changes because they matched the security checklist and made the backend stricter about invalid input and allowed origins.
- **Commit:** `cbfb38d` — Add backend validation and stricter CORS

### Entry 10 — Basic Authentication

- **Date:** 2026-09-25
- **Tool:** ChatGPT
- **What I asked:** I asked how to protect the API because the application can write to a database and does not yet have a normal user account system.
- **What AI gave:** AI suggested using environment-based Basic Authentication as a temporary protection layer for the API.
- **What I kept, changed, and why:** I implemented Basic Authentication before the API routes and kept the username and password in local environment variables instead of the public repository.
- **Commit:** `e672f64` — Add Basic Auth protection to API

### Entry 11 — Week 2 Setup Documentation

- **Date:** 2026-09-27
- **Tool:** ChatGPT
- **What I asked:** I asked for help correcting the README after testing showed that the frontend and backend use separate `package.json` files and that some earlier setup commands were incorrect.
- **What AI gave:** AI suggested corrected installation, database, environment, security, and run instructions based on the actual repository structure.
- **What I kept, changed, and why:** I updated the README and `.env.example`, then verified the frontend build and successfully ran the PostgreSQL schema and seed scripts before committing the changes.
- **Commit:** `20d69ff` — Update Week 2 setup documentation

## Week 3 AI Use

### Entry 12 — Full-Stack Frontend Integration

- **Date:** 2026-09-30
- **Tool:** ChatGPT
- **What I asked:** I asked for help connecting the React frontend to the real Express and PostgreSQL backend instead of continuing to use the mock API.
- **What AI gave:** AI helped identify missing backend routes and data-shape mismatches between the React frontend and PostgreSQL. It suggested adding support for workout updates, schedule data, profile data, workout sessions, camelCase API responses, and authenticated frontend requests.
- **What I kept, changed, and why:** I implemented the backend routes and repositories, updated the database schema, connected the frontend HTTP API to the backend, and switched the local client from mock mode to the real API. I tested the dashboard, exercise library, profile saving, workout creation, editing, deletion, schedule assignment, workout completion, persistence after refresh, and authentication before committing the changes.
- **Commit:** https://github.com/Keane03/workout-split-builder/commit/2a48073a57087cf1335077eba9beae4467765c55