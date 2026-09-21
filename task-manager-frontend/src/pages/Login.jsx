import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-ink px-12 py-14 text-paper-light md:flex">
        <div className="stamp-underline font-display text-2xl">Ledger</div>
        <div className="max-w-sm">
          <p className="font-display text-3xl italic leading-snug text-paper-light">
            "A running account of what's yours to do, and what's already closed."
          </p>
          <p className="mt-6 text-sm text-paper-light/60">
            Keep one clear line on every task — when it's due, where it stands, and when it's done.
          </p>
        </div>
        <p className="text-xs text-paper-light/40">Personal task ledger, built on the MERN stack.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <span className="stamp-underline font-display text-2xl text-ink">Ledger</span>
          </div>
          <h1 className="font-display text-2xl text-ink">Sign in</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Pick up your ledger where you left it.</p>

          {error && (
            <p className="mt-5 rounded-sm border border-wax/30 bg-wax-light px-3 py-2 text-sm text-wax">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm bg-ink py-2.5 text-sm font-medium text-paper-light transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-muted">
            New here?{' '}
            <Link to="/signup" className="font-medium text-ink underline underline-offset-2">
              Open a ledger
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
