// src/components/dashboards/Investments.tsx

import React from "react";

const Investments: React.FC = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Investments</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here you can view and manage your investments.
      </p>
      {/* Add your investment details and components here */}
    </div>
  );
};

export default Investments;
