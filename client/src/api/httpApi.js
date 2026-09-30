const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const API_USERNAME =
  import.meta.env.VITE_API_USERNAME || '';

const API_PASSWORD =
  import.meta.env.VITE_API_PASSWORD || '';

function getAuthHeader() {
  const credentials = `${API_USERNAME}:${API_PASSWORD}`;

  return `Basic ${btoa(credentials)}`;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function listExercises() {
  return request('/api/exercises');
}

export function listWorkouts() {
  return request('/api/workouts');
}

export function createWorkout(workout) {
  return request('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(workout),
  });
}

export function updateWorkout(id, workout) {
  return request(`/api/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(workout),
  });
}

export function deleteWorkout(id) {
  return request(`/api/workouts/${id}`, {
    method: 'DELETE',
  });
}

export function getSchedule() {
  return request('/api/schedule');
}

export function updateSchedule(schedule) {
  return request('/api/schedule', {
    method: 'PUT',
    body: JSON.stringify(schedule),
  });
}

export function getProfile() {
  return request('/api/profile');
}

export function updateProfile(profile) {
  return request('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

export function getWorkoutSession(id) {
  return request(`/api/workouts/${id}/session`);
}

export function updateWorkoutSession(id, session) {
  return request(`/api/workouts/${id}/session`, {
    method: 'PUT',
    body: JSON.stringify(session),
  });
}