import { describe, expect, it } from "vitest";
import { baselineTests, getBaselineCoverage } from "../lib/seedData";

describe("baseline seed data", () => {
  it("includes a flexible golf baseline with side-specific tests", () => {
    const slugs = baselineTests.map((test) => test.slug);

    expect(slugs).toContain("hip-ir-left");
    expect(slugs).toContain("hip-ir-right");
    expect(slugs).toContain("t-spine-rotation-left");
    expect(slugs).toContain("ankle-dorsiflexion-right");
    expect(slugs).toContain("rotational-medball-throw-left");
  });

  it("computes baseline completion without requiring all tests", () => {
    const coverage = getBaselineCoverage([
      { testSlug: "hip-ir-left", status: "needs_work" },
      { testSlug: "hip-ir-right", status: "okay" }
    ]);

    expect(coverage.completed).toBe(2);
    expect(coverage.total).toBeGreaterThan(10);
    expect(coverage.percent).toBeGreaterThan(0);
    expect(coverage.percent).toBeLessThan(100);
  });
});
