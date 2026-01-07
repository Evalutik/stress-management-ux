import { useState } from 'react';
import { onStressLevelChange, onThresholdEvent, RoomData, ThresholdEvent } from '../services/firebase';

export default function PhoneDashboard() {
    const [roomId, setRoomId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [stressLevel, setStressLevel] = useState(0);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [lastEventCount, setLastEventCount] = useState(0);

    const handleConnect = () => {
        if (roomId.trim()) {
            setIsConnected(true);

            // Listen to stress level
            onStressLevelChange(roomId, (data: RoomData | null) => {
                if (data) {
                    setStressLevel(data.stressLevel);
                }
            });

            // Listen to threshold events
            onThresholdEvent(roomId, (events) => {
                if (events) {
                    const eventList = Object.values(events);
                    if (eventList.length > lastEventCount) {
                        // New event(s) received
                        const newEvents = eventList.slice(lastEventCount);
                        newEvents.forEach((event: ThresholdEvent) => {
                            const message = `⚠️ Stress level reached ${event.threshold}%!`;
                            setNotifications((prev) => [message, ...prev].slice(0, 5));
                        });
                        setLastEventCount(eventList.length);
                    }
                }
            });
        }
    };

    const getStressEmoji = (level: number): string => {
        if (level <= 25) return '😊';
        if (level <= 50) return '😐';
        if (level <= 75) return '😟';
        return '😰';
    };

    const getStressColor = (level: number): string => {
        if (level <= 25) return '#4ade80';
        if (level <= 50) return '#facc15';
        if (level <= 75) return '#fb923c';
        return '#f87171';
    };

    if (!isConnected) {
        return (
            <div style={styles.setupContainer}>
                <h1 style={styles.appTitle}>Stress Manager</h1>
                <p style={styles.setupSubtitle}>Enter your Room ID to connect</p>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Room ID"
                    style={styles.input}
                />
                <button onClick={handleConnect} style={styles.button}>
                    Connect
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>Stress Status</h1>
                <span style={styles.roomTag}>{roomId}</span>
            </header>

            {/* Main Stress Display */}
            <div style={styles.stressCard}>
                <div
                    style={{
                        ...styles.emojiCircle,
                        backgroundColor: getStressColor(stressLevel),
                    }}
                >
                    <span style={styles.emoji}>{getStressEmoji(stressLevel)}</span>
                </div>
                <p style={styles.stressLabel}>Current Stress: {stressLevel}%</p>
            </div>

            {/* Notifications */}
            <div style={styles.notificationsSection}>
                <h2 style={styles.sectionTitle}>Notifications</h2>
                {notifications.length === 0 ? (
                    <p style={styles.noNotifications}>No alerts yet</p>
                ) : (
                    <div style={styles.notificationList}>
                        {notifications.map((msg, i) => (
                            <div key={i} style={styles.notification}>
                                {msg}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Suggestions (Static for now) */}
            <div style={styles.activitySection}>
                <h2 style={styles.sectionTitle}>Suggested Activities</h2>
                <div style={styles.activityGrid}>
                    {['🚶 Walk', '🎵 Music', '🧘 Breathe', '✏️ Draw'].map((activity) => (
                        <div key={activity} style={styles.activityCard}>
                            {activity}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    setupContainer: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        backgroundColor: '#fafafa',
        padding: '2rem',
    },
    appTitle: {
        fontSize: '2rem',
        color: '#333',
    },
    setupSubtitle: {
        color: '#666',
    },
    input: {
        padding: '1rem',
        fontSize: '1.5rem',
        textAlign: 'center',
        borderRadius: '12px',
        border: '2px solid #ddd',
        width: '180px',
        textTransform: 'uppercase',
    },
    button: {
        padding: '1rem 2rem',
        fontSize: '1.2rem',
        backgroundColor: '#ff6b8a',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    container: {
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '1.5rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.5rem',
        color: '#333',
    },
    roomTag: {
        backgroundColor: '#ff6b8a',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
    },
    stressCard: {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginBottom: '2rem',
    },
    emojiCircle: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        transition: 'background-color 0.5s ease',
    },
    emoji: {
        fontSize: '4rem',
    },
    stressLabel: {
        fontSize: '1.25rem',
        color: '#333',
        fontWeight: '600',
    },
    notificationsSection: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '1rem',
    },
    noNotifications: {
        color: '#999',
        fontStyle: 'italic',
    },
    notificationList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    notification: {
        backgroundColor: '#fff3cd',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        borderLeft: '4px solid #ffc107',
    },
    activitySection: {},
    activityGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
    },
    activityCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        textAlign: 'center',
        fontSize: '1.1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
};
