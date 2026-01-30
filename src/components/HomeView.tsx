import { Home, Smile, Settings, ChevronRight, History, MessageCircle } from 'lucide-react';
import { Activity, activities, dailyStats, getStressEmoji, getStressColor } from './data';

interface ToastNotification {
    id: number;
    message: string;
    threshold: number;
    suggestedActivity: Activity;
}

interface HomeViewProps {
    stressLevel: number;
    toasts: ToastNotification[];
    snoozeFeedback: string | null;
    onTabChange: (tab: 'stress' | 'activities') => void;
    onHistoryClick: () => void;
    onDailyStatsClick: () => void;
    onSettingsClick: () => void;
    onActivitySelect: (activity: Activity) => void;
    onNavigate: (view: 'home' | 'activities' | 'chat') => void;
    onSnooze: (toastId: number) => void;
    onDoActivity: (toast: ToastNotification) => void;
    activeTab: 'stress' | 'activities';
}

export default function HomeView({
    stressLevel,
    toasts,
    snoozeFeedback,
    onTabChange,
    onHistoryClick,
    onDailyStatsClick,
    onSettingsClick,
    onActivitySelect,
    onNavigate,
    onSnooze,
    onDoActivity,
    activeTab
}: HomeViewProps) {
    return (
        <div className="dashboard-container">
            {/* Toast Notifications - Phone notification style */}
            <div className="toast-container">
                {toasts.length > 0 && (() => {
                    const toast = toasts[toasts.length - 1];
                    return (
                        <div key={toast.id} className="toast">
                            <div className="toast-header">
                                <div className="toast-app-icon">🧘</div>
                                <span className="toast-app-name">ActiveColour</span>
                                <span className="toast-time">now</span>
                            </div>
                            <div className="toast-body">{toast.message}</div>
                            <div className="toast-actions">
                                <button className="toast-btn toast-btn-snooze" onClick={() => onSnooze(toast.id)}>
                                    Snooze
                                </button>
                                <button className="toast-btn toast-btn-activity" onClick={() => onDoActivity(toast)}>
                                    Do Activity
                                </button>
                            </div>
                        </div>
                    );
                })()}
                {snoozeFeedback && (
                    <div className="snooze-feedback">
                        {snoozeFeedback}
                    </div>
                )}
            </div>

            {/* Header */}
            <header className="dashboard-header">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'stress' ? 'active' : ''}`}
                        onClick={() => onTabChange('stress')}
                    >
                        <Smile size={14} />
                        Stress status
                    </button>
                    <button
                        className={`tab ${activeTab === 'activities' ? 'active' : ''}`}
                        onClick={() => {
                            onTabChange('activities');
                            onNavigate('activities');
                        }}
                    >
                        <span className="tab-icon-text">〜</span>
                        Relaxing Activities
                    </button>
                </div>
                <button className="history-button" onClick={onHistoryClick}>
                    <History size={18} />
                </button>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Big Emoji Display */}
                <div className="stress-display">
                    <div className="emoji-circle" style={{ backgroundColor: getStressColor(stressLevel) }}>
                        <span className="stress-emoji">{getStressEmoji(stressLevel)}</span>
                    </div>
                </div>

                {/* Daily Stats */}
                <section className="section">
                    <div className="section-header" onClick={onDailyStatsClick}>
                        <h2 className="section-title">Daily stats</h2>
                        <ChevronRight size={18} className="section-chevron" />
                    </div>
                    <div className="daily-stats">
                        {dailyStats.map((stat, i) => (
                            <div key={i} className="stat-item" onClick={onDailyStatsClick}>
                                <div className="stat-emoji-circle" style={{ backgroundColor: getStressColor(stat.level) }}>
                                    <span className="stat-emoji">{getStressEmoji(stat.level)}</span>
                                </div>
                                <span className="stat-date">{stat.date}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Activities */}
                <section className="section">
                    <div className="section-header" onClick={() => onNavigate('activities')}>
                        <h2 className="section-title">Choose a relaxing activity</h2>
                        <ChevronRight size={18} className="section-chevron" />
                    </div>
                    <div className="activities-scroll">
                        {activities.filter(a => a.image).map((activity, i) => (
                            <div
                                key={i}
                                className="activity-card"
                                onClick={() => onActivitySelect(activity)}
                            >
                                <div className="activity-image">
                                    {activity.image && <img src={activity.image} alt={activity.name} />}
                                </div>
                                <span className="activity-name">{activity.name}</span>
                                <span className="activity-rating">{activity.rating}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <button className="nav-item active" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('chat')}><MessageCircle size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
