# Workout App V1 Design

Date: 2026-06-13
Repo: pcarley1/workout_app

## Summary

Build a private, single-user golf fitness web app focused on a guided daily workout player, persistent logging, flexible baseline testing, and progress tracking. The app's training bias is improving golf swing speed, rotational capacity, ease of shallowing, posture retention, lead-side rotation, hip internal rotation, T-spine rotation, ankle mobility, and golf-specific strength.

V1 intentionally skips AI suggestions. Recommendation logic is rule-based and deterministic so the app is useful immediately and the logged data stays structured for a future AI coaching layer.

## Goals

- Provide a simple guided workout player that answers "what should I do today?"
- Let the user choose workout options before starting: length, focus, equipment, intensity, energy, soreness, and pain flags.
- Persist all logs in Postgres on Railway.
- Track progress over time through workout completion, training minutes, strength logs, baseline tests, soreness/pain, and golf-feel ratings.
- Include a flexible TPI-inspired baseline assessment. Tests are recommended but never required to receive workout suggestions.
- Keep the app private with one shared app password.

## Non-Goals

- No multi-user accounts in V1.
- No AI-generated workouts in V1.
- No official TPI certification, branding, or clinical diagnosis claims.
- No native iOS or Android app in V1.
- No payment, social sharing, trainer portal, or public program marketplace.

## Product Shape

The app has three main areas:

1. Today
2. Baseline
3. Progress

The default landing screen after authentication is Today.

## Authentication

V1 uses a shared app password.

- Password is stored in an environment variable, for example `APP_PASSWORD`.
- On first visit, the user enters the password.
- A signed session cookie or equivalent server-side session keeps the user authenticated.
- There is no username, registration, password reset, or email flow.
- All app routes except the password screen are protected.

## Today Flow

The Today screen guides workout selection and launch.

Inputs:

- Session length: 15, 25, or 40 minutes.
- Focus: swing speed, mobility, strength, recovery, posture/shallowing, or balanced.
- Equipment: bodyweight, medball, dumbbells, bands, bench, golf club, open floor.
- Intensity: easy, normal, or push.
- Readiness: energy level, soreness level, pain flags, and optional note.

Output:

- A suggested guided workout assembled from seeded routines and exercise blocks.
- A short explanation of why the session was selected.
- A start button that opens the guided workout player.

Missing baseline data never blocks workout creation. If relevant baseline tests are incomplete, the app can show gentle prompts such as "Add ankle mobility when you have 2 minutes."

## Guided Workout Player

The player walks through the session exercise by exercise.

Required behavior:

- Show current exercise, cues, sets/reps or duration, rest time, and golf benefit.
- Include timers for timed movements and rests.
- Allow complete, skip, substitute, previous, and next.
- Allow notes during or after an exercise.
- Log completed exercises, skipped exercises, substitutions, elapsed time, difficulty, and notes.
- End with a workout summary.

Workout completion prompt:

- Session RPE or difficulty.
- Energy after workout.
- Pain/soreness after workout.
- Golf feel ratings, such as ease of rotation, ease of shallowing, posture, and speed feel.
- Freeform notes.

## Exercise Library

Initial exercises are golf-specific and grouped by tags.

Core V1 exercises:

- Medball external to internal hip rotation.
- Medball dynamic T-spine opener.
- Single-leg squat progression.
- Weighted knee-over-toe lunge.
- Isometric internal hip rotation.
- Loaded hip hinge or hamstring strength movement.
- Ankle dorsiflexion mobility.
- Lead-leg posting drill.
- Rotational medball throw progression.
- Core anti-rotation or separation drill.

Exercise fields:

- Name.
- Category: mobility, strength, power, control, recovery, warmup.
- Body focus: hips, T-spine, ankles, lower body, core, shoulders.
- Swing focus: speed, shallowing, posture, rotation, lead-leg post, pressure shift.
- Equipment.
- Default prescription.
- Setup.
- Cues.
- Common mistakes.
- Golf benefit.
- Regression and progression.

## Recommendation Logic

V1 uses rule-based recommendations.

Inputs:

- Selected length, focus, equipment, and intensity.
- Readiness check-in.
- Recent workout history.
- Recent soreness and pain flags.
- Completed baseline tests when available.

Rules:

- Pain flags reduce intensity and avoid aggravating categories.
- High soreness biases recovery, mobility, and lower-volume work.
- Low energy avoids high-volume power sessions.
- Recent hard lower-body sessions reduce lower-body strength loading.
- Missing baseline data adds non-blocking suggestions to complete relevant tests.
- Baseline limitations bias exercise selection. For example, limited lead hip internal rotation increases hip IR mobility and isometric control work.

## Baseline Assessment

The baseline is TPI-inspired and flexible. It supports incomplete coverage.

Each test can be:

- Not tested.
- Needs work.
- Okay.
- Strong.

Where useful, tests can also store numeric values, side-specific values, video/image notes later, and freeform notes.

Initial baseline tests:

- Hip internal rotation, left and right.
- Hip external rotation, left and right.
- T-spine rotation, left and right.
- Ankle dorsiflexion, left and right.
- Shoulder mobility, left and right.
- Single-leg balance, left and right.
- Single-leg squat quality, left and right.
- Pelvic rotation/control.
- Pelvic tilt/control.
- Overhead reach or lat/core position.
- Broad jump or vertical jump.
- Rotational medball throw, left and right.
- Optional driver swing speed.
- Optional iron swing speed.
- Optional golf feel notes.

Baseline screen behavior:

- Show completion coverage.
- Prioritize suggested tests based on app goals and missing data.
- Let the user update one test at a time.
- Show trend history for repeated tests.

## Progress Tracking

Progress is non-negotiable in V1.

Dashboard metrics:

- Workouts completed.
- Training minutes.
- Current weekly consistency.
- Session difficulty trend.
- Soreness and pain trend.
- Baseline completion.
- Baseline improvements over time.
- Strength progress by exercise.
- Golf feel trend: rotation, shallowing, posture, and speed feel.

History views:

- Workout session history.
- Exercise log history.
- Baseline test history.
- Strength movement history.
- Golf feel notes.

## Data Model

Core entities:

- `WorkoutSession`: selected options, started time, completed time, total duration, focus, readiness, completion status, summary ratings, notes.
- `WorkoutExerciseLog`: session id, exercise id, prescription, actual completion, skipped/substituted flags, duration, sets, reps, load, notes.
- `Exercise`: seed library entry with tags, cues, prescriptions, progressions, and regressions.
- `BaselineTest`: seed definition for each assessment.
- `BaselineResult`: test id, date, status, numeric values, side, notes.
- `StrengthLog`: exercise id, date, sets, reps, load, RPE, notes.
- `ReadinessCheckIn`: energy, soreness, pain flags, notes.
- `GolfFeelLog`: date, rotation, shallowing, posture, speed feel, notes.

V1 can keep a single implicit user and does not need a `User` table unless the auth/session implementation benefits from it.

## Technical Architecture

Stack:

- Next.js with TypeScript.
- Postgres on Railway.
- Prisma or Drizzle ORM.
- Server actions or API routes for writes.
- Seed data for exercises, baseline tests, and workout templates.
- Railway deployment from GitHub.

Environment variables:

- `DATABASE_URL`
- `APP_PASSWORD`
- Session signing secret, if needed.

Deployment:

- GitHub repo: `pcarley1/workout_app`.
- Railway service deploys from GitHub.
- Railway Postgres is added to the same project.
- Migrations run during deployment using a Railway pre-deploy command.

## Error Handling

- Failed saves show a clear retryable error and keep the user on the current screen.
- Timer state should avoid losing the current workout if a page refresh happens during V1 where practical.
- Invalid password shows a generic auth failure.
- Missing env vars should fail loudly at startup or during protected actions.
- Empty database after first deploy should be recoverable by running seeds.

## Testing

Minimum test coverage:

- Recommendation rules for readiness, soreness, pain, missing baseline, and focus selection.
- Baseline scoring and incomplete baseline behavior.
- Workout session creation and completion.
- Exercise log persistence.
- Shared password auth guard.

Manual verification:

- Start and complete a 15-minute workout.
- Skip and substitute an exercise.
- Log a baseline test.
- View progress updates after saving logs.
- Confirm unauthenticated users cannot access protected routes.

## Future Expansion

Likely V2 additions:

- AI coaching suggestions based on logs and baselines.
- PWA installability.
- Video references or form demos.
- Real login if multi-device/session management becomes annoying.
- Import swing speed from a device or CSV.
- More detailed periodized programming.
