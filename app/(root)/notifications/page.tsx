import React from "react";
import Notifications from "@/components/Notifications";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8f8f8] to-[#e1e1e1] flex items-center justify-center">
      <div className="w-full">
        <Notifications />
      </div>
    </div>
  );
};

export default NotificationsPage;
