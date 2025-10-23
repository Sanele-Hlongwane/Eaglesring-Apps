import React from "react";
import classNames from "classnames";
import { FaListAlt, FaCog, FaTimesCircle, FaCreditCard } from "react-icons/fa";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  toggleSidebar,
}) => {
  return (
    <nav
      className={classNames(
        "fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md z-40",
        "md:relative md:flex md:justify-center md:items-center",
        {
          hidden: !isSidebarOpen,
        },
      )}
    >
      <div className="flex flex-wrap justify-center gap-2 p-2">
        {[
          { name: "Overview", icon: FaListAlt, tab: "overview" },
          { name: "Details", icon: FaCog, tab: "details" },
          { name: "Manage", icon: FaTimesCircle, tab: "manage" },
          { name: "Payment Methods", icon: FaCreditCard, tab: "payment" },
        ].map(({ name, icon: Icon, tab }) => (
          <button
            key={tab}
            className={classNames(
              "flex items-center text-xs sm:text-sm md:text-base font-semibold py-2 px-3 sm:py-2.5 sm:px-4 border-b-2",
              activeTab === tab
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-700 dark:text-gray-200",
              "hover:border-blue-500 focus:outline-none",
            )}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            <Icon className="mr-1 sm:mr-2" />
            <span
              className={classNames("hidden sm:inline", {
                inline: isSidebarOpen,
              })}
            >
              {name}
            </span>
          </button>
        ))}
      </div>

      {/* Toggle button for small screens */}
      <button
        className="absolute top-2 right-2 md:hidden text-lg p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "←" : "→"}
      </button>
    </nav>
  );
};

export default SideBar;
