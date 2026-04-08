'use client';

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { FileText, CalendarRange } from 'lucide-react';
import { formatDateRange } from '@/lib/calendar';
import {
  getMonthNotes,
  setMonthNotes,
  getRangeNote,
  setRangeNote,
  getDateNote,
  setDateNote,
} from '@/lib/storage';

function NotesPanel({ month, year, rangeStart, rangeEnd }) {
  const [activeTab, setActiveTab] = useState('month'); // 'month' | 'range'
  const [monthText, setMonthText] = useState('');
  const [rangeText, setRangeText] = useState('');
  const debounceRef = useRef(null);

  // Load notes when month changes
  useEffect(() => {
    setMonthText(getMonthNotes(year, month));
  }, [year, month]);

  // Load range notes when selection changes
  useEffect(() => {
    if (rangeStart && rangeEnd) {
      setRangeText(getRangeNote(rangeStart, rangeEnd));
      setActiveTab('range');
    } else if (rangeStart && !rangeEnd) {
      const note = getDateNote(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
      setRangeText(note);
    } else {
      setRangeText('');
    }
  }, [rangeStart, rangeEnd]);

  // Debounced save for month notes
  const handleMonthChange = useCallback((e) => {
    const text = e.target.value;
    setMonthText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setMonthNotes(year, month, text);
    }, 400);
  }, [year, month]);

  // Debounced save for range/date notes
  const handleRangeChange = useCallback((e) => {
    const text = e.target.value;
    setRangeText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (rangeStart && rangeEnd) {
        setRangeNote(rangeStart, rangeEnd, text);
      } else if (rangeStart) {
        setDateNote(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate(), text);
      }
    }, 400);
  }, [rangeStart, rangeEnd]);

  const currentText = activeTab === 'month' ? monthText : rangeText;
  const maxChars = 500;

  const hasRange = rangeStart != null;
  const rangeLabelText = rangeStart
    ? formatDateRange(rangeStart, rangeEnd) || 'Select end date...'
    : 'No dates selected';

  return (
    <div className="notes-panel">
      <h2 className="notes-title">Notes</h2>

      {/* Tab switcher */}
      <div className="notes-tabs">
        <button
          className={`notes-tab ${activeTab === 'month' ? 'active' : ''}`}
          onClick={() => setActiveTab('month')}
          id="tab-month-notes"
        >
          <FileText size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Monthly
        </button>
        <button
          className={`notes-tab ${activeTab === 'range' ? 'active' : ''}`}
          onClick={() => setActiveTab('range')}
          id="tab-range-notes"
        >
          <CalendarRange size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Selection
        </button>
      </div>

      {/* Range label (only show in range tab) */}
      {activeTab === 'range' && (
        <div className="notes-range-label">
          {rangeLabelText}
        </div>
      )}

      {/* Textarea */}
      <textarea
        className="notes-textarea"
        value={activeTab === 'month' ? monthText : rangeText}
        onChange={activeTab === 'month' ? handleMonthChange : handleRangeChange}
        placeholder={
          activeTab === 'month'
            ? 'Jot down notes for this month...'
            : hasRange
              ? 'Add notes for the selected dates...'
              : 'Select a date or range first...'
        }
        maxLength={maxChars}
        disabled={activeTab === 'range' && !hasRange}
        id="notes-textarea"
        aria-label={activeTab === 'month' ? 'Monthly notes' : 'Date range notes'}
      />

      {/* Char count */}
      <div className="notes-char-count">
        {(activeTab === 'month' ? monthText : rangeText).length} / {maxChars}
      </div>
    </div>
  );
}

export default memo(NotesPanel);
