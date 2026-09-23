-- Workout Split Builder seed data

INSERT INTO exercises (name, muscle_group, equipment, difficulty)
VALUES
  ('Barbell Squat', 'Legs', 'Barbell', 'Intermediate'),
  ('Bench Press', 'Chest', 'Barbell', 'Intermediate'),
  ('Pull-Up', 'Back', 'Bodyweight', 'Advanced'),
  ('Deadlift', 'Back', 'Barbell', 'Advanced'),
  ('Shoulder Press', 'Shoulders', 'Dumbbell', 'Intermediate'),
  ('Dumbbell Row', 'Back', 'Dumbbell', 'Intermediate'),
  ('Bicep Curl', 'Arms', 'Dumbbell', 'Beginner'),
  ('Tricep Pushdown', 'Arms', 'Cable', 'Beginner'),
  ('Leg Press', 'Legs', 'Machine', 'Beginner'),
  ('Lateral Raise', 'Shoulders', 'Dumbbell', 'Beginner')
ON CONFLICT DO NOTHING;

INSERT INTO workouts (name, day_of_week, completed)
VALUES
  ('Push Day', 'Monday', false),
  ('Pull Day', 'Wednesday', false),
  ('Leg Day', 'Friday', false)
ON CONFLICT DO NOTHING;

INSERT INTO workout_exercises
  (workout_id, exercise_id, sets, reps, rest_seconds, position)
SELECT
  w.id,
  e.id,
  3,
  10,
  60,
  1
FROM workouts w
JOIN exercises e ON e.name = 'Bench Press'
WHERE w.name = 'Push Day'
  AND NOT EXISTS (
    SELECT 1
    FROM workout_exercises we
    WHERE we.workout_id = w.id
      AND we.exercise_id = e.id
  );

INSERT INTO workout_exercises
  (workout_id, exercise_id, sets, reps, rest_seconds, position)
SELECT
  w.id,
  e.id,
  3,
  10,
  60,
  1
FROM workouts w
JOIN exercises e ON e.name = 'Pull-Up'
WHERE w.name = 'Pull Day'
  AND NOT EXISTS (
    SELECT 1
    FROM workout_exercises we
    WHERE we.workout_id = w.id
      AND we.exercise_id = e.id
  );

INSERT INTO workout_exercises
  (workout_id, exercise_id, sets, reps, rest_seconds, position)
SELECT
  w.id,
  e.id,
  3,
  10,
  90,
  1
FROM workouts w
JOIN exercises e ON e.name = 'Barbell Squat'
WHERE w.name = 'Leg Day'
  AND NOT EXISTS (
    SELECT 1
    FROM workout_exercises we
    WHERE we.workout_id = w.id
      AND we.exercise_id = e.id
  );
