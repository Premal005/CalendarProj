'use client';

import { memo } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

function ThemeSwitcher({ theme, onThemeChange }) {
  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Theme selector">
      <button
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => onThemeChange('light')}
        aria-label="Light theme"
        title="Light"
        id="theme-light"
        role="radio"
        aria-checked={theme === 'light'}
      >
        <Sun size={16} />
      </button>
      <button
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => onThemeChange('dark')}
        aria-label="Dark theme"
        title="Dark"
        id="theme-dark"
        role="radio"
        aria-checked={theme === 'dark'}
      >
        <Moon size={16} />
      </button>
      <button
        className={`theme-btn ${theme === 'auto' ? 'active' : ''}`}
        onClick={() => onThemeChange('auto')}
        aria-label="Seasonal auto theme"
        title="Auto (Seasonal)"
        id="theme-auto"
        role="radio"
        aria-checked={theme === 'auto'}
      >
        <Palette size={16} />
      </button>
    </div>
  );
}

export default memo(ThemeSwitcher);
