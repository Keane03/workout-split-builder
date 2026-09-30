-- Workout Split Builder database schema

CREATE TABLE IF NOT EXISTS exercises (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment    TEXT NOT NULL,
  difficulty   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workouts (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  day_of_week  TEXT NOT NULL,
  completed    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id            SERIAL PRIMARY KEY,
  workout_id    INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id   INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets          INTEGER NOT NULL DEFAULT 3,
  reps          INTEGER NOT NULL DEFAULT 10,
  rest_seconds  INTEGER NOT NULL DEFAULT 60,
  position      INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS workout_exercises_workout_idx
  ON workout_exercises (workout_id, position);

CREATE INDEX IF NOT EXISTS workout_exercises_exercise_idx
  ON workout_exercises (exercise_id);

  -- Week 3 fields used by the real frontend.

ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';

ALTER TABLE workouts
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';

-- Scheduling is now stored separately, so a workout itself does not need
-- to permanently belong to one day.
ALTER TABLE workouts
  ALTER COLUMN day_of_week DROP NOT NULL;


-- One saved workout may be assigned to each day.
CREATE TABLE IF NOT EXISTS schedule (
  day_of_week TEXT PRIMARY KEY,
  workout_id INTEGER REFERENCES workouts(id) ON DELETE SET NULL,
  CHECK (
    day_of_week IN (
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    )
  )
);


-- This project currently has one local application profile.
CREATE TABLE IF NOT EXISTS profile (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Athlete',
  CHECK (id = 1)
);


-- Stores which exercises have been completed during a workout.
CREATE TABLE IF NOT EXISTS workout_sessions (
  workout_id INTEGER PRIMARY KEY
    REFERENCES workouts(id) ON DELETE CASCADE,
  completed_exercise_ids INTEGER[] NOT NULL DEFAULT '{}'
);