"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingDots from './ui/LoadingDots';
import { Button } from '@nextui-org/react';

interface Notification {
  id: string;
  content: string;
  createdAt: string;
  read: boolean; // Added this property
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const response = await axios.get('/api/get-notifications');
        setNotifications(response.data.notifications);
        setFilteredNotifications(response.data.notifications);
        generateGraphData(response.data.notifications);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const generateGraphData = (notifications: Notification[]) => {
    const data: { [key: string]: number } = {};
    
    notifications.forEach(notification => {
      const date = format(new Date(notification.createdAt), 'yyyy-MM-dd');
      data[date] = (data[date] || 0) + 1;
    });

    const graphData = Object.entries(data).map(([date, count]) => ({ date, count }));
    setGraphData(graphData);
  };

  const handleSearch = () => {
    let filtered = notifications;

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(notification =>
        new Date(notification.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(notification =>
        new Date(notification.createdAt) <= new Date(endDate)
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleNotificationClick = async (id: string) => {
    // Immediately update the local state to reflect the change
    setFilteredNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification // Mark as read
      )
    );
  
    try {
      // Mark the notification as read in the database
      await axios.post(`/api/mark-notification-read/${id}`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Optionally revert the change on error if necessary
      setFilteredNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification // Revert on error
        )
      );
    }
  };
  

  return (
    <div className="min-h-screen w-full p-0 m-0">
      <div className="h-full max-w-full mx-auto min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-800 text-gray-900 dark:text-white rounded-none shadow-none overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white text-3xl font-semibold text-center">
          Notifications
        </div>
  
        <div className="p-6">
          {/* Filter Controls */}
          <div className="p-6 space-y-6">
            {/* Date Filters and Button Code Here */}
          </div>
  
          {/* Graph Section */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-4">Notification Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <XAxis dataKey="date" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568' }} 
                  labelStyle={{ color: '#EDF2F7' }} 
                  itemStyle={{ color: '#BEE3F8' }} 
                />
                <Line type="monotone" dataKey="count" stroke="#4A5568" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
  
          {/* Notifications List */}
          <div className="mt-6">
            {loading ? (
              <div className="text-center">
                <LoadingDots />
              </div>
            ) : error ? (
              <p className="text-center text-xl font-bold text-red-500">{error}</p>
            ) : filteredNotifications.length > 0 ? (
              <ul className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`rounded-lg shadow-md p-4 border-l-4 ${
                      notification.read ? 'bg-gray-200 dark:bg-gray-800 border-gray-500' : 'bg-indigo-200 dark:bg-indigo-600 border-indigo-500' // Different background color for new notifications
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                      {notification.content}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {format(new Date(notification.createdAt), 'PPPpp')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl font-bold text-red-500 ">
                No notifications found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}  