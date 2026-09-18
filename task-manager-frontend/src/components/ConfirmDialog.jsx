export default function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="w-full max-w-sm rounded-sm bg-paper-light p-6 shadow-xl">
        <h2 id="confirm-title" className="font-display text-lg text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-sm px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-sm bg-wax px-4 py-2 text-sm font-medium text-paper-light transition-colors hover:bg-wax/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
