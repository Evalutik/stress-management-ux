import { useState, useRef } from 'react';
import { onStressLevelChange, onThresholdEvent, RoomData, ThresholdEvent } from '../services/firebase';
import './PhoneDashboard.css';

// Import components
import LoginScreen from '../components/LoginScreen';
import HomeView from '../components/HomeView';
import HistoryView from '../components/HistoryView';
import ActivityDetailView from '../components/ActivityDetailView';
import ActivitiesListView from '../components/ActivitiesListView';
import DailyStatsView from '../components/DailyStatsView';
import SettingsView from '../components/SettingsView';
import { Activity } from '../components/data';

interface HistoryNotification {
    id: number;
    message: string;
    threshold: number;
    timestamp: Date;
    assignedActivity?: Activity;
}

interface ToastNotification {
    id: number;
    message: string;
    threshold: number;
}

type ViewType = 'home' | 'activities' | 'activityDetail' | 'history' | 'dailyStats' | 'settings';

export default function PhoneDashboard() {
    const [roomId, setRoomId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [stressLevel, setStressLevel] = useState(0);
    const [activeTab, setActiveTab] = useState<'stress' | 'activities'>('stress');
    const [currentView, setCurrentView] = useState<ViewType>('home');
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const [notificationHistory, setNotificationHistory] = useState<HistoryNotification[]>([]);
    const [activeNotificationId, setActiveNotificationId] = useState<number | null>(null);
    const [snoozeDurationMinutes, setSnoozeDurationMinutes] = useState(15);
    const [snoozeFeedback, setSnoozeFeedback] = useState<string | null>(null);
    const lastEventCountRef = useRef(0);
    const toastIdRef = useRef(0);

    const handleConnect = () => {
        if (roomId.trim()) {
            setIsConnected(true);
            lastEventCountRef.current = 0;

            onStressLevelChange(roomId, (data: RoomData | null) => {
                if (data) setStressLevel(data.stressLevel);
            });

            onThresholdEvent(roomId, (events) => {
                if (events) {
                    const eventList = Object.values(events);
                    if (eventList.length > lastEventCountRef.current) {
                        const newEvents = eventList.slice(lastEventCountRef.current);
                        newEvents.forEach((event: ThresholdEvent) => {
                            const id = toastIdRef.current++;
                            const notification = {
                                id,
                                message: `Stress level reached ${event.threshold}%`,
                                threshold: event.threshold,
                                timestamp: new Date()
                            };

                            setToasts(prev => [...prev, notification]);
                        });
                        lastEventCountRef.current = eventList.length;
                    }
                }
            });
        }
    };

    const handleActivitySelect = (activity: Activity) => {
        if (activeNotificationId !== null) {
            setNotificationHistory(prev => prev.map(n =>
                n.id === activeNotificationId ? { ...n, assignedActivity: activity } : n
            ));
            setActiveNotificationId(null);
            setCurrentView('history');
        } else {
            setSelectedActivity(activity);
            setCurrentView('activityDetail');
        }
    };

    const handleViewActivities = (notificationId: number) => {
        setActiveNotificationId(notificationId);
        setCurrentView('activities');
    };

    const handleNavigate = (view: ViewType) => {
        setCurrentView(view);
        if (view === 'activities') {
            setActiveTab('activities');
        } else if (view === 'home') {
            setActiveTab('stress');
        }
    };

    const handleLogout = () => {
        setIsConnected(false);
        setRoomId('');
        setCurrentView('home');
        setStressLevel(0);
        setNotificationHistory([]);
    };

    const handleSnooze = (toastId: number) => {
        const toast = toasts.find(t => t.id === toastId);
        if (toast) {
            // Add to history without activity
            const historyNotif: HistoryNotification = {
                id: toast.id,
                message: toast.message,
                threshold: toast.threshold,
                timestamp: new Date()
            };
            setNotificationHistory(prev => [historyNotif, ...prev]);
        }
        // Remove from active toasts
        setToasts(prev => prev.filter(t => t.id !== toastId));
        // Show feedback
        setSnoozeFeedback(`Reminder set for ${snoozeDurationMinutes} minutes`);
        setTimeout(() => setSnoozeFeedback(null), 3000);
    };

    const handleDoActivity = (toast: ToastNotification) => {
        // Add to history first
        const historyNotif: HistoryNotification = {
            id: toast.id,
            message: toast.message,
            threshold: toast.threshold,
            timestamp: new Date()
        };
        setNotificationHistory(prev => [historyNotif, ...prev]);
        // Remove from active toasts
        setToasts(prev => prev.filter(t => t.id !== toast.id));
        // Set active notification for activity assignment
        setActiveNotificationId(toast.id);
        // Navigate to activities
        setCurrentView('activities');
    };

    // Login Screen
    if (!isConnected) {
        return (
            <LoginScreen
                roomId={roomId}
                onRoomIdChange={setRoomId}
                onConnect={handleConnect}
            />
        );
    }

    // History View
    if (currentView === 'history') {
        return (
            <HistoryView
                notificationHistory={notificationHistory}
                onBack={() => setCurrentView('home')}
                onViewActivities={handleViewActivities}
                onNavigate={handleNavigate}
                onSettingsClick={() => setCurrentView('settings')}
            />
        );
    }

    // Activity Detail View
    if (currentView === 'activityDetail' && selectedActivity) {
        return (
            <ActivityDetailView
                activity={selectedActivity}
                onBack={() => setCurrentView('home')}
                onNavigate={handleNavigate}
                onSettingsClick={() => setCurrentView('settings')}
            />
        );
    }

    // Activities List View
    if (currentView === 'activities') {
        return (
            <ActivitiesListView
                onBack={() => setCurrentView('home')}
                onActivitySelect={handleActivitySelect}
                onNavigate={handleNavigate}
                onSettingsClick={() => setCurrentView('settings')}
            />
        );
    }

    // Daily Stats View
    if (currentView === 'dailyStats') {
        return (
            <DailyStatsView
                onBack={() => setCurrentView('home')}
                onNavigate={handleNavigate}
                onSettingsClick={() => setCurrentView('settings')}
            />
        );
    }

    // Settings View
    if (currentView === 'settings') {
        return (
            <SettingsView
                roomId={roomId}
                snoozeDuration={snoozeDurationMinutes}
                onSnoozeDurationChange={setSnoozeDurationMinutes}
                onBack={() => setCurrentView('home')}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />
        );
    }

    // Main Dashboard (Home)
    return (
        <HomeView
            stressLevel={stressLevel}
            toasts={toasts}
            snoozeFeedback={snoozeFeedback}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onHistoryClick={() => setCurrentView('history')}
            onDailyStatsClick={() => setCurrentView('dailyStats')}
            onSettingsClick={() => setCurrentView('settings')}
            onActivitySelect={handleActivitySelect}
            onNavigate={handleNavigate}
            onSnooze={handleSnooze}
            onDoActivity={handleDoActivity}
        />
    );
}
