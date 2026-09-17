import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LifeManager({ username, API_URL }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Study');
  const [priority, setPriority] = useState('High');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/life/tasks/${username}`);
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (username) fetchTasks();
  }, [username]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const taskFormatted = `[${category}] [${priority}] ${newTask} (Scheduled: ${scheduledTime})`;
    try {
      const res = await axios.post(`${API_URL}/life/task/add`, {
        username,
        task_text: taskFormatted
      });
      
      const createdTask = res.data.task || {
        id: Date.now(),
        text: taskFormatted,
        completed: false
      };

      setTasks(prev => [...prev, createdTask]);
      setNewTask('');
    } catch (e) {
      const fallbackTask = {
        id: Date.now(),
        text: taskFormatted,
        completed: false
      };
      setTasks(prev => [...prev, fallbackTask]);
      setNewTask('');
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.post(`${API_URL}/life/task/toggle`, { task_id: id });
    } catch (e) {
      console.error(e);
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="life-container">
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>PikaBot Executive Schedule Engine</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Autonomous task tracking, priority scheduling & life execution.</p>
          </div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            {completedCount}/{tasks.length} Targets ({progress}%)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 100px 1fr 130px', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ background: '#0f1420', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px', padding: '10px' }}
          >
            <option value="Study">📚 Study</option>
            <option value="Work">💼 Work</option>
            <option value="Health">🧘 Health</option>
            <option value="Personal">⚙️ System</option>
          </select>

          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ background: '#0f1420', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px', padding: '10px' }}
          >
            <option value="High">🔴 High</option>
            <option value="Med">🟡 Med</option>
            <option value="Low">🟢 Low</option>
          </select>

          <input 
            type="time" 
            value={scheduledTime} 
            onChange={(e) => setScheduledTime(e.target.value)}
            style={{ background: '#0f1420', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px', padding: '10px' }}
          />

          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Type your execution objective..."
            style={{ background: '#0f1420', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
          />

          <button className="btn-primary" onClick={addTask}>Add Target</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px border-dashed var(--panel-border)' }}>
              No targets scheduled. Add a task above to begin tracking execution.
            </div>
          ) : (
            tasks.map(t => (
              <div 
                key={t.id} 
                className={`task-item ${t.completed ? 'done' : ''}`} 
                onClick={() => toggleTask(t.id)} 
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{t.completed ? '✅' : '🎯'}</span>
                  <span style={{ fontSize: '0.95rem', color: t.completed ? '#94a3b8' : '#f1f5f9', textDecoration: t.completed ? 'line-through' : 'none' }}>
                    {t.text}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: t.completed ? '#4cd137' : '#00f2fe', background: 'rgba(0, 242, 254, 0.05)', padding: '4px 10px', borderRadius: '4px' }}>
                  {t.completed ? 'EXECUTED' : 'ACTIVE TARGET'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Telemetry & Alarms</h4>
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SCHEDULED REMINDER ALARM</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#00f2fe', marginTop: '4px' }}>⏰ 09:00 PM - Focus Session</div>
        </div>
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>COGNITIVE AGENT MODEL</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#4facfe', marginTop: '4px' }}>PikaBot AI Architecture v2.4</div>
        </div>
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>EXECUTION METRIC</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ff9f43', marginTop: '4px' }}>{progress}% Target Completion</div>
        </div>
      </div>
    </div>
  );
}
