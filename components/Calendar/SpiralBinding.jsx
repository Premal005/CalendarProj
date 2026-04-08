'use client';

import { memo } from 'react';

function SpiralBinding() {
  const rings = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="spiral-binding" aria-hidden="true">
      {rings.map((i) => (
        <div key={i} className="spiral-ring" />
      ))}
    </div>
  );
}

export default memo(SpiralBinding);
