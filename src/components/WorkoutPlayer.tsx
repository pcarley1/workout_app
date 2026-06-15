"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { completeWorkoutSession, logWorkoutSet } from "../lib/actions";
import { SubmitButton } from "./SubmitButton";

type PlayerSession = {
  id: string;
  length: number;
  recommendationText: string;
  exerciseLogs: Array<{
    id: string;
    title: string;
    prescription: string;
    category: string;
    plannedMinutes: number;
    sets: number | null;
    setLogs: Array<{ setIndex: number; reps: number | null; load: number | null }>;
    exercise: {
      defaultSets: number;
      defaultRestSeconds: number;
      setup: string;
      instructions: string[];
      feel: string;
      cues: string[];
      commonMistakes: string[];
      golfBenefit: string;
      regression: string;
      progression: string;
      referenceUrl: string | null;
      referenceTitle: string | null;
    } | null;
  }>;
};

const summaryFields = [
  ["difficulty", "Difficulty"],
  ["energyAfter", "Energy after"],
  ["sorenessAfter", "Soreness after"],
  ["rotation", "Ease of rotation"],
  ["shallowing", "Ease of shallowing"],
  ["posture", "Posture feel"],
  ["speedFeel", "Speed feel"]
] as const;

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function nextSetNumber(loggedSets: Array<{ setIndex: number }>, totalSets: number) {
  const logged = new Set(loggedSets.map((set) => set.setIndex));
  for (let set = 1; set <= totalSets; set += 1) {
    if (!logged.has(set)) return set;
  }
  return totalSets;
}

export function WorkoutPlayer({ session }: { session: PlayerSession }) {
  const [index, setIndex] = useState(0);
  const current = session.exerciseLogs[index];
  const done = index >= session.exerciseLogs.length;
  const totalSets = Math.max(1, current?.sets ?? current?.exercise?.defaultSets ?? 1);
  const restSeconds = current?.exercise?.defaultRestSeconds ?? 45;
  const [setNumber, setSetNumber] = useState(() => nextSetNumber(session.exerciseLogs[0]?.setLogs ?? [], totalSets));
  const [resting, setResting] = useState(false);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(restSeconds);
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const nextExercise = session.exerciseLogs[index];
    const nextTotalSets = Math.max(1, nextExercise?.sets ?? nextExercise?.exercise?.defaultSets ?? 1);
    setSetNumber(nextSetNumber(nextExercise?.setLogs ?? [], nextTotalSets));
    setResting(false);
    setRunning(false);
    setSecondsLeft(nextExercise?.exercise?.defaultRestSeconds ?? 45);
    setReps("");
    setLoad("");
  }, [index, session.exerciseLogs]);

  useEffect(() => {
    if (!running || !resting || done) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          setResting(false);
          setSetNumber((currentSet) => Math.min(totalSets, currentSet + 1));
          setReps("");
          return restSeconds;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, resting, done, totalSets, restSeconds]);

  const mmss = useMemo(() => formatSeconds(secondsLeft), [secondsLeft]);
  const loadApplicable = current ? ["strength", "power"].includes(current.category) : false;

  function goToExercise(nextIndex: number) {
    setRunning(false);
    setResting(false);
    setSetNumber(1);
    setReps("");
    setLoad("");
    setIndex(Math.max(0, nextIndex));
  }

  function skipRest() {
    setRunning(false);
    setResting(false);
    setSecondsLeft(restSeconds);
    setSetNumber((currentSet) => Math.min(totalSets, currentSet + 1));
    setReps("");
  }

  function logSetAndContinue() {
    const formData = new FormData();
    formData.set("exerciseLogId", current.id);
    formData.set("setIndex", String(setNumber));
    formData.set("reps", reps);
    formData.set("load", load);
    startTransition(() => {
      void logWorkoutSet(formData);
    });

    if (setNumber >= totalSets) {
      goToExercise(index + 1);
      return;
    }

    setResting(true);
    setRunning(true);
    setSecondsLeft(restSeconds);
  }

  if (done) {
    return (
      <main className="page">
        <form action={completeWorkoutSession} className="panel summary-panel">
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="totalDurationMin" value={session.length} />
          <h1>Workout summary</h1>
          {summaryFields.map(([field, label]) => (
            <label key={field}>
              {label}
              <input name={field} type="number" min="1" max="5" defaultValue="3" />
            </label>
          ))}
          <label>
            Notes
            <textarea name="notes" />
          </label>
          <SubmitButton className="primary-action" pendingLabel="Saving...">
            Save workout
          </SubmitButton>
        </form>
      </main>
    );
  }

  return (
    <main className="page player">
      <section className="player-shell">
        <p className="eyebrow">Guided session</p>
        <p className="muted">{session.recommendationText}</p>
        <div className="player-card">
          <p className="step-count">
            Exercise {index + 1} of {session.exerciseLogs.length}
          </p>
          <h1>{current.title}</h1>
          <p className="prescription">{current.prescription}</p>
          <div className="button-row set-row">
            <p className="pill">Set {setNumber} of {totalSets}</p>
            <p className="pill">Rest {formatSeconds(restSeconds)}</p>
            <p className="pill">{current.category}</p>
          </div>
          {current.exercise ? (
            <div className="exercise-coaching">
              <p>{current.exercise.setup}</p>
              <div className="coaching-grid">
                <section>
                  <h2>How to do it</h2>
                  <ol>
                    {current.exercise.instructions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h2>Feel</h2>
                  <p>{current.exercise.feel}</p>
                  <h2>Cues</h2>
                  <ul>
                    {current.exercise.cues.map((cue) => (
                      <li key={cue}>{cue}</li>
                    ))}
                  </ul>
                </section>
              </div>
              <details>
                <summary>Why it matters / mistakes</summary>
                <p>{current.exercise.golfBenefit}</p>
                <ul>
                  {current.exercise.commonMistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
                <p><strong>Regression:</strong> {current.exercise.regression}</p>
                <p><strong>Progression:</strong> {current.exercise.progression}</p>
                {current.exercise.referenceUrl ? (
                  <a href={current.exercise.referenceUrl} target="_blank" rel="noreferrer">
                    {current.exercise.referenceTitle ?? "Reference video"}
                  </a>
                ) : null}
              </details>
            </div>
          ) : null}
          <div className="set-log-panel">
            <label>
              Reps completed
              <input
                inputMode="numeric"
                min="0"
                name="reps"
                placeholder="Optional"
                type="number"
                value={reps}
                onChange={(event) => setReps(event.target.value)}
                disabled={resting}
              />
            </label>
            {loadApplicable ? (
              <label>
                Weight / load
                <input
                  inputMode="decimal"
                  min="0"
                  name="load"
                  placeholder="Optional"
                  step="0.5"
                  type="number"
                  value={load}
                  onChange={(event) => setLoad(event.target.value)}
                  disabled={resting}
                />
              </label>
            ) : null}
          </div>
          <div className="timer-panel">
            <p className="timer-label">{resting ? "Rest started automatically" : "Log this set to start rest"}</p>
            <div className="timer">{resting ? mmss : formatSeconds(restSeconds)}</div>
          </div>
          <div className="button-row player-controls">
            <button
              type="button"
              className="icon-button"
              aria-label="Reduce rest by 15 seconds"
              disabled={!resting}
              onClick={() => setSecondsLeft((value) => Math.max(0, value - 15))}
            >
              -15
            </button>
            <button
              type="button"
              className="primary-action round-action"
              disabled={!resting}
              onClick={() => setRunning((value) => !value)}
            >
              {running ? <Pause size={22} /> : <Play size={22} />}
              {running ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Add 15 seconds rest"
              disabled={!resting}
              onClick={() => setSecondsLeft((value) => value + 15)}
            >
              +15
            </button>
          </div>
          <div className="button-row">
            <button
              type="button"
              className="secondary-action"
              onClick={() => goToExercise(index - 1)}
            >
              <StepBack size={18} />
              Previous
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setRunning(false);
                setResting(false);
                setSecondsLeft(restSeconds);
              }}
            >
              <RotateCcw size={18} />
              Reset rest
            </button>
            <button type="button" className="primary-action" onClick={resting ? skipRest : logSetAndContinue}>
              {resting ? "Skip rest" : setNumber >= totalSets ? "Log final set" : "Log set"}
              <StepForward size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
