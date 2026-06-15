CREATE TABLE "WorkoutSetLog" (
  "id" TEXT NOT NULL,
  "exerciseLogId" TEXT NOT NULL,
  "setIndex" INTEGER NOT NULL,
  "reps" INTEGER,
  "load" DOUBLE PRECISION,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WorkoutSetLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WorkoutSetLog_exerciseLogId_setIndex_key" ON "WorkoutSetLog"("exerciseLogId", "setIndex");

ALTER TABLE "WorkoutSetLog" ADD CONSTRAINT "WorkoutSetLog_exerciseLogId_fkey" FOREIGN KEY ("exerciseLogId") REFERENCES "WorkoutExerciseLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
