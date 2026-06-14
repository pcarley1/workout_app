import { AppShell } from "../../components/AppShell";
import { BaselineTestCard } from "../../components/BaselineTestCard";
import { requireAuth } from "../../lib/auth";
import { prisma } from "../../lib/db";

export default async function BaselinePage() {
  await requireAuth();
  const tests = await prisma.baselineTest.findMany({
    orderBy: [{ priority: "asc" }, { name: "asc" }],
    include: { results: { orderBy: { recordedAt: "desc" }, take: 3 } }
  });
  const completed = tests.filter((test) => test.results.length > 0).length;
  const percent = tests.length ? Math.round((completed / tests.length) * 100) : 0;

  return (
    <AppShell>
      <main className="page">
        <h1>Baseline</h1>
        <p>
          {completed} of {tests.length} tests complete ({percent}%). Missing tests help personalize workouts, but
          they never block training.
        </p>
        <section className="card-grid">
          {tests.map((test) => (
            <BaselineTestCard key={test.id} test={test} />
          ))}
        </section>
      </main>
    </AppShell>
  );
}
