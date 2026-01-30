import { ChevronLeft, MessageCircle } from 'lucide-react';
import { Activity } from './data';
import AnimatedActivityIcon from './AnimatedActivityIcon';

interface ActivityInstructionViewProps {
    activity: Activity;
    onBack: () => void;
    onDone: () => void;
    onAskAI: (activity: Activity) => void;
}

export default function ActivityInstructionView({
    activity,
    onBack,
    onDone,
    onAskAI
}: ActivityInstructionViewProps) {
    return (
        <div className="dashboard-container">
            <header className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="detail-title">{activity.name}</h1>
                <div style={{ width: 28 }} />
            </header>

            <main className="dashboard-main instruction-main">
                {/* Animated Icon */}
                <AnimatedActivityIcon icon={activity.icon} />

                {/* Activity Description */}
                <p className="activity-description">{activity.description}</p>

                <section className="instructions-section">
                    <h3 className="instructions-label">Follow these steps:</h3>
                    <ol className="instructions-list">
                        {activity.instructions.map((step, i) => (
                            <li key={i} className="instruction-item">{step}</li>
                        ))}
                    </ol>
                </section>

                {/* Ask AI Button */}
                <button
                    className="ask-ai-btn ask-ai-btn-secondary"
                    onClick={() => onAskAI(activity)}
                >
                    <MessageCircle size={18} />
                    Ask AI about this activity
                </button>
            </main>

            <div className="instruction-actions">
                <button className="instruction-btn instruction-btn-back" onClick={onBack}>
                    Back
                </button>
                <button className="instruction-btn instruction-btn-done" onClick={onDone}>
                    Done
                </button>
            </div>
        </div>
    );
}
