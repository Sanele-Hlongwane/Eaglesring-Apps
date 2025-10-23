"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the structure of a Notification
interface Notification {
  id: number; // Adjust the type as per your actual schema (e.g., string if it's a UUID)
  content: string;
  createdAt: string; // Adjust if necessary
}

const LatestNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("/api/get-notifications");
      const data = await response.json();
      setNotifications(data.notifications.slice(0, 5)); // Get only the latest 5 notifications
    };

    fetchNotifications();
  }, []);

  return (
    <div className="w-full bg-gray-300 dark:bg-gray-800 rounded-lg p-4 mt-4">
      <h2 className="text-2xl font-extrabold mb-4 text-blue-700 dark:text-blue-600 border-b-2 border-gray-700 dark:border-gray-300 pb-2">
        Latest Notifications
      </h2>
      <div className="max-h-32 overflow-y-auto ">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-2 border-b border-gray-600 dark:border-gray-400"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {notification.content}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No notifications available.
          </p>
        )}
      </div>
      <button
        onClick={() => router.push("/notifications")}
        className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
      >
        View All
      </button>
    </div>
  );
};

export default LatestNotifications;
