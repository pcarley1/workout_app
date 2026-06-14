import { Activity, BarChart3, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="nav">
        <Link href="/" className="nav-link">
          <Activity size={18} />
          Today
        </Link>
        <Link href="/baseline" className="nav-link">
          <ClipboardCheck size={18} />
          Baseline
        </Link>
        <Link href="/progress" className="nav-link">
          <BarChart3 size={18} />
          Progress
        </Link>
      </nav>
      {children}
    </div>
  );
}
