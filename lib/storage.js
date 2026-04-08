const NOTES_KEY = 'wall-calendar-notes';
const RANGE_NOTES_KEY = 'wall-calendar-range-notes';
const THEME_KEY = 'wall-calendar-theme';

function safeGetItem(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSetItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

// Monthly notes: { "2026-3": "some note text" }
export function getMonthNotes(year, month) {
  const all = safeGetItem(NOTES_KEY, {});
  return all[`${year}-${month}`] || '';
}

export function setMonthNotes(year, month, text) {
  const all = safeGetItem(NOTES_KEY, {});
  all[`${year}-${month}`] = text;
  safeSetItem(NOTES_KEY, all);
}

// Date-specific notes: { "2026-3-15": "meeting at 3pm" }
export function getDateNote(year, month, day) {
  const all = safeGetItem(RANGE_NOTES_KEY, {});
  return all[`${year}-${month}-${day}`] || '';
}

export function setDateNote(year, month, day, text) {
  const all = safeGetItem(RANGE_NOTES_KEY, {});
  if (text.trim() === '') {
    delete all[`${year}-${month}-${day}`];
  } else {
    all[`${year}-${month}-${day}`] = text;
  }
  safeSetItem(RANGE_NOTES_KEY, all);
}

export function hasDateNote(year, month, day) {
  const all = safeGetItem(RANGE_NOTES_KEY, {});
  return !!all[`${year}-${month}-${day}`];
}

export function getAllDateNotes() {
  return safeGetItem(RANGE_NOTES_KEY, {});
}

// Range notes: { "2026-3-15_2026-3-20": "vacation" }
export function getRangeNote(startDate, endDate) {
  if (!startDate || !endDate) return '';
  const all = safeGetItem(RANGE_NOTES_KEY, {});
  const key = `range_${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}_${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`;
  return all[key] || '';
}

export function setRangeNote(startDate, endDate, text) {
  if (!startDate || !endDate) return;
  const all = safeGetItem(RANGE_NOTES_KEY, {});
  const key = `range_${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}_${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`;
  if (text.trim() === '') {
    delete all[key];
  } else {
    all[key] = text;
  }
  safeSetItem(RANGE_NOTES_KEY, all);
}

// Theme preference
export function getThemePreference() {
  return safeGetItem(THEME_KEY, 'auto');
}

export function setThemePreference(theme) {
  safeSetItem(THEME_KEY, theme);
}
