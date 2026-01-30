import { ChevronLeft, Home, Smile, Settings, MessageCircle } from 'lucide-react';
import { Activity } from './data';

interface ActivityDetailViewProps {
    activity: Activity;
    activityCount: number;
    activityRating: number;
    onBack: () => void;
    onGoToActivity: (activity: Activity) => void;
    onNavigate: (view: 'home' | 'activities' | 'chat') => void;
    onSettingsClick: () => void;
    onAskAI: (activity: Activity) => void;
}

export default function ActivityDetailView({
    activity,
    activityCount,
    activityRating,
    onBack,
    onGoToActivity,
    onNavigate,
    onSettingsClick,
    onAskAI
}: ActivityDetailViewProps) {
    return (
        <div className="dashboard-container">
            <header className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="detail-title">{activity.name}</h1>
                <div style={{ width: 28 }} />
            </header>

            <main className="dashboard-main">
                <section className="efficiency-section">
                    <h3 className="efficiency-label">Efficiency</h3>
                    <div className="efficiency-cards">
                        <div className="efficiency-card">
                            <span className="efficiency-card-label">Times</span>
                            <span className="efficiency-card-value">{activityCount}</span>
                            <span className="efficiency-card-change">+33% month over month</span>
                        </div>
                        <div className="efficiency-card">
                            <span className="efficiency-card-label">Rating</span>
                            <span className="efficiency-card-value">{activityRating.toFixed(1)}</span>
                            <span className="efficiency-card-change">+33% month over month</span>
                        </div>
                    </div>
                </section>

                {/* Activity Description */}
                <section className="description-section">
                    <h3 className="description-label">About this activity</h3>
                    <p className="activity-description">{activity.description}</p>
                </section>

                <section className="timeline-section">
                    <h3 className="timeline-label">Activity timeline</h3>
                    <div className="timeline-chart">
                        <span className="chart-title">Activity Implementation</span>
                        <div className="chart-placeholder">
                            <svg viewBox="0 0 300 100" className="chart-svg">
                                <polyline
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                    points="0,20 30,10 60,15 90,80 120,85 150,20 180,10 210,70 240,20 270,10 300,5"
                                />
                                <polygon
                                    fill="rgba(59, 130, 246, 0.1)"
                                    points="0,20 30,10 60,15 90,80 120,85 150,20 180,10 210,70 240,20 270,10 300,5 300,100 0,100"
                                />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="activity-actions">
                    <button
                        className="ask-ai-btn"
                        onClick={() => onAskAI(activity)}
                    >
                        <MessageCircle size={18} />
                        Ask AI
                    </button>
                    <button
                        className="go-to-activity-btn"
                        onClick={() => onGoToActivity(activity)}
                    >
                        Go to Activity
                    </button>
                </div>
            </main>

            <nav className="bottom-nav">
                <button className="nav-item active" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('chat')}><MessageCircle size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
