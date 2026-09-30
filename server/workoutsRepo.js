import { pool } from './db/pool.js';

function mapWorkout(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    completed: row.completed,
    exercises: row.exercises || [],
  };
}

const workoutSelect = `
  SELECT
    w.id,
    w.name,
    w.description,
    w.completed,
    COALESCE(
      json_agg(
        json_build_object(
          'exerciseId', we.exercise_id,
          'sets', we.sets,
          'reps', we.reps,
          'rest', we.rest_seconds,
          'position', we.position
        )
        ORDER BY we.position
      ) FILTER (WHERE we.id IS NOT NULL),
      '[]'
    ) AS exercises
  FROM workouts w
  LEFT JOIN workout_exercises we
    ON we.workout_id = w.id
`;

export async function listWorkouts() {
  const result = await pool.query(`
    ${workoutSelect}
    GROUP BY w.id
    ORDER BY w.id
  `);

  return result.rows.map(mapWorkout);
}

export async function getWorkoutById(id) {
  const result = await pool.query(
    `
      ${workoutSelect}
      WHERE w.id = $1
      GROUP BY w.id
    `,
    [id]
  );

  const row = result.rows[0];

  return row ? mapWorkout(row) : null;
}

export async function createWorkout({ name, description, exercises }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const workoutResult = await client.query(
      `
        INSERT INTO workouts (name, description)
        VALUES ($1, $2)
        RETURNING id
      `,
      [name, description]
    );

    const workoutId = workoutResult.rows[0].id;

    for (let index = 0; index < exercises.length; index += 1) {
      const exercise = exercises[index];

      await client.query(
        `
          INSERT INTO workout_exercises
            (workout_id, exercise_id, sets, reps, rest_seconds, position)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          workoutId,
          exercise.exerciseId,
          exercise.sets,
          exercise.reps,
          exercise.rest,
          index + 1,
        ]
      );
    }

    await client.query('COMMIT');

    return getWorkoutById(workoutId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateWorkout(id, {
  name,
  description,
  exercises,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `
        UPDATE workouts
        SET name = $1,
            description = $2
        WHERE id = $3
        RETURNING id
      `,
      [name, description, id]
    );

    if (!updateResult.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `
        DELETE FROM workout_exercises
        WHERE workout_id = $1
      `,
      [id]
    );

    for (let index = 0; index < exercises.length; index += 1) {
      const exercise = exercises[index];

      await client.query(
        `
          INSERT INTO workout_exercises
            (workout_id, exercise_id, sets, reps, rest_seconds, position)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          id,
          exercise.exerciseId,
          exercise.sets,
          exercise.reps,
          exercise.rest,
          index + 1,
        ]
      );
    }

    await client.query('COMMIT');

    return getWorkoutById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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