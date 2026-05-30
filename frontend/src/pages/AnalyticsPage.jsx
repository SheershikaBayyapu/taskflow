import { useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
} from 'recharts';
import { useTasks } from '../context/TaskContext';
import { subDays, format, isSameDay } from 'date-fns';
import { CheckCircle2, Clock3, ListTodo, RotateCcw, TrendingUp, Target } from 'lucide-react';

const STATUS_COLORS = {
  todo: '#94a3b8',
  inprogress: '#6366f1',
  review: '#f59e0b',
  done: '#10b981',
};
const STATUS_LABELS = { todo: 'To Do', inprogress: 'In Progress', review: 'Review', done: 'Done' };

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm`}>
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
    <div className="mb-5">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{title}</h3>
      {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 dark:bg-zinc-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-zinc-700">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold text-white">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { tasks, fetchTasks, loading } = useTasks();

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Status distribution for Doughnut
  const statusData = useMemo(() => {
    const counts = { todo: 0, inprogress: 0, review: 0, done: 0 };
    tasks.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++; });
    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_LABELS[key],
      value,
      color: STATUS_COLORS[key],
    })).filter((d) => d.value > 0);
  }, [tasks]);

  // Last 7 days bar chart
  const dailyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const created = tasks.filter((t) => isSameDay(new Date(t.createdAt), date)).length;
      const completed = tasks.filter(
        (t) => t.status === 'done' && t.updatedAt && isSameDay(new Date(t.updatedAt), date)
      ).length;
      return { day: format(date, 'EEE'), created, completed };
    });
  }, [tasks]);

  // Weekly productivity score
  const productivityScore = useMemo(() => {
    const total = tasks.length;
    if (!total) return 0;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inprogress = tasks.filter((t) => t.status === 'inprogress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const score = Math.round(((done * 1 + inprogress * 0.5 + review * 0.75) / total) * 100);
    return Math.min(score, 100);
  }, [tasks]);

  const gaugeData = [
    { name: 'Score', value: productivityScore, fill: productivityScore >= 70 ? '#10b981' : productivityScore >= 40 ? '#f59e0b' : '#ef4444' },
    { name: 'Remaining', value: 100 - productivityScore, fill: 'transparent' },
  ];

  const counts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inprogress: tasks.filter((t) => t.status === 'inprogress').length,
      review: tasks.filter((t) => t.status === 'review').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks]);

  const scoreColor = productivityScore >= 70 ? 'text-emerald-500' : productivityScore >= 40 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = productivityScore >= 70 ? 'bg-emerald-500/10' : productivityScore >= 40 ? 'bg-amber-500/10' : 'bg-red-500/10';

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={counts.total} color="text-zinc-500" bg="bg-zinc-100 dark:bg-zinc-800" />
        <StatCard icon={Clock3} label="In Progress" value={counts.inprogress} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatCard icon={RotateCcw} label="In Review" value={counts.review} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard icon={CheckCircle2} label="Completed" value={counts.done} color="text-emerald-500" bg="bg-emerald-500/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut - Status Distribution */}
        <ChartCard title="Task Status Distribution" subtitle="Breakdown by current status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(val) => (
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{val}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          {tasks.length === 0 && (
            <p className="text-center text-xs text-zinc-400 -mt-4">No tasks yet</p>
          )}
        </ChartCard>

        {/* Bar Chart - Daily activity */}
        <div className="lg:col-span-2">
          <ChartCard title="Weekly Activity" subtitle="Tasks created vs completed (last 7 days)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)', radius: 6 }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{val}</span>}
                />
                <Bar dataKey="created" name="Created" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Productivity Score */}
      <ChartCard
        title="Weekly Productivity Score"
        subtitle="Based on task completion, progress, and review status"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Gauge */}
          <div className="relative w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={180}
                endAngle={0}
                data={[{ name: 'Score', value: productivityScore, fill: gaugeData[0].fill }]}
                barSize={16}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={8}
                  background={{ fill: '#f4f4f5' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
              <span className={`text-3xl font-black ${scoreColor}`}>{productivityScore}%</span>
              <span className="text-xs text-zinc-400 font-medium mt-0.5">Score</span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="flex-1 space-y-3 w-full">
            {[
              { label: 'Done', count: counts.done, total: counts.total, color: 'bg-emerald-500', weight: '100% weight' },
              { label: 'In Review', count: counts.review, total: counts.total, color: 'bg-amber-500', weight: '75% weight' },
              { label: 'In Progress', count: counts.inprogress, total: counts.total, color: 'bg-indigo-500', weight: '50% weight' },
              { label: 'To Do', count: counts.todo, total: counts.total, color: 'bg-zinc-300 dark:bg-zinc-600', weight: '0% weight' },
            ].map(({ label, count, total, color, weight }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                  <span className="text-xs text-zinc-400">{count} tasks · {weight}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}

            <div className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-xl ${scoreBg}`}>
              <Target className={`w-4 h-4 ${scoreColor}`} />
              <p className={`text-sm font-semibold ${scoreColor}`}>
                {productivityScore >= 70 ? '🎉 Great productivity this week!' :
                  productivityScore >= 40 ? '📈 Good progress, keep going!' :
                    '💪 Time to pick up the pace!'}
              </p>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
