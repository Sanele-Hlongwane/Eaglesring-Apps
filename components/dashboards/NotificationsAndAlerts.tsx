import React from 'react';

interface NotificationsAlertsProps {
  alerts: any; 
}

const NotificationsAlerts: React.FC<NotificationsAlertsProps> = ({ alerts }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications & Alerts</h2>
      {/* Render your alerts data here */}
      {alerts ? (
        <ul>
          {alerts.map((alert: any, index: number) => (
            <li key={index} className="mb-2">
              {alert.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No alerts available.</p>
      )}
    </div>
  );
};

export default NotificationsAlerts;
