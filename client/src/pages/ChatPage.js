import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ChatPage.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: `# Welcome to your reading sanctuary 🌿

I'm **Sage**, your bibliotherapy guide. I believe that for every struggle, every joy, every question about life — there is a book waiting for you.

**How this works:**
- Tell me how you're feeling, what you're going through, or simply what's on your mind
- I'll suggest books carefully chosen to meet you where you are emotionally  
- Each recommendation comes with a music pairing to enhance your reading experience

*So — how are you feeling today? What's in your heart?*`
};

const SUGGESTED_PROMPTS = [
  "I've been feeling really anxious lately",
  "I'm dealing with grief and don't know where to turn",
  "I feel lost and don't know my purpose",
  "I want books that spark joy and wonder",
  "I'm going through a major life change",
  "I struggle with loneliness",
  "I want to cultivate more gratitude",
  "I'm healing from a difficult relationship"
];

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/📚 (.*?)(?:\n|$)/g, '<div class="book-rec">📚 $1</div>')
    .replace(/🎵 (.*?)(?:\n|$)/g, '<div class="music-rec">🎵 $1</div>')
    .replace(/# (.*?)(?:\n|$)/g, '<h3>$1</h3>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

export default function ChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [poweredBy, setPoweredBy] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.slice(1).slice(0, -1).map(m => ({ role: m.role, content: m.content }));

      const res = await axios.post('/api/chat', { message: msg, history });
      setPoweredBy(res.data.powered_by);

      const updatedMessages = [...newMessages, { role: 'assistant', content: res.data.response }];
      setMessages(updatedMessages);

      // Save chat history if logged in
      if (isLoggedIn) {
        try {
          await axios.post('/api/auth/chat-history', {
            messages: updatedMessages.slice(1).map(m => ({ role: m.role, content: m.content }))
          });
        } catch {}
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a quiet moment. Please try again in a moment. 🌿\n\n*Make sure the server is running on port 5000.*"
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div className="sage-avatar">🌿</div>
          <div>
            <h3>Sage</h3>
            <p>Bibliotherapy Guide</p>
          </div>
        </div>

        {isLoggedIn && (
          <div className="chat-user-badge">
            👤 {user?.name?.split(' ')[0]} · History saved
          </div>
        )}

        {poweredBy && (
          <div className={`ai-badge ${poweredBy === 'groq' ? 'gemini' : 'fallback'}`}>
            {poweredBy === 'groq' ? '✦ Powered by Groq AI' : '📚 Smart recommendations'}
          </div>
        )}

        <div className="sidebar-section">
          <h4>Suggested topics</h4>
          <div className="suggested-prompts">
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button key={i} className="prompt-chip" onClick={() => sendMessage(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section sidebar-about">
          <h4>What is Bibliotherapy?</h4>
          <p>
            Bibliotherapy uses the healing power of books to support mental and emotional wellbeing.
            Dating back to ancient Greece, it's the practice of finding in literature the mirror
            of our inner lives — and the window to new possibilities.
          </p>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar">🌿</div>
              )}
              <div className="message-bubble">
                <p dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
              </div>
              {msg.role === 'user' && (
                <div className="message-avatar user-av">
                  {isLoggedIn ? user?.name?.charAt(0).toUpperCase() : '👤'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar">🌿</div>
              <div className="message-bubble loading-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Share what's on your mind... Sage is listening 🌿"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : '→'}
          </button>
        </div>
        <p className="chat-hint">Press Enter to send • Shift+Enter for new line</p>
      </div>
    </div>
  );
}
