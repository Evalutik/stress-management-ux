import { useState, useEffect } from 'react';
import { setStressLevel, onThresholdEvent, ThresholdEvent, resetRoom, ChatMessage, onChatMessages, sendBotResponse } from '../services/firebase';

export default function DevPanel() {
    const [roomId, setRoomId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [stressLevel, setStressLevelState] = useState(0);
    const [events, setEvents] = useState<ThresholdEvent[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [responseText, setResponseText] = useState('');
    const [pendingMessage, setPendingMessage] = useState<ChatMessage | null>(null);

    const handleConnect = () => {
        if (roomId.trim()) {
            // Reset the room to clear old events and start fresh
            resetRoom(roomId).then(() => {
                setIsConnected(true);
                setEvents([]); // Clear local events state
                // Start listening to events
                onThresholdEvent(roomId, (eventData) => {
                    if (eventData) {
                        const eventList = Object.values(eventData);
                        setEvents(eventList);
                    } else {
                        setEvents([]);
                    }
                });
                // Start listening to chat messages
                onChatMessages(roomId, (messages) => {
                    setChatMessages(messages);
                    // Find pending user message (last user message without bot response after it)
                    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
                    const lastBotMsg = [...messages].reverse().find(m => m.sender === 'bot');
                    if (lastUserMsg && (!lastBotMsg || lastUserMsg.timestamp > lastBotMsg.timestamp)) {
                        setPendingMessage(lastUserMsg);
                    } else {
                        setPendingMessage(null);
                    }
                });
            });
        }
    };

    const handleSliderChange = (value: number) => {
        setStressLevelState(value);
        if (isConnected) {
            setStressLevel(roomId, value);
        }
    };

    const handleSendResponse = () => {
        if (!responseText.trim() || !pendingMessage) return;
        sendBotResponse(roomId, responseText.trim());
        setResponseText('');
    };

    useEffect(() => {
        // Generate a random room ID suggestion
        const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        setRoomId(randomId);
    }, []);

    if (!isConnected) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>Developer Control Panel</h1>
                <p style={styles.subtitle}>Enter a Room ID to start controlling the prototype</p>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Room ID (e.g., LAB1)"
                    style={styles.input}
                />
                <button onClick={handleConnect} style={styles.button}>
                    Start Session
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Developer Panel</h1>
                <div style={styles.roomBadge}>Room: {roomId}</div>
            </div>

            <div style={styles.sliderSection}>
                <h2 style={styles.sliderLabel}>Stress Level: {stressLevel}%</h2>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={stressLevel}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    style={styles.slider}
                />
                <div style={styles.sliderMarks}>
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Chat Response Section */}
            <div style={styles.chatSection}>
                <h3 style={styles.logTitle}>💬 AntiStressGPT Messages</h3>

                {pendingMessage ? (
                    <div style={styles.pendingMessage}>
                        <div style={styles.userMessage}>
                            <span style={styles.messageLabel}>User:</span>
                            <span>{pendingMessage.text}</span>
                        </div>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your response as AntiStressGPT..."
                            style={styles.textarea}
                            rows={3}
                        />
                        <button
                            onClick={handleSendResponse}
                            style={styles.sendButton}
                            disabled={!responseText.trim()}
                        >
                            Send Response
                        </button>
                    </div>
                ) : (
                    <p style={styles.noEvents}>No pending messages from user...</p>
                )}

                {chatMessages.length > 0 && (
                    <div style={styles.chatHistory}>
                        <h4 style={styles.historyTitle}>Chat History</h4>
                        {chatMessages.slice(-5).map((msg) => (
                            <div key={msg.id} style={msg.sender === 'user' ? styles.historyUser : styles.historyBot}>
                                <strong>{msg.sender === 'user' ? 'User' : 'Bot'}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={styles.logSection}>
                <h3 style={styles.logTitle}>Event Log</h3>
                <div style={styles.logList}>
                    {events.length === 0 ? (
                        <p style={styles.noEvents}>No threshold events yet...</p>
                    ) : (
                        events.map((event, i) => (
                            <div key={i} style={styles.logItem}>
                                ⚠️ Threshold {event.threshold}% reached
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        backgroundColor: '#0a0a0a',
        color: 'white',
        gap: '0.75rem',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: 0,
    },
    subtitle: {
        color: '#666',
        fontSize: '0.85rem',
        marginBottom: '0.75rem',
    },
    roomBadge: {
        backgroundColor: '#FF6B8A',
        color: '#fff',
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '0.8rem',
    },
    input: {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        textAlign: 'center',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        width: '180px',
        textTransform: 'uppercase',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '0.9rem',
        backgroundColor: '#FF6B8A',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    sliderSection: {
        width: '100%',
        maxWidth: '360px',
        textAlign: 'center',
    },
    sliderLabel: {
        fontSize: '1rem',
        marginBottom: '0.75rem',
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: '8px',
        cursor: 'pointer',
        accentColor: '#FF6B8A',
    },
    sliderMarks: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.4rem',
        color: '#666',
        fontSize: '0.7rem',
    },
    chatSection: {
        width: '100%',
        maxWidth: '360px',
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
    },
    pendingMessage: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    userMessage: {
        padding: '0.75rem',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        fontSize: '0.85rem',
        borderLeft: '3px solid #4ECDC4',
    },
    messageLabel: {
        fontWeight: '600',
        marginRight: '0.5rem',
        color: '#4ECDC4',
    },
    textarea: {
        padding: '0.75rem',
        fontSize: '0.85rem',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    sendButton: {
        padding: '0.6rem 1rem',
        fontSize: '0.85rem',
        backgroundColor: '#4ECDC4',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    chatHistory: {
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #333',
    },
    historyTitle: {
        fontSize: '0.75rem',
        color: '#666',
        marginBottom: '0.5rem',
    },
    historyUser: {
        fontSize: '0.75rem',
        padding: '0.4rem',
        backgroundColor: '#2a2a2a',
        borderRadius: '4px',
        marginBottom: '0.25rem',
    },
    historyBot: {
        fontSize: '0.75rem',
        padding: '0.4rem',
        backgroundColor: '#1a3a3a',
        borderRadius: '4px',
        marginBottom: '0.25rem',
    },
    logSection: {
        width: '100%',
        maxWidth: '360px',
        marginTop: '1rem',
    },
    logTitle: {
        fontSize: '0.9rem',
        marginBottom: '0.75rem',
        borderBottom: '1px solid #222',
        paddingBottom: '0.4rem',
        fontWeight: '500',
    },
    logList: {
        maxHeight: '150px',
        overflowY: 'auto',
    },
    logItem: {
        padding: '0.5rem 0.75rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '6px',
        marginBottom: '0.4rem',
        fontSize: '0.8rem',
        borderLeft: '3px solid #FF6B8A',
    },
    noEvents: {
        color: '#444',
        fontStyle: 'italic',
        fontSize: '0.8rem',
    },
};
