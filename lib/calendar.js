export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MONTH_IMAGES = {
  0: '/images/january.png',
  1: '/images/february.png',
  2: '/images/march.png',
  3: '/images/april.png',
  4: '/images/may.png',
  5: '/images/june.png',
  6: '/images/july.png',
  7: '/images/august.png',
  8: '/images/september.png',
  9: '/images/october.png',
  10: '/images/november.png',
  11: '/images/december.png',
};

// Seasonal color themes
export const SEASONAL_THEMES = {
  winter: {
    accent: '#3b82f6',
    accentLight: '#dbeafe',
    accentDark: '#1d4ed8',
    heroOverlay: 'linear-gradient(135deg, rgba(59,130,246,0.85), rgba(29,78,216,0.75))',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
  },
  spring: {
    accent: '#ec4899',
    accentLight: '#fce7f3',
    accentDark: '#be185d',
    heroOverlay: 'linear-gradient(135deg, rgba(236,72,153,0.85), rgba(190,24,93,0.75))',
    gradient: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
  },
  summer: {
    accent: '#f59e0b',
    accentLight: '#fef3c7',
    accentDark: '#d97706',
    heroOverlay: 'linear-gradient(135deg, rgba(245,158,11,0.85), rgba(217,119,6,0.75))',
    gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
  },
  autumn: {
    accent: '#ef4444',
    accentLight: '#fee2e2',
    accentDark: '#dc2626',
    heroOverlay: 'linear-gradient(135deg, rgba(239,68,68,0.85), rgba(220,38,38,0.75))',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
  },
};

export function getSeasonForMonth(month) {
  if (month === 11 || month === 0 || month === 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns day of week (0=Mon, 6=Sun) for the first day of the month
export function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay();
  // Convert from Sun=0 to Mon=0
  return day === 0 ? 6 : day - 1;
}

export function isWeekend(dayOfWeek) {
  return dayOfWeek === 5 || dayOfWeek === 6; // Sat or Sun (0-indexed Mon start)
}

export function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function isInRange(date, start, end) {
  if (!date || !start || !end) return false;
  const d = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return d > s && d < e;
}

export function isBeforeOrEqual(date, ref) {
  if (!date || !ref) return false;
  return date.getTime() <= ref.getTime();
}

export function formatDateRange(start, end) {
  if (!start) return '';
  const opts = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  if (!end || isSameDay(start, end)) return startStr;
  const endStr = end.toLocaleDateString('en-US', opts);
  return `${startStr} – ${endStr}`;
}

// US Holidays (month is 0-indexed)
export const HOLIDAYS = {
  '0-1': "New Year's Day",
  '0-20': "Martin Luther King Jr. Day",
  '1-14': "Valentine's Day",
  '1-17': "Presidents' Day",
  '2-17': "St. Patrick's Day",
  '3-1': "April Fool's Day",
  '4-26': "Memorial Day",
  '5-19': "Juneteenth",
  '6-4': "Independence Day",
  '8-1': "Labor Day",
  '9-31': "Halloween",
  '10-11': "Veterans Day",
  '10-27': "Thanksgiving",
  '11-25': "Christmas Day",
  '11-31': "New Year's Eve",
};

export function getHoliday(month, day) {
  return HOLIDAYS[`${month}-${day}`] || null;
}

// Generate calendar grid data for a month
export function generateCalendarGrid(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const grid = [];

  // Previous month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    grid.push({
      day,
      month: prevMonth,
      year: prevYear,
      isOverflow: true,
      date: new Date(prevYear, prevMonth, day),
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push({
      day,
      month,
      year,
      isOverflow: false,
      date: new Date(year, month, day),
    });
  }

  // Next month overflow to fill remaining cells (complete 6 rows)
  const remaining = 42 - grid.length;
  for (let day = 1; day <= remaining; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    grid.push({
      day,
      month: nextMonth,
      year: nextYear,
      isOverflow: true,
      date: new Date(nextYear, nextMonth, day),
    });
  }

  return grid;
}
