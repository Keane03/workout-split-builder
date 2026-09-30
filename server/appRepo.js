import { pool } from './db/pool.js';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export async function getSchedule() {
  const result = await pool.query(`
    SELECT day_of_week, workout_id
    FROM schedule
  `);

  const schedule = Object.fromEntries(
    DAYS.map((day) => [day, null])
  );

  for (const row of result.rows) {
    schedule[row.day_of_week] = row.workout_id;
  }

  return schedule;
}

export async function saveSchedule(schedule) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const day of DAYS) {
      const rawWorkoutId = schedule[day];
      const workoutId =
        rawWorkoutId === null ||
        rawWorkoutId === undefined ||
        rawWorkoutId === ''
          ? null
          : Number(rawWorkoutId);

      await client.query(
        `
          INSERT INTO schedule (day_of_week, workout_id)
          VALUES ($1, $2)
          ON CONFLICT (day_of_week)
          DO UPDATE SET workout_id = EXCLUDED.workout_id
        `,
        [day, workoutId]
      );
    }

    await client.query('COMMIT');

    return getSchedule();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getProfile() {
  const result = await pool.query(`
    SELECT name
    FROM profile
    WHERE id = 1
  `);

  if (!result.rows[0]) {
    const created = await pool.query(`
      INSERT INTO profile (id, name)
      VALUES (1, 'Athlete')
      RETURNING name
    `);

    return created.rows[0];
  }

  return result.rows[0];
}

export async function saveProfile(name) {
  const result = await pool.query(
    `
      INSERT INTO profile (id, name)
      VALUES (1, $1)
      ON CONFLICT (id)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING name
    `,
    [name]
  );

  return result.rows[0];
}

export async function getWorkoutSession(workoutId) {
  const result = await pool.query(
    `
      SELECT completed_exercise_ids
      FROM workout_sessions
      WHERE workout_id = $1
    `,
    [workoutId]
  );

  return {
    completed: result.rows[0]?.completed_exercise_ids || [],
  };
}

export async function saveWorkoutSession(workoutId, completed) {
  const result = await pool.query(
    `
      INSERT INTO workout_sessions
        (workout_id, completed_exercise_ids)
      VALUES ($1, $2)
      ON CONFLICT (workout_id)
      DO UPDATE SET completed_exercise_ids = EXCLUDED.completed_exercise_ids
      RETURNING completed_exercise_ids
    `,
    [workoutId, completed]
  );

  return {
    completed: result.rows[0].completed_exercise_ids,
  };
}