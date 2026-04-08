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
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const triggerSavePulse = useCallback(() => {
    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setIsSaving(false), 1500);
  }, []);

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
      triggerSavePulse();
    }, 600);
  }, [year, month, triggerSavePulse]);

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
      triggerSavePulse();
    }, 600);
  }, [rangeStart, rangeEnd, triggerSavePulse]);

  const currentText = activeTab === 'month' ? monthText : rangeText;
  const maxChars = 500;

  const hasRange = rangeStart != null;
  const rangeLabelText = rangeStart
    ? formatDateRange(rangeStart, rangeEnd) || 'Select end date...'
    : 'No dates selected';

  return (
    <div className="notes-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-sm)', borderBottom: '2px solid var(--text-primary)' }}>
        <h2 className="notes-title" style={{ paddingBottom: 0, borderBottom: 'none', margin: 0 }}>Notes</h2>
        <span style={{
          fontSize: '0.75rem',
          color: '#10b981', // Tailwind emerald-500
          fontWeight: 700,
          opacity: isSaving ? 1 : 0,
          transform: isSaving ? 'translateY(0)' : 'translateY(4px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}>
          ✓ Saved
        </span>
      </div>

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
        style={{
          boxShadow: isSaving ? 'inset 0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
          transition: 'box-shadow 0.4s ease'
        }}
      />

      {/* Char count */}
      <div className="notes-char-count">
        {(activeTab === 'month' ? monthText : rangeText).length} / {maxChars}
      </div>
    </div>
  );
}

export default memo(NotesPanel);
