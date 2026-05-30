import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { formatDueDate, formatCreatedAt } from '../../utils/dateUtils';
import { useTasks } from '../../context/TaskContext';
import toast from 'react-hot-toast';

const priorityStyles = {
  high: { badge: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400', dot: 'bg-red-500', border: 'border-l-red-500', label: 'High' },
  medium: { badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', border: 'border-l-amber-500', label: 'Medium' },
  low: { badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', border: 'border-l-emerald-500', label: 'Low' },
};

export default function TaskCard({ task, index, onEdit }) {
  const { deleteTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const priority = priorityStyles[task.priority] || priorityStyles.medium;
  const due = formatDueDate(task.dueDate);

  const handleDelete = async () => {
    try { await deleteTask(task._id); toast.success('Task deleted'); }
    catch { toast.error('Failed to delete task'); }
    setMenuOpen(false);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          className={`group relative bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 border-l-4 ${priority.border} p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'shadow-2xl shadow-indigo-500/20 rotate-1 scale-105' : ''}`}>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${priority.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.label}
            </span>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
                  <button onClick={() => { onEdit(task); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                    <Edit2 className="w-3.5 h-3.5" />Edit
                  </button>
                  <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                    <Trash2 className="w-3.5 h-3.5" />Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug mb-1.5 line-clamp-2">{task.title}</h3>
          {task.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-3">{task.description}</p>}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700/60">
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="w-3 h-3" />{formatCreatedAt(task.createdAt)}
            </div>
            {due && (
              <span className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md ${due.bg} ${due.color}`}>
                <Clock className="w-3 h-3" />{due.label}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
