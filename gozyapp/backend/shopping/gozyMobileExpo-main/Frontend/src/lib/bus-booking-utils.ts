export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export function buildCalendarDays(month: Date): (number | null)[] {
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days: (number | null)[] = Array.from({ length: firstDay }, () => null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export function formatBusDate(date: Date, compact = false): string {
  if (compact) {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isSameBusRoute(from: string, to: string): boolean {
  return from.trim().toLowerCase() === to.trim().toLowerCase();
}

export function buildBusRouteQuery(
  from: string,
  to: string,
  date: Date,
  extra?: Record<string, string>,
): string {
  return new URLSearchParams({
    from,
    to,
    date: date.toISOString(),
    ...extra,
  }).toString();
}

export function formatFetchedTime(iso: string | null): string {
  if (!iso) return 'Now';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function parseBusTravelDate(dateIso: string): Date {
  const parsed = new Date(dateIso);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function isSameCalendarDay(day: number | null, selected: Date, month: Date): boolean {
  return (
    day !== null &&
    selected.getDate() === day &&
    selected.getMonth() === month.getMonth() &&
    selected.getFullYear() === month.getFullYear()
  );
}
