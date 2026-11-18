import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
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
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `transition-colors hover:text-ink ${isActive ? 'font-medium text-ink' : ''}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `transition-colors hover:text-ink ${isActive ? 'font-medium text-ink' : ''}`
                  }
                >
                  Sign in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `transition-colors hover:text-ink ${isActive ? 'font-medium text-ink' : ''}`
                  }
                >
                  Create account
                </NavLink>
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
  );
}
