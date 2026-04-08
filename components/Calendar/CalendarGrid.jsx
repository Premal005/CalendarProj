'use client';

import { memo } from 'react';
import { DAY_NAMES, generateCalendarGrid } from '@/lib/calendar';
import DateCell from './DateCell';

function CalendarGrid({
  month,
  year,
  rangeStart,
  rangeEnd,
  hoverDate,
  onDateClick,
  onDateHover,
  allDateNotes,
}) {
  const grid = generateCalendarGrid(year, month);

  return (
    <div className="grid-section">
      {/* Day headers */}
      <div className="grid-header" role="row">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={`grid-header-cell ${i >= 5 ? 'weekend' : ''}`}
            role="columnheader"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid-body" role="grid" onMouseLeave={() => onDateHover(null)}>
        {grid.map((cell, i) => (
          <DateCell
            key={`${cell.year}-${cell.month}-${cell.day}-${i}`}
            cellData={cell}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hoverDate={hoverDate}
            onDateClick={onDateClick}
            onDateHover={onDateHover}
            allDateNotes={allDateNotes}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CalendarGrid);
