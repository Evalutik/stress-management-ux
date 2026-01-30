import { useState, useRef } from 'react';
import { onStressLevelChange, sendThresholdEvent, RoomData } from '../services/firebase';

// Safe vibration function that won't crash if not supported
const safeVibrate = (pattern: number | number[]): boolean => {
    try {
        if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
            return navigator.vibrate(pattern);
        }
    } catch (error) {
        console.warn('Vibration not supported or failed:', error);
    }
    return false;
};

// Vibration patterns for different stress levels (stronger for higher levels)
const getVibrationPattern = (threshold: number): number[] => {
    switch (threshold) {
        case 25:
            return [100]; // Single short vibration
        case 50:
            return [150, 100, 150]; // Two medium pulses
        case 75:
            return [200, 100, 200, 100, 200]; // Three strong pulses
        case 100:
            return [300, 100, 300, 100, 300, 100, 300]; // Four intense pulses
        default:
            return [100];
    }
};

export default function WatchLED() {
    const [roomId, setRoomId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [stressLevel, setStressLevel] = useState(0);
    const prevLevelRef = useRef(0);
    const thresholdsTriggeredRef = useRef<Set<number>>(new Set());

    const handleConnect = () => {
        if (roomId.trim()) {
            setIsConnected(true);
            onStressLevelChange(roomId, (data: RoomData | null) => {
                if (data) {
                    const newLevel = data.stressLevel;
                    const prevLevel = prevLevelRef.current;

                    // Check thresholds (only when crossing UP)
                    const thresholds = [25, 50, 75, 100];
                    thresholds.forEach((threshold) => {
                        if (prevLevel < threshold && newLevel >= threshold) {
                            if (!thresholdsTriggeredRef.current.has(threshold)) {
                                thresholdsTriggeredRef.current.add(threshold);
                                sendThresholdEvent(roomId, threshold);

                                // Trigger vibration for this threshold
                                safeVibrate(getVibrationPattern(threshold));
                            }
                        }
                    });

                    // Reset triggered thresholds when going below them
                    thresholds.forEach((threshold) => {
                        if (newLevel < threshold) {
                            thresholdsTriggeredRef.current.delete(threshold);
                        }
                    });

                    prevLevelRef.current = newLevel;
                    setStressLevel(newLevel);
                }
            });
        }
    };

    // Calculate color based on stress level (Green -> Yellow -> Red)
    const getBackgroundColor = (level: number): string => {
        if (level <= 25) {
            // Green to Yellow-Green
            const hue = 120 - (level / 25) * 30; // 120 (green) to 90
            return `hsl(${hue}, 80%, 50%)`;
        } else if (level <= 50) {
            // Yellow-Green to Yellow
            const hue = 90 - ((level - 25) / 25) * 30; // 90 to 60 (yellow)
            return `hsl(${hue}, 80%, 50%)`;
        } else if (level <= 75) {
            // Yellow to Orange
            const hue = 60 - ((level - 50) / 25) * 30; // 60 to 30 (orange)
            return `hsl(${hue}, 80%, 50%)`;
        } else {
            // Orange to Red
            const hue = 30 - ((level - 75) / 25) * 30; // 30 to 0 (red)
            return `hsl(${hue}, 80%, 50%)`;
        }
    };

    if (!isConnected) {
        return (
            <div style={styles.setupContainer}>
                <h2 style={styles.setupTitle}>Watch Setup</h2>
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
        <div
            style={{
                ...styles.ledContainer,
                backgroundColor: getBackgroundColor(stressLevel),
            }}
        >
            <span style={styles.levelText}>{stressLevel}%</span>
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
        backgroundColor: '#000',
        color: 'white',
    },
    setupTitle: {
        fontSize: '1.5rem',
    },
    input: {
        padding: '1rem',
        fontSize: '1.5rem',
        textAlign: 'center',
        borderRadius: '8px',
        border: 'none',
        width: '150px',
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
    ledContainer: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 1s ease-in-out',
    },
    levelText: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.3)',
        textShadow: '0 0 10px rgba(0,0,0,0.3)',
    },
};
