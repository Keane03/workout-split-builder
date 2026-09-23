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