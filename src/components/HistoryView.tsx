import { ChevronLeft, Home, Smile, Settings, MessageCircle } from 'lucide-react';
import { Activity, getStressEmoji } from './data';

interface HistoryNotification {
    id: number;
    message: string;
    threshold: number;
    timestamp: Date;
    suggestedActivity: Activity;
    wasSnoozed: boolean;
    activityPerformed: boolean;
}

interface HistoryViewProps {
    notificationHistory: HistoryNotification[];
    onBack: () => void;
    onViewActivities: (notificationId: number) => void;
    onDoSuggested: (notificationId: number, activity: Activity) => void;
    onNavigate: (view: 'home' | 'activities' | 'chat') => void;
    onSettingsClick: () => void;
}

export default function HistoryView({
    notificationHistory,
    onBack,
    onViewActivities,
    onDoSuggested,
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
                <p className="section-description">
                    View your stress notifications and track which activities you've completed.
                </p>

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
                                            {/* Status badges */}
                                            <div className="history-status">
                                                {notif.wasSnoozed && (
                                                    <span className="history-badge history-badge-snoozed">Snoozed</span>
                                                )}
                                                {notif.activityPerformed ? (
                                                    <span className="history-badge history-badge-completed">Completed ✓</span>
                                                ) : (
                                                    <span className="history-badge history-badge-pending">Not done</span>
                                                )}
                                            </div>
                                            {/* Suggested activity */}
                                            <div className="history-suggested">
                                                Suggested: <span className="history-suggested-name">{notif.suggestedActivity.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons - only show if not performed */}
                                {!notif.activityPerformed && (
                                    <div className="history-actions">
                                        <button
                                            className="history-action-btn history-action-btn-do"
                                            onClick={() => onDoSuggested(notif.id, notif.suggestedActivity)}
                                        >
                                            Do Suggested
                                        </button>
                                        <button
                                            className="history-action-btn history-action-btn-choose"
                                            onClick={() => onViewActivities(notif.id)}
                                        >
                                            Choose Other
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('chat')}><MessageCircle size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
