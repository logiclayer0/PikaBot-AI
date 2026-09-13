import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LifeManager({ username, API_URL }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Study');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/life/tasks/${username}`);
      setTasks(res.data.tasks);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (username) fetchTasks();
  }, [username]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/life/task/add`, {
        username,
        task_text: `[${category}] ${newTask}`
      });
      setTasks([...tasks, res.data.task]);
      setNewTask('');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.post(`${API_URL}/life/task/toggle`, { task_id: id });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="life-container">
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Autonomous Task Engine</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Manage high-priority targets and daily workflows.</p>
          </div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            {completedCount}/{tasks.length} Completed ({progress}%)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '8px', padding: '0 12px' }}
          >
            <option value="Study">📚 Study</option>
            <option value="Work">💼 Work</option>
            <option value="Health">🧘 Health</option>
          </select>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new objective..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '12px', color: '#fff' }}
          />
          <button className="btn-primary" onClick={addTask}>Add Target</button>
        </div>

        <div>
          {tasks.map(t => (
            <div key={t.id} className={`task-item ${t.completed ? 'done' : ''}`} onClick={() => toggleTask(t.id)} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.text}</span>
              <span style={{ fontSize: '0.75rem', color: t.completed ? '#4cd137' : '#e1b12c' }}>
                {t.completed ? 'COMPLETED' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Cognitive Insights</h4>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>OPTIMAL FOCUS TIME</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#00f2fe', marginTop: '4px' }}>9:00 PM - 11:30 PM</div>
        </div>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SYSTEM HEALTH</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#4facfe', marginTop: '4px' }}>99.8% Efficiency</div>
        </div>
      </div>
    </div>
  );
}
