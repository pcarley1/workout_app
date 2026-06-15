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
  exerciseSlug: string;
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

const exerciseMeta: Record<string, Omit<WorkoutBlock, "exerciseSlug" | "minutes">> = {
  "90-90-lead-hip-ir-lift-off": { title: "90/90 Lead Hip IR Lift-Off", category: "control" },
  "medball-hip-er-to-ir": { title: "Medball External to Internal Hip Rotation", category: "control" },
  "half-kneeling-t-spine-open-book": { title: "Half-Kneeling T-Spine Open Book", category: "mobility" },
  "weighted-kot-lunge": { title: "Weighted Knee-Over-Toe Lunge", category: "strength" },
  "single-leg-squat-to-box": { title: "Single-Leg Squat to Box", category: "strength" },
  "pelvic-rotation-sticks": { title: "Pelvic Rotation with Club Across Chest", category: "control" },
  "medball-scoop-toss": { title: "Rotational Medball Scoop Toss", category: "power" },
  "band-assisted-shallow-pump": { title: "Band-Assisted Shallow Pump", category: "control" },
  "club-across-hips-depth-turn": { title: "Club-Across-Hips Depth Turn", category: "control" },
  "pallof-press-rotation-resist": { title: "Pallof Press with Rotation Resist", category: "control" },
  "snap-down-to-stick": { title: "Snap Down to Stick", category: "power" },
  "ankle-dorsiflexion-wall-drive": { title: "Ankle Dorsiflexion Wall Drive", category: "mobility" }
};

function block(exerciseSlug: keyof typeof exerciseMeta, minutes: number): WorkoutBlock {
  return { exerciseSlug, minutes, ...exerciseMeta[exerciseSlug] };
}

function trimToLength(blocks: WorkoutBlock[], length: SessionLength) {
  const total = blocks.reduce((sum, item) => sum + item.minutes, 0);
  if (total <= length) return blocks;

  const scale = length / total;
  let remaining = length;
  return blocks.map((item, index) => {
    const minutes = index === blocks.length - 1 ? remaining : Math.max(2, Math.round(item.minutes * scale));
    remaining -= minutes;
    return { ...item, minutes: Math.max(1, minutes) };
  });
}

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
      reason: `Pain flag noted (${input.painFlags.join(", ")}), so today's plan avoids speed work and uses low-threat mobility/control drills.`,
      baselinePrompts,
      blocks: trimToLength([
        block("half-kneeling-t-spine-open-book", 5),
        block("ankle-dorsiflexion-wall-drive", 5),
        block("90-90-lead-hip-ir-lift-off", 5),
        block("pelvic-rotation-sticks", 5)
      ], input.length)
    };
  }

  if (input.soreness >= 4) {
    return {
      adjustedIntensity,
      reason: "High soreness detected, so today's plan emphasizes mobility, positional control, and low-volume rotation work.",
      baselinePrompts,
      blocks: trimToLength([
        block("half-kneeling-t-spine-open-book", 5),
        block("ankle-dorsiflexion-wall-drive", 5),
        block("90-90-lead-hip-ir-lift-off", 6),
        block("pallof-press-rotation-resist", 6)
      ], input.length)
    };
  }

  if (input.focus === "swing_speed") {
    return {
      adjustedIntensity,
      reason: "Swing speed focus selected, so the plan primes mobility, trains fast rotational intent, then reinforces lead-side strength.",
      baselinePrompts,
      blocks: trimToLength([
        block("snap-down-to-stick", 4),
        block("half-kneeling-t-spine-open-book", 4),
        block("medball-scoop-toss", input.length >= 25 ? 7 : 4),
        block("weighted-kot-lunge", input.length >= 40 ? 10 : 5),
        block("single-leg-squat-to-box", input.length >= 40 ? 9 : 5),
        block("90-90-lead-hip-ir-lift-off", 5)
      ], input.length)
    };
  }

  if (input.focus === "posture_shallowing") {
    return {
      adjustedIntensity,
      reason: "Posture and shallowing focus selected, so the plan targets lead-hip IR, pelvic depth, T-spine turn, and transition feel.",
      baselinePrompts,
      blocks: trimToLength([
        block("ankle-dorsiflexion-wall-drive", 4),
        block("90-90-lead-hip-ir-lift-off", 5),
        block("club-across-hips-depth-turn", 5),
        block("band-assisted-shallow-pump", 5),
        block("pallof-press-rotation-resist", input.length >= 25 ? 6 : 3)
      ], input.length)
    };
  }

  if (input.focus === "strength") {
    return {
      adjustedIntensity,
      reason: "Strength focus selected, so the plan builds lead-leg posting, hip hinge support, and anti-rotation control.",
      baselinePrompts,
      blocks: trimToLength([
        block("ankle-dorsiflexion-wall-drive", 4),
        block("weighted-kot-lunge", 7),
        block("single-leg-squat-to-box", 7),
        block("pallof-press-rotation-resist", 6),
        block("pelvic-rotation-sticks", 4)
      ], input.length)
    };
  }

  return {
    adjustedIntensity,
    reason: "Balanced golf fitness selected, so the plan blends hip/T-spine mobility, pelvic control, strength, and a small speed primer.",
    baselinePrompts,
    blocks: trimToLength([
      block("half-kneeling-t-spine-open-book", 4),
      block("90-90-lead-hip-ir-lift-off", 5),
      block("medball-hip-er-to-ir", 5),
      block("single-leg-squat-to-box", 6),
      block("snap-down-to-stick", 4)
    ], input.length)
  };
}
