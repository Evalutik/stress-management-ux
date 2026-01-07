import { ChevronLeft, Home, Smile, Settings, ExternalLink, LogOut } from 'lucide-react';

interface SettingsViewProps {
    roomId: string;
    onBack: () => void;
    onNavigate: (view: 'home' | 'activities') => void;
    onLogout: () => void;
}

export default function SettingsView({ roomId, onBack, onNavigate, onLogout }: SettingsViewProps) {
    return (
        <div className="dashboard-container">
            <header className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="detail-title">Settings</h1>
                <div style={{ width: 28 }} />
            </header>

            <main className="dashboard-main">
                {/* Prototype Notice */}
                <div className="settings-notice">
                    <h2 className="notice-title">🧪 Prototype Mode</h2>
                    <p className="notice-text">
                        This is a UX prototype for user testing purposes.
                        Data is simulated and used for research only.
                    </p>
                </div>

                {/* Room Info */}
                <div className="settings-section">
                    <h3 className="settings-section-title">Session</h3>
                    <div className="settings-item">
                        <span className="settings-label">Room ID</span>
                        <span className="settings-value">{roomId}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="settings-section">
                    <h3 className="settings-section-title">Actions</h3>

                    <a
                        href="/dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="settings-button settings-button-secondary"
                    >
                        <ExternalLink size={18} />
                        View Dev Dashboard
                    </a>

                    <button
                        onClick={onLogout}
                        className="settings-button settings-button-danger"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
            </main>

            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => onNavigate('home')}><Home size={22} /></button>
                <button className="nav-item" onClick={() => onNavigate('activities')}><Smile size={22} /></button>
                <button className="nav-item active"><Settings size={22} /></button>
            </nav>
        </div>
    );
}
