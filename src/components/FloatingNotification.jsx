import { useGame } from '../context/GameContext';
import './FloatingNotification.css';

const FloatingNotification = () => {
    const { notifications } = useGame();

    return (
        <div className="notifications-container">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`floating-notification ${notif.type}`}
                    style={{ animationDelay: '0s' }}
                >
                    <div className="notification-content">
                        {notif.healthChange && (
                            <div className="notification-health">
                                {notif.healthChange > 0 ? '+' : ''}{notif.healthChange}%
                            </div>
                        )}
                        <div className="notification-message">{notif.message}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FloatingNotification;
