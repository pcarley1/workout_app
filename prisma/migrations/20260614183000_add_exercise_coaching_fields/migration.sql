ALTER TABLE "Exercise"
  ADD COLUMN "instructions" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "feel" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "referenceUrl" TEXT,
  ADD COLUMN "referenceTitle" TEXT;
