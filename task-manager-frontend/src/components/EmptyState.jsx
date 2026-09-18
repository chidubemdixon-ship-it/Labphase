export default function EmptyState({ filter, search, onNewTask, onClearSearch }) {
  let copy;
  if (search) {
    copy = {
      title: `No entries match "${search}"`,
      body: 'Try a different search term, or clear the search to see everything.',
    };
  } else if (filter === 'all') {
    copy = {
      title: 'The ledger is empty',
      body: 'Nothing has been entered yet. Add the first thing you need to get done.',
    };
  } else {
    copy = {
      title: `Nothing marked ${filter.replace('-', ' ')}`,
      body: 'Try another filter, or add a new entry to the ledger.',
    };
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-paper-line py-20 text-center">
      <p className="font-display text-xl italic text-ink">{copy.title}</p>
      <p className="mt-2 max-w-xs text-sm text-ink-muted">{copy.body}</p>
      <button
        onClick={search ? onClearSearch : onNewTask}
        className="mt-6 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper-light transition-colors hover:bg-ink-soft"
      >
        {search ? 'Clear search' : 'Add an entry'}
      </button>
    </div>
  );
}
