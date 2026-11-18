import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import Navbar from '../components/Navbar.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskFormModal from '../components/TaskFormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { key: 'deadline', label: 'Deadline (soonest)' },
  { key: 'priority', label: 'Priority (highest)' },
  { key: 'title', label: 'Title (A–Z)' },
  { key: 'newest', label: 'Newest first' },
];

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      // Fetch the full set once; filtering, searching, and sorting all
      // happen client-side below so switching between them feels instant.
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Could not load your tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let result = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description || '').toLowerCase().includes(query)
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'priority':
        sorted.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'deadline':
      default:
        // Tasks without a deadline sort to the end rather than the top.
        sorted.sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
    }

    return sorted;
  }, [tasks, filter, search, sortBy]);

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  const openNewTask = () => {
    setEditingTask(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, payload);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? data.data : t)));
      } else {
        const { data } = await api.post('/tasks', payload);
        setTasks((prev) => [...prev, data.data]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic update so the ledger feels immediate.
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t)));
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data.data : t)));
    } catch {
      // Roll back on failure
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    }
  };

  const handleDeleteConfirmed = async () => {
    const task = taskPendingDelete;
    setTaskPendingDelete(null);
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    try {
      await api.delete(`/tasks/${task._id}`);
    } catch {
      // Restore the task if deletion failed server-side
      setTasks((prev) => [...prev, task]);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-paper">
      <Navbar />

      <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">
              {user ? `${user.name.split(' ')[0]}'s ledger` : 'Your ledger'}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {counts.all === 0
                ? 'Nothing entered yet.'
                : `${counts.pending + counts['in-progress']} open, ${counts.completed} closed.`}
            </p>
          </div>
          <button
            onClick={openNewTask}
            className="rounded-sm bg-stamp px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-stamp-dark"
          >
            + New entry
          </button>
        </div>

        {/* Filter tabs, styled as ledger section tabs rather than pill buttons */}
        <div className="mt-8 flex gap-6 border-b border-paper-line text-sm">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative pb-3 font-medium transition-colors ${
                filter === f.key ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs text-ink-muted">{counts[f.key]}</span>
              {filter === f.key && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-stamp" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>

        {/* Search + sort controls */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or notes…"
              aria-label="Search tasks"
              className="w-full rounded-sm border border-paper-line bg-paper-light py-1.5 pl-8 pr-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-stamp"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-sm text-ink-muted">
              Sort by
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-sm border border-paper-line bg-paper-light py-1.5 pl-2 pr-7 text-sm text-ink focus:border-stamp"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2">
          {loading && <p className="py-12 text-center text-sm text-ink-muted">Loading your ledger…</p>}

          {!loading && loadError && (
            <div className="py-12 text-center">
              <p className="text-sm text-wax">{loadError}</p>
              <button onClick={fetchTasks} className="mt-3 text-sm font-medium text-ink underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <TaskList
              tasks={filteredTasks}
              filter={filter}
              search={search}
              onToggleComplete={handleToggleComplete}
              onEdit={openEditTask}
              onDelete={setTaskPendingDelete}
              onNewTask={openNewTask}
              onClearSearch={() => setSearch('')}
            />
          )}
        </div>
      </main>

      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        error={formError}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(taskPendingDelete)}
        title="Remove this entry?"
        body={taskPendingDelete ? `"${taskPendingDelete.title}" will be permanently deleted.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setTaskPendingDelete(null)}
      />
    </div>
  );
}
