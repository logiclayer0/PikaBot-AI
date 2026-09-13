import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import StreaksBadge from './StreaksBadge';
import LifeManager from './LifeManager';
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

  const speakText = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const fetchStats = async (username) => {
    try {
      const res = await axios.get(`${API_BASE}/stats/${username}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async () => {
    setAuthError('');
    if (!authData.username || !authData.password) return;
    try {
      if (authMode === 'login') {
        const res = await axios.post(`${API_BASE}/auth/login`, authData);
        const loggedUser = res.data.username || authData.username;
        setUser(loggedUser);
        fetchStats(loggedUser);
      } else {
        await axios.post(`${API_BASE}/auth/register`, authData);
        setAuthMode('login');
      }
    } catch (err) {
      setAuthError(err.response?.data?.detail || 'Authentication Failed');
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
      speakText(botReply);
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Engine Error: Connection lost.' }]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition unsupported in this browser environment.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.start();
  };

  return (
    <div className="glass-container">
      <div className="header">
        <div className="brand">
          <span>⚡</span> PIKABOT OS <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '4px', color: '#00f2fe' }}>PRO v2.4</span>
        </div>

        {user && (
          <div className="header-actions">
            <StreaksBadge streak={stats.streak} xp={stats.xp} />
            <div className="tab-nav">
              <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                🧠 Copilot
              </button>
              <button className={`tab-btn ${activeTab === 'life' ? 'active' : ''}`} onClick={() => setActiveTab('life')}>
                📊 Life OS
              </button>
            </div>
            <button 
              onClick={() => setTtsEnabled(!ttsEnabled)}
              style={{ background: 'transparent', border: '1px solid var(--panel-border)', color: ttsEnabled ? '#00f2fe' : '#94a3b8', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              {ttsEnabled ? '🔊 Audio On' : '🔇 Audio Muted'}
            </button>
          </div>
        )}
      </div>

      {!user ? (
        <div className="auth-overlay">
          <div className="auth-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{authMode === 'login' ? 'Authenticate System' : 'Create Intelligence Account'}</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Enter credentials to synchronize personal workspace.</p>
            {authError && <p style={{ color: '#ff4757', fontSize: '0.8rem' }}>{authError}</p>}
            <input
              type="text"
              placeholder="Operator ID / Username"
              value={authData.username}
              onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Access Key / Password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />
            <button className="btn-primary" style={{ height: '42px' }} onClick={handleAuth}>
              {authMode === 'login' ? 'Initialize Session' : 'Register Operator'}
            </button>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer', textAlign: 'center' }} onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'New operator? Request Access' : 'Existing session? Log In'}
            </p>
          </div>
        </div>
      ) : (
        <div className="main-body">
          {activeTab === 'chat' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="chat-window">
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', margin: 'auto', maxWidth: '500px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>PikaBot AI Copilot Online</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Autonomous agent ready for complex analysis, software execution, and lifestyle scheduling.</p>
                  </div>
                )}
                {messages.map((m, idx) => (
                  <div key={idx} className={`msg-row ${m.role}`}>
                    <div className="msg-bubble">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
              <div className="input-bar">
                <button 
                  onClick={startVoiceInput} 
                  style={{ background: isListening ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '0 14px', color: isListening ? '#ff4757' : '#fff', cursor: 'pointer' }}
                >
                  🎙️
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Execute command or consult intelligence agent..."
                />
                <button className="btn-primary" onClick={() => sendMessage()}>Execute</button>
              </div>
            </div>
          ) : (
            <LifeManager username={user} API_URL={API_BASE} />
          )}
        </div>
      )}
    </div>
  );
}
