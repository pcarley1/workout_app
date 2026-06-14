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
          {sessions.length === 0 ? <p>No completed workouts yet.</p> : null}
          {sessions.map((session) => (
            <p key={session.id}>
              {session.focus} - {session.totalDurationMin ?? session.length} min - difficulty{" "}
              {session.difficulty ?? "not rated"}
            </p>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
