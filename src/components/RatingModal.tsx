import { useState } from 'react';

interface RatingModalProps {
    activityName: string;
    onSubmit: (rating: number) => void;
    onSkip: () => void;
}

export default function RatingModal({ activityName, onSubmit, onSkip }: RatingModalProps) {
    const [rating, setRating] = useState(3);

    return (
        <div className="rating-modal-overlay">
            <div className="rating-modal">
                <h2 className="rating-title">Rate this activity</h2>
                <p className="rating-activity-name">{activityName}</p>

                <div className="rating-slider-container">
                    <div className="rating-labels">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={rating}
                        onChange={(e) => setRating(parseFloat(e.target.value))}
                        className="rating-slider"
                    />
                    <div className="rating-value">{rating.toFixed(1)}</div>
                </div>

                <p className="rating-hint">
                    Your rating helps us improve personal recommendations
                </p>

                <div className="rating-actions">
                    <button className="rating-btn rating-btn-skip" onClick={onSkip}>
                        Skip
                    </button>
                    <button className="rating-btn rating-btn-submit" onClick={() => onSubmit(rating)}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
