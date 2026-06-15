export type SessionLength = 15 | 25 | 40;

export type WorkoutFocus =
  | "swing_speed"
  | "mobility"
  | "strength"
  | "recovery"
  | "posture_shallowing"
  | "balanced";

export type Intensity = "easy" | "normal" | "push";
export type BaselineStatus = "not_tested" | "needs_work" | "okay" | "strong";

export type Equipment =
  | "bodyweight"
  | "medball"
  | "dumbbells"
  | "bands"
  | "bench"
  | "golf_club"
  | "open_floor";

export type BaselineTestSeed = {
  slug: string;
  name: string;
  category: "mobility" | "control" | "power" | "speed" | "golf_feel";
  side: "left" | "right" | "center" | "optional";
  unit?: "degrees" | "inches" | "seconds" | "mph" | "feet" | "rating";
  priority: number;
};

export type BaselineResultInput = {
  testSlug: string;
  status: BaselineStatus;
};

export type ExerciseSeed = {
  slug: string;
  name: string;
  category: "mobility" | "strength" | "power" | "control" | "recovery" | "warmup";
  bodyFocus: string[];
  swingFocus: string[];
  equipment: Equipment[];
  defaultPrescription: string;
  setup: string;
  instructions: string[];
  feel: string;
  cues: string[];
  commonMistakes: string[];
  golfBenefit: string;
  regression: string;
  progression: string;
  tags: string[];
  referenceUrl?: string;
  referenceTitle?: string;
};
