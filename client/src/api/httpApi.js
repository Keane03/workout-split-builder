const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    // Try to use the API's own message; fall back to the status line.
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listExercises = () => request('/api/exercises')

export const listWorkouts = () => request('/api/workouts')

export const createWorkout = (input) =>
  request('/api/workouts', { method: 'POST', body: JSON.stringify(input) })

export const updateWorkout = (id, input) =>
  request(`/api/workouts/${id}`, { method: 'PUT', body: JSON.stringify(input) })

export const deleteWorkout = (id) =>
  request(`/api/workouts/${id}`, { method: 'DELETE' })

export const getSchedule = () => request('/api/schedule')

export const updateSchedule = (schedule) =>
  request('/api/schedule', { method: 'PUT', body: JSON.stringify(schedule) })

export const getProfile = () => request('/api/profile')

export const updateProfile = (profile) =>
  request('/api/profile', { method: 'PUT', body: JSON.stringify(profile) })

export const getWorkoutSession = (workoutId) =>
  request(`/api/workouts/${workoutId}/session`)

export const updateWorkoutSession = (workoutId, session) =>
  request(`/api/workouts/${workoutId}/session`, {
    method: 'PUT',
    body: JSON.stringify(session),
  })
