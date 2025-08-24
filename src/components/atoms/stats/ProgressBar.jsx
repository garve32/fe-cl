import React from 'react';

function ProgressBar({ percentage, color = 'bg-blue-500' }) {
  return (
    <div className="bg-gray-200 h-2 rounded-full w-full">
      <div
        className={`${color} duration-500 ease-out h-2 rounded-full transition-all`}
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  );
}

export default ProgressBar;
