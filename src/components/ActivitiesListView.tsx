import { ChevronLeft, Home, Smile, Settings, ChevronRight } from 'lucide-react';
import { Activity, activities } from './data';

interface ActivitiesListViewProps {
    onBack: () => void;
    onActivitySelect: (activity: Activity) => void;
    onNavigate: (view: 'home' | 'activities') => void;
    onSettingsClick: () => void;
}

export default function ActivitiesListView({ onBack, onActivitySelect, onNavigate, onSettingsClick }: ActivitiesListViewProps) {
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
                <div className="activities-table">
                    <div className="table-header">
                        <span className="table-col activity-col">ACTIVITY</span>
                        <span className="table-col">TIMES</span>
                        <span className="table-col">RATING</span>
                        <span className="table-col chevron-col"></span>
                    </div>
                    {activities.map((activity, i) => (
                        <div
                            key={i}
                            className="table-row"
                            onClick={() => onActivitySelect(activity)}
                        >
                            <span className="table-col activity-col">{activity.name.toUpperCase()}</span>
                            <span className="table-col">{activity.times}</span>
                            <span className="table-col">{activity.rating}</span>
                            <span className="table-col chevron-col"><ChevronRight size={16} /></span>
                        </div>
                    ))}
                </div>

                <button className="choose-activity-btn">Choose activity</button>
            </main>

            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item active" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
