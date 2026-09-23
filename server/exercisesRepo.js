import { pool } from './db/pool.js';

export async function listExercises() {
  const result = await pool.query(`
    SELECT
      id,
      name,
      muscle_group,
      equipment,
      difficulty
    FROM exercises
    ORDER BY id
  `);

  return result.rows;
}

export async function getExerciseById(id) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        muscle_group,
        equipment,
        difficulty
      FROM exercises
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}
