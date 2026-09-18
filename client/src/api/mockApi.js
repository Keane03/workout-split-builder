import seed from './seed.json'

const KEY = 'workout-split-builder:demo'

// A real network is not instant. Keeping this delay is what forces you to build
// a loading state now, while it is cheap, instead of discovering you need one
// the day you switch to the real API.
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read() {
  const stored = localStorage.getItem(KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(KEY)
    }
  }
  const initial = structuredClone(seed)
  localStorage.setItem(KEY, JSON.stringify(initial))
  return initial
}

function write(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows))
  return rows
}

export async function listExercises() {
  await delay()
  return read().exercises
}

export async function listWorkouts() {
  await delay()
  return read().workouts
}

export async function createWorkout(input) {
  await delay()
  const state = read()
  const created = {
    ...input,
    id: crypto.randomUUID(),
    exercises: input.exercises || [],
  }
  write({ ...state, workouts: [...state.workouts, created] })
  return created
}

export async function updateWorkout(id, input) {
  await delay()
  const state = read()
  const index = state.workouts.findIndex((row) => String(row.id) === String(id))
  if (index === -1) throw new Error('Not found')
  state.workouts[index] = { ...state.workouts[index], ...input }
  write(state)
  return state.workouts[index]
}

export async function deleteWorkout(id) {
  await delay()
  const state = read()
  state.workouts = state.workouts.filter((row) => String(row.id) !== String(id))
  Object.keys(state.schedule).forEach((day) => {
    if (state.schedule[day] === id) state.schedule[day] = null
  })
  write(state)
}

export async function getSchedule() {
  await delay()
  return read().schedule
}

export async function updateSchedule(schedule) {
  await delay()
  const state = read()
  state.schedule = schedule
  write(state)
  return state.schedule
}

export async function getProfile() {
  await delay()
  return read().profile
}

export async function updateProfile(profile) {
  await delay()
  const state = read()
  state.profile = profile
  write(state)
  return state.profile
}

export async function getWorkoutSession(workoutId) {
  await delay()
  return read().sessions[workoutId] || { completed: [] }
}

export async function updateWorkoutSession(workoutId, session) {
  await delay()
  const state = read()
  state.sessions[workoutId] = session
  write(state)
  return session
}
