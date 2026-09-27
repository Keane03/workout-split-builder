export function getTotalWorkouts(workouts) {
  return workouts.length;
}

export function getCompletedWorkouts(workouts) {
  return workouts.filter((workout) => workout.completed).length;
}

export function getCompletionPercentage(workouts) {
  if (workouts.length === 0) {
    return 0;
  }

  const completedWorkouts = getCompletedWorkouts(workouts);
  const percentage = (completedWorkouts / workouts.length) * 100;

  return Math.round(percentage);
}

export function getTotalExercises(workouts) {
  return workouts.reduce((total, workout) => {
    return total + workout.exercises.length;
  }, 0);
}

export function estimateWorkoutMinutes(workout) {
  return workout.exercises.length * 5;
}

export function getWorkoutForDay(workouts, day) {
  return workouts.find((workout) => workout.day_of_week === day);
}