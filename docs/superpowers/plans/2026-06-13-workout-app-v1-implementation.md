# Workout App V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private single-user golf fitness web app with guided daily workouts, Postgres-backed logging, flexible baseline tests, and progress tracking.

**Architecture:** Use a Next.js App Router application with TypeScript, server actions for mutations, Prisma for Postgres persistence, and focused domain modules for recommendation logic, seed data, baseline scoring, and progress aggregation. The UI is a responsive app shell with three primary sections: Today, Baseline, and Progress.

**Tech Stack:** Next.js, TypeScript, React, Prisma, Postgres, Vitest, Testing Library, Railway, GitHub.

---

## File Structure

Create the app in the repo root.

- `package.json`: scripts and dependencies.
- `next.config.ts`: standalone output for Railway.
- `tsconfig.json`: TypeScript configuration.
- `vitest.config.ts`: unit test configuration.
- `.env.example`: required environment variables.
- `prisma/schema.prisma`: Postgres schema.
- `prisma/seed.ts`: exercise and baseline seed runner.
- `src/app/layout.tsx`: root layout.
- `src/app/page.tsx`: Today screen.
- `src/app/login/page.tsx`: shared password screen.
- `src/app/baseline/page.tsx`: baseline dashboard.
- `src/app/progress/page.tsx`: progress dashboard.
- `src/app/workout/[sessionId]/page.tsx`: guided player.
- `src/app/globals.css`: app styles.
- `src/components/AppShell.tsx`: protected navigation shell.
- `src/components/TodayForm.tsx`: workout option form.
- `src/components/WorkoutPlayer.tsx`: guided exercise player.
- `src/components/BaselineTestCard.tsx`: baseline update UI.
- `src/components/ProgressSummary.tsx`: progress cards and trends.
- `src/lib/auth.ts`: shared password and session cookie helpers.
- `src/lib/db.ts`: Prisma client singleton.
- `src/lib/actions.ts`: server actions for login, session creation, workout completion, baseline updates.
- `src/lib/recommendations.ts`: rule-based workout selection.
- `src/lib/progress.ts`: progress aggregation.
- `src/lib/seedData.ts`: exercise, baseline, and workout template seed data.
- `src/lib/types.ts`: shared domain types.
- `src/test/recommendations.test.ts`: recommendation behavior tests.
- `src/test/baseline.test.ts`: baseline completion tests.
- `src/test/auth.test.ts`: shared password helper tests.
- `src/test/progress.test.ts`: progress aggregation tests.
- `docs/superpowers/plans/2026-06-13-workout-app-v1-implementation.md`: this plan.

## Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Create project files**

Write `package.json`:

```json
{
  "name": "workout-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.16.0",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.1",
    "prisma": "^5.22.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Write `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone"
};

export default nextConfig;
```

Write `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/workout_app"
APP_PASSWORD="change-me"
SESSION_SECRET="replace-with-a-long-random-string"
```

- [ ] **Step 2: Create minimal app shell**

Write `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golf Workout",
  description: "Private golf fitness workout tracker"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Write `src/app/page.tsx`:

```tsx
export default function TodayPage() {
  return (
    <main className="page">
      <h1>Today</h1>
      <p>Choose a golf-focused workout and get moving.</p>
    </main>
  );
}
```

Write `src/app/globals.css`:

```css
:root {
  color-scheme: light;
  --bg: #f7f4ee;
  --surface: #ffffff;
  --ink: #1f2722;
  --muted: #66736b;
  --line: #d9ded7;
  --accent: #2f6f5e;
  --accent-2: #c45a35;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
}

.page {
  width: min(1120px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 32px 0;
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Verify build skeleton**

Run:

```bash
npm run build
```

Expected: Next.js build succeeds.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json vitest.config.ts .gitignore .env.example src/app
git commit -m "chore: scaffold Next.js app"
```

## Task 2: Add Domain Types and Seed Data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/seedData.ts`
- Create: `src/test/baseline.test.ts`

- [ ] **Step 1: Write baseline seed test**

Write `src/test/baseline.test.ts`:

```ts
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
```

- [ ] **Step 2: Run failing test**

Run:

```bash
npm test -- src/test/baseline.test.ts
```

Expected: FAIL because `src/lib/seedData.ts` does not exist.

- [ ] **Step 3: Implement domain types and seed data**

Write `src/lib/types.ts`:

```ts
export type SessionLength = 15 | 25 | 40;
export type WorkoutFocus = "swing_speed" | "mobility" | "strength" | "recovery" | "posture_shallowing" | "balanced";
export type Intensity = "easy" | "normal" | "push";
export type BaselineStatus = "not_tested" | "needs_work" | "okay" | "strong";
export type Equipment = "bodyweight" | "medball" | "dumbbells" | "bands" | "bench" | "golf_club" | "open_floor";

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
  cues: string[];
  commonMistakes: string[];
  golfBenefit: string;
  regression: string;
  progression: string;
};
```

Write `src/lib/seedData.ts`:

```ts
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
  const completedSlugs = new Set(results.filter((result) => result.status !== "not_tested").map((result) => result.testSlug));
  const completed = baselineTests.filter((test) => completedSlugs.has(test.slug)).length;
  const total = baselineTests.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}
```

- [ ] **Step 4: Run test**

Run:

```bash
npm test -- src/test/baseline.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/seedData.ts src/test/baseline.test.ts
git commit -m "feat: add golf baseline and exercise seeds"
```

## Task 3: Add Rule-Based Recommendation Engine

**Files:**
- Create: `src/lib/recommendations.ts`
- Create: `src/test/recommendations.test.ts`

- [ ] **Step 1: Write failing recommendation tests**

Write `src/test/recommendations.test.ts`:

```ts
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
    expect(recommendation.baselinePrompts.length).toContain("hip-ir-left");
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
```

- [ ] **Step 2: Run failing test**

Run:

```bash
npm test -- src/test/recommendations.test.ts
```

Expected: FAIL because `src/lib/recommendations.ts` does not exist.

- [ ] **Step 3: Implement recommendation logic**

Write `src/lib/recommendations.ts`:

```ts
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
  const tested = new Set(input.baselineResults.filter((result) => result.status !== "not_tested").map((result) => result.testSlug));
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
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test -- src/test/recommendations.test.ts src/test/baseline.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/recommendations.ts src/test/recommendations.test.ts
git commit -m "feat: add workout recommendation rules"
```

## Task 4: Add Prisma Schema and Seed Runner

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`

- [ ] **Step 1: Create Prisma schema**

Write `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum BaselineStatus {
  NOT_TESTED
  NEEDS_WORK
  OKAY
  STRONG
}

model Exercise {
  id                  String               @id @default(cuid())
  slug                String               @unique
  name                String
  category            String
  bodyFocus           String[]
  swingFocus          String[]
  equipment           String[]
  defaultPrescription String
  setup               String
  cues                String[]
  commonMistakes      String[]
  golfBenefit         String
  regression          String
  progression         String
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  logs                WorkoutExerciseLog[]
  strengthLogs        StrengthLog[]
}

model BaselineTest {
  id        String           @id @default(cuid())
  slug      String           @unique
  name      String
  category  String
  side      String
  unit      String?
  priority  Int
  results   BaselineResult[]
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}

model BaselineResult {
  id           String         @id @default(cuid())
  baselineTest BaselineTest   @relation(fields: [baselineTestId], references: [id])
  baselineTestId String
  status       BaselineStatus
  numericValue Float?
  notes        String?
  recordedAt   DateTime       @default(now())
}

model WorkoutSession {
  id                 String               @id @default(cuid())
  length             Int
  focus              String
  intensity          String
  adjustedIntensity  String
  equipment          String[]
  energyBefore       Int
  sorenessBefore     Int
  painFlags          String[]
  recommendationText String
  status             String               @default("planned")
  startedAt          DateTime             @default(now())
  completedAt        DateTime?
  totalDurationMin   Int?
  difficulty         Int?
  energyAfter        Int?
  sorenessAfter      Int?
  notes              String?
  exerciseLogs       WorkoutExerciseLog[]
  golfFeelLog        GolfFeelLog?
}

model WorkoutExerciseLog {
  id               String         @id @default(cuid())
  session          WorkoutSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId        String
  exercise         Exercise?      @relation(fields: [exerciseId], references: [id])
  exerciseId       String?
  title            String
  prescription     String
  category         String
  plannedMinutes   Int
  completed        Boolean        @default(false)
  skipped          Boolean        @default(false)
  substituted      Boolean        @default(false)
  actualDurationMin Int?
  sets             Int?
  reps             Int?
  load             Float?
  notes            String?
  orderIndex       Int
}

model StrengthLog {
  id         String    @id @default(cuid())
  exercise   Exercise  @relation(fields: [exerciseId], references: [id])
  exerciseId String
  sets       Int
  reps       Int
  load       Float?
  rpe        Int?
  notes      String?
  recordedAt DateTime  @default(now())
}

model GolfFeelLog {
  id          String         @id @default(cuid())
  session     WorkoutSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId   String         @unique
  rotation    Int
  shallowing  Int
  posture     Int
  speedFeel   Int
  notes       String?
  recordedAt  DateTime       @default(now())
}
```

- [ ] **Step 2: Add Prisma client and seed script**

Write `src/lib/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Write `prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";
import { baselineTests, exercises } from "../src/lib/seedData";

const prisma = new PrismaClient();

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      create: exercise,
      update: exercise
    });
  }

  for (const test of baselineTests) {
    await prisma.baselineTest.upsert({
      where: { slug: test.slug },
      create: test,
      update: test
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 3: Generate initial migration**

Run:

```bash
npm run db:generate
npm run db:migrate -- --name init
```

Expected: Prisma client generated and `prisma/migrations/.../migration.sql` created.

- [ ] **Step 4: Run seed**

Run:

```bash
npm run db:seed
```

Expected: seed exits without error.

- [ ] **Step 5: Commit**

```bash
git add prisma src/lib/db.ts package.json package-lock.json
git commit -m "feat: add database schema and seeds"
```

## Task 5: Add Shared Password Auth

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/login/page.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/test/auth.test.ts`

- [ ] **Step 1: Write auth helper tests**

Write `src/test/auth.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isPasswordValid } from "../lib/auth";

describe("isPasswordValid", () => {
  it("accepts the configured password", async () => {
    expect(await isPasswordValid("secret", "secret")).toBe(true);
  });

  it("rejects incorrect passwords", async () => {
    expect(await isPasswordValid("wrong", "secret")).toBe(false);
  });

  it("rejects empty configured passwords", async () => {
    expect(await isPasswordValid("secret", "")).toBe(false);
  });
});
```

- [ ] **Step 2: Run failing auth test**

Run:

```bash
npm test -- src/test/auth.test.ts
```

Expected: FAIL because `src/lib/auth.ts` does not exist.

- [ ] **Step 3: Implement auth helper**

Write `src/lib/auth.ts`:

```ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "workout_app_session";

export async function isPasswordValid(input: string, configured: string | undefined) {
  if (!configured || !input) return false;
  const inputBuffer = Buffer.from(input);
  const configuredBuffer = Buffer.from(configured);
  if (inputBuffer.length !== configuredBuffer.length) return false;
  return timingSafeEqual(inputBuffer, configuredBuffer);
}

function sign(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionValue() {
  const payload = "single-user";
  return `${payload}.${sign(payload)}`;
}

export function isSessionValueValid(value: string | undefined) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  return sign(payload) === signature;
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!isSessionValueValid(session)) {
    redirect("/login");
  }
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}
```

- [ ] **Step 4: Add login page and protect layout**

Write `src/app/login/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { isPasswordValid, setAuthCookie } from "../../lib/auth";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const valid = await isPasswordValid(password, process.env.APP_PASSWORD);
  if (!valid) redirect("/login?error=1");
  await setAuthCookie();
  redirect("/");
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="auth-page">
      <form action={login} className="panel">
        <h1>Golf Workout</h1>
        <p>Enter the app password to continue.</p>
        <input name="password" type="password" placeholder="Password" required />
        {searchParams.error ? <p className="error">That password did not work.</p> : null}
        <button type="submit">Enter</button>
      </form>
    </main>
  );
}
```

Modify protected pages to call `requireAuth()` at the top of each server page, starting with `src/app/page.tsx`:

```tsx
import { requireAuth } from "../lib/auth";

export default async function TodayPage() {
  await requireAuth();

  return (
    <main className="page">
      <h1>Today</h1>
      <p>Choose a golf-focused workout and get moving.</p>
    </main>
  );
}
```

- [ ] **Step 5: Run auth tests and build**

Run:

```bash
npm test -- src/test/auth.test.ts
npm run build
```

Expected: PASS and build succeeds with `APP_PASSWORD` and `SESSION_SECRET` available locally.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts src/app/login src/app/page.tsx src/test/auth.test.ts src/app/globals.css
git commit -m "feat: add shared password auth"
```

## Task 6: Build Today Screen and Session Creation

**Files:**
- Create: `src/components/AppShell.tsx`
- Create: `src/components/TodayForm.tsx`
- Create: `src/lib/actions.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Implement app shell**

Write `src/components/AppShell.tsx`:

```tsx
import Link from "next/link";
import { Activity, BarChart3, ClipboardCheck } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="nav">
        <Link href="/" className="nav-link"><Activity size={18} />Today</Link>
        <Link href="/baseline" className="nav-link"><ClipboardCheck size={18} />Baseline</Link>
        <Link href="/progress" className="nav-link"><BarChart3 size={18} />Progress</Link>
      </nav>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Implement session creation action**

Write `src/lib/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { prisma } from "./db";
import { recommendWorkout } from "./recommendations";
import type { Equipment, Intensity, SessionLength, WorkoutFocus } from "./types";

export async function createWorkoutSession(formData: FormData) {
  const length = Number(formData.get("length")) as SessionLength;
  const focus = String(formData.get("focus")) as WorkoutFocus;
  const intensity = String(formData.get("intensity")) as Intensity;
  const equipment = formData.getAll("equipment").map(String) as Equipment[];
  const energy = Number(formData.get("energy")) as 1 | 2 | 3 | 4 | 5;
  const soreness = Number(formData.get("soreness")) as 1 | 2 | 3 | 4 | 5;
  const painFlags = String(formData.get("painFlags") ?? "")
    .split(",")
    .map((flag) => flag.trim())
    .filter(Boolean);

  const baselineResults = await prisma.baselineResult.findMany({
    include: { baselineTest: true },
    orderBy: { recordedAt: "desc" }
  });

  const recommendation = recommendWorkout({
    length,
    focus,
    equipment,
    intensity,
    energy,
    soreness,
    painFlags,
    recentHardLowerBody: false,
    baselineResults: baselineResults.map((result) => ({
      testSlug: result.baselineTest.slug,
      status: result.status.toLowerCase() as "not_tested" | "needs_work" | "okay" | "strong"
    }))
  });

  const session = await prisma.workoutSession.create({
    data: {
      length,
      focus,
      intensity,
      adjustedIntensity: recommendation.adjustedIntensity,
      equipment,
      energyBefore: energy,
      sorenessBefore: soreness,
      painFlags,
      recommendationText: recommendation.reason,
      exerciseLogs: {
        create: recommendation.blocks.map((block, index) => ({
          title: block.title,
          prescription: `${block.minutes} minutes`,
          category: block.category,
          plannedMinutes: block.minutes,
          orderIndex: index
        }))
      }
    }
  });

  redirect(`/workout/${session.id}`);
}
```

- [ ] **Step 3: Implement Today form**

Write `src/components/TodayForm.tsx`:

```tsx
import { createWorkoutSession } from "../lib/actions";

export function TodayForm() {
  return (
    <form action={createWorkoutSession} className="grid-form">
      <label>Length
        <select name="length" defaultValue="25">
          <option value="15">15 minutes</option>
          <option value="25">25 minutes</option>
          <option value="40">40 minutes</option>
        </select>
      </label>
      <label>Focus
        <select name="focus" defaultValue="posture_shallowing">
          <option value="posture_shallowing">Posture / shallowing</option>
          <option value="swing_speed">Swing speed</option>
          <option value="mobility">Mobility</option>
          <option value="strength">Strength</option>
          <option value="recovery">Recovery</option>
          <option value="balanced">Balanced</option>
        </select>
      </label>
      <label>Intensity
        <select name="intensity" defaultValue="normal">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="push">Push</option>
        </select>
      </label>
      <label>Energy
        <input name="energy" type="number" min="1" max="5" defaultValue="4" />
      </label>
      <label>Soreness
        <input name="soreness" type="number" min="1" max="5" defaultValue="2" />
      </label>
      <fieldset>
        <legend>Equipment</legend>
        {["bodyweight", "medball", "dumbbells", "bands", "bench", "golf_club", "open_floor"].map((item) => (
          <label key={item} className="check">
            <input type="checkbox" name="equipment" value={item} defaultChecked={item === "bodyweight" || item === "open_floor"} />
            {item.replace("_", " ")}
          </label>
        ))}
      </fieldset>
      <label>Pain flags
        <input name="painFlags" placeholder="left hip, low back" />
      </label>
      <button type="submit">Start guided workout</button>
    </form>
  );
}
```

- [ ] **Step 4: Wire Today page**

Modify `src/app/page.tsx`:

```tsx
import { AppShell } from "../components/AppShell";
import { TodayForm } from "../components/TodayForm";
import { requireAuth } from "../lib/auth";

export default async function TodayPage() {
  await requireAuth();

  return (
    <AppShell>
      <main className="page">
        <h1>Today</h1>
        <p>Choose your session and the app will bias the workout toward your golf priorities.</p>
        <TodayForm />
      </main>
    </AppShell>
  );
}
```

- [ ] **Step 5: Build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/AppShell.tsx src/components/TodayForm.tsx src/lib/actions.ts src/app/page.tsx src/app/globals.css
git commit -m "feat: add Today workout creation flow"
```

## Task 7: Build Guided Workout Player

**Files:**
- Create: `src/app/workout/[sessionId]/page.tsx`
- Create: `src/components/WorkoutPlayer.tsx`
- Modify: `src/lib/actions.ts`

- [ ] **Step 1: Add completion action**

Append to `src/lib/actions.ts`:

```ts
export async function completeWorkoutSession(formData: FormData) {
  const sessionId = String(formData.get("sessionId"));
  const difficulty = Number(formData.get("difficulty"));
  const energyAfter = Number(formData.get("energyAfter"));
  const sorenessAfter = Number(formData.get("sorenessAfter"));
  const rotation = Number(formData.get("rotation"));
  const shallowing = Number(formData.get("shallowing"));
  const posture = Number(formData.get("posture"));
  const speedFeel = Number(formData.get("speedFeel"));
  const notes = String(formData.get("notes") ?? "");

  await prisma.workoutSession.update({
    where: { id: sessionId },
    data: {
      status: "completed",
      completedAt: new Date(),
      difficulty,
      energyAfter,
      sorenessAfter,
      notes,
      golfFeelLog: {
        upsert: {
          create: { rotation, shallowing, posture, speedFeel, notes },
          update: { rotation, shallowing, posture, speedFeel, notes }
        }
      },
      exerciseLogs: {
        updateMany: {
          where: { sessionId },
          data: { completed: true }
        }
      }
    }
  });

  redirect("/progress");
}
```

- [ ] **Step 2: Implement workout route**

Write `src/app/workout/[sessionId]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { WorkoutPlayer } from "../../../components/WorkoutPlayer";
import { requireAuth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export default async function WorkoutPage({ params }: { params: { sessionId: string } }) {
  await requireAuth();
  const session = await prisma.workoutSession.findUnique({
    where: { id: params.sessionId },
    include: { exerciseLogs: { orderBy: { orderIndex: "asc" } } }
  });

  if (!session) notFound();

  return <WorkoutPlayer session={session} />;
}
```

- [ ] **Step 3: Implement player component**

Write `src/components/WorkoutPlayer.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { completeWorkoutSession } from "../lib/actions";

type PlayerSession = {
  id: string;
  recommendationText: string;
  exerciseLogs: Array<{
    id: string;
    title: string;
    prescription: string;
    category: string;
    plannedMinutes: number;
  }>;
};

export function WorkoutPlayer({ session }: { session: PlayerSession }) {
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(session.exerciseLogs[0]?.plannedMinutes * 60 ?? 0);
  const current = session.exerciseLogs[index];
  const done = index >= session.exerciseLogs.length;

  const mmss = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  if (done) {
    return (
      <main className="page">
        <form action={completeWorkoutSession} className="panel">
          <input type="hidden" name="sessionId" value={session.id} />
          <h1>Workout summary</h1>
          {["difficulty", "energyAfter", "sorenessAfter", "rotation", "shallowing", "posture", "speedFeel"].map((field) => (
            <label key={field}>{field}
              <input name={field} type="number" min="1" max="5" defaultValue="3" />
            </label>
          ))}
          <label>Notes
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
        <p>{index + 1} of {session.exerciseLogs.length}</p>
        <h1>{current.title}</h1>
        <p>{current.prescription}</p>
        <div className="timer">{mmss}</div>
        <div className="button-row">
          <button type="button" onClick={() => setSecondsLeft((value) => Math.max(0, value - 15))}>-15s</button>
          <button type="button" onClick={() => setSecondsLeft((value) => value + 15)}>+15s</button>
          <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))}>Previous</button>
          <button type="button" onClick={() => {
            const next = index + 1;
            setIndex(next);
            setSecondsLeft(session.exerciseLogs[next]?.plannedMinutes * 60 ?? 0);
          }}>Complete / next</button>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/workout src/components/WorkoutPlayer.tsx src/lib/actions.ts src/app/globals.css
git commit -m "feat: add guided workout player"
```

## Task 8: Build Baseline Screen

**Files:**
- Create: `src/app/baseline/page.tsx`
- Create: `src/components/BaselineTestCard.tsx`
- Modify: `src/lib/actions.ts`

- [ ] **Step 1: Add baseline action**

Append to `src/lib/actions.ts`:

```ts
export async function saveBaselineResult(formData: FormData) {
  const baselineTestId = String(formData.get("baselineTestId"));
  const status = String(formData.get("status")).toUpperCase() as "NOT_TESTED" | "NEEDS_WORK" | "OKAY" | "STRONG";
  const numericRaw = String(formData.get("numericValue") ?? "");
  const notes = String(formData.get("notes") ?? "");

  await prisma.baselineResult.create({
    data: {
      baselineTestId,
      status,
      numericValue: numericRaw ? Number(numericRaw) : null,
      notes
    }
  });

  redirect("/baseline");
}
```

- [ ] **Step 2: Create baseline card**

Write `src/components/BaselineTestCard.tsx`:

```tsx
import { saveBaselineResult } from "../lib/actions";

type Props = {
  test: {
    id: string;
    name: string;
    category: string;
    unit: string | null;
    results: Array<{ status: string; numericValue: number | null; recordedAt: Date }>;
  };
};

export function BaselineTestCard({ test }: Props) {
  const latest = test.results[0];

  return (
    <article className="panel">
      <h2>{test.name}</h2>
      <p>{latest ? `Latest: ${latest.status.toLowerCase().replace("_", " ")}` : "Not tested yet"}</p>
      <form action={saveBaselineResult} className="mini-form">
        <input type="hidden" name="baselineTestId" value={test.id} />
        <select name="status" defaultValue="OKAY">
          <option value="NEEDS_WORK">Needs work</option>
          <option value="OKAY">Okay</option>
          <option value="STRONG">Strong</option>
        </select>
        <input name="numericValue" type="number" step="0.1" placeholder={test.unit ?? "value"} />
        <input name="notes" placeholder="Notes" />
        <button type="submit">Save</button>
      </form>
    </article>
  );
}
```

- [ ] **Step 3: Create baseline page**

Write `src/app/baseline/page.tsx`:

```tsx
import { AppShell } from "../../components/AppShell";
import { BaselineTestCard } from "../../components/BaselineTestCard";
import { requireAuth } from "../../lib/auth";
import { prisma } from "../../lib/db";

export default async function BaselinePage() {
  await requireAuth();
  const tests = await prisma.baselineTest.findMany({
    orderBy: [{ priority: "asc" }, { name: "asc" }],
    include: { results: { orderBy: { recordedAt: "desc" }, take: 3 } }
  });
  const completed = tests.filter((test) => test.results.length > 0).length;
  const percent = tests.length ? Math.round((completed / tests.length) * 100) : 0;

  return (
    <AppShell>
      <main className="page">
        <h1>Baseline</h1>
        <p>{completed} of {tests.length} tests complete ({percent}%). Missing tests help personalize workouts, but they never block training.</p>
        <section className="card-grid">
          {tests.map((test) => <BaselineTestCard key={test.id} test={test} />)}
        </section>
      </main>
    </AppShell>
  );
}
```

- [ ] **Step 4: Build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/baseline src/components/BaselineTestCard.tsx src/lib/actions.ts src/app/globals.css
git commit -m "feat: add flexible baseline tracking"
```

## Task 9: Build Progress Screen

**Files:**
- Create: `src/lib/progress.ts`
- Create: `src/components/ProgressSummary.tsx`
- Create: `src/app/progress/page.tsx`
- Create: `src/test/progress.test.ts`

- [ ] **Step 1: Write progress aggregation test**

Write `src/test/progress.test.ts`:

```ts
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
```

- [ ] **Step 2: Implement progress helper**

Write `src/lib/progress.ts`:

```ts
type SessionForProgress = {
  totalDurationMin: number | null;
  difficulty: number | null;
  golfFeelLog: {
    rotation: number;
    shallowing: number;
    posture: number;
    speedFeel: number;
  } | null;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function summarizeProgress(sessions: SessionForProgress[]) {
  const feelLogs = sessions.map((session) => session.golfFeelLog).filter(Boolean) as NonNullable<SessionForProgress["golfFeelLog"]>[];
  return {
    workoutsCompleted: sessions.length,
    trainingMinutes: sessions.reduce((sum, session) => sum + (session.totalDurationMin ?? 0), 0),
    averageDifficulty: average(sessions.map((session) => session.difficulty).filter((value): value is number => value !== null)),
    averageRotation: average(feelLogs.map((log) => log.rotation)),
    averageShallowing: average(feelLogs.map((log) => log.shallowing)),
    averagePosture: average(feelLogs.map((log) => log.posture)),
    averageSpeedFeel: average(feelLogs.map((log) => log.speedFeel))
  };
}
```

- [ ] **Step 3: Create progress UI**

Write `src/components/ProgressSummary.tsx`:

```tsx
type Summary = {
  workoutsCompleted: number;
  trainingMinutes: number;
  averageDifficulty: number;
  averageRotation: number;
  averageShallowing: number;
  averagePosture: number;
  averageSpeedFeel: number;
};

export function ProgressSummary({ summary }: { summary: Summary }) {
  return (
    <section className="metric-grid">
      <div className="metric"><span>Workouts</span><strong>{summary.workoutsCompleted}</strong></div>
      <div className="metric"><span>Minutes</span><strong>{summary.trainingMinutes}</strong></div>
      <div className="metric"><span>Difficulty</span><strong>{summary.averageDifficulty}</strong></div>
      <div className="metric"><span>Rotation</span><strong>{summary.averageRotation}</strong></div>
      <div className="metric"><span>Shallowing</span><strong>{summary.averageShallowing}</strong></div>
      <div className="metric"><span>Posture</span><strong>{summary.averagePosture}</strong></div>
      <div className="metric"><span>Speed feel</span><strong>{summary.averageSpeedFeel}</strong></div>
    </section>
  );
}
```

Write `src/app/progress/page.tsx`:

```tsx
import { AppShell } from "../../components/AppShell";
import { ProgressSummary } from "../../components/ProgressSummary";
import { requireAuth } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { summarizeProgress } from "../../lib/progress";

export default async function ProgressPage() {
  await requireAuth();
  const sessions = await prisma.workoutSession.findMany({
    where: { status: "completed" },
    orderBy: { completedAt: "desc" },
    include: { golfFeelLog: true },
    take: 25
  });
  const summary = summarizeProgress(sessions);

  return (
    <AppShell>
      <main className="page">
        <h1>Progress</h1>
        <ProgressSummary summary={summary} />
        <section className="panel">
          <h2>Recent workouts</h2>
          {sessions.map((session) => (
            <p key={session.id}>{session.focus} - {session.totalDurationMin ?? session.length} min - difficulty {session.difficulty ?? "not rated"}</p>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test -- src/test/progress.test.ts
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/progress.ts src/components/ProgressSummary.tsx src/app/progress src/test/progress.test.ts src/app/globals.css
git commit -m "feat: add progress dashboard"
```

## Task 10: Polish UI and Railway Readiness

**Files:**
- Modify: `src/app/globals.css`
- Create: `railway.json`
- Modify: `README.md`

- [ ] **Step 1: Add production styles**

Extend `src/app/globals.css` with stable responsive UI classes:

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 12px;
  background: rgba(247, 244, 238, 0.94);
  border-bottom: 1px solid var(--line);
}

.nav-link,
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 14px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

button {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px;
}

.grid-form,
.mini-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  color: var(--muted);
}

input,
select,
textarea {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--ink);
  font: inherit;
}

.card-grid,
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.metric {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
}

.metric span {
  display: block;
  color: var(--muted);
}

.metric strong,
.timer {
  display: block;
  font-size: 2rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}
```

- [ ] **Step 2: Add Railway config**

Write `railway.json`:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK"
  },
  "deploy": {
    "preDeployCommand": "npm run db:deploy && npm run db:seed",
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

- [ ] **Step 3: Add README**

Write `README.md`:

```md
# Workout App

Private single-user golf fitness app for guided workouts, baseline tests, and progress tracking.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `APP_PASSWORD`, and `SESSION_SECRET`.
3. Run `npm install`.
4. Run `npm run db:migrate -- --name init`.
5. Run `npm run db:seed`.
6. Run `npm run dev`.

## Railway

Create a Railway project from the GitHub repo, add Postgres, and expose `DATABASE_URL` to the app service. Add `APP_PASSWORD` and `SESSION_SECRET` as service variables. Railway runs migrations and seeds with the pre-deploy command in `railway.json`.
```

- [ ] **Step 4: Run final local checks**

Run:

```bash
npm test
npm run build
```

Expected: tests pass and production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css railway.json README.md
git commit -m "chore: prepare app for Railway deployment"
```

## Task 11: Manual Verification

**Files:**
- No required edits unless verification finds defects.

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev
```

Expected: app starts on `http://localhost:3000`.

- [ ] **Step 2: Verify private access**

Open `http://localhost:3000`.

Expected:

- Unauthenticated visit redirects to `/login`.
- Wrong password stays on login and shows an error.
- Correct password opens Today.

- [ ] **Step 3: Verify guided player**

From Today:

- Select 15 minutes.
- Select posture/shallowing.
- Select bodyweight and open floor.
- Set energy to 4.
- Set soreness to 2.
- Start workout.

Expected:

- Workout player opens.
- Exercise blocks show in order.
- Timer controls work.
- Complete / next advances through the workout.
- Final summary saves and redirects to Progress.

- [ ] **Step 4: Verify baseline**

Open Baseline and save:

- Hip Internal Rotation - Left: Needs work, numeric value 25.
- T-Spine Rotation - Right: Okay, numeric value 45.

Expected:

- Baseline completion count increases.
- Latest statuses appear on cards.

- [ ] **Step 5: Verify progress**

Open Progress.

Expected:

- Workouts completed increments.
- Training minutes displays a non-zero value.
- Golf feel averages reflect the completed workout.
- Recent workouts list includes the saved session.

- [ ] **Step 6: Final commit if verification fixes were needed**

If defects were fixed:

```bash
git add .
git commit -m "fix: address manual verification issues"
```

If no defects were found, do not create an empty commit.

## Self-Review

- Spec coverage: Today flow, shared password auth, guided player, baseline, progress, Postgres persistence, seed data, Railway deployment, and test coverage are covered.
- Placeholder scan: No task depends on a future undefined step. Implementation snippets define the named files and functions before use.
- Type consistency: Shared union types are introduced in Task 2 and reused by recommendation and action modules. Prisma status enum is upper-case; UI/domain baseline statuses are converted at the server action boundary.
