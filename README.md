# Workout Split Builder

Workout Split Builder helps athletes create, organize, schedule, and complete
weekly workout routines.

**Live site:** Not deployed yet.
**API:** Planned for a later phase.
**Demo video:** (link)

> **This project is currently running in demo mode.** The React interface uses a
> browser-side mock API backed by `localStorage`, so it works without Express or
> PostgreSQL. Backend integration is planned for a later phase.

### SCREENSHOT FOUND IN docs/screenshots/

# Workout Split Builder

## 1. Overview

Workout Split Builder is a React/Vite web application that helps users create, organize, schedule, and perform workout routines. It is designed for users who wants a simple way to manage exercises, build workout plans, assign workouts to specific days, and track workout progress.

The Week 1 version focuses on the React client and works in demo/mock mode without requiring an Express server or PostgreSQL database.

---

## 2. Setup and installation

### Requirements

The project requires:

- Node.js
- npm
- A web browser
- Git

The Week 1 application is a React/Vite client and does not require PostgreSQL or a database server to run in demo mode.

### Get the code

Clone the Workout Split Builder repository from GitHub:

```bash
git clone <your-workout-split-builder-repository-url>

Then enter the project directory:

cd workout-split-builder

Install dependencies
The React application is inside the client/ directory.
cd client
npm install

No additional dependencies are required for the Week 1 implementation.
Environment and configuration
The Week 1 application uses the API abstraction provided by the final-project template.

The application can use:
VITE_USE_MOCK_API

The mock API is used for the current Week 1 version.
For the future HTTP implementation, the project also supports:
VITE_API_BASE_URL

Example configuration:
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000

For Week 1 demo mode, Express and PostgreSQL are not required.

Do not place real passwords, API keys, database credentials, or other secrets in the repository.

Database setup
No database setup or seeding is required for Week 1.
The current demo mode uses the mock API and browser localStorage for data persistence.
Express and PostgreSQL integration are planned for a later phase of the final project.

##3. How to run it

From the project repository, enter the client directory:
cd client
Install the dependencies if this has not been done yet:
npm install
Start the development server:
npm run dev
Vite will display a local development address in the terminal.
Open the displayed address in a web browser.
When the application is working correctly, the Workout Split Builder Dashboard should load as the main screen.
Production build
The project can also be checked by creating a production build:
npm run build
The Week 1 build was successfully tested.

###4. Features and usage

 #Dashboard

  The Dashboard provides an overview of the user's workout activity.
    It displays:

-Today's workout
-Weekly workout schedule
-Total workouts
-Workout completion percentage

Exercise Library
The Exercise Library contains the available exercises.
Users can:

-Search for an exercise by name.
-Filter exercises by muscle group.
-Filter exercises by equipment.
-Filter exercises by difficulty.
-Add an exercise to a workout.

Workout Builder
The Workout Builder allows users to create and manage     workout routines.
Users can:

-Create a workout.
-Add exercises.
-Remove exercises.
-Edit the number of sets.
-Edit repetitions.
-Edit rest time.
-Reorder exercises.
-View the estimated workout duration.
-Save the workout.

Workout Schedule
Workouts can be assigned to days from Monday through Sunday.Schedule changes are saved in demo mode.

Start Workout
The Start Workout screen allows users to perform a selected workout.

Users can:

-View the exercises in the workout.
-Mark exercises as completed.
-View workout progress.
-Use the rest timer.
-Complete the workout.

Settings
The Settings screen allows the user to change their profile name.
The profile information is saved in demo mode and remains available after reloading the page.

Data persistence
The Week 1 mock implementation uses browser localStorage to persist:

-Workout plans
-Workout schedules
-Exercise completion data
-Profile information
-This allows saved information to remain after a page reload.

API
The project uses one API abstraction through:

client/src/api/index.js

The current Week 1 implementation uses:

client/src/api/mockApi.js

The project also preserves:

client/src/api/httpApi.js

for the future Express implementation.

There are currently no active Express REST endpoints in the Week 1 version because the backend integration is intentionally deferred.

The React UI does not directly import mockApi.js or httpApi.js. The API implementation is selected through src/api/index.js.

5. Project structure
The important project files and folders are:
workout-split-builder/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── index.js
│   │   │   ├── mockApi.js
│   │   │   ├── httpApi.js
│   │   │   └── seed.json
│   │   │
│   │   ├── components/
│   │   │   └── DemoNotice.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│
├── docs/
│
├── START-HERE.md
└── README.md

Important files

client/src/App.jsx
Contains the main Workout Split Builder interface and application views.

client/src/api/index.js
Provides the single API interface used by the React application and selects the API implementation.

client/src/api/mockApi.js
Provides the Week 1 demo implementation and local persistence.

client/src/api/httpApi.js
Preserved for the future Express API implementation.

client/src/api/seed.json
Contains the initial Workout Split Builder demo data.

client/src/styles.css
Contains the application's responsive styling.

client/src/components/DemoNotice.jsx
Provides the demo-mode notice used by the application.

The server/ directory was not modified during Week 1.

## 6. Screenshots

### Dashboard

![Workout Split Builder Dashboard](docs/screenshots/dashboard.png)

### Exercise Library

![Workout Split Builder Exercise Library](docs/screenshots/exercise-library.png)

### Workout Builder

![Workout Split Builder Workout Builder](docs/screenshots/workout-builder.png)

### Schedule

![Workout Split Builder Schedule](docs/screenshots/schedule.png)

### Start Workout

![Workout Split Builder Start Workout](docs/screenshots/start-workout.png)

### Settings

![Workout Split Builder Settings](docs/screenshots/settings.png)

## 7. Known issues and next steps

Known issues
No reproducible application bugs remained after Week 1 testing.

The application was tested in demo/mock mode, including:

-Dashboard
-Exercise Library
-Search and filters
-Adding exercises
-Workout creation and editing
-Exercise removal
-Exercise reordering
-Sets, repetitions, and rest editing
-Workout scheduling
-Start Workout
-Exercise completion
-Workout progress
-Rest timer
-Settings/profile persistence
-Data persistence after reload

The production build also completed successfully.

There is currently no automated test suite. Week 1 validation was performed through application/browser testing and build verification.

--Current limitations
The current version is still a client-side demo implementation.

The following are not implemented yet:

-Express REST API integration
-PostgreSQL database integration
-Full client-to-server communication
-Production deployment

These are intentionally deferred to the later phase of the final project.

Next steps
The next development phase will focus on moving from the Week 1 mock implementation toward the full-stack architecture:

React/Vite Frontend
        ↓
API Abstraction
        ↓
Express REST API
        ↓
PostgreSQL Database

The existing API abstraction will be preserved so that the React UI can continue using the same interface when the backend is implemented.

---

### SCREENSHOT FOUND IN docs/screenshots/
