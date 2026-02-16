import React from 'react';

function clampPercent(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(100, number));
}

export default function ProgressBar({ percent = 0 }) {
  const safePercent = clampPercent(percent);

  return (
    <div
      style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#e5e7eb',
        borderRadius: '999px',
        overflow: 'hidden',
      }}
      aria-label="progress"
    >
      <div
        style={{
          width: `${safePercent}%`,
          height: '100%',
          backgroundColor: '#2563eb',
          transition: 'width 0.2s ease',
        }}
      />
    </div>
  );
}
