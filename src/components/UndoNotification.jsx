import React, { useState, useEffect } from 'react';

const UndoNotification = ({ documentName, onUndo, onDismiss, duration = 30000 }) => {
    const [timeLeft, setTimeLeft] = useState(duration / 1000);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onDismiss();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onDismiss]);

    const handleUndo = () => {
        onUndo();
    };

    const handleDismiss = () => {
        onDismiss();
    };

    return (
        <div className="undo-notification">
            <div className="undo-content">
                <span className="undo-message">
                        Updated "{documentName}"
                </span>
                <div className="undo-actions">
                    <button onClick={handleUndo} className="undo-button">
                        ↶ Undo ({timeLeft}s)
                    </button>
                    <button onClick={handleDismiss} className="dismiss-button">
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UndoNotification;