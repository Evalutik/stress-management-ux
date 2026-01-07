interface LoginScreenProps {
    roomId: string;
    onRoomIdChange: (value: string) => void;
    onConnect: () => void;
}

export default function LoginScreen({ roomId, onRoomIdChange, onConnect }: LoginScreenProps) {
    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Join a session</h1>
                <p className="login-subtitle">Enter your Room ID to connect</p>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => onRoomIdChange(e.target.value.toUpperCase())}
                    placeholder="Room ID"
                    className="login-input"
                />
                <button onClick={onConnect} className="login-button">
                    Continue
                </button>
            </div>
        </div>
    );
}
