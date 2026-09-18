import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-paper-line bg-paper-light">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <div className="stamp-underline font-display text-xl text-ink">Ledger</div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-muted sm:inline">{user.name}</span>
            <button
              onClick={logout}
              className="rounded-sm px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
