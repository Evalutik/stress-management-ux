import { ChevronLeft, Home, Smile, Settings, MessageCircle } from 'lucide-react';
import { dailyStats, getStressEmoji, getStressColor } from './data';

interface DailyStatsViewProps {
    onBack: () => void;
    onNavigate: (view: 'home' | 'activities' | 'chat') => void;
    onSettingsClick: () => void;
}

export default function DailyStatsView({ onBack, onNavigate, onSettingsClick }: DailyStatsViewProps) {
    return (
        <div className="dashboard-container">
            <header className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="detail-title">Daily Stats</h1>
                <div style={{ width: 28 }} />
            </header>

            <main className="dashboard-main">
                <div className="stats-table">
                    <div className="stats-table-header">
                        <span className="stats-col date-col">DATE</span>
                        <span className="stats-col status-col">STATUS</span>
                        <span className="stats-col level-col">LEVEL</span>
                    </div>
                    {dailyStats.map((stat, i) => (
                        <div key={i} className="stats-table-row">
                            <span className="stats-col date-col">{stat.date}</span>
                            <span className="stats-col status-col">
                                <div
                                    className="stats-emoji-circle"
                                    style={{ backgroundColor: getStressColor(stat.level) }}
                                >
                                    {getStressEmoji(stat.level)}
                                </div>
                            </span>
                            <span className="stats-col level-col">{stat.level}%</span>
                        </div>
                    ))}
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
