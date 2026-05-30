import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useTasks } from '../context/TaskContext';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskModal from '../components/kanban/TaskModal';
import { Loader2 } from 'lucide-react';

const STATUSES = ['todo', 'inprogress', 'review', 'done'];

export default function KanbanPage() {
  const { loading, fetchTasks, getByStatus, moveTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    await moveTask(draggableId, destination.droppableId, destination.index);
  };

  const openCreate = (status = 'todo') => { setEditingTask(null); setDefaultStatus(status); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading tasks...</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 p-6 h-full min-w-max">
            {STATUSES.map((status) => <KanbanColumn key={status} status={status} tasks={getByStatus(status)} onEdit={openEdit} onAddTask={openCreate} />)}
          </div>
        </div>
      </DragDropContext>
      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} task={editingTask} defaultStatus={defaultStatus} />
    </div>
  );
}
