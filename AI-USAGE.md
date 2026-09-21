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

- File: `AI-USAGE.md`
- Commit: To be added in the Week 1 AI usage commit.
- What it does and why it is built this way: This file documents how I used AI during the project, where I found problems in AI-generated work, and which parts I personally wrote or understand.

### The AI-written part I understand best

- File: `client/src/App.jsx`
- Commit: https://github.com/Keane03/workout-split-builder/commit/87000079e8e2641f630967401608d3b9d8335398
- What it does and why we kept it: This file controls the main Workout Split Builder interface and connects the different application screens to the API layer. I reviewed and tested the generated implementation, including the dashboard, exercise library, workout builder, schedule, workout completion, and settings behavior.