import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-display text-5xl text-ink">404</p>
      <p className="mt-3 text-ink-muted">There's no entry at this page in the ledger.</p>
      <Link to="/" className="mt-6 text-sm font-medium text-ink underline underline-offset-2">
        Back to your ledger
      </Link>
    </div>
  );
}
