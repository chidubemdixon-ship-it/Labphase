import { useEffect, useState } from 'react';
import { toDateInputValue } from '../utils/date.js';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in-progress', 'completed'];

const emptyForm = { title: '', description: '', priority: 'medium', deadline: '', status: 'pending' };

export default function TaskFormModal({ open, task, onClose, onSubmit, error, submitting }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        deadline: toDateInputValue(task.deadline),
        status: task.status || 'pending',
      });
    } else {
      setForm(emptyForm);
    }
  }, [task, open]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 px-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div className="w-full max-w-lg rounded-sm bg-paper-light p-7 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 id="task-form-title" className="font-display text-2xl text-ink">
            {task ? 'Amend entry' : 'New entry'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-sm p-1.5 text-ink-muted transition-colors hover:bg-paper hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-sm border border-wax/30 bg-wax-light px-3 py-2 text-sm text-wax">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={100}
              value={form.title}
              onChange={handleChange('title')}
              placeholder="What needs doing?"
              className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink placeholder:text-ink-muted/60 focus:border-stamp"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ink">
              Notes <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              maxLength={1000}
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Any detail worth remembering later"
              className="mt-1.5 w-full resize-none rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink placeholder:text-ink-muted/60 focus:border-stamp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-ink">
                Due date
              </label>
              <input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange('deadline')}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-ink">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={handleChange('priority')}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {task && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-ink">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={handleChange('status')}
                className="mt-1.5 w-full rounded-sm border border-paper-line bg-paper-light px-3 py-2 text-ink focus:border-stamp"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'in-progress' ? 'In progress' : s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-stamp px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-stamp-dark disabled:opacity-60"
            >
              {submitting ? 'Saving…' : task ? 'Save changes' : 'Add to ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
