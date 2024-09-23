"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch,
  FaLightbulb,
  FaShieldAlt,
  FaComments,
  FaUserTie,
  FaChartLine,
  FaRegGem,
  FaLeaf,
  FaHandsHelping,
  FaGlobe,
  FaRocket,
  FaAward,
  FaMedal, } from 'react-icons/fa';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingDots from './ui/LoadingDots';

interface Notification {
  id: string;
  content: string;
  createdAt: string;
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

  return (
    <div className="min-h-screen w-full p-0 m-0">
      <div className="h-full max-w-full mx-auto min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white rounded-none shadow-none overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-300 to-gray-500 dark:from-gray-800 dark:to-gray-600 text-gray-900 dark:text-gray-100 text-3xl font-semibold text-center">
          Notifications
        </div>
        {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
            <FaLightbulb className="text-yellow-500 absolute top-16 left-20 text-[100px] rotate-12" />
            <FaShieldAlt className="text-blue-500 absolute top-1/3 right-10 text-[120px] rotate-6" />
            <FaComments className="text-green-500 absolute bottom-16 left-1/4 text-[80px] -rotate-12" />
            <FaUserTie className="text-red-500 absolute bottom-1/4 left-10 text-[90px] rotate-45" />
            <FaGlobe className="text-blue-400 absolute bottom-28 right-14 text-[100px] rotate-12" />
            <FaAward className="text-orange-500 absolute bottom-10 left-32 text-[120px] rotate-6" />
            <FaHandsHelping className="text-yellow-400 absolute top-20 right-5 text-[90px] rotate-12" />
            <FaLeaf className="text-green-500 text-[70px] absolute bottom-16 left-16 animate-spin-slow" />
          </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search notifications"
                className="w-full bg-gray-400 dark:bg-gray-600 rounded-full px-4 py-2 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute top-2 right-4 text-gray-700 dark:text-gray-300" />
            </div>
            <input
              type="date"
              className="w-full sm:w-1/4 bg-gray-400 dark:bg-gray-600 rounded-full px-4 py-2 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              className="w-full sm:w-1/4 bg-gray-400 dark:bg-gray-600 rounded-full px-4 py-2 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button
              className="w-full sm:w-auto px-6 py-2 bg-gray-400 text-gray-900 dark:bg-gray-600 dark:text-gray-200 rounded-full shadow-lg hover:bg-gray-500 dark:hover:bg-gray-500 transition duration-200"
              onClick={handleSearch}
            >
              Filter
            </button>
          </div>

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
                    className="bg-gray-400 dark:bg-gray-600 rounded-lg shadow-md p-4 border-l-4 border-indigo-500"
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
              <p className="text-center text-xl font-bold text-gray-300">
                No notifications found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}