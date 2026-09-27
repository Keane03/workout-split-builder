export function filterBySearch(exercises, search) {
  return exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );
}

export function filterByMuscle(exercises, muscle) {
  if (muscle === 'All') {
    return exercises;
  }

  return exercises.filter(
    (exercise) => exercise.muscleGroup === muscle
  );
}

export function filterByEquipment(exercises, equipment) {
  if (equipment === 'All') {
    return exercises;
  }

  return exercises.filter(
    (exercise) => exercise.equipment === equipment
  );
}

export function filterByDifficulty(exercises, difficulty) {
  if (difficulty === 'All') {
    return exercises;
  }

  return exercises.filter(
    (exercise) => exercise.difficulty === difficulty
  );
}