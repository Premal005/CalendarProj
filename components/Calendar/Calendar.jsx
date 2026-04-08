'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSeasonForMonth, formatDateRange, isSameDay } from '@/lib/calendar';
import { getThemePreference, setThemePreference, getAllDateNotes } from '@/lib/storage';

import SpiralBinding from './SpiralBinding';
import HeroImage from './HeroImage';
import NavigationBar from './NavigationBar';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import ThemeSwitcher from './ThemeSwitcher';
import Confetti from './Confetti';

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [theme, setTheme] = useState('auto');
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const [allDateNotes, setAllDateNotes] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme and notes from localStorage on mount
  useEffect(() => {
    setMounted(true);
    setTheme(getThemePreference());
    setAllDateNotes(getAllDateNotes());
  }, []);

  // Refresh notes when month changes or when a note could have been saved
  useEffect(() => {
    const interval = setInterval(() => {
      setAllDateNotes(getAllDateNotes());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    const season = getSeasonForMonth(currentMonth);

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Season always applied for color accent
    document.documentElement.setAttribute('data-season', season);
  }, [theme, currentMonth, mounted]);

  // Check for confetti (New Year's)
  useEffect(() => {
    if (currentMonth === 0 && currentYear === today.getFullYear()) {
      const isNewYearsDay = today.getMonth() === 0 && today.getDate() === 1;
      if (isNewYearsDay) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [currentMonth, currentYear]);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setDirection(0);
  }, []);

  const handleDateClick = useCallback((date) => {
    setRangeStart((prevStart) => {
      if (!prevStart) {
        // First click: set start
        setRangeEnd(null);
        return date;
      }
      if (isSameDay(prevStart, date)) {
        // Clicking same date: deselect
        setRangeEnd(null);
        return null;
      }
      // Second click: check if we already have an end
      if (rangeEnd) {
        // Third click: restart selection
        setRangeEnd(null);
        return date;
      }
      // Set end date
      const start = prevStart.getTime() < date.getTime() ? prevStart : date;
      const end = prevStart.getTime() < date.getTime() ? date : prevStart;
      setRangeEnd(end);
      return start;
    });
  }, [rangeEnd]);

  const handleDateHover = useCallback((date) => {
    setHoverDate(date);
  }, []);

  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
    setThemePreference(newTheme);
  }, []);

  const handleClearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  const handleGoToDate = useCallback((year, month) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setDirection(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevMonth();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextMonth();
          break;
        case 'Escape':
          handleClearRange();
          break;
        case 't':
        case 'T':
          handleToday();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevMonth, handleNextMonth, handleClearRange, handleToday]);

  const rangeLabel = useMemo(() => {
    return formatDateRange(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  // Compute day count
  const dayCount = useMemo(() => {
    if (!rangeStart || !rangeEnd) return 0;
    const diff = Math.abs(rangeEnd.getTime() - rangeStart.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [rangeStart, rangeEnd]);

  // Prevent SSR mismatch
  if (!mounted) {
    return (
      <div className="page-wrapper">
        <div className="calendar-outer">
          <div className="calendar-container" style={{ minHeight: 600 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Confetti active={showConfetti} />
      <ThemeSwitcher theme={theme} onThemeChange={handleThemeChange} />

      <div className="page-wrapper">
        <div className="calendar-outer">
          <div className="calendar-container">
            {/* Spiral binding at top */}
            <SpiralBinding />

            {/* Hero image with month overlay */}
            <HeroImage
              month={currentMonth}
              year={currentYear}
              direction={direction}
            />

            {/* Navigation */}
            <NavigationBar
              month={currentMonth}
              year={currentYear}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onGoToDate={handleGoToDate}
            />

            {/* Range info bar */}
            {rangeStart && (
              <div className="range-info-bar">
                <span>
                  {rangeLabel}
                  {dayCount > 0 && ` · ${dayCount} day${dayCount > 1 ? 's' : ''}`}
                </span>
                <button className="clear-btn" onClick={handleClearRange} id="clear-selection">
                  Clear
                </button>
              </div>
            )}

            {/* Body: Notes + Grid */}
            <div className="calendar-body">
              <NotesPanel
                month={currentMonth}
                year={currentYear}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
              />
              <CalendarGrid
                month={currentMonth}
                year={currentYear}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                hoverDate={hoverDate}
                onDateClick={handleDateClick}
                onDateHover={handleDateHover}
                allDateNotes={allDateNotes}
              />
            </div>

            {/* Footer with keyboard hints */}
            <div className="calendar-footer">
              <span>© {today.getFullYear()} Wall Calendar</span>
              <div className="keyboard-hint">
                <span><kbd>←</kbd><kbd>→</kbd> Navigate months</span>
                <span><kbd>T</kbd> Today</span>
                <span><kbd>Esc</kbd> Clear selection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
