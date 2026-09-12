import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import StreaksBadge from './StreaksBadge';
import LifeManager from './LifeManager';
import { signInWithGoogle } from './firebase';
import './index.css';

const API_BASE = 'https://pikabot-ai.onrender.com';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ streak: 1, xp: 50 });
  const [activeTab, setActiveTab] = useState('chat');
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const fetchStats = async (username) => {
    try {
      const res = await axios.get(`${API_BASE}/stats/${username}`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const googleUser = result.user.displayName || result.user.email.split('@')[0];
      setUser(googleUser);
      fetchStats(googleUser);
    } catch (err) {
      setAuthError('Google Sign-In failed!');
    }
  };

  const handleAuth = async () => {
    setAuthError('');
    if (!authData.username || !authData.password) return;
    try {
      if (authMode === 'login') {
        const res = await axios.post(`${API_BASE}/auth/login`, authData);
        setUser(res.data.username);
        fetchStats(res.data.username);
      } else {
        await axios.post(`${API_BASE}/auth/register`, authData);
        setAuthMode('login');
      }
    } catch (err) {
      setAuthError(err.response?.data?.detail || 'Auth Error');
    }
  };

  const sendMessage = async (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;
    const newMsgs = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMsgs);
    if (!overrideText) setInput('');

    try {
      const res = await axios.post(`${API_BASE}/chat/message`, {
        username: user || 'guest',
        message: textToSend
      });
      const botReply = res.data.reply;
      setMessages([...newMsgs, { role: 'assistant', content: botReply }]);
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection Error!' }]);
    }
  };

  return (
    <div className="glass-container">
      <div className="header">
        <div className="brand">⚡ PikaBot OS</div>
        <div className="header-actions">
          {user && <StreaksBadge streak={stats.streak} xp={stats.xp} />}
          <div className="tab-buttons">
            <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>💬 Chat</button>
            <button className={activeTab === 'life' ? 'active' : ''} onClick={() => setActiveTab('life')}>📅 Life OS</button>
          </div>
          {user ? <span className="user-badge">👤 {user}</span> : null}
        </div>
      </div>

      {!user && (
        <div className="auth-overlay">
          <div className="auth-card">
            <h3>Welcome to PikaBot OS</h3>
            {authError && <p className="error">{authError}</p>}
            <button className="btn-google" onClick={handleGoogleSignIn}>🌐 Sign in with Google</button>
            <div className="divider">OR</div>
            <input placeholder="Username" onChange={(e) => setAuthData({ ...authData, username: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setAuthData({ ...authData, password: e.target.value })} />
            <button className="btn-primary" onClick={handleAuth}>{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button>
          </div>
        </div>
      )}

      {activeTab === 'chat' ? (
        <div className="chat-window">
          {messages.map((m, idx) => (
            <div key={idx} className={`msg-row ${m.role}`}>
              <div className="msg-bubble"><ReactMarkdown>{m.content}</ReactMarkdown></div>
            </div>
          ))}
          <div className="input-bar">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask PikaBot OS..." />
            <button className="btn-primary" onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      ) : (
        <LifeManager username={user} API_URL={API_BASE} />
      )}
    </div>
  );
}
