// src/components/dashboards/Profile.tsx

import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here you can view and edit your profile information.
      </p>
      {/* Add your profile details and components here */}
    </div>
  );
};

export default Profile;
