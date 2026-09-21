import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6 || !/\d/.test(form.password) || !/[A-Za-z]/.test(form.password)) {
      setError('Password must be at least 6 characters and include a letter and a number.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink px-12 py-14 text-paper-light md:flex">
        <div className="stamp-underline font-display text-2xl">Ledger</div>
        <div className="max-w-sm">
          <p className="font-display text-3xl italic leading-snug text-paper-light">
            "Every entry gets a date, a status, and eventually — a line drawn through it."
          </p>
          <p className="mt-6 text-sm text-paper-light/60">
            Your ledger is private to you. No one else sees your entries.
          </p>
        </div>
        <p className="text-xs text-paper-light/40">Personal task ledger, built on the MERN stack.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <span className="stamp-underline font-display text-2xl text-ink">Ledger</span>
          </div>
          <h1 className="font-display text-2xl text-ink">Open a ledger</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Set up your account in a few seconds.</p>

          {error && (
            <p className="mt-5 rounded-sm border border-wax/30 bg-wax-light px-3 py-2 text-sm text-wax">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              />
            </div>
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
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              />
              <p className="mt-1 text-xs text-ink-muted">At least 6 characters, with a letter and a number.</p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm bg-ink py-2.5 text-sm font-medium text-paper-light transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-muted">
            Already keeping a ledger?{' '}
            <Link to="/login" className="font-medium text-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
