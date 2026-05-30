import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, Monitor, LogOut, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const themeOptions = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function Navbar({ onMenuClick, onNewTask, pageTitle }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const themeRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!themeRef.current?.contains(e.target)) setThemeOpen(false);
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CurrentThemeIcon = themeOptions.find((t) => t.value === theme)?.icon || Monitor;

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-3">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><Menu className="w-5 h-5" /></button>
      <h1 className="text-lg font-bold text-zinc-900 dark:text-white flex-1">{pageTitle}</h1>
      <div className="flex items-center gap-2">
        <button onClick={onNewTask} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Task</span>
        </button>
        <div ref={themeRef} className="relative">
          <button onClick={() => setThemeOpen(!themeOpen)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            <CurrentThemeIcon className="w-5 h-5" />
          </button>
          {themeOpen && (
            <div className="absolute right-0 top-11 w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {themeOptions.map(({ value, icon: Icon, label }) => (
                <button key={value} onClick={() => { setTheme(value); setThemeOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${theme === value ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60'}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div ref={profileRef} className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>
              <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                <LogOut className="w-4 h-4" />Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
