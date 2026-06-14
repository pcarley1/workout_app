"use client";

import { useMemo, useState } from "react";
import { completeWorkoutSession } from "../lib/actions";

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
  const current = session.exerciseLogs[index];
  const done = index >= session.exerciseLogs.length;

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
        <form action={completeWorkoutSession} className="panel">
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
          <button type="submit">Save workout</button>
        </form>
      </main>
    );
  }

  return (
    <main className="page player">
      <p>{session.recommendationText}</p>
      <section className="panel">
        <p>
          {index + 1} of {session.exerciseLogs.length}
        </p>
        <h1>{current.title}</h1>
        <p>{current.prescription}</p>
        <p>{current.category}</p>
        <div className="timer">{mmss}</div>
        <div className="button-row">
          <button type="button" onClick={() => setSecondsLeft((value) => Math.max(0, value - 15))}>
            -15s
          </button>
          <button type="button" onClick={() => setSecondsLeft((value) => value + 15)}>
            +15s
          </button>
          <button
            type="button"
            onClick={() => {
              const previous = Math.max(0, index - 1);
              setIndex(previous);
              setSecondsLeft((session.exerciseLogs[previous]?.plannedMinutes ?? 0) * 60);
            }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => {
              const next = index + 1;
              setIndex(next);
              setSecondsLeft((session.exerciseLogs[next]?.plannedMinutes ?? 0) * 60);
            }}
          >
            Complete / next
          </button>
        </div>
      </section>
    </main>
  );
}
