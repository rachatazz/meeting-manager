import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = 'Asia/Bangkok';

export function useDate() {
  // "Jan 5, 2026 · 10:00 AM – 11:30 AM"
  function formatDateRange(start: string, end: string): string {
    const s = dayjs(start).tz(TZ);
    const e = dayjs(end).tz(TZ);
    const date = s.format('MMM D, YYYY');
    const startTime = s.format('h:mm A');
    const endTime = e.format('h:mm A');
    return `${date} · ${startTime} – ${endTime}`;
  }

  // "10:00 AM – 11:30 AM"
  function formatTimeRange(start: string, end: string): string {
    const s = dayjs(start).tz(TZ);
    const e = dayjs(end).tz(TZ);
    return `${s.format('h:mm A')} – ${e.format('h:mm A')}`;
  }

  // "Jan 5, 2026"
  function formatDate(dateStr: string): string {
    return dayjs(dateStr).tz(TZ).format('MMM D, YYYY');
  }

  // "Jan 5"
  function formatDateShort(dateStr: string | Date): string {
    return dayjs(dateStr).tz(TZ).format('MMM D');
  }

  // "Monday, January 5, 2026"
  function formatDateFull(dateStr: string | Date): string {
    return dayjs(dateStr).tz(TZ).format('dddd, MMMM D, YYYY');
  }

  // "2026-01-04T17:00:00.000Z" (start of day in Asia/Bangkok)
  function toISODate(date: Date): string {
    return dayjs(date).tz(TZ).startOf('day').toISOString();
  }

  // "2026-01-05T16:59:59.999Z" (end of day in Asia/Bangkok)
  function toISODateEnd(date: Date): string {
    return dayjs(date).tz(TZ).endOf('day').toISOString();
  }

  return {
    formatDate,
    formatDateFull,
    formatDateShort,
    formatDateRange,
    formatTimeRange,
    toISODate,
    toISODateEnd,
  };
}
