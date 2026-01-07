import { useState } from 'react';
import { setStressLevel, onThresholdEvent, ThresholdEvent } from '../services/firebase';
import { useEffect } from 'react';

export default function DevPanel() {
    const [roomId, setRoomId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [stressLevel, setStressLevelState] = useState(0);
    const [events, setEvents] = useState<ThresholdEvent[]>([]);

    const handleConnect = () => {
        if (roomId.trim()) {
            setIsConnected(true);
            // Start listening to events
            onThresholdEvent(roomId, (eventData) => {
                if (eventData) {
                    const eventList = Object.values(eventData);
                    setEvents(eventList);
                }
            });
        }
    };

    const handleSliderChange = (value: number) => {
        setStressLevelState(value);
        if (isConnected) {
            setStressLevel(roomId, value);
        }
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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#1a1a2e',
        color: 'white',
        gap: '1rem',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#888',
        marginBottom: '1rem',
    },
    roomBadge: {
        backgroundColor: '#4ade80',
        color: '#000',
        padding: '0.5rem 1rem',
        borderRadius: '999px',
        fontWeight: 'bold',
    },
    input: {
        padding: '1rem',
        fontSize: '1.5rem',
        textAlign: 'center',
        borderRadius: '8px',
        border: 'none',
        width: '200px',
        textTransform: 'uppercase',
    },
    button: {
        padding: '1rem 2rem',
        fontSize: '1.2rem',
        backgroundColor: '#4ade80',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    sliderSection: {
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
    },
    sliderLabel: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
    },
    slider: {
        width: '100%',
        height: '20px',
        cursor: 'pointer',
    },
    sliderMarks: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        color: '#888',
    },
    logSection: {
        width: '100%',
        maxWidth: '500px',
        marginTop: '2rem',
    },
    logTitle: {
        marginBottom: '1rem',
        borderBottom: '1px solid #333',
        paddingBottom: '0.5rem',
    },
    logList: {
        maxHeight: '200px',
        overflowY: 'auto',
    },
    logItem: {
        padding: '0.75rem',
        backgroundColor: '#2a2a4e',
        borderRadius: '4px',
        marginBottom: '0.5rem',
    },
    noEvents: {
        color: '#666',
        fontStyle: 'italic',
    },
};
