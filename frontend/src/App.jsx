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
    utterance.pitch = 1.1;
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
      speakText(botReply);
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection Error!' }]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser does not support Speech Recognition.');
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="glass-container">
      <div className="header">
        <div className="brand">⚡ PikaBot OS</div>
        <div className="header-actions">
          <button 
            className={`btn-icon ${ttsEnabled ? 'active' : ''}`}
            onClick={() => {
              if (ttsEnabled) window.speechSynthesis.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
            title="Toggle Voice Response"
          >
            {ttsEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>

          {user && (
            <>
              <StreaksBadge streak={stats.streak} xp={stats.xp} />
              <div className="tab-buttons" style={{ display: 'inline-flex', gap: '8px', marginLeft: '10px' }}>
                <button 
                  className={`btn-secondary ${activeTab === 'chat' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('chat')}
                >
                  💬 Chat
                </button>
                <button 
                  className={`btn-secondary ${activeTab === 'life' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('life')}
                >
                  📅 Life OS
                </button>
              </div>
              <span className="user-badge" style={{ marginLeft: '10px' }}>👤 {user}</span>
            </>
          )}
        </div>
      </div>

      {!user && (
        <div className="auth-overlay">
          <div className="auth-card">
            <h3>{authMode === 'login' ? 'Login to PikaBot OS' : 'Register Account'}</h3>
            {authError && <p className="error">{authError}</p>}
            <input
              type="text"
              placeholder="Username"
              value={authData.username}
              onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />
            <button className="btn-primary" onClick={handleAuth}>
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
            <p className="toggle-auth" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
            </p>
          </div>
        </div>
      )}

      {user && (
        <>
          {activeTab === 'chat' ? (
            <div className="chat-window">
              {messages.length === 0 && (
                <div className="welcome-box">
                  <h3>Hey {user}! Welcome to PikaBot OS ⚡</h3>
                  <p>Select a quick prompt or type anything below:</p>
                  <div className="quick-chips">
                    <button onClick={() => sendMessage("Explain Python decorators simply")}>💡 Explain Code</button>
                    <button onClick={() => sendMessage("Give me 3 futuristic project ideas for AI")}>🚀 AI Ideas</button>
                    <button onClick={() => sendMessage("Tell me a quick developer joke")}>😄 Dev Joke</button>
                  </div>
                </div>
              )}

              {messages.map((m, idx) => (
                <div key={idx} className={`msg-row ${m.role}`}>
                  <div className="msg-bubble">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                    {m.role === 'assistant' && (
                      <div className="bubble-footer">
                        <button className="copy-btn" onClick={() => copyToClipboard(m.content)}>📋 Copy</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LifeManager username={user} API_URL={API_BASE} />
          )}

          {activeTab === 'chat' && (
            <div className="input-bar">
              <button
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={startVoiceInput}
                title="Voice Command"
              >
                🎙️
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask PikaBot anything..."
              />
              <button className="btn-primary" onClick={() => sendMessage()}>Send</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
