import { AppShell } from "../components/AppShell";
import { TodayForm } from "../components/TodayForm";
import { requireAuth } from "../lib/auth";

export default async function TodayPage() {
  await requireAuth();

  return (
    <AppShell>
      <main className="page">
        <h1>Today</h1>
        <p>Choose your session and the app will bias the workout toward your golf priorities.</p>
        <TodayForm />
      </main>
    </AppShell>
  );
}
