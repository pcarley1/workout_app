"use server";

import { redirect } from "next/navigation";
import { BaselineStatus as PrismaBaselineStatus } from "@prisma/client";
import { requireAuth } from "./auth";
import { prisma } from "./db";
import { recommendWorkout } from "./recommendations";
import type { BaselineStatus, Equipment, Intensity, SessionLength, WorkoutFocus } from "./types";

function coerceRating(value: FormDataEntryValue | null, fallback: 1 | 2 | 3 | 4 | 5) {
  const number = Number(value);
  return number >= 1 && number <= 5 ? (number as 1 | 2 | 3 | 4 | 5) : fallback;
}

export async function createWorkoutSession(formData: FormData) {
  await requireAuth();

  const length = Number(formData.get("length")) as SessionLength;
  const focus = String(formData.get("focus")) as WorkoutFocus;
  const intensity = String(formData.get("intensity")) as Intensity;
  const equipment = formData.getAll("equipment").map(String) as Equipment[];
  const energy = coerceRating(formData.get("energy"), 4);
  const soreness = coerceRating(formData.get("soreness"), 2);
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
      status: result.status.toLowerCase() as BaselineStatus
    }))
  });

  const exerciseRows = await prisma.exercise.findMany({
    where: { slug: { in: recommendation.blocks.map((block) => block.exerciseSlug) } }
  });
  const exercisesBySlug = new Map(exerciseRows.map((exercise) => [exercise.slug, exercise]));

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
        create: recommendation.blocks.map((block, index) => {
          const exercise = exercisesBySlug.get(block.exerciseSlug);

          return {
            exerciseId: exercise?.id,
            title: exercise?.name ?? block.title,
            prescription: exercise?.defaultPrescription ?? `${block.minutes} minutes`,
            category: exercise?.category ?? block.category,
            sets: exercise?.defaultSets,
            plannedMinutes: block.minutes,
            orderIndex: index
          };
        })
      }
    }
  });

  redirect(`/workout/${session.id}`);
}

export async function completeWorkoutSession(formData: FormData) {
  await requireAuth();

  const sessionId = String(formData.get("sessionId"));
  const difficulty = Number(formData.get("difficulty"));
  const energyAfter = Number(formData.get("energyAfter"));
  const sorenessAfter = Number(formData.get("sorenessAfter"));
  const rotation = Number(formData.get("rotation"));
  const shallowing = Number(formData.get("shallowing"));
  const posture = Number(formData.get("posture"));
  const speedFeel = Number(formData.get("speedFeel"));
  const totalDurationMin = Number(formData.get("totalDurationMin"));
  const notes = String(formData.get("notes") ?? "");

  await prisma.workoutSession.update({
    where: { id: sessionId },
    data: {
      status: "completed",
      completedAt: new Date(),
      totalDurationMin,
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

export async function saveBaselineResult(formData: FormData) {
  await requireAuth();

  const baselineTestId = String(formData.get("baselineTestId"));
  const status = String(formData.get("status")).toUpperCase() as PrismaBaselineStatus;
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
