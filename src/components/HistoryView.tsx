import { ChevronLeft, Home, Smile, Settings, ChevronRight } from 'lucide-react';
import { Activity, getStressEmoji } from './data';

interface HistoryNotification {
    id: number;
    message: string;
    threshold: number;
    timestamp: Date;
    assignedActivity?: Activity;
}

interface HistoryViewProps {
    notificationHistory: HistoryNotification[];
    onBack: () => void;
    onViewActivities: (notificationId: number) => void;
    onNavigate: (view: 'home' | 'activities') => void;
    onSettingsClick: () => void;
}

export default function HistoryView({
    notificationHistory,
    onBack,
    onViewActivities,
    onNavigate,
    onSettingsClick
}: HistoryViewProps) {
    return (
        <div className="dashboard-container">
            <header className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="detail-title">Notification History</h1>
                <div style={{ width: 28 }} />
            </header>

            <main className="dashboard-main">
                {notificationHistory.length === 0 ? (
                    <div className="empty-state">
                        <p>No notifications yet</p>
                        <span>Notifications will appear here when stress thresholds are reached</span>
                    </div>
                ) : (
                    <div className="history-list">
                        {notificationHistory.map((notif) => (
                            <div key={notif.id} className="history-item-container">
                                <div className="history-item-main">
                                    <div className="history-item-content">
                                        <span className="history-emoji">{getStressEmoji(notif.threshold)}</span>
                                        <div className="history-text">
                                            <span className="history-message">{notif.message}</span>
                                            <span className="history-time">
                                                {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity assignment section */}
                                <div className="history-activity-section">
                                    {notif.assignedActivity ? (
                                        <div
                                            className="history-assigned-activity"
                                            onClick={() => onViewActivities(notif.id)}
                                        >
                                            <span className="assigned-label">Chosen activity:</span>
                                            <span className="assigned-name">{notif.assignedActivity.name}</span>
                                            <ChevronRight size={14} className="assigned-chevron" />
                                        </div>
                                    ) : (
                                        <button
                                            className="history-view-activities-btn"
                                            onClick={() => onViewActivities(notif.id)}
                                        >
                                            View activities
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
