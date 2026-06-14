import { baselineTests } from "./seedData";
import type { BaselineResultInput, Equipment, Intensity, SessionLength, WorkoutFocus } from "./types";

export type RecommendationInput = {
  length: SessionLength;
  focus: WorkoutFocus;
  equipment: Equipment[];
  intensity: Intensity;
  energy: 1 | 2 | 3 | 4 | 5;
  soreness: 1 | 2 | 3 | 4 | 5;
  painFlags: string[];
  recentHardLowerBody: boolean;
  baselineResults: BaselineResultInput[];
};

export type WorkoutBlock = {
  title: string;
  category: "mobility" | "strength" | "power" | "control" | "recovery" | "warmup";
  minutes: number;
};

export type WorkoutRecommendation = {
  adjustedIntensity: Intensity;
  reason: string;
  baselinePrompts: string[];
  blocks: WorkoutBlock[];
};

export function recommendWorkout(input: RecommendationInput): WorkoutRecommendation {
  const hasPain = input.painFlags.length > 0;
  const adjustedIntensity: Intensity = hasPain || input.soreness >= 4 || input.energy <= 2 ? "easy" : input.intensity;
  const tested = new Set(
    input.baselineResults.filter((result) => result.status !== "not_tested").map((result) => result.testSlug)
  );
  const baselinePrompts = baselineTests
    .filter((test) => test.priority <= 2 && !tested.has(test.slug))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4)
    .map((test) => test.slug);

  if (hasPain) {
    return {
      adjustedIntensity,
      reason: `Pain flag noted (${input.painFlags.join(", ")}), so today's plan avoids power work and keeps intensity low.`,
      baselinePrompts,
      blocks: [
        { title: "Breathing reset and gentle rotation", category: "recovery", minutes: 5 },
        { title: "Hip and T-spine mobility", category: "mobility", minutes: Math.max(8, input.length - 10) },
        { title: "Easy control finisher", category: "control", minutes: 5 }
      ]
    };
  }

  if (input.soreness >= 4) {
    return {
      adjustedIntensity,
      reason: "High soreness detected, so today's plan emphasizes recovery, mobility, and low-volume control.",
      baselinePrompts,
      blocks: [
        { title: "Warmup reset", category: "warmup", minutes: 4 },
        { title: "Hips, ankles, and T-spine mobility", category: "mobility", minutes: input.length - 8 },
        { title: "Low-intensity posture control", category: "control", minutes: 4 }
      ]
    };
  }

  if (input.focus === "swing_speed") {
    return {
      adjustedIntensity,
      reason: "Swing speed focus selected with acceptable readiness, so the plan blends mobility, rotational power, and strength.",
      baselinePrompts,
      blocks: [
        { title: "Dynamic golf warmup", category: "warmup", minutes: 5 },
        { title: "Rotational medball speed", category: "power", minutes: input.length >= 25 ? 8 : 5 },
        { title: "Lead-leg strength and posting", category: "strength", minutes: input.length >= 40 ? 18 : input.length >= 25 ? 8 : 5 },
        { title: "Hip IR control cooldown", category: "control", minutes: 5 }
      ]
    };
  }

  return {
    adjustedIntensity,
    reason: "Balanced golf fitness selected, so the plan covers mobility, control, and strength.",
    baselinePrompts,
    blocks: [
      { title: "Golf mobility warmup", category: "warmup", minutes: 4 },
      { title: "Hip IR and T-spine control", category: "control", minutes: Math.floor(input.length / 2) },
      { title: "Single-leg strength", category: "strength", minutes: input.length - 4 - Math.floor(input.length / 2) }
    ]
  };
}
