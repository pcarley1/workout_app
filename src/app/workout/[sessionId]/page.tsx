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
    include: { exerciseLogs: { orderBy: { orderIndex: "asc" }, include: { exercise: true } } }
  });

  if (!session) notFound();

  return <WorkoutPlayer session={session} />;
}
