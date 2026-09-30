import { pool } from './db/pool.js';

function mapExercise(row) {
  return {
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group,
    equipment: row.equipment,
    difficulty: row.difficulty,
    description: row.description,
  };
}

export async function listExercises() {
  const result = await pool.query(`
    SELECT
      id,
      name,
      muscle_group,
      equipment,
      difficulty,
      description
    FROM exercises
    ORDER BY id
  `);

  return result.rows.map(mapExercise);
}

export async function getExerciseById(id) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        muscle_group,
        equipment,
        difficulty,
        description
      FROM exercises
      WHERE id = $1
    `,
    [id]
  );

  const row = result.rows[0];

  return row ? mapExercise(row) : null;
}