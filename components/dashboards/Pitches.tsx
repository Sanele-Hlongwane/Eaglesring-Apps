// src/components/dashboards/Pitches.tsx

import React from "react";

const Pitches: React.FC = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Pitches</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here you can view and manage upcoming pitches.
      </p>
      {/* Add your pitches details and components here */}
    </div>
  );
};

export default Pitches;
