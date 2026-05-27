/**
 * -------------------------------------------------------
 * File: ChatAssistant.jsx
 * Purpose: A global slide-out React chat helper enabling students
 * to ask career and programming questions.
 *
 * Responsibilities:
 * - Maintains a toggleable, overlay assistant chat window
 * - Manages typing simulation loading states and automatic scroll down
 * - Filters hello message history from being submitted to LLM memory contexts
 * - Formats AI markdown responses, custom styling code snippets
 *
 * Dependencies:
 * - react
 * - react-markdown
 * - @heroicons/react
 * - authService (authorized Express Axios Client)
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/authService';
import { 
    ChatBubbleLeftRightIcon, 
    PaperAirplaneIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * Slide-out float button chat assistant UI.
 */
const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm SkillLens AI. How can I help you today with your career or technical doubts?" }] }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const windowRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (windowRef.current && !windowRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    /**
     * Submits active input to Express AI chat endpoint, appending the returned answer.
     */
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', parts: [{ text: input }] };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { 
                message: input,
                history: messages
                    .filter(msg => msg.parts[0].text !== "Hello! I'm SkillLens AI. How can I help you today with your career or technical doubts?") 
                    .map(m => ({
                        role: m.role,
                        parts: m.parts
                    }))
            });
            
            setMessages([...newMessages, { role: 'model', parts: [{ text: res.data.reply }] }]);
        } catch (err) {
            console.error("Chat Error:", err);
            let errorMsg = "Sorry, I encountered an error. Please try again later.";
            
            if (err.response) {
                if (err.response.status === 429) {
                    errorMsg = "I'm a bit overwhelmed with requests right now! Please wait a few seconds and try again.";
                } else if (err.response.data && err.response.data.error) {
                    errorMsg = `AI Error: ${err.response.data.error}`;
                }
            }
            
            setMessages([...newMessages, { role: 'model', parts: [{ text: errorMsg }] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            {isOpen && (
                <div className="chat-window" ref={windowRef}>
                    <div className="chat-header">
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>SkillLens AI Mentor</h3>
                            <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>Powered by Gemini Pro</span>
                        </div>
                        <button 
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            title="Close Chat"
                        >
                            <XMarkIcon style={{ width: '1.25rem' }} />
                        </button>
                    </div>

                    <div className="chat-messages" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-model'}`}
                            >
                                <ReactMarkdown 
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            return (
                                                <code 
                                                    style={{ 
                                                        background: inline ? 'rgba(0,0,0,0.05)' : '#1e1e1e', 
                                                        color: inline ? 'inherit' : '#d4d4d4',
                                                        padding: inline ? '2px 4px' : '12px',
                                                        borderRadius: '6px',
                                                        display: inline ? 'inline' : 'block',
                                                        fontSize: '0.85rem',
                                                        overflowX: 'auto',
                                                        margin: inline ? '0' : '12px 0',
                                                        fontFamily: "'Fira Code', 'Courier New', monospace",
                                                        lineHeight: '1.6'
                                                    }} 
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            )
                                        },
                                        p: ({children}) => <p style={{ margin: '0 0 10px 0' }}>{children}</p>,
                                        ul: ({children}) => <ul style={{ paddingLeft: '22px', margin: '10px 0' }}>{children}</ul>,
                                        ol: ({children}) => <ol style={{ paddingLeft: '22px', margin: '10px 0' }}>{children}</ol>,
                                        li: ({children}) => <li style={{ marginBottom: '6px' }}>{children}</li>
                                    }}
                                >
                                    {msg.parts[0].text}
                                </ReactMarkdown>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message chat-message-model">
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '4px' }}>Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-area">
                        <input
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your question..."
                            disabled={loading}
                        />
                        <button 
                            className="chat-send-btn"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                        >
                            <PaperAirplaneIcon style={{ width: '1.25rem' }} />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button 
                    className="chat-bubble"
                    onClick={() => setIsOpen(true)}
                    title="Open AI Assistant"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ChatBubbleLeftRightIcon style={{ width: '2rem' }} />
                </button>
            )}
        </div>
    );
};

const styles = {}; // Kept for safety if anything missed, but now using classes

export default ChatAssistant;
