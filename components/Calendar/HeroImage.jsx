'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { MONTH_NAMES, MONTH_IMAGES } from '@/lib/calendar';

function HeroImage({ month, year, direction }) {
  const [currentImage, setCurrentImage] = useState(MONTH_IMAGES[month]);
  const [prevImage, setPrevImage] = useState(null);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const newImage = MONTH_IMAGES[month];
    if (newImage !== currentImage) {
      setPrevImage(currentImage);
      setCurrentImage(newImage);
      setAnimating(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setAnimating(false);
        setPrevImage(null);
      }, 650);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [month]);

  // Determine font size based on month name length
  const monthName = MONTH_NAMES[month];
  const isLongName = monthName.length > 7;

  return (
    <div className="hero-section">
      {/* Previous image (fading out) */}
      {animating && prevImage && (
        <div className="hero-image-wrapper hero-flip-exit">
          <img src={prevImage} alt="" />
        </div>
      )}

      {/* Current image (flipping in) */}
      <div
        className={`hero-image-wrapper ${animating ? 'hero-flip-enter' : ''}`}
        key={`${month}-${year}`}
      >
        <img
          src={currentImage}
          alt={`${monthName} ${year} landscape`}
          loading="eager"
        />
      </div>

      {/* Floating glassmorphism date badge */}
      <div className="hero-tag-container">
        <div className="hero-tag-glass">
          <span className="hero-year">{year}</span>
          <span className={`hero-month ${isLongName ? 'hero-month-long' : ''}`}>{monthName}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(HeroImage);
