import { AppShell } from "../components/AppShell";
import { TodayForm } from "../components/TodayForm";
import { requireAuth } from "../lib/auth";

export default async function TodayPage() {
  await requireAuth();

  return (
    <AppShell>
      <main className="page">
        <section className="hero-panel">
          <p className="eyebrow">Golf performance</p>
          <h1>Today&apos;s rotation work</h1>
          <p>
            Build a session around speed, posture, lead-hip control, and the kind of rotation that makes shallowing
            feel easier.
          </p>
        </section>
        <section className="panel form-panel">
          <div>
            <p className="eyebrow">Session builder</p>
            <h2>Dial in today</h2>
          </div>
          <TodayForm />
        </section>
      </main>
    </AppShell>
  );
}
