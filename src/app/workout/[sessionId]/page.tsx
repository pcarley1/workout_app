import { notFound } from "next/navigation";
import { WorkoutPlayer } from "../../../components/WorkoutPlayer";
import { requireAuth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export default async function WorkoutPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  await requireAuth();
  const { sessionId } = await params;
  const session = await prisma.workoutSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      length: true,
      recommendationText: true,
      exerciseLogs: {
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          title: true,
          prescription: true,
          category: true,
          plannedMinutes: true,
          sets: true,
          setLogs: { orderBy: { setIndex: "asc" }, select: { setIndex: true, reps: true, load: true } },
          exercise: {
            select: {
              id: true,
              defaultSets: true,
              defaultRestSeconds: true,
              setup: true,
              instructions: true,
              feel: true,
              cues: true,
              commonMistakes: true,
              golfBenefit: true,
              regression: true,
              progression: true,
              referenceUrl: true,
              referenceTitle: true,
              tags: true,
              equipment: true
            }
          }
        }
      }
    }
  });

  if (!session) notFound();

  const exerciseLibrary = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true, equipment: true, tags: true, defaultPrescription: true }
  });

  return <WorkoutPlayer exerciseLibrary={exerciseLibrary} session={session} />;
}
