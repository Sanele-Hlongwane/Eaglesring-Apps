"use client";

import React, { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  email: string;
  imageUrl?: string;
  role: "ENTREPRENEUR" | "INVESTOR";
  entrepreneurProfile?: { bio?: string; company?: string };
  investorProfile?: { bio?: string; investmentStrategy?: string };
  notifications?: { id: number; content: string }[];
};

const ProfileOverview: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found</div>;

  const initials = profile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full rounded-full"
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <h4 className="text-xl font-semibold">{profile.name}</h4>
          <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
          {profile.role === "INVESTOR" && profile.investorProfile?.investmentStrategy && (
            <p className="text-gray-500 text-sm mt-1">
              Strategy: {profile.investorProfile.investmentStrategy}
            </p>
          )}
          {profile.role === "ENTREPRENEUR" && profile.entrepreneurProfile?.company && (
            <p className="text-gray-500 text-sm mt-1">
              Company: {profile.entrepreneurProfile.company}
            </p>
          )}
          <button className="bg-teal-600 text-white py-2 px-4 rounded mt-4 hover:bg-teal-700 transition-colors duration-300">
            Edit Profile
          </button>
        </div>
      </div>

      {profile.notifications && profile.notifications.length > 0 && (
        <div className="mt-6">
          <h5 className="text-lg font-semibold mb-2">Recent Notifications</h5>
          <ul>
            {profile.notifications.map((n) => (
              <li
                key={n.id}
                className="p-2 bg-gray-50 dark:bg-gray-700 rounded mb-1"
              >
                {n.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;
