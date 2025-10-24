"use client";
import React from "react";
import {
  FaUser,
  FaRocket,
  FaChartBar,
  FaCog,
  FaTachometerAlt,
  FaBell,
} from "react-icons/fa";

interface NavItem {
  key: string;
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { key: "overview", label: "Overview", icon: <FaTachometerAlt /> },
  { key: "profile", label: "Profile", icon: <FaUser /> },
  { key: "investments", label: "Investments", icon: <FaRocket /> },
  { key: "analytics", label: "Analytics", icon: <FaChartBar /> },
  { key: "notifications", label: "Notifications", icon: <FaBell /> },
  { key: "settings", label: "Settings", icon: <FaCog /> },
];

interface ResponsiveNavProps {
  activeSection: string;
  onSelect: (section: string) => void;
}

const ResponsiveNav: React.FC<ResponsiveNavProps> = ({
  activeSection,
  onSelect,
}) => {
  return (
    <>
      {/* 🖥️ SIDE NAV for large screens */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col bg-gray-900 text-white shadow-xl p-6">
        <div className="text-2xl font-bold mb-10 text-center text-green-400">
          EaglesRing
        </div>
        <nav className="flex flex-col space-y-4">
          {navItems.map(({ key, label, icon }) => {
            const active = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 w-full text-left ${
                  active
                    ? "bg-green-500 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 📱 BOTTOM NAV for small & medium screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 border-t border-gray-700 shadow-lg">
        {navItems.map(({ key, label, icon }) => {
          const active = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center justify-center text-xs ${
                active ? "text-green-400" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="text-lg mb-1">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default ResponsiveNav;
