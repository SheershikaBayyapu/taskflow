import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import toast from 'react-hot-toast';

const statuses = [{ value: 'todo', label: 'To Do' }, { value: 'inprogress', label: 'In Progress' }, { value: 'review', label: 'Review' }, { value: 'done', label: 'Done' }];
const priorities = [
  { value: 'high', label: 'High', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' },
  { value: 'medium', label: 'Medium', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' },
  { value: 'low', label: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
];
const defaultForm = { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', tags: '' };

export default function TaskModal({ open, onClose, task, defaultStatus }) {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const isEdit = !!task;

  useEffect(() => {
    if (task) { setForm({ title: task.title || '', description: task.description || '', priority: task.priority || 'medium', status: task.status || 'todo', dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '', tags: (task.tags || []).join(', ') }); }
    else { setForm({ ...defaultForm, status: defaultStatus || 'todo' }); }
  }, [task, open, defaultStatus]);

  if (!open) return null;
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [], dueDate: form.dueDate || undefined };
      if (isEdit) { await updateTask(task._id, payload); toast.success('Task updated!'); }
      else { await createTask(payload); toast.success('Task created!'); }
      onClose();
    } catch (err) { toast.error(err?.response?.data?.message || 'Something went wrong'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Task title..." className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Add details..." rows={3} className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map(({ value, label, color, bg }) => (
                <button key={value} type="button" onClick={() => set('priority', value)}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-all ${form.priority === value ? `${bg} ${color} ring-2 ring-offset-1 dark:ring-offset-zinc-900 ring-current` : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500">
                {statuses.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Tags <span className="font-normal text-zinc-400">(comma-separated)</span></label>
            <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="design, frontend, bug..." className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
