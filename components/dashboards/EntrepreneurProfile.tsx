"use client";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FaBuilding, FaRocket, FaMoneyBillWave } from "react-icons/fa";

interface EntrepreneurProfile {
  id: number;
  bio?: string;
  company?: string;
  revenue?: number;
  businessStage?: string;
  fundingHistory?: string;
}

interface EntrepreneurProfileProps {
  data?: EntrepreneurProfile;
  onEdit: (data: EntrepreneurProfile) => void;
}

const EntrepreneurProfile: React.FC<EntrepreneurProfileProps> = ({
  data,
  onEdit,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<EntrepreneurProfile>(data || { id: 0 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleEditClick = () => router.push("/profile");

  return (
    <>
      {/* Fixed profile image top-right */}
      {user?.imageUrl && (
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="focus:outline-none rounded-full ring-2 ring-offset-2 ring-green-500 hover:ring-blue-500 transition-all"
          >
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-14 h-14 rounded-full shadow-md hover:scale-105 transition-transform"
            />
          </button>
        </div>
      )}

      {/* Profile Popup (Modal) */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          {/* 🔥 Responsive Width Control */}
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl 
                          w-full sm:w-11/12 md:w-4/5 lg:w-1/2 xl:w-2/5 
                          h-auto max-h-[90vh] overflow-y-auto relative p-6 mx-4 animate-fade-in">
            
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-3xl text-gray-500 hover:text-red-500 transition"
              onClick={() => setIsPopupOpen(false)}
              title="Close"
            >
              &times;
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-green-500 shadow-lg mb-3"
              />
              <h2 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {data?.company || "Company Unavailable"}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 text-left border-t border-gray-300 dark:border-gray-700 pt-4">
              <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-3">
                {data?.bio || "No biography available."}
              </p>

              <div className="flex items-center gap-3">
                <FaBuilding className="text-blue-500" />
                <span className="font-semibold">Company:</span>
                <span>{data?.company || "N/A"}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-green-500" />
                <span className="font-semibold">Annual Revenue:</span>
                <span>
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(data?.revenue || 0)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaRocket className="text-purple-500" />
                <span className="font-semibold">Stage:</span>
                <span>{data?.businessStage || "N/A"}</span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleEditClick}
                className="px-6 py-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-green-400 hover:to-blue-400 transition-transform active:scale-95"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EntrepreneurProfile;
