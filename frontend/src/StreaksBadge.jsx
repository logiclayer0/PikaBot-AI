import React from 'react';

export default function StreaksBadge({ streak, xp }) {
  const currentLevel = Math.floor(xp / 100) + 1;
  const progressToNextLevel = xp % 100;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '6px 14px',
        borderRadius: '20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#ff9f43'
        }}
      >
        <span>🔥</span>
        <span>{streak} DAY STREAK</span>
      </div>

      <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.15)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#94a3b8',
            fontWeight: 500
          }}
        >
          <span>LVL {currentLevel}</span>
          <span style={{ color: '#00f2fe' }}>{xp} XP</span>
        </div>

        <div
          style={{
            width: '70px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progressToNextLevel}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00f2fe, #4facfe)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
