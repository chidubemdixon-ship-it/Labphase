import { ledgerDate } from '../utils/date.js';

const RELATION_STYLES = {
  overdue: 'text-wax',
  today: 'text-stamp-dark',
  tomorrow: 'text-ink',
  soon: 'text-ink',
  future: 'text-ink-muted',
  none: 'text-ink-muted/60',
};

const PRIORITY_MARK = {
  high: { label: 'High priority', color: 'bg-wax' },
  medium: { label: 'Medium priority', color: 'bg-stamp' },
  low: { label: 'Low priority', color: 'bg-ink-muted' },
};

export default function TaskRow({ task, onToggleComplete, onEdit, onDelete }) {
  const { day, month, relation, full } = ledgerDate(task.deadline);
  const isCompleted = task.status === 'completed';
  const priority = PRIORITY_MARK[task.priority] ?? PRIORITY_MARK.medium;

  return (
    <div className="group flex items-start gap-4 border-b border-paper-line py-4 first:pt-0 last:border-b-0 sm:gap-6">
      {/* Date column */}
      <div
        className={`w-12 shrink-0 text-center leading-none ${RELATION_STYLES[relation]}`}
        title={full}
      >
        <div className="font-display text-2xl">{day}</div>
        <div className="mt-0.5 text-[11px] tracking-wide">{month}</div>
      </div>

      {/* Divider */}
      <div className="mt-1 h-10 w-px shrink-0 bg-paper-line" aria-hidden="true" />

      {/* Mark-complete control */}
      <button
        onClick={() => onToggleComplete(task)}
        aria-pressed={isCompleted}
        aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors"
        style={{
          borderColor: isCompleted ? '#2F5233' : '#5B5F58',
          backgroundColor: isCompleted ? '#2F5233' : 'transparent',
        }}
      >
        {isCompleted && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
            <path d="M1 4.5L4 7.5L10 1" stroke="#F4F5F0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className={`truncate font-display text-lg ${isCompleted ? 'text-ink-muted line-through' : 'text-ink'}`}>
            {task.title}
          </h3>
          <span
            className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: priority.color.includes('wax') ? '#A8342A' : priority.color.includes('stamp') ? '#C98A2B' : '#5B5F58' }}
            title={priority.label}
          />
          {task.status === 'in-progress' && (
            <span className="text-xs font-medium uppercase tracking-wide text-stamp-dark">in progress</span>
          )}
        </div>
        {task.description && (
          <p className={`mt-1 line-clamp-2 text-sm ${isCompleted ? 'text-ink-muted/70' : 'text-ink-muted'}`}>
            {task.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit entry"
          className="rounded-sm p-1.5 text-ink-muted transition-colors hover:bg-paper hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M11.3 2.3a1.5 1.5 0 0 1 2.1 2.1L5.6 12.2l-2.9.7.7-2.9 7.9-7.7Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete entry"
          className="rounded-sm p-1.5 text-ink-muted transition-colors hover:bg-wax-light hover:text-wax"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
