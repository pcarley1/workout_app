import { requireAuth } from "../lib/auth";

export default async function TodayPage() {
  await requireAuth();

  return (
    <main className="page">
      <h1>Today</h1>
      <p>Choose a golf-focused workout and get moving.</p>
    </main>
  );
}
