import { describe, expect, it } from "vitest";
import { summarizeProgress } from "../lib/progress";

describe("summarizeProgress", () => {
  it("summarizes workouts, minutes, and average golf feel", () => {
    const summary = summarizeProgress([
      { totalDurationMin: 25, difficulty: 3, golfFeelLog: { rotation: 4, shallowing: 3, posture: 4, speedFeel: 3 } },
      { totalDurationMin: 40, difficulty: 4, golfFeelLog: { rotation: 5, shallowing: 4, posture: 4, speedFeel: 4 } }
    ]);

    expect(summary.workoutsCompleted).toBe(2);
    expect(summary.trainingMinutes).toBe(65);
    expect(summary.averageRotation).toBe(4.5);
    expect(summary.averageDifficulty).toBe(3.5);
  });
});
