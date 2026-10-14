import React from 'react';

export const LoadingSkeleton = ({ count = 4, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="shimmer h-3 rounded w-2/3" />
            <div className="shimmer h-8 rounded w-1/2" />
            <div className="shimmer h-3 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="shimmer h-5 rounded w-1/4" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shimmer h-10 rounded w-full" />
      ))}
    </div>
  );
};
