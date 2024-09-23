"use client";
import React, { useState } from "react";
import { FaListAlt, FaBriefcase, FaCalendar, FaUser } from "react-icons/fa";
import Overview from "@/components/dashboards/Overview";
import Investments from "@/components/dashboards/Investments";
import Pitches from "@/components/dashboards/Pitches";
import Profile from "@/components/dashboards/Profile";

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between p-2 md:justify-center">
          <button
            className="text-lg md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
          <div
            className={`flex flex-wrap justify-center gap-2 ${isSidebarOpen ? "md:flex" : "md:hidden"}`}
          >
            {[
              { name: "Overview", icon: FaListAlt, tab: "overview" },
              { name: "My Investments", icon: FaBriefcase, tab: "investments" },
              { name: "Upcoming Pitches", icon: FaCalendar, tab: "pitches" },
              { name: "Profile", icon: FaUser, tab: "profile" },
            ].map(({ name, icon: Icon, tab }) => (
              <button
                key={tab}
                className={`flex items-center text-xs sm:text-sm md:text-base font-semibold py-2 px-3 sm:py-2.5 sm:px-4 border-b-2 transition-colors duration-300 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-700 dark:text-gray-200"
                } hover:border-blue-500 focus:outline-none`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
              >
                <Icon className="mr-1 sm:mr-2 text-xl sm:text-2xl md:text-3xl" />
                <span
                  className={`hidden sm:inline ${isSidebarOpen ? "inline" : "hidden"}`}
                >
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Welcome, Investor
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === "overview" && <Overview />}
          {activeTab === "investments" && <Investments />}
          {activeTab === "pitches" && <Pitches />}
          {activeTab === "profile" && <Profile />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
