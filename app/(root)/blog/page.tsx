// pages/investor-dashboard.tsx
"use client";
// pages/investor-dashboard.tsx

import React, { useState } from "react";
import {
  FaChartLine,
  FaBell,
  FaUser,
  FaMoneyBillWave,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { Chart } from "react-chartjs-2";
import "chart.js/auto"; // Ensure to import Chart.js for charts

const InvestorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for charts
  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Investment Growth",
        data: [30, 60, 45, 75, 90],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-800 text-white p-6 dark:bg-teal-900">
        <h2 className="text-2xl font-bold mb-6">Investor Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center space-x-2 text-left hover:text-teal-400 dark:hover:text-teal-300 transition-colors duration-300 ${activeTab === "overview" ? "text-teal-300" : ""}`}
            >
              <FaChartLine className="text-xl" />
              <span>Overview</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("investments")}
              className={`flex items-center space-x-2 text-left hover:text-teal-400 dark:hover:text-teal-300 transition-colors duration-300 ${activeTab === "investments" ? "text-teal-300" : ""}`}
            >
              <FaMoneyBillWave className="text-xl" />
              <span>My Investments</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("performance")}
              className={`flex items-center space-x-2 text-left hover:text-teal-400 dark:hover:text-teal-300 transition-colors duration-300 ${activeTab === "performance" ? "text-teal-300" : ""}`}
            >
              <FaClipboardList className="text-xl" />
              <span>Performance Metrics</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center space-x-2 text-left hover:text-teal-400 dark:hover:text-teal-300 transition-colors duration-300 ${activeTab === "notifications" ? "text-teal-300" : ""}`}
            >
              <FaBell className="text-xl" />
              <span>Notifications</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 text-left hover:text-teal-400 dark:hover:text-teal-300 transition-colors duration-300 ${activeTab === "profile" ? "text-teal-300" : ""}`}
            >
              <FaUser className="text-xl" />
              <span>Profile</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-teal-700 dark:text-teal-300">
            Welcome, Investor
          </h1>
          <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-300">
            New Investment
          </button>
        </header>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Overview Statistics Card */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">
                  Investment Overview
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center shadow-md">
                    <h4 className="text-lg font-medium">Total Invested</h4>
                    <p className="text-2xl font-bold">$250,000</p>
                    <p className="text-green-600 dark:text-green-400">
                      +10% from last month
                    </p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-center shadow-md">
                    <h4 className="text-lg font-medium">Average ROI</h4>
                    <p className="text-2xl font-bold">15%</p>
                    <p className="text-yellow-600 dark:text-yellow-400">
                      Stable growth
                    </p>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-center shadow-md">
                    <h4 className="text-lg font-medium">Pending Pitches</h4>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-red-600 dark:text-red-400">
                      New opportunities
                    </p>
                  </div>
                </div>
              </div>
              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">
                  Recent Activities
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Reviewed Pitch from Tech Startup A</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Just Now
                    </span>
                  </li>
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>New Investment Opportunity in Health Tech</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      1 Hour Ago
                    </span>
                  </li>
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Green Energy C Project Update</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      3 Days Ago
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "investments" && (
            <div className="space-y-6">
              {/* Investment List */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">
                  My Investments
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Tech Startup A</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      $50,000
                    </span>
                  </li>
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Health Tech B</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      $75,000
                    </span>
                  </li>
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Green Energy C</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      $125,000
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">
                  Performance Metrics
                </h3>
                <div className="h-64">
                  <Chart
                    type="line"
                    data={data}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">
                  Notifications
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>New pitch from Tech Startup A</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Just Now
                    </span>
                  </li>
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Investment opportunity in Health Tech</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      2 Hours Ago
                    </span>
                  </li>
                  <li className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span>Green Energy C project update</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      1 Day Ago
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* User Profile */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">
                  Profile
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {/* Placeholder for User Image */}
                    <span>AB</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Alex Brown
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      alex.brown@example.com
                    </p>
                    <button className="bg-teal-600 text-white py-2 px-4 rounded mt-4 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-300">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvestorDashboard;
