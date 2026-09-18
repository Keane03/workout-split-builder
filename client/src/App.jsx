import { useEffect, useState } from 'react'
import {
  createWorkout,
  deleteWorkout,
  getProfile,
  getSchedule,
  getWorkoutSession,
  listExercises,
  listWorkouts,
  updateProfile,
  updateSchedule,
  updateWorkout,
  updateWorkoutSession,
} from './api'
import DemoNotice from './components/DemoNotice.jsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const NAV_ITEMS = [
  ['dashboard', 'Dashboard'],
  ['exercises', 'Exercise Library'],
  ['builder', 'Workout Builder'],
  ['schedule', 'Schedule'],
  ['start', 'Start Workout'],
  ['settings', 'Settings'],
]

const EMPTY_WORKOUT = { id: null, name: '', description: '', exercises: [] }

function todayName() {
  const day = new Date().getDay()
  return DAYS[day === 0 ? 6 : day - 1]
}

function estimateMinutes(workout) {
  return workout.exercises.reduce((total, item) => {
    return total + (Number(item.sets) * 45 + Number(item.rest) * Math.max(Number(item.sets) - 1, 0)) / 60
  }, 0)
}

export default function App() {
  const [status, setStatus] = useState('loading')
  const [screen, setScreen] = useState('dashboard')
  const [exercises, setExercises] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [schedule, setSchedule] = useState({})
  const [profile, setProfile] = useState({ name: '' })
  const [sessions, setSessions] = useState({})
  const [error, setError] = useState(null)
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
  const [editingWorkout, setEditingWorkout] = useState(null)

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      const [loadedExercises, loadedWorkouts, loadedSchedule, loadedProfile] = await Promise.all([
        listExercises(), listWorkouts(), getSchedule(), getProfile(),
      ])
      const loadedSessions = {}
      await Promise.all(loadedWorkouts.map(async (workout) => {
        loadedSessions[workout.id] = await getWorkoutSession(workout.id)
      }))
      setExercises(loadedExercises)
      setWorkouts(loadedWorkouts)
      setSchedule(loadedSchedule)
      setProfile(loadedProfile)
      setSessions(loadedSessions)
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const workoutById = (id) => workouts.find((workout) => String(workout.id) === String(id))
  const todayWorkout = workoutById(schedule[todayName()])
  const scheduledWorkouts = DAYS.map((day) => workoutById(schedule[day])).filter(Boolean)
  const completion = scheduledWorkouts.length
    ? Math.round(scheduledWorkouts.reduce((total, workout) => total + (sessions[workout.id]?.completed?.length === workout.exercises.length && workout.exercises.length > 0 ? 1 : 0), 0) / scheduledWorkouts.length * 100)
    : 0

  function openBuilder(workout = EMPTY_WORKOUT) {
    setEditingWorkout({ ...workout, exercises: workout.exercises.map((item) => ({ ...item })) })
    setScreen('builder')
  }

  function addExerciseToBuilder(exercise) {
    const next = editingWorkout || { ...EMPTY_WORKOUT, name: 'New Workout' }
    if (next.exercises.some((item) => item.exerciseId === exercise.id)) return
    setEditingWorkout({
      ...next,
      exercises: [...next.exercises, { exerciseId: exercise.id, sets: 3, reps: 10, rest: 60 }],
    })
    setScreen('builder')
  }

  async function saveWorkout() {
    if (!editingWorkout?.name.trim()) return
    try {
      const payload = { ...editingWorkout, name: editingWorkout.name.trim() }
      const saved = payload.id ? await updateWorkout(payload.id, payload) : await createWorkout(payload)
      setWorkouts(payload.id ? workouts.map((workout) => String(workout.id) === String(saved.id) ? saved : workout) : [...workouts, saved])
      setEditingWorkout(saved)
      setSelectedWorkoutId(saved.id)
      setScreen('builder')
    } catch (caught) {
      setError(caught)
    }
  }

  async function removeWorkout(id) {
    try {
      await deleteWorkout(id)
      setWorkouts(workouts.filter((workout) => String(workout.id) !== String(id)))
      setSchedule(Object.fromEntries(Object.entries(schedule).map(([day, workoutId]) => [day, String(workoutId) === String(id) ? null : workoutId])))
      if (String(editingWorkout?.id) === String(id)) setEditingWorkout(null)
    } catch (caught) {
      setError(caught)
    }
  }

  async function saveSchedule(day, workoutId) {
    const next = { ...schedule, [day]: workoutId || null }
    setSchedule(next)
    try { await updateSchedule(next) } catch (caught) { setError(caught) }
  }

  async function saveProfile(event) {
    event.preventDefault()
    try { setProfile(await updateProfile(profile)) } catch (caught) { setError(caught) }
  }

  if (status === 'loading') return <div className="loading-screen">Loading your training space...</div>
  if (status === 'error') return <div className="loading-screen"><p className="error">{error?.message}</p><button onClick={load}>Try again</button></div>

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">WS</span><span>Workout Split<br /><strong>Builder</strong></span></div>
        <nav aria-label="Main navigation">
          {NAV_ITEMS.map(([key, label]) => <button key={key} className={screen === key ? 'nav-item active' : 'nav-item'} onClick={() => setScreen(key)}><span className="nav-icon">{key === 'dashboard' ? '◼' : key === 'exercises' ? '＋' : key === 'builder' ? '▤' : key === 'schedule' ? '□' : key === 'start' ? '▶' : '⚙'}</span>{label}</button>)}
        </nav>
        <div className="sidebar-foot"><DemoNotice /></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">{screen === 'dashboard' ? 'Your training overview' : NAV_ITEMS.find(([key]) => key === screen)?.[1]}</p><h1>{screen === 'dashboard' ? `Good day, ${profile.name || 'Athlete'}.` : NAV_ITEMS.find(([key]) => key === screen)?.[1]}</h1></div><button className="profile-chip" onClick={() => setScreen('settings')}><span>{(profile.name || 'A').slice(0, 1).toUpperCase()}</span>{profile.name || 'Athlete'}</button></header>
        {error && <p className="error" role="alert">{error.message} <button onClick={() => setError(null)}>Dismiss</button></p>}
        {screen === 'dashboard' && <Dashboard todayWorkout={todayWorkout} today={todayName()} schedule={schedule} workoutById={workoutById} workouts={workouts} completion={completion} onOpen={setScreen} onStart={(id) => { setSelectedWorkoutId(id); setScreen('start') }} />}
        {screen === 'exercises' && <ExerciseLibrary exercises={exercises} onAdd={addExerciseToBuilder} />}
        {screen === 'builder' && <WorkoutBuilder workout={editingWorkout} workouts={workouts} exercises={exercises} onNew={() => openBuilder()} onEdit={openBuilder} onChange={setEditingWorkout} onSave={saveWorkout} onDelete={removeWorkout} onAddExercise={() => setScreen('exercises')} />}
        {screen === 'schedule' && <Schedule days={DAYS} schedule={schedule} workouts={workouts} onChange={saveSchedule} onView={(id) => { setSelectedWorkoutId(id); setScreen('start') }} />}
        {screen === 'start' && <StartWorkout workout={workoutById(selectedWorkoutId) || todayWorkout} exercises={exercises} session={sessions[selectedWorkoutId || todayWorkout?.id] || { completed: [] }} onBack={() => setScreen('dashboard')} onSession={(session) => { const id = selectedWorkoutId || todayWorkout?.id; setSessions({ ...sessions, [id]: session }); updateWorkoutSession(id, session).catch(setError) }} />}
        {screen === 'settings' && <Settings profile={profile} onChange={setProfile} onSave={saveProfile} />}
      </main>
    </div>
  )
}

function Dashboard({ todayWorkout, today, schedule, workoutById, workouts, completion, onOpen, onStart }) {
  return <div className="screen dashboard"><section className="hero-panel"><div><span className="section-kicker">{today} session</span><h2>{todayWorkout?.name || 'Rest and recover'}</h2><p>{todayWorkout ? todayWorkout.description : 'No workout assigned today. Use the schedule to plan your next session.'}</p>{todayWorkout && <button onClick={() => onStart(todayWorkout.id)}>Start workout <span>→</span></button>}</div><div className="hero-stamp"><strong>{todayWorkout ? Math.round(estimateMinutes(todayWorkout)) : '—'}</strong><span>min estimated</span></div></section><div className="stat-grid"><div className="stat-card"><span>Total workouts</span><strong>{workouts.length}</strong><small>in your library</small></div><div className="stat-card"><span>Weekly completion</span><strong>{completion}%</strong><small>scheduled sessions</small></div><div className="stat-card"><span>Planned today</span><strong>{todayWorkout ? '1' : '0'}</strong><small>{todayWorkout ? 'ready to go' : 'rest day'}</small></div></div><section className="dashboard-section"><div className="section-heading"><div><span className="section-kicker">This week</span><h2>Weekly schedule</h2></div><button className="text-button" onClick={() => onOpen('schedule')}>Edit schedule →</button></div><div className="week-strip">{DAYS.map((day) => { const workout = workoutById(schedule[day]); return <button key={day} className={`day-card ${day === today ? 'today' : ''} ${workout ? 'planned' : ''}`} onClick={() => workout && onStart(workout.id)}><span>{day.slice(0, 3)}</span><strong>{workout ? workout.name : 'Rest'}</strong><small>{workout ? `${Math.round(estimateMinutes(workout))} min` : 'Recovery'}</small></button> })}</div></section></div>
}

function ExerciseLibrary({ exercises, onAdd }) {
  const [query, setQuery] = useState('')
  const [muscle, setMuscle] = useState('All')
  const [equipment, setEquipment] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const values = (key) => ['All', ...new Set(exercises.map((exercise) => exercise[key]))]
  const filtered = exercises.filter((exercise) => exercise.name.toLowerCase().includes(query.toLowerCase()) && (muscle === 'All' || exercise.muscleGroup === muscle) && (equipment === 'All' || exercise.equipment === equipment) && (difficulty === 'All' || exercise.difficulty === difficulty))
  return <div className="screen"><div className="toolbar"><input className="search-input" placeholder="Search exercises..." value={query} onChange={(event) => setQuery(event.target.value)} />{[['Muscle group', muscle, setMuscle, 'muscleGroup'], ['Equipment', equipment, setEquipment, 'equipment'], ['Difficulty', difficulty, setDifficulty, 'difficulty']].map(([label, value, setter, key]) => <label className="filter" key={key}>{label}<select value={value} onChange={(event) => setter(event.target.value)}>{values(key).map((option) => <option key={option}>{option}</option>)}</select></label>)}</div><p className="result-count">{filtered.length} exercises available</p><div className="exercise-grid">{filtered.map((exercise) => <article className="exercise-card" key={exercise.id}><div className="exercise-visual">{exercise.name.slice(0, 2).toUpperCase()}</div><div className="exercise-content"><div className="tag-row"><span>{exercise.muscleGroup}</span><span>{exercise.difficulty}</span></div><h2>{exercise.name}</h2><p>{exercise.description}</p><small>{exercise.equipment}</small><button onClick={() => onAdd(exercise)}>Add to workout <span>＋</span></button></div></article>)}</div></div>
}

function WorkoutBuilder({ workout, workouts, exercises, onNew, onEdit, onChange, onSave, onDelete, onAddExercise }) {
  const active = workout || EMPTY_WORKOUT
  const details = active.exercises.map((item, index) => ({ ...item, exercise: exercises.find((exercise) => exercise.id === item.exerciseId), index }))
  function updateExercise(index, field, value) { onChange({ ...active, exercises: active.exercises.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: Number(value) } : item) }) }
  function move(index, direction) { const next = [...active.exercises]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; onChange({ ...active, exercises: next }) }
  return <div className="screen builder-screen"><div className="builder-layout"><section className="builder-panel"><div className="section-heading"><div><span className="section-kicker">Plan your session</span><h2>{active.id ? 'Edit workout' : 'New workout'}</h2></div><button className="secondary-button" onClick={onNew}>＋ New</button></div><label>Workout name<input value={active.name} onChange={(event) => onChange({ ...active, name: event.target.value })} placeholder="e.g. Push day" /></label><label>Description<textarea rows="2" value={active.description} onChange={(event) => onChange({ ...active, description: event.target.value })} placeholder="What is the focus of this session?" /></label><div className="builder-summary"><span>{details.length} exercises</span><strong>{Math.round(estimateMinutes(active))} min estimated</strong></div>{details.length === 0 ? <div className="empty-builder"><strong>Your workout is empty</strong><p>Add exercises from the library to start building.</p><button onClick={onAddExercise}>Browse exercise library →</button></div> : <div className="builder-list">{details.map(({ exercise, index, ...item }) => <div className="builder-exercise" key={`${item.exerciseId}-${index}`}><div className="drag-handle">••</div><div className="builder-exercise-title"><strong>{exercise?.name}</strong><small>{exercise?.muscleGroup} · {exercise?.equipment}</small></div><label>Sets<input type="number" min="1" value={item.sets} onChange={(event) => updateExercise(index, 'sets', event.target.value)} /></label><label>Reps<input type="number" min="1" value={item.reps} onChange={(event) => updateExercise(index, 'reps', event.target.value)} /></label><label>Rest<input type="number" min="0" value={item.rest} onChange={(event) => updateExercise(index, 'rest', event.target.value)} /></label><div className="item-actions"><button title="Move up" onClick={() => move(index, -1)}>↑</button><button title="Move down" onClick={() => move(index, 1)}>↓</button><button title="Remove" onClick={() => onChange({ ...active, exercises: active.exercises.filter((_, itemIndex) => itemIndex !== index) })}>×</button></div></div>)}</div>}<div className="builder-actions"><button onClick={onAddExercise}>＋ Add exercise</button><button className="primary-button" onClick={onSave} disabled={!active.name.trim()}>Save workout</button></div>{active.id && <button className="danger-button" onClick={() => onDelete(active.id)}>Delete this workout</button>}</section><aside className="saved-workouts"><div className="section-heading"><h2>Saved workouts</h2><span>{workouts.length}</span></div>{workouts.map((saved) => <button className={`saved-workout ${saved.id === active.id ? 'selected' : ''}`} key={saved.id} onClick={() => onEdit(saved)}><strong>{saved.name}</strong><small>{saved.exercises.length} exercises · {Math.round(estimateMinutes(saved))} min</small></button>)}</aside></div></div>
}

function Schedule({ days, schedule, workouts, onChange, onView }) {
  return <div className="screen schedule-screen"><p className="lede">Assign a saved workout to each day. Changes are saved in demo mode.</p><div className="schedule-list">{days.map((day) => { const workout = workouts.find((item) => item.id === schedule[day]); return <div className="schedule-row" key={day}><div className="schedule-day"><strong>{day}</strong><small>{day === todayName() ? 'Today' : 'Training plan'}</small></div><select value={schedule[day] || ''} onChange={(event) => onChange(day, event.target.value)}><option value="">Rest day</option>{workouts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{workout && <button className="text-button" onClick={() => onView(workout.id)}>View workout →</button>}</div> })}</div></div>
}

function StartWorkout({ workout, exercises, session, onBack, onSession }) {
  const [restSeconds, setRestSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const completed = session.completed || []
  useEffect(() => { if (!timerRunning) return undefined; const timer = setInterval(() => setRestSeconds((seconds) => { if (seconds <= 1) { setTimerRunning(false); return 0 } return seconds - 1 }), 1000); return () => clearInterval(timer) }, [timerRunning])
  if (!workout) return <div className="screen empty-state"><h2>No workout selected</h2><p>Choose a workout from your dashboard or schedule first.</p><button onClick={onBack}>Back to dashboard</button></div>
  const progress = Math.round(completed.length / workout.exercises.length * 100) || 0
  const toggle = (exerciseId) => onSession({ completed: completed.includes(exerciseId) ? completed.filter((id) => id !== exerciseId) : [...completed, exerciseId] })
  return <div className="screen start-screen"><button className="back-button" onClick={onBack}>← Back</button><section className="start-header"><div><span className="section-kicker">Active workout</span><h2>{workout.name}</h2><p>{workout.description}</p></div><div className="progress-ring"><strong>{progress}%</strong><small>complete</small></div></section><div className="progress-bar"><span style={{ width: `${progress}%` }} /></div><div className="start-grid"><section className="start-exercises"><h2>Exercises <span>{completed.length}/{workout.exercises.length}</span></h2>{workout.exercises.map((item, index) => { const exercise = exercises.find((entry) => entry.id === item.exerciseId); return <div className={`start-exercise ${completed.includes(item.exerciseId) ? 'complete' : ''}`} key={item.exerciseId}><button className="check-button" onClick={() => toggle(item.exerciseId)}>{completed.includes(item.exerciseId) ? '✓' : index + 1}</button><div><strong>{exercise?.name || item.exerciseId}</strong><small>{item.sets} sets × {item.reps} reps · {item.rest}s rest</small></div></div> })}</section><aside className="timer-panel"><span className="section-kicker">Rest timer</span><strong>{String(Math.floor(restSeconds / 60)).padStart(2, '0')}:{String(restSeconds % 60).padStart(2, '0')}</strong><div><button onClick={() => { setRestSeconds(60); setTimerRunning(true) }}>60 sec</button><button onClick={() => { setRestSeconds(90); setTimerRunning(true) }}>90 sec</button></div>{timerRunning && <button className="text-button" onClick={() => setTimerRunning(false)}>Pause timer</button>}</aside></div></div>
}

function Settings({ profile, onChange, onSave }) {
  return <div className="screen settings-screen"><section className="settings-panel"><span className="section-kicker">Personalize your space</span><h2>Profile settings</h2><p className="lede">Your profile name is saved locally while using demo mode.</p><form onSubmit={onSave}><label>Profile name<input value={profile.name} maxLength="40" onChange={(event) => onChange({ ...profile, name: event.target.value })} /></label><button className="primary-button">Save changes</button></form></section></div>
}
