import { useState, useRef, useEffect } from 'react';
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
import ActivityInstructionView from '../components/ActivityInstructionView';
import RatingModal from '../components/RatingModal';
import ChatView from '../components/ChatView';
import { Activity, getRandomActivity, activities } from '../components/data';

interface HistoryNotification {
    id: number;
    message: string;
    threshold: number;
    timestamp: Date;
    suggestedActivity: Activity;
    wasSnoozed: boolean;
    activityPerformed: boolean;
}

interface ToastNotification {
    id: number;
    message: string;
    threshold: number;
    suggestedActivity: Activity;
}

type ViewType = 'home' | 'activities' | 'activityDetail' | 'history' | 'dailyStats' | 'settings' | 'activityInstruction' | 'chat';

// Initialize random activity stats
const initializeActivityStats = () => {
    const counts: Record<string, number> = {};
    const ratings: Record<string, number> = {};
    activities.forEach(activity => {
        counts[activity.name] = Math.floor(Math.random() * 10) + 1;
        ratings[activity.name] = Math.round((Math.random() * 3 + 2) * 10) / 10; // 2.0-5.0
    });
    return { counts, ratings };
};

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
    const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});
    const [activityRatings, setActivityRatings] = useState<Record<string, number>>({});
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [pendingRatingActivity, setPendingRatingActivity] = useState<Activity | null>(null);
    const [chatActivityContext, setChatActivityContext] = useState<Activity | null>(null);
    const lastEventCountRef = useRef(0);
    const toastIdRef = useRef(0);

    // Initialize activity stats on first load
    useEffect(() => {
        const { counts, ratings } = initializeActivityStats();
        setActivityCounts(counts);
        setActivityRatings(ratings);
    }, []);

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
                            const suggestedActivity = getRandomActivity();

                            const notification: ToastNotification = {
                                id,
                                message: `Stress at ${event.threshold}%! Try: ${suggestedActivity.name}`,
                                threshold: event.threshold,
                                suggestedActivity
                            };

                            setToasts(prev => [...prev, notification]);

                            // Trigger vibration feedback
                            safeVibrate(getVibrationPattern(event.threshold));

                            // Also add to history immediately
                            const historyNotif: HistoryNotification = {
                                id,
                                message: `Stress level reached ${event.threshold}%`,
                                threshold: event.threshold,
                                timestamp: new Date(),
                                suggestedActivity,
                                wasSnoozed: false,
                                activityPerformed: false
                            };
                            setNotificationHistory(prev => [historyNotif, ...prev]);

                            // Auto-remove toast after animation completes (5s)
                            setTimeout(() => {
                                setToasts(prev => prev.filter(t => t.id !== id));
                            }, 5000);
                        });
                        lastEventCountRef.current = eventList.length;
                    }
                }
            });
        }
    };

    const handleActivitySelect = (activity: Activity) => {
        if (activeNotificationId !== null) {
            // User is selecting an alternative activity from the list
            setSelectedActivity(activity);
            setCurrentView('activityInstruction');
        } else {
            // Normal activity selection from activities tab
            setSelectedActivity(activity);
            setCurrentView('activityDetail');
        }
    };

    const handleViewActivities = (notificationId: number) => {
        setActiveNotificationId(notificationId);
        setCurrentView('activities');
    };

    const handleNavigate = (view: ViewType) => {
        // Clear active toasts when leaving home
        setToasts([]);
        setCurrentView(view);
        if (view === 'activities') {
            setActiveTab('activities');
        } else if (view === 'home') {
            setActiveTab('stress');
        }
    };

    const handleHistoryClick = () => {
        setToasts([]);
        setCurrentView('history');
    };

    const handleLogout = () => {
        setIsConnected(false);
        setRoomId('');
        setCurrentView('home');
        setStressLevel(0);
        setNotificationHistory([]);
        // Re-initialize stats on logout
        const { counts, ratings } = initializeActivityStats();
        setActivityCounts(counts);
        setActivityRatings(ratings);
    };

    const handleSnooze = (toastId: number) => {
        // Mark as snoozed in history
        setNotificationHistory(prev => prev.map(n =>
            n.id === toastId ? { ...n, wasSnoozed: true } : n
        ));
        // Remove from active toasts
        setToasts(prev => prev.filter(t => t.id !== toastId));
        // Show feedback
        setSnoozeFeedback(`Reminder set for ${snoozeDurationMinutes} minutes`);
        setTimeout(() => setSnoozeFeedback(null), 3000);
    };

    const handleDoActivity = (toast: ToastNotification) => {
        // Remove from active toasts
        setToasts(prev => prev.filter(t => t.id !== toast.id));
        // Set the suggested activity and notification id
        setActiveNotificationId(toast.id);
        setSelectedActivity(toast.suggestedActivity);
        // Navigate to instruction view
        setCurrentView('activityInstruction');
    };

    const handleDoSuggestedFromHistory = (notificationId: number, activity: Activity) => {
        setActiveNotificationId(notificationId);
        setSelectedActivity(activity);
        setCurrentView('activityInstruction');
    };

    const handleActivityDone = () => {
        if (selectedActivity) {
            // Increment activity count
            setActivityCounts(prev => ({
                ...prev,
                [selectedActivity.name]: (prev[selectedActivity.name] || 0) + 1
            }));
            // Store the activity for rating
            setPendingRatingActivity(selectedActivity);
        }
        // Mark as performed in history
        if (activeNotificationId !== null) {
            setNotificationHistory(prev => prev.map(n =>
                n.id === activeNotificationId ? { ...n, activityPerformed: true } : n
            ));
        }
        // Show rating modal
        setShowRatingModal(true);
    };

    const handleRatingSubmit = (rating: number) => {
        if (pendingRatingActivity) {
            // Update the rating (weighted average with existing)
            setActivityRatings(prev => {
                const currentRating = prev[pendingRatingActivity.name] || 3;
                const currentCount = activityCounts[pendingRatingActivity.name] || 1;
                // Simple weighted average: blend new rating with existing
                const newRating = Math.round(((currentRating * (currentCount - 1) + rating) / currentCount) * 10) / 10;
                return {
                    ...prev,
                    [pendingRatingActivity.name]: Math.min(5, Math.max(1, newRating))
                };
            });
        }
        // Close modal and reset
        setShowRatingModal(false);
        setPendingRatingActivity(null);
        setActiveNotificationId(null);
        setSelectedActivity(null);
        setCurrentView('home');
    };

    const handleRatingSkip = () => {
        // Just close without updating rating
        setShowRatingModal(false);
        setPendingRatingActivity(null);
        setActiveNotificationId(null);
        setSelectedActivity(null);
        setCurrentView('home');
    };

    const handleActivityBack = () => {
        // Activity was not completed, just navigate back
        setActiveNotificationId(null);
        setSelectedActivity(null);
        setCurrentView('home');
    };

    const handleGoToActivity = (activity: Activity) => {
        setSelectedActivity(activity);
        setCurrentView('activityInstruction');
    };

    const handleAskAI = (activity: Activity) => {
        setChatActivityContext(activity);
        setCurrentView('chat');
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

    // Rating Modal (overlay)
    if (showRatingModal && pendingRatingActivity) {
        return (
            <RatingModal
                activityName={pendingRatingActivity.name}
                onSubmit={handleRatingSubmit}
                onSkip={handleRatingSkip}
            />
        );
    }

    // Activity Instruction View
    if (currentView === 'activityInstruction' && selectedActivity) {
        return (
            <ActivityInstructionView
                activity={selectedActivity}
                onBack={handleActivityBack}
                onDone={handleActivityDone}
                onAskAI={handleAskAI}
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
                onDoSuggested={handleDoSuggestedFromHistory}
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
                activityCount={activityCounts[selectedActivity.name] || 0}
                activityRating={activityRatings[selectedActivity.name] || 0}
                onBack={() => setCurrentView('activities')}
                onGoToActivity={handleGoToActivity}
                onNavigate={handleNavigate}
                onSettingsClick={() => setCurrentView('settings')}
                onAskAI={handleAskAI}
            />
        );
    }

    // Activities List View
    if (currentView === 'activities') {
        return (
            <ActivitiesListView
                activityCounts={activityCounts}
                activityRatings={activityRatings}
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

    // Chat View
    if (currentView === 'chat') {
        return (
            <ChatView
                roomId={roomId}
                onNavigate={handleNavigate}
                onSettingsClick={() => setCurrentView('settings')}
                activityContext={chatActivityContext}
                onClearContext={() => setChatActivityContext(null)}
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
            onHistoryClick={handleHistoryClick}
            onDailyStatsClick={() => setCurrentView('dailyStats')}
            onSettingsClick={() => setCurrentView('settings')}
            onActivitySelect={handleActivitySelect}
            onNavigate={handleNavigate}
            onSnooze={handleSnooze}
            onDoActivity={handleDoActivity}
        />
    );
}
