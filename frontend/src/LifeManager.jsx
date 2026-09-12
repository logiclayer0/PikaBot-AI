import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LifeManager({ username, API_URL }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/life/tasks/${username}`);
      setTasks(res.data.tasks);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (username) fetchTasks(); }, [username]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/life/task/add`, { username, task_text: newTask });
      setTasks([...tasks, res.data.task]);
      setNewTask('');
    } catch (e) { console.error(e); }
  };

  const toggleTask = async (id) => {
    try {
      await axios.post(`${API_URL}/life/task/toggle`, { task_id: id });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="life-manager-card">
      <h4>📅 Life OS & Habit Tracker</h4>
      <div className="task-input-group">
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add daily goal or study task..."
        />
        <button onClick={addTask}>+ Add</button>
      </div>
      <ul className="task-list">
        {tasks.map(t => (
          <li key={t.id} onClick={() => toggleTask(t.id)} className={t.completed ? 'done' : ''}>
            {t.completed ? '✅' : '⚪'} {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
