import React from 'react';
export default function AnalyticsDashboard({ stats, username }) {
  const currentLevel = Math.floor(stats.xp / 100) + 1;
  const xpProgress = stats.xp % 100;

  return (
    <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Telemetry & Neural Analytics</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Real-time cognitive performance & engagement tracking for operator <span style={{ color: '#00f2fe' }}>{username}</span>.
          </p>
        </div>
        <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '6px 14px', borderRadius: '8px', color: '#00f2fe', fontSize: '0.8rem', fontWeight: 600 }}>
          SYSTEM HEALTH: 99.9%
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>CONSISTENCY SCORE</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ff9f43' }}>🔥 {stats.streak} Days</span>
          <span style={{ fontSize: '0.75rem', color: '#4facfe' }}>Active streak multiplier applied</span>
        </div>

        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL EXPERIENCE</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00f2fe' }}>⚡ {stats.xp} XP</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{100 - xpProgress} XP to Level {currentLevel + 1}</span>
        </div>

        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>OPERATOR RANK</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#7f00ff' }}>LVL {currentLevel}</span>
          <span style={{ fontSize: '0.75rem', color: '#4cd137' }}>Tier 1 Copilot Access</span>
        </div>
      </div>

      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Level Advancement Status</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
          <span>Level {currentLevel}</span>
          <span style={{ color: '#00f2fe' }}>{xpProgress} / 100 XP</span>
          <span>Level {currentLevel + 1}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${xpProgress}%`, height: '100%', background: 'linear-gradient(90deg, #00f2fe, #7f00ff)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
        </div>
      </div>
    </div>
  );
}
