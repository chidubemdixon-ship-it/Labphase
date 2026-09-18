import TaskRow from './TaskRow.jsx';
import EmptyState from './EmptyState.jsx';

export default function TaskList({ tasks, filter, search, onToggleComplete, onEdit, onDelete, onNewTask, onClearSearch }) {
  if (tasks.length === 0) {
    return <EmptyState filter={filter} search={search} onNewTask={onNewTask} onClearSearch={onClearSearch} />;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskRow
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
