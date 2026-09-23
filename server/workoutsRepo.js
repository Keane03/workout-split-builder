import { pool } from './db/pool.js';

export async function listWorkouts() {
  const result = await pool.query(`
    SELECT
      w.id,
      w.name,
      w.day_of_week,
      w.completed,
      COALESCE(
        json_agg(
          json_build_object(
            'id', we.exercise_id,
            'name', e.name,
            'muscle_group', e.muscle_group,
            'equipment', e.equipment,
            'difficulty', e.difficulty,
            'sets', we.sets,
            'reps', we.reps,
            'rest_seconds', we.rest_seconds,
            'position', we.position
          )
          ORDER BY we.position
        ) FILTER (WHERE we.id IS NOT NULL),
        '[]'
      ) AS exercises
    FROM workouts w
    LEFT JOIN workout_exercises we
      ON we.workout_id = w.id
    LEFT JOIN exercises e
      ON e.id = we.exercise_id
    GROUP BY w.id
    ORDER BY w.id
  `);

  return result.rows;
}

export async function getWorkoutById(id) {
  const result = await pool.query(
    `
      SELECT
        w.id,
        w.name,
        w.day_of_week,
        w.completed,
        COALESCE(
          json_agg(
            json_build_object(
              'id', we.exercise_id,
              'name', e.name,
              'muscle_group', e.muscle_group,
              'equipment', e.equipment,
              'difficulty', e.difficulty,
              'sets', we.sets,
              'reps', we.reps,
              'rest_seconds', we.rest_seconds,
              'position', we.position
            )
            ORDER BY we.position
          ) FILTER (WHERE we.id IS NOT NULL),
          '[]'
        ) AS exercises
      FROM workouts w
      LEFT JOIN workout_exercises we
        ON we.workout_id = w.id
      LEFT JOIN exercises e
        ON e.id = we.exercise_id
      WHERE w.id = $1
      GROUP BY w.id
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function createWorkout({ name, dayOfWeek }) {
  const result = await pool.query(
    `
      INSERT INTO workouts (name, day_of_week)
      VALUES ($1, $2)
      RETURNING id, name, day_of_week, completed
    `,
    [name, dayOfWeek]
  );

  return result.rows[0];
}

export async function deleteWorkout(id) {
  const result = await pool.query(
    `
      DELETE FROM workouts
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  return result.rows[0] ?? null;
}
