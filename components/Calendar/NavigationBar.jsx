'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight, CalendarSearch } from 'lucide-react';
import { MONTH_NAMES } from '@/lib/calendar';

function NavigationBar({ month, year, onPrevMonth, onNextMonth, onToday, onGoToDate }) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(month);
  const [pickerYear, setPickerYear] = useState(year);
  const pickerRef = useRef(null);

  // Sync picker values when month/year changes
  useEffect(() => {
    setPickerMonth(month);
    setPickerYear(year);
  }, [month, year]);

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPicker]);

  const handleGoTo = () => {
    onGoToDate(pickerYear, pickerMonth);
    setShowPicker(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="nav-bar">
      <div className="nav-controls">
        <button
          className="nav-btn"
          onClick={onPrevMonth}
          aria-label="Previous month"
          id="nav-prev"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="nav-title">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          className="nav-btn"
          onClick={onNextMonth}
          aria-label="Next month"
          id="nav-next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="nav-actions">
        {/* Go to date picker */}
        <div className="goto-wrapper" ref={pickerRef}>
          <button
            className="nav-goto-btn"
            onClick={() => setShowPicker(!showPicker)}
            aria-label="Go to specific date"
            title="Go to date"
            id="nav-goto"
          >
            <CalendarSearch size={15} />
            <span className="goto-label">Go to</span>
          </button>

          {showPicker && (
            <div className="goto-picker">
              <div className="goto-picker-header">Jump to Date</div>
              <div className="goto-picker-row">
                <div className="goto-field">
                  <label htmlFor="goto-month">Month</label>
                  <select
                    id="goto-month"
                    value={pickerMonth}
                    onChange={(e) => setPickerMonth(Number(e.target.value))}
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i} value={i}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="goto-field">
                  <label htmlFor="goto-year">Year</label>
                  <select
                    id="goto-year"
                    value={pickerYear}
                    onChange={(e) => setPickerYear(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Month quick-select grid */}
              <div className="goto-month-grid">
                {MONTH_NAMES.map((name, i) => (
                  <button
                    key={i}
                    className={`goto-month-cell ${i === pickerMonth ? 'active' : ''} ${i === month && pickerYear === year ? 'current' : ''}`}
                    onClick={() => {
                      setPickerMonth(i);
                      onGoToDate(pickerYear, i);
                      setShowPicker(false);
                    }}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div className="goto-picker-actions">
                <button className="goto-cancel" onClick={() => setShowPicker(false)}>Cancel</button>
                <button className="goto-confirm" onClick={handleGoTo}>Go</button>
              </div>
            </div>
          )}
        </div>

        <button
          className="nav-today-btn"
          onClick={onToday}
          id="nav-today"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default memo(NavigationBar);
