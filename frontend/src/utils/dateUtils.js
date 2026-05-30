import { formatDistanceToNow, differenceInDays, format, isToday, isPast } from 'date-fns';

export const formatDueDate = (dueDate) => {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const days = differenceInDays(date, new Date());
  if (isPast(date) && !isToday(date)) return { label: 'Overdue', color: 'text-red-500', bg: 'bg-red-500/10' };
  if (isToday(date)) return { label: 'Due Today', color: 'text-amber-500', bg: 'bg-amber-500/10' };
  if (days === 1) return { label: '1 day left', color: 'text-amber-400', bg: 'bg-amber-400/10' };
  if (days <= 3) return { label: `${days} days left`, color: 'text-amber-400', bg: 'bg-amber-400/10' };
  return { label: `${days} days left`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
};

export const formatCreatedAt = (date) => format(new Date(date), 'MMM d, yyyy');
