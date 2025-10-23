"use client";

import { useState } from "react";
import { toast } from "react-toastify";

// Define the type for props
interface UserBlockerProps {
  userId: number; // or string, depending on your database ID type
}

const UserBlocker: React.FC<UserBlockerProps> = ({ userId }) => {
  const [blockedId, setBlockedId] = useState<string>("");

  const blockUser = async () => {
    try {
      const response = await fetch("/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("User blocked successfully");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error blocking user");
    }
  };

  const unblockUser = async () => {
    try {
      const response = await fetch("/api/block", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("User unblocked successfully");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error unblocking user");
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Block/Unblock User</h2>
      <input
        type="text"
        value={blockedId}
        onChange={(e) => setBlockedId(e.target.value)}
        placeholder="Enter User ID to block/unblock"
        className="border rounded p-2 mb-4 w-full"
      />
      <div className="flex justify-between">
        <button
          onClick={blockUser}
          className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
        >
          Block User
        </button>
        <button
          onClick={unblockUser}
          className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
        >
          Unblock User
        </button>
      </div>
    </div>
  );
};

export default UserBlocker;
