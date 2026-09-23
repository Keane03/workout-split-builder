import express from 'express';
import cors from 'cors';
import { listExercises, getExerciseById } from './exercisesRepo.js';
import {
  listWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
} from './workoutsRepo.js';


const app = express();
const port = Number(process.env.PORT || 3000);

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) || '*',
  })
);

app.use(express.json());

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
      return res.status(400).json({ error: 'Invalid exercise ID' });
    }

    const exercise = await getExerciseById(id);

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/workouts/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid workout ID' });
    }

    const deletedWorkout = await deleteWorkout(id);

    if (!deletedWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/api/workouts', async (req, res, next) => {
  try {
    const { name, dayOfWeek } = req.body;

    if (!name || !dayOfWeek) {
      return res.status(400).json({
        error: 'name and dayOfWeek are required',
      });
    }

    const workout = await createWorkout({
      name,
      dayOfWeek,
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
});

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
      return res.status(400).json({ error: 'Invalid workout ID' });
    }

    const workout = await getWorkoutById(id);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Workout Split Builder API running on http://localhost:${port}`);
});
