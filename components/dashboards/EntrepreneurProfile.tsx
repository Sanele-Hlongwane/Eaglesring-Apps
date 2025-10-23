"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaBuilding,
  FaRocket,
  FaDollarSign,
  FaMoneyBillWave,
} from "react-icons/fa";

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
  const [formData, setFormData] = useState<EntrepreneurProfile>(
    data || { id: 0 },
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false); // For image popup

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleEditClick = () => {
    router.push("/profile");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/entrepreneur-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Profile updated successfully!");
        onEdit(result.profile);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto p-1 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-lg">
      <div className="flex items-center mb-4">
        {user?.imageUrl && (
          <button
            onClick={() => setIsPopupOpen(true)}
            className="focus:outline-none"
          >
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-blue-500 to-green-500 shadow-md cursor-pointer"
            />
          </button>
        )}
        <div>
          <h2 className="text-xl lg:text-2xl ml-4 font-extrabold text-gray-900 dark:text-white animate-pulse">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-l lg:text-xl font-bold text-blue-700 italic">
            {data?.company || "Company Unavailable"}
          </p>
        </div>
      </div>

      {/* Image Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="w-96 h-96 object-cover rounded-lg shadow-lg"
            />
            <button
              className="absolute top-4 right-4 text-red-600 dark:text-red-400 text-2xl"
              onClick={() => setIsPopupOpen(false)}
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs text-gray-800 dark:text-gray-300 mt-2">
          {data?.bio || "N/A"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <label htmlFor="company" className="block text-lg font-semibold mr-4">
            Company:
          </label>
          <FaBuilding className="text-blue-500 mr-2" />
          <span id="company">{data?.company || "N/A"}</span>
        </div>

        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <label htmlFor="revenue" className="block text-lg font-semibold mr-4">
            Annual Revenue:
          </label>
          <FaMoneyBillWave className="text-green-500 mr-2" />
          <span id="revenue">
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
            }).format(data?.revenue || 0)}
          </span>
        </div>

        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <label
            htmlFor="businessStage"
            className="block text-lg font-semibold mr-4"
          >
            Stage:
          </label>
          <FaRocket className="text-blue-500 mr-2" />
          <span id="businessStage" className="text-green-600">
            {data?.businessStage || "N/A"}
          </span>
        </div>
      </div>

      <button
        onClick={handleEditClick}
        className="mt-4 w-full py-2 border border-gray-800 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md transition-transform transform hover:bg-gradient-to-r hover:from-green-400 hover:to-green-500 active:scale-95 active:bg-gradient-to-r active:from-green-600 active:to-green-700 shadow-lg hover:shadow-xl active:shadow-md"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default EntrepreneurProfile;
