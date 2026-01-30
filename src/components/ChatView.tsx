import { useState, useEffect, useRef } from 'react';
import { Home, Smile, Settings, MessageCircle, Send, X } from 'lucide-react';
import { ChatMessage, sendChatMessage, onChatMessages } from '../services/firebase';
import { Activity } from './data';

interface ChatViewProps {
    roomId: string;
    onNavigate: (view: 'home' | 'activities' | 'chat') => void;
    onSettingsClick: () => void;
    activityContext?: Activity | null;
    onClearContext?: () => void;
}

export default function ChatView({
    roomId,
    onNavigate,
    onSettingsClick,
    activityContext,
    onClearContext
}: ChatViewProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onChatMessages(roomId, (msgs) => {
            setMessages(msgs);
            // Check if waiting for response - last message is from user
            if (msgs.length > 0) {
                const lastMsg = msgs[msgs.length - 1];
                setIsWaitingForResponse(lastMsg.sender === 'user');
            }
        });
        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isWaitingForResponse) return;

        // Include activity context in message if present
        const messageText = activityContext
            ? `@${activityContext.name}: ${inputText.trim()}`
            : inputText.trim();

        await sendChatMessage(roomId, messageText);
        setInputText('');
        setIsWaitingForResponse(true);

        // Clear context after sending
        if (onClearContext) {
            onClearContext();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="dashboard-container">
            <header className="chat-header">
                <div className="chat-header-info">
                    <MessageCircle size={24} className="chat-header-icon" />
                    <div>
                        <h1 className="chat-title">AntiStressGPT</h1>
                        <span className="chat-subtitle">Your AI wellness companion</span>
                    </div>
                </div>
            </header>

            <main className="chat-main">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <MessageCircle size={48} className="chat-empty-icon" />
                        <p className="chat-empty-title">Start a conversation</p>
                        <p className="chat-empty-text">
                            Ask me anything about stress management, relaxation techniques, or just chat about how you're feeling.
                        </p>
                    </div>
                ) : (
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-message chat-message-${msg.sender}`}
                            >
                                <div className="chat-bubble">
                                    {msg.text}
                                </div>
                                <span className="chat-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {isWaitingForResponse && (
                            <div className="chat-message chat-message-bot">
                                <div className="chat-typing">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            <div className="chat-input-container">
                {activityContext && (
                    <div className="chat-context-badge">
                        <span>@{activityContext.name}</span>
                        <button className="context-badge-close" onClick={onClearContext}>
                            <X size={14} />
                        </button>
                    </div>
                )}
                <div className="chat-input-row">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={isWaitingForResponse ? "Waiting for response..." : "Type your message..."}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isWaitingForResponse}
                    />
                    <button
                        className={`chat-send-btn ${(!inputText.trim() || isWaitingForResponse) ? 'disabled' : ''}`}
                        onClick={handleSend}
                        disabled={!inputText.trim() || isWaitingForResponse}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item active" onClick={() => onNavigate('chat')}><MessageCircle size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
