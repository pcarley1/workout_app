import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <nav className="nav">
        <Link href="/" className="logo" aria-label="TurnSpeed home">
          <span className="logo-mark" aria-hidden="true">
            <span className="logo-orbit" />
            <span className="logo-text">TS</span>
          </span>
          <span className="logo-name">TurnSpeed</span>
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
