'use client';

import { useCallback, useRef, memo } from 'react';
import { getHoliday, isToday, isSameDay, isInRange, isWeekend, hasDateNote } from '@/lib/calendar';

function DateCell({
  cellData,
  rangeStart,
  rangeEnd,
  hoverDate,
  onDateClick,
  onDateHover,
  allDateNotes,
}) {
  const { day, month, year, isOverflow, date } = cellData;
  const cellRef = useRef(null);

  const dayOfWeek = date.getDay();
  // Convert to Mon=0 index
  const dayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekend = isWeekend(dayIdx);
  const today = isToday(date);
  const holiday = getHoliday(month, day);

  // Check if has notes
  const noteKey = `${year}-${month}-${day}`;
  const hasNote = allDateNotes && allDateNotes[noteKey];

  // Range states
  const isStart = rangeStart && isSameDay(date, rangeStart);
  const isEnd = rangeEnd && isSameDay(date, rangeEnd);

  // Determine effective start and end for visual range
  let effectiveStart = rangeStart;
  let effectiveEnd = rangeEnd;
  if (rangeStart && rangeEnd && rangeStart.getTime() > rangeEnd.getTime()) {
    effectiveStart = rangeEnd;
    effectiveEnd = rangeStart;
  }

  const inRange = effectiveStart && effectiveEnd && isInRange(date, effectiveStart, effectiveEnd);

  // Hover preview
  let isHoverPreview = false;
  if (rangeStart && !rangeEnd && hoverDate && !isOverflow) {
    const hStart = Math.min(rangeStart.getTime(), hoverDate.getTime());
    const hEnd = Math.max(rangeStart.getTime(), hoverDate.getTime());
    const t = date.getTime();
    isHoverPreview = t > hStart && t < hEnd;
  }

  const handleClick = useCallback((e) => {
    if (isOverflow) return;

    // Ripple effect
    const rect = cellRef.current.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    cellRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    onDateClick(date);
  }, [date, isOverflow, onDateClick]);

  const handleMouseEnter = useCallback(() => {
    if (!isOverflow) {
      onDateHover(date);
    }
  }, [date, isOverflow, onDateHover]);

  // Build class list
  const classes = ['date-cell'];
  if (isOverflow) classes.push('overflow');
  if (weekend && !isOverflow) classes.push('weekend');
  if (today && !isOverflow) classes.push('today');
  if (isStart && !isOverflow) classes.push('range-start');
  if (isEnd && !isOverflow) classes.push('range-end');
  if (inRange && !isOverflow && !isStart && !isEnd) classes.push('in-range');
  if (isHoverPreview && !isStart) classes.push('hover-preview');
  if (holiday && !isOverflow) classes.push('is-holiday');

  return (
    <div
      ref={cellRef}
      className={classes.join(' ')}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="gridcell"
      aria-label={`${day} ${isOverflow ? '(other month)' : ''} ${holiday || ''}`}
      aria-selected={isStart || isEnd || false}
      tabIndex={isOverflow ? -1 : 0}
      data-date={`${year}-${month}-${day}`}
      id={`date-${year}-${month}-${day}`}
    >
      {day}
      {holiday && !isOverflow && (
        <>
          <svg className="holiday-icon" width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span className="holiday-tooltip">{holiday}</span>
        </>
      )}
      {hasNote && !isOverflow && <span className="note-dot" />}
    </div>
  );
}

export default memo(DateCell);
