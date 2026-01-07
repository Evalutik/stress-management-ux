import { ChevronLeft, Home, Smile, Settings } from 'lucide-react';
import { Activity } from './data';

interface ActivityDetailViewProps {
    activity: Activity;
    onBack: () => void;
    onNavigate: (view: 'home' | 'activities') => void;
    onSettingsClick: () => void;
}

export default function ActivityDetailView({ activity, onBack, onNavigate, onSettingsClick }: ActivityDetailViewProps) {
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
                            <span className="efficiency-card-value">{activity.times}</span>
                            <span className="efficiency-card-change">+33% month over month</span>
                        </div>
                        <div className="efficiency-card">
                            <span className="efficiency-card-label">Rating</span>
                            <span className="efficiency-card-value">{activity.rating}</span>
                            <span className="efficiency-card-change">+33% month over month</span>
                        </div>
                    </div>
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

                <section className="instructions-section">
                    <h3 className="instructions-label">How to do it</h3>
                    <ol className="instructions-list">
                        {activity.instructions.map((step, i) => (
                            <li key={i} className="instruction-item">{step}</li>
                        ))}
                    </ol>
                </section>
            </main>

            <nav className="bottom-nav">
                <button className="nav-item active" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item" onClick={onSettingsClick}><Settings size={22} /></button>
            </nav>
        </div>
    );
}
