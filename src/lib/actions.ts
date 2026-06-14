"use server";

import { redirect } from "next/navigation";
import { prisma } from "./db";
import { recommendWorkout } from "./recommendations";
import type { BaselineStatus, Equipment, Intensity, SessionLength, WorkoutFocus } from "./types";

function coerceRating(value: FormDataEntryValue | null, fallback: 1 | 2 | 3 | 4 | 5) {
  const number = Number(value);
  return number >= 1 && number <= 5 ? (number as 1 | 2 | 3 | 4 | 5) : fallback;
}

export async function createWorkoutSession(formData: FormData) {
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
