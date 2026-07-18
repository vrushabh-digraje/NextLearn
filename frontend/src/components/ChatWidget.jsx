import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Send, X, Bot, Sparkles, Trash2 } from 'lucide-react';

const ChatWidget = ({ courseId, lessonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && courseId && token) {
      fetchChatHistory();
    }
  }, [isOpen, courseId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || !courseId || loading) return;

    if (!textToSend) setInput('');
    setLoading(true);

    // Optimistically add user message to screen
    const tempUserMsg = {
      role: 'user',
      parts: [{ text }],
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lessonId, message: text }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        // Show error message as AI reply
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            parts: [{ text: `Error: ${data.message || 'Could not reach AI assistant.'}` }],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: 'Error connecting to the server.' }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear this chat history?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${courseId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to clear chat:', err);
      }
    }
  };

  // Basic formatter for code blocks in UI
  const formatMessageText = (text) => {
    if (!text) return '';

    // Split by triple backticks for code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3);

        return (
          <div key={index} style={{ position: 'relative', margin: '10px 0' }}>
            {lang && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'rgba(0,0,0,0.5)',
                padding: '2px 8px',
                borderTopLeftRadius: '6px',
                borderTopRightRadius: '6px',
                display: 'inline-block',
                borderBottom: '1px solid var(--border-color)'
              }}>
                {lang}
              </div>
            )}
            <pre style={{
              margin: 0,
              background: '#040711',
              padding: '12px',
              borderRadius: lang ? '0 6px 6px 6px' : '6px',
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <code style={{ fontFamily: 'monospace', color: '#e2e8f0', fontSize: '0.85rem' }}>{code}</code>
            </pre>
          </div>
        );
      }

      // Handle inline code `code`
      const inlineParts = part.split(/`([^`]+)`/g);
      return (
        <span key={index}>
          {inlineParts.map((subPart, subIndex) => {
            if (subIndex % 2 === 1) {
              return (
                <code key={subIndex} style={{
                  background: 'rgba(236,72,153,0.15)',
                  color: '#ec4899',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem'
                }}>
                  {subPart}
                </code>
              );
            }
            return subPart;
          })}
        </span>
      );
    });
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-trigger ${isOpen ? '' : 'active'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div style={{
                background: 'rgba(139, 92, 246, 0.15)',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Bot size={18} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Study Buddy <Sparkles size={12} color="#f59e0b" />
                </h3>
                <span className="chatbot-status">Active Context</span>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                padding: '20px',
                gap: '12px'
              }}>
                <Bot size={48} color="var(--text-muted)" style={{ opacity: 0.6 }} />
                <p style={{ fontSize: '0.9rem' }}>
                  Hey <strong>{user.name}</strong>! I'm your learning assistant. Ask me questions about this lesson, explain coding blocks, or request summaries!
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}
                >
                  {formatMessageText(msg.parts[0]?.text)}
                </div>
              ))
            )}

            {loading && (
              <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={14} color="#8b5cf6" />
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Help Chips */}
          <div className="chatbot-chips">
            <button className="chat-chip" onClick={() => handleSend('Can you explain this lesson in simple terms?')}>
              Explain Lesson
            </button>
            <button className="chat-chip" onClick={() => handleSend('Give me a 3-bullet point summary of this lesson.')}>
              Summarize
            </button>
            <button className="chat-chip" onClick={() => handleSend('Quiz me on this lesson with one multiple choice question!')}>
              Quiz Me
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chatbot-input-area"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask study buddy..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send-btn" disabled={loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
