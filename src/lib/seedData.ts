import type { BaselineResultInput, BaselineTestSeed, ExerciseSeed } from "./types";

export const baselineTests: BaselineTestSeed[] = [
  { slug: "hip-ir-left", name: "Hip Internal Rotation - Left", category: "mobility", side: "left", unit: "degrees", priority: 1 },
  { slug: "hip-ir-right", name: "Hip Internal Rotation - Right", category: "mobility", side: "right", unit: "degrees", priority: 1 },
  { slug: "hip-er-left", name: "Hip External Rotation - Left", category: "mobility", side: "left", unit: "degrees", priority: 3 },
  { slug: "hip-er-right", name: "Hip External Rotation - Right", category: "mobility", side: "right", unit: "degrees", priority: 3 },
  { slug: "t-spine-rotation-left", name: "T-Spine Rotation - Left", category: "mobility", side: "left", unit: "degrees", priority: 1 },
  { slug: "t-spine-rotation-right", name: "T-Spine Rotation - Right", category: "mobility", side: "right", unit: "degrees", priority: 1 },
  { slug: "ankle-dorsiflexion-left", name: "Ankle Dorsiflexion - Left", category: "mobility", side: "left", unit: "inches", priority: 2 },
  { slug: "ankle-dorsiflexion-right", name: "Ankle Dorsiflexion - Right", category: "mobility", side: "right", unit: "inches", priority: 2 },
  { slug: "shoulder-mobility-left", name: "Shoulder Mobility - Left", category: "mobility", side: "left", priority: 4 },
  { slug: "shoulder-mobility-right", name: "Shoulder Mobility - Right", category: "mobility", side: "right", priority: 4 },
  { slug: "single-leg-balance-left", name: "Single-Leg Balance - Left", category: "control", side: "left", unit: "seconds", priority: 3 },
  { slug: "single-leg-balance-right", name: "Single-Leg Balance - Right", category: "control", side: "right", unit: "seconds", priority: 3 },
  { slug: "single-leg-squat-left", name: "Single-Leg Squat Quality - Left", category: "control", side: "left", unit: "rating", priority: 2 },
  { slug: "single-leg-squat-right", name: "Single-Leg Squat Quality - Right", category: "control", side: "right", unit: "rating", priority: 2 },
  { slug: "pelvic-rotation-control", name: "Pelvic Rotation Control", category: "control", side: "center", unit: "rating", priority: 1 },
  { slug: "pelvic-tilt-control", name: "Pelvic Tilt Control", category: "control", side: "center", unit: "rating", priority: 2 },
  { slug: "overhead-reach", name: "Overhead Reach / Lat-Core Position", category: "mobility", side: "center", unit: "rating", priority: 4 },
  { slug: "broad-jump", name: "Broad Jump", category: "power", side: "center", unit: "feet", priority: 3 },
  { slug: "rotational-medball-throw-left", name: "Rotational Medball Throw - Left", category: "power", side: "left", unit: "feet", priority: 2 },
  { slug: "rotational-medball-throw-right", name: "Rotational Medball Throw - Right", category: "power", side: "right", unit: "feet", priority: 2 },
  { slug: "driver-swing-speed", name: "Driver Swing Speed", category: "speed", side: "optional", unit: "mph", priority: 5 },
  { slug: "iron-swing-speed", name: "Iron Swing Speed", category: "speed", side: "optional", unit: "mph", priority: 5 }
];

export const exercises: ExerciseSeed[] = [
  {
    slug: "medball-hip-er-to-ir",
    name: "Medball External to Internal Hip Rotation",
    category: "control",
    bodyFocus: ["hips", "core"],
    swingFocus: ["lead hip rotation", "posture", "shallowing"],
    equipment: ["medball", "open_floor"],
    defaultPrescription: "2 sets x 6 slow reps per side",
    setup: "Hold a medball and rotate from external hip load into controlled internal rotation.",
    cues: ["Move from the hip, not the low back", "Keep pelvis depth", "Finish balanced"],
    commonMistakes: ["Rushing the turn", "Standing up out of posture", "Letting the knee collapse"],
    golfBenefit: "Builds active lead hip internal rotation for a deeper, cleaner downswing pivot.",
    regression: "Perform without load.",
    progression: "Add a pause at end-range internal rotation."
  },
  {
    slug: "dynamic-t-spine-opener",
    name: "Medball Dynamic T-Spine Opener",
    category: "mobility",
    bodyFocus: ["t-spine", "core"],
    swingFocus: ["rotation", "separation", "speed"],
    equipment: ["medball", "open_floor"],
    defaultPrescription: "2 sets x 8 reps per side",
    setup: "Use the medball as a light counterbalance while opening through the upper back.",
    cues: ["Rotate ribs over pelvis", "Breathe out into the open position", "Keep hips quiet"],
    commonMistakes: ["Arching the low back", "Moving only the arms"],
    golfBenefit: "Improves torso rotation without forcing compensation from the low back.",
    regression: "Use bodyweight only.",
    progression: "Add a controlled reach at end range."
  }
];

export function getBaselineCoverage(results: BaselineResultInput[]) {
  const completedSlugs = new Set(
    results.filter((result) => result.status !== "not_tested").map((result) => result.testSlug)
  );
  const completed = baselineTests.filter((test) => completedSlugs.has(test.slug)).length;
  const total = baselineTests.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}
