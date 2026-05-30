import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Zap } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
        <Zap className="w-6 h-6 text-white" />
      </div>
      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}
