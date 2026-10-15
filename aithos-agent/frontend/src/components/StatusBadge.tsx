import React from 'react';

export type BadgeStatusType =
  | 'CONNECTED'
  | 'ACTIVE'
  | 'ONLINE'
  | 'SUCCESS'
  | 'COMPLETED'
  | 'AWAITING_INTEGRATION'
  | 'UNAVAILABLE'
  | 'OFFLINE'
  | 'BLOCKED'
  | 'WARNING'
  | 'RUNNING'
  | 'FAILED'
  | 'PENDING'
  | 'CANCELLED'
  | 'INFO';

interface StatusBadgeProps {
  status: BadgeStatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'CONNECTED':
      case 'ACTIVE':
      case 'ONLINE':
      case 'SUCCESS':
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500 animate-pulse',
        };
      case 'RUNNING':
      case 'PENDING':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500 animate-ping',
        };
      case 'AWAITING_INTEGRATION':
      case 'INFO':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'BLOCKED':
      case 'WARNING':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'UNAVAILABLE':
      case 'OFFLINE':
      case 'FAILED':
      case 'CANCELLED':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-300',
          dot: 'bg-slate-400',
        };
    }
  };

  const styles = getStyles();
  const displayLabel = label || status.replace('_', ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${styles.bg} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      <span className="capitalize">{displayLabel.toLowerCase()}</span>
    </span>
  );
};
