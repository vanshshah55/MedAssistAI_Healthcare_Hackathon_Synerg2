import { format, formatDistance } from 'date-fns';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm');
}

export function formatTimeAgo(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

export function formatTriageLevel(level: string): string {
  const map: Record<string, string> = {
    immediate: 'Immediate',
    urgent: 'Urgent',
    delayed: 'Delayed',
    expectant: 'Expectant',
  };
  return map[level] || level;
}

export function getTriageLevelColor(level: string): string {
  const map: Record<string, string> = {
    immediate: 'bg-danger-600',
    urgent: 'bg-warning-500',
    delayed: 'bg-primary-500',
    expectant: 'bg-gray-500',
  };
  return map[level] || 'bg-gray-500';
}

export function getRiskLevelColor(score: number): string {
  if (score >= 80) return 'text-danger-600';
  if (score >= 60) return 'text-warning-500';
  if (score >= 40) return 'text-yellow-500';
  if (score >= 20) return 'text-primary-500';
  return 'text-success-500';
}

export function getRiskLevelText(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Low';
  return 'Minimal';
}