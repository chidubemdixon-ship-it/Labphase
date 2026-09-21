import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-50 border-b border-paper-line bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="stamp-underline font-display text-2xl text-ink">Ledger</div>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/login" className="font-medium text-ink-muted transition-colors hover:text-ink">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-sm bg-stamp px-4 py-2 font-medium text-ink transition-colors hover:bg-stamp-dark"
            >
              Open a ledger
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="pt-4 animate-[fadeInUp_0.8s_ease-out]">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-ink-muted">A personal task ledger</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] text-ink md:text-6xl">
              A calm place for what needs doing.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-muted">
              Keep every task, deadline, and priority in one place — neatly marked, easy to scan, and simple to keep moving.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper-light transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-sm border border-paper-line bg-paper-light px-5 py-3 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-stamp"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-paper-line pt-6 text-sm text-ink-muted">
              <span>Priority tracking</span>
              <span>Due-date focus</span>
              <span>Simple status views</span>
            </div>
          </section>

          <aside className="animate-[fadeInUp_1s_ease-out] rounded-sm border border-paper-line bg-paper-light p-5 shadow-panel">
            <div className="border-b border-paper-line pb-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">Today</p>
              <h2 className="mt-3 font-display text-3xl text-ink">3 open tasks</h2>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { title: 'Review proposal', meta: 'Due today', tone: 'bg-wax-light text-wax' },
                { title: 'Email client', meta: 'High priority', tone: 'bg-stamp-light text-ink' },
                { title: 'Plan sprint', meta: 'In progress', tone: 'bg-ledger-light text-ledger' },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-3 border-b border-paper-line pb-3 last:border-b-0 last:pb-0"
                  style={{ animation: `fadeInUp 0.8s ease-out ${index * 0.15 + 0.2}s both` }}
                >
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-ink-muted">{item.meta}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.tone}`}>
                    {item.meta}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-paper-line bg-paper-light">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
            <div>
              <div className="stamp-underline font-display text-2xl text-ink">Ledger</div>
              <p className="mt-4 max-w-sm text-sm leading-7 text-ink-muted">
                A quiet, focused place for tracking tasks, deadlines, and priorities without the noise of a busy dashboard.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">Navigate</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="transition-colors hover:text-ink">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="transition-colors hover:text-ink">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">Why it works</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                <li>Clear priorities</li>
                <li>Simple status tracking</li>
                <li>Deadline-first planning</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-paper-line pt-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Ledger</p>
            <p>Made for keeping the next task in view.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
