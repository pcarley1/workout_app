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
        <p className="eyebrow">Training log</p>
        <h1>Progress</h1>
        <ProgressSummary summary={summary} />
        <section className="panel recent-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Recent work</p>
              <h2>Completed sessions</h2>
            </div>
            <span className="pill">{sessions.length} logged</span>
          </div>
          {sessions.length === 0 ? <p>No completed workouts yet.</p> : null}
          <div className="recent-list">
            {sessions.map((session) => (
              <div key={session.id} className="recent-row">
                <div>
                  <strong>{session.focus.replace("_", " ")}</strong>
                  <span>{session.totalDurationMin ?? session.length} min</span>
                </div>
                <div className="recent-meta">
                  <span>Difficulty {session.difficulty ?? "-"}</span>
                  <span>Rotation {session.golfFeelLog?.rotation ?? "-"}</span>
                  <span>Shallowing {session.golfFeelLog?.shallowing ?? "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
