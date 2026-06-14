"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { completeWorkoutSession } from "../lib/actions";
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

export function WorkoutPlayer({ session }: { session: PlayerSession }) {
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState((session.exerciseLogs[0]?.plannedMinutes ?? 0) * 60);
  const [running, setRunning] = useState(false);
  const current = session.exerciseLogs[index];
  const done = index >= session.exerciseLogs.length;

  useEffect(() => {
    if (!running || done) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, done, index]);

  const mmss = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

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
          {index + 1} of {session.exerciseLogs.length}
          </p>
        <h1>{current.title}</h1>
          <p className="prescription">{current.prescription}</p>
          <p className="pill">{current.category}</p>
        <div className="timer">{mmss}</div>
          <div className="button-row player-controls">
            <button type="button" className="icon-button" aria-label="Back 15 seconds" onClick={() => setSecondsLeft((value) => Math.max(0, value - 15))}>
              -15
            </button>
            <button type="button" className="primary-action round-action" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause size={22} /> : <Play size={22} />}
              {running ? "Pause" : "Start"}
            </button>
            <button type="button" className="icon-button" aria-label="Forward 15 seconds" onClick={() => setSecondsLeft((value) => value + 15)}>
              +15
            </button>
          </div>
          <div className="button-row">
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                const previous = Math.max(0, index - 1);
                setRunning(false);
                setIndex(previous);
                setSecondsLeft((session.exerciseLogs[previous]?.plannedMinutes ?? 0) * 60);
              }}
            >
              <StepBack size={18} />
              Previous
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setRunning(false);
                setSecondsLeft((current?.plannedMinutes ?? 0) * 60);
              }}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          <button
            type="button"
              className="primary-action"
            onClick={() => {
              const next = index + 1;
                setRunning(false);
              setIndex(next);
              setSecondsLeft((session.exerciseLogs[next]?.plannedMinutes ?? 0) * 60);
            }}
          >
              Complete
              <StepForward size={18} />
          </button>
        </div>
        </div>
      </section>
    </main>
  );
}
