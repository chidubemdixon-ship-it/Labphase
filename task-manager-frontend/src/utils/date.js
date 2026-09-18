import { format, isPast, isToday, isTomorrow, differenceInCalendarDays } from 'date-fns';

/**
 * Splits a deadline into the stacked day/month pair used in the ledger's
 * left-hand date column, plus a status label used for coloring.
 */
export function ledgerDate(deadline) {
  if (!deadline) {
    return { day: '—', month: 'no date', relation: 'none' };
  }

  const date = new Date(deadline);
  const day = format(date, 'd');
  const month = format(date, 'MMM').toLowerCase();

  let relation = 'future';
  if (isPast(date) && !isToday(date)) relation = 'overdue';
  else if (isToday(date)) relation = 'today';
  else if (isTomorrow(date)) relation = 'tomorrow';
  else if (differenceInCalendarDays(date, new Date()) <= 3) relation = 'soon';

  return { day, month, relation, full: format(date, 'EEEE, MMMM d, yyyy') };
}

/** Formats a date for the <input type="date"> value attribute. */
export function toDateInputValue(deadline) {
  if (!deadline) return '';
  return format(new Date(deadline), 'yyyy-MM-dd');
}
