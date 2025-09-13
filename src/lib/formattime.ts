import { SALON_TIMEZONE } from '@/lib/constants';

export function formatZoned(iso: string | Date, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return '';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: SALON_TIMEZONE,
    ...opts,
  }).format(d);
}

export function formatZonedDate(iso: string | Date) {
  return formatZoned(iso, { dateStyle: 'short', timeStyle: undefined });
}
