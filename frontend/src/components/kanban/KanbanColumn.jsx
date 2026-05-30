import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const columnConfig = {
  todo: { label: 'To Do', color: 'bg-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-800/40', header: 'text-zinc-600 dark:text-zinc-300', countBg: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300', dropBg: 'bg-zinc-100 dark:bg-zinc-800/60' },
  inprogress: { label: 'In Progress', color: 'bg-indigo-500', bg: 'bg-indigo-50/50 dark:bg-indigo-500/5', header: 'text-indigo-700 dark:text-indigo-300', countBg: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300', dropBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  review: { label: 'Review', color: 'bg-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-500/5', header: 'text-amber-700 dark:text-amber-300', countBg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300', dropBg: 'bg-amber-50 dark:bg-amber-500/10' },
  done: { label: 'Done', color: 'bg-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-500/5', header: 'text-emerald-700 dark:text-emerald-300', countBg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', dropBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
};

export default function KanbanColumn({ status, tasks, onEdit, onAddTask }) {
  const cfg = columnConfig[status];
  return (
    <div className={`flex flex-col rounded-2xl ${cfg.bg} border border-zinc-200 dark:border-zinc-700/50 min-w-[280px] max-w-[320px] w-full`}>
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-700/50">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
          <h2 className={`text-sm font-bold ${cfg.header}`}>{cfg.label}</h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.countBg}`}>{tasks.length}</span>
        </div>
        <button onClick={() => onAddTask(status)} className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 min-h-[120px] transition-colors ${snapshot.isDraggingOver ? cfg.dropBg : ''}`}>
            {tasks.map((task, index) => <TaskCard key={task._id} task={task} index={index} onEdit={onEdit} />)}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24">
                <p className="text-xs text-zinc-400 dark:text-zinc-600">Drop tasks here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
