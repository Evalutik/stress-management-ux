import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, serverTimestamp, DataSnapshot, update } from 'firebase/database';

// Firebase configuration from environment variables
// Create a .env file in the project root with your Firebase credentials
// See .env.example for the required variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export interface RoomData {
    stressLevel: number;
    lastUpdated: number;
}

export interface ThresholdEvent {
    threshold: number;
    timestamp: number;
    acknowledged: boolean;
}

// Reset room - clears all data and starts fresh (called when Dev Panel starts session)
export function resetRoom(roomId: string) {
    const roomRef = ref(database, `rooms/${roomId}`);
    return set(roomRef, {
        stressLevel: 0,
        lastUpdated: Date.now()
    });
}

// Set stress level (from Dev Panel) - uses update() to preserve events
export function setStressLevel(roomId: string, level: number) {
    const roomRef = ref(database, `rooms/${roomId}`);
    return update(roomRef, {
        stressLevel: level,
        lastUpdated: Date.now()
    });
}


// Listen to stress level changes
export function onStressLevelChange(roomId: string, callback: (data: RoomData | null) => void) {
    const roomRef = ref(database, `rooms/${roomId}`);
    return onValue(roomRef, (snapshot: DataSnapshot) => {
        callback(snapshot.val() as RoomData | null);
    });
}

// Send threshold event (from Watch)
export function sendThresholdEvent(roomId: string, threshold: number) {
    const eventsRef = ref(database, `rooms/${roomId}/events`);
    return push(eventsRef, {
        threshold,
        timestamp: serverTimestamp(),
        acknowledged: false
    });
}

// Listen to threshold events (for Phone Dashboard)
export function onThresholdEvent(roomId: string, callback: (events: Record<string, ThresholdEvent> | null) => void) {
    const eventsRef = ref(database, `rooms/${roomId}/events`);
    return onValue(eventsRef, (snapshot: DataSnapshot) => {
        callback(snapshot.val() as Record<string, ThresholdEvent> | null);
    });
}

// Chat Message Interface
export interface ChatMessage {
    id?: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: number;
}

// Send chat message (from Phone - user message)
export function sendChatMessage(roomId: string, text: string) {
    const chatRef = ref(database, `rooms/${roomId}/chat`);
    return push(chatRef, {
        sender: 'user',
        text,
        timestamp: Date.now()
    });
}

// Send bot response (from Dev Dashboard)
export function sendBotResponse(roomId: string, text: string) {
    const chatRef = ref(database, `rooms/${roomId}/chat`);
    return push(chatRef, {
        sender: 'bot',
        text,
        timestamp: Date.now()
    });
}

// Listen to chat messages
export function onChatMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
    const chatRef = ref(database, `rooms/${roomId}/chat`);
    return onValue(chatRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
            const messages: ChatMessage[] = Object.entries(data).map(([id, msg]) => ({
                id,
                ...(msg as Omit<ChatMessage, 'id'>)
            }));
            messages.sort((a, b) => a.timestamp - b.timestamp);
            callback(messages);
        } else {
            callback([]);
        }
    });
}

export { database };
