import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <nav className="nav">
        <Link href="/" className="logo">
          <span className="logo-mark">G</span>
          Golf Workout
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Today
          </Link>
          <Link href="/baseline" className="nav-link">
            Baseline
          </Link>
          <Link href="/progress" className="nav-link">
            Progress
          </Link>
        </div>
        <div className="nav-status">
          <span className="status-dot" />
          Private
        </div>
      </nav>
      {children}
    </div>
  );
}
