-- CreateEnum
CREATE TYPE "BaselineStatus" AS ENUM ('NOT_TESTED', 'NEEDS_WORK', 'OKAY', 'STRONG');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "bodyFocus" TEXT[],
    "swingFocus" TEXT[],
    "equipment" TEXT[],
    "defaultPrescription" TEXT NOT NULL,
    "setup" TEXT NOT NULL,
    "cues" TEXT[],
    "commonMistakes" TEXT[],
    "golfBenefit" TEXT NOT NULL,
    "regression" TEXT NOT NULL,
    "progression" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaselineTest" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "unit" TEXT,
    "priority" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaselineTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaselineResult" (
    "id" TEXT NOT NULL,
    "baselineTestId" TEXT NOT NULL,
    "status" "BaselineStatus" NOT NULL,
    "numericValue" DOUBLE PRECISION,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaselineResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "focus" TEXT NOT NULL,
    "intensity" TEXT NOT NULL,
    "adjustedIntensity" TEXT NOT NULL,
    "equipment" TEXT[],
    "energyBefore" INTEGER NOT NULL,
    "sorenessBefore" INTEGER NOT NULL,
    "painFlags" TEXT[],
    "recommendationText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalDurationMin" INTEGER,
    "difficulty" INTEGER,
    "energyAfter" INTEGER,
    "sorenessAfter" INTEGER,
    "notes" TEXT,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExerciseLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "title" TEXT NOT NULL,
    "prescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "plannedMinutes" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "substituted" BOOLEAN NOT NULL DEFAULT false,
    "actualDurationMin" INTEGER,
    "sets" INTEGER,
    "reps" INTEGER,
    "load" DOUBLE PRECISION,
    "notes" TEXT,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExerciseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrengthLog" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "load" DOUBLE PRECISION,
    "rpe" INTEGER,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrengthLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GolfFeelLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "rotation" INTEGER NOT NULL,
    "shallowing" INTEGER NOT NULL,
    "posture" INTEGER NOT NULL,
    "speedFeel" INTEGER NOT NULL,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GolfFeelLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_slug_key" ON "Exercise"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BaselineTest_slug_key" ON "BaselineTest"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GolfFeelLog_sessionId_key" ON "GolfFeelLog"("sessionId");

-- AddForeignKey
ALTER TABLE "BaselineResult" ADD CONSTRAINT "BaselineResult_baselineTestId_fkey" FOREIGN KEY ("baselineTestId") REFERENCES "BaselineTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseLog" ADD CONSTRAINT "WorkoutExerciseLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseLog" ADD CONSTRAINT "WorkoutExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrengthLog" ADD CONSTRAINT "StrengthLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GolfFeelLog" ADD CONSTRAINT "GolfFeelLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
