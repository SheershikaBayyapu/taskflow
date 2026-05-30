import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Zap, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Kanban Board' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">TaskFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><X className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-3">Navigation</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'}`}>
              <Icon className="w-[18px] h-[18px]" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
