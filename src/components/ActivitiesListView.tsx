import { ChevronLeft, Home, Smile, Settings, ChevronRight, MessageCircle } from 'lucide-react';
import { Activity, activities } from './data';

interface ActivitiesListViewProps {
    activityCounts: Record<string, number>;
    activityRatings: Record<string, number>;
    onBack: () => void;
    onActivitySelect: (activity: Activity) => void;
    onNavigate: (view: 'home' | 'activities' | 'chat') => void;
    onSettingsClick: () => void;
}

export default function ActivitiesListView({
    activityCounts,
    activityRatings,
    onBack,
    onActivitySelect,
    onNavigate,
    onSettingsClick
}: ActivitiesListViewProps) {
    return (
        <div className="dashboard-container">
            <header className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="detail-title">Relaxing activities</h1>
                <div style={{ width: 28 }} />
            </header>

            <main className="dashboard-main">
                <p className="section-description">
                    Choose an activity below to help reduce your stress levels. Each activity has been designed to promote relaxation.
                </p>

                <div className="activities-table">
                    <div className="table-header">
                        <span className="table-col activity-col">ACTIVITY</span>
                        <span className="table-col">TIMES</span>
                        <span className="table-col">RATING</span>
                        <span className="table-col chevron-col"></span>
                    </div>
                    {[...activities]
                        .sort((a, b) => (activityRatings[b.name] || 0) - (activityRatings[a.name] || 0))
                        .map((activity, i) => (
                            <div
                                key={i}
                                className="table-row"
                                onClick={() => onActivitySelect(activity)}
                            >
                                <span className="table-col activity-col">{activity.name}</span>
                                <span className="table-col">{activityCounts[activity.name] || 0}</span>
                                <span className="table-col">{(activityRatings[activity.name] || 0).toFixed(1)}</span>
                                <span className="table-col chevron-col"><ChevronRight size={16} /></span>
                            </div>
                        ))}
                </div>
            </main>

            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item active" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('chat')}><MessageCircle size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
