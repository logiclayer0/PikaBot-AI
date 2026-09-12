import React from 'react';

export default function StreaksBadge({ streak, xp }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/60 px-3 py-1.5 rounded-full border border-yellow-500/30">
      <span className="text-sm font-bold text-orange-400">🔥 {streak} Day Streak</span>
      <span className="text-gray-500">|</span>
      <span className="text-sm font-bold text-yellow-400">⚡ {xp} XP</span>
    </div>
  );
}
