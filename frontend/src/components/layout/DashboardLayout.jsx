import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = { '/': 'Kanban Board', '/analytics': 'Analytics' };

export default function DashboardLayout({ children, onNewTask }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} onNewTask={onNewTask} pageTitle={pageTitles[pathname] || 'TaskFlow'} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
