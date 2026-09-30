const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getAuthHeader() {
  const username = sessionStorage.getItem('apiUsername') || '';
  const password = sessionStorage.getItem('apiPassword') || '';

  if (!username || !password) {
    return null;
  }

  return `Basic ${btoa(`${username}:${password}`)}`;
}

export function saveCredentials(username, password) {
  sessionStorage.setItem('apiUsername', username);
  sessionStorage.setItem('apiPassword', password);
}

export function clearCredentials() {
  sessionStorage.removeItem('apiUsername');
  sessionStorage.removeItem('apiPassword');
}

export function hasCredentials() {
  return Boolean(
    sessionStorage.getItem('apiUsername') &&
    sessionStorage.getItem('apiPassword')
  );
}

async function request(path, options = {}) {
  const authHeader = getAuthHeader();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

export function checkLogin() {
  return request('/healthz');
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