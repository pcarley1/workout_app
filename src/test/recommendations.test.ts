import { describe, expect, it } from "vitest";
import { recommendWorkout } from "../lib/recommendations";

describe("recommendWorkout", () => {
  it("returns a workout even when baseline data is missing", () => {
    const recommendation = recommendWorkout({
      length: 15,
      focus: "posture_shallowing",
      equipment: ["bodyweight", "medball"],
      intensity: "normal",
      energy: 4,
      soreness: 2,
      painFlags: [],
      recentHardLowerBody: false,
      baselineResults: []
    });

    expect(recommendation.blocks.length).toBeGreaterThan(0);
    expect(recommendation.baselinePrompts).toContain("hip-ir-left");
  });

  it("biases toward recovery when soreness is high", () => {
    const recommendation = recommendWorkout({
      length: 25,
      focus: "swing_speed",
      equipment: ["bodyweight", "medball"],
      intensity: "push",
      energy: 3,
      soreness: 5,
      painFlags: [],
      recentHardLowerBody: false,
      baselineResults: []
    });

    expect(recommendation.adjustedIntensity).toBe("easy");
    expect(recommendation.reason).toMatch(/soreness/i);
  });

  it("avoids power emphasis when pain is flagged", () => {
    const recommendation = recommendWorkout({
      length: 40,
      focus: "swing_speed",
      equipment: ["medball"],
      intensity: "push",
      energy: 5,
      soreness: 1,
      painFlags: ["left hip"],
      recentHardLowerBody: false,
      baselineResults: []
    });

    expect(recommendation.blocks.some((block) => block.category === "power")).toBe(false);
    expect(recommendation.reason).toMatch(/pain/i);
  });
});
