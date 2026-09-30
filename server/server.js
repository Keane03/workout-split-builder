import express from 'express';
import cors from 'cors';

import {
  listExercises,
  getExerciseById,
} from './exercisesRepo.js';

import {
  listWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from './workoutsRepo.js';

import {
  getSchedule,
  saveSchedule,
  getProfile,
  saveProfile,
  getWorkoutSession,
  saveWorkoutSession,
} from './appRepo.js';

const app = express();
const port = Number(process.env.PORT || 3000);

const appUsername = process.env.APP_USERNAME;
const appPassword = process.env.APP_PASSWORD;

if (!appUsername || !appPassword) {
  throw new Error('APP_USERNAME and APP_PASSWORD are required');
}

function requireBasicAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Basic ')) {
    res.set(
      'WWW-Authenticate',
      'Basic realm="Workout Split Builder"'
    );

    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  const encodedCredentials =
    authorization.slice('Basic '.length);

  const decodedCredentials = Buffer.from(
    encodedCredentials,
    'base64'
  ).toString('utf8');

  const separatorIndex = decodedCredentials.indexOf(':');

  if (separatorIndex === -1) {
    res.set(
      'WWW-Authenticate',
      'Basic realm="Workout Split Builder"'
    );

    return res.status(401).json({
      error: 'Invalid authentication',
    });
  }

  const username =
    decodedCredentials.slice(0, separatorIndex);

  const password =
    decodedCredentials.slice(separatorIndex + 1);

  if (
    username !== appUsername ||
    password !== appPassword
  ) {
    res.set(
      'WWW-Authenticate',
      'Basic realm="Workout Split Builder"'
    );

    return res.status(401).json({
      error: 'Invalid authentication',
    });
  }

  next();
}

const allowedOrigins = process.env.CORS_ORIGINS
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!allowedOrigins?.length) {
  throw new Error('CORS_ORIGINS is required');
}

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.use(requireBasicAuth);

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

app.get('/readyz', async (_req, res, next) => {
  try {
    await listExercises();
    res.json({ ready: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/exercises', async (_req, res, next) => {
  try {
    const exercises = await listExercises();
    res.json(exercises);
  } catch (error) {
    next(error);
  }
});

app.get('/api/exercises/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid exercise ID',
      });
    }

    const exercise = await getExerciseById(id);

    if (!exercise) {
      return res.status(404).json({
        error: 'Exercise not found',
      });
    }

    res.json(exercise);
  } catch (error) {
    next(error);
  }
});

function validateWorkoutInput(body) {
  if (
    typeof body.name !== 'string' ||
    !body.name.trim() ||
    body.name.trim().length > 100
  ) {
    return 'name must be a non-empty string with at most 100 characters';
  }

  if (
    body.description !== undefined &&
    typeof body.description !== 'string'
  ) {
    return 'description must be a string';
  }

  if (!Array.isArray(body.exercises)) {
    return 'exercises must be an array';
  }

  for (const exercise of body.exercises) {
    if (
      !Number.isInteger(Number(exercise.exerciseId)) ||
      Number(exercise.exerciseId) <= 0
    ) {
      return 'Each exercise must have a valid exerciseId';
    }

    if (
      !Number.isInteger(Number(exercise.sets)) ||
      Number(exercise.sets) <= 0
    ) {
      return 'Each exercise must have valid sets';
    }

    if (
      !Number.isInteger(Number(exercise.reps)) ||
      Number(exercise.reps) <= 0
    ) {
      return 'Each exercise must have valid reps';
    }

    if (
      !Number.isInteger(Number(exercise.rest)) ||
      Number(exercise.rest) < 0
    ) {
      return 'Each exercise must have valid rest time';
    }
  }

  return null;
}

app.get('/api/workouts', async (_req, res, next) => {
  try {
    const workouts = await listWorkouts();
    res.json(workouts);
  } catch (error) {
    next(error);
  }
});

app.get('/api/workouts/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid workout ID',
      });
    }

    const workout = await getWorkoutById(id);

    if (!workout) {
      return res.status(404).json({
        error: 'Workout not found',
      });
    }

    res.json(workout);
  } catch (error) {
    next(error);
  }
});

app.post('/api/workouts', async (req, res, next) => {
  try {
    const validationError =
      validateWorkoutInput(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const workout = await createWorkout({
      name: req.body.name.trim(),
      description:
        req.body.description?.trim() || '',
      exercises: req.body.exercises,
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
});

app.put('/api/workouts/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid workout ID',
      });
    }

    const validationError =
      validateWorkoutInput(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const workout = await updateWorkout(id, {
      name: req.body.name.trim(),
      description:
        req.body.description?.trim() || '',
      exercises: req.body.exercises,
    });

    if (!workout) {
      return res.status(404).json({
        error: 'Workout not found',
      });
    }

    res.json(workout);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/workouts/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid workout ID',
      });
    }

    const deletedWorkout = await deleteWorkout(id);

    if (!deletedWorkout) {
      return res.status(404).json({
        error: 'Workout not found',
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/schedule', async (_req, res, next) => {
  try {
    res.json(await getSchedule());
  } catch (error) {
    next(error);
  }
});

app.put('/api/schedule', async (req, res, next) => {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        error: 'Schedule must be an object',
      });
    }

    const saved = await saveSchedule(req.body);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

app.get('/api/profile', async (_req, res, next) => {
  try {
    res.json(await getProfile());
  } catch (error) {
    next(error);
  }
});

app.put('/api/profile', async (req, res, next) => {
  try {
    const name = req.body?.name;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      name.trim().length > 40
    ) {
      return res.status(400).json({
        error:
          'name must be a non-empty string with at most 40 characters',
      });
    }

    res.json(await saveProfile(name.trim()));
  } catch (error) {
    next(error);
  }
});

app.get(
  '/api/workouts/:id/session',
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: 'Invalid workout ID',
        });
      }

      const workout = await getWorkoutById(id);

      if (!workout) {
        return res.status(404).json({
          error: 'Workout not found',
        });
      }

      res.json(await getWorkoutSession(id));
    } catch (error) {
      next(error);
    }
  }
);

app.put(
  '/api/workouts/:id/session',
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: 'Invalid workout ID',
        });
      }

      if (!Array.isArray(req.body?.completed)) {
        return res.status(400).json({
          error: 'completed must be an array',
        });
      }

      const completed = req.body.completed.map(Number);

      if (
        completed.some(
          (exerciseId) =>
            !Number.isInteger(exerciseId) ||
            exerciseId <= 0
        )
      ) {
        return res.status(400).json({
          error:
            'completed must contain valid exercise IDs',
        });
      }

      const workout = await getWorkoutById(id);

      if (!workout) {
        return res.status(404).json({
          error: 'Workout not found',
        });
      }

      res.json(
        await saveWorkoutSession(id, completed)
      );
    } catch (error) {
      next(error);
    }
  }
);

app.use((_req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(
    `Workout Split Builder API running on http://localhost:${port}`
  );
});