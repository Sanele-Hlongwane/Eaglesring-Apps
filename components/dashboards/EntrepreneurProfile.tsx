"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FaUser, FaBuilding, FaRocket, FaDollarSign } from "react-icons/fa";

interface EntrepreneurProfile {
  id: number;
  bio?: string;
  company?: string;
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
    <div className="w-full mx-auto p-4 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-lg">
      <div className="flex items-center mb-4">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-blue-500 to-green-500 shadow-md"
          />
        )}
        <div>
          <h2 className="text-2xl lg:text-4xl ml-4 font-extrabold text-gray-900 dark:text-white animate-pulse">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-2xl lg:text-3xl font-bold text-blue-700 italic">
            {data?.company || "Company Unavailable"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <FaUser className="text-blue-500 mr-2" />
          <span>{data?.bio || "N/A"}</span>
        </div>

        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <FaBuilding className="text-blue-500 mr-2" />
          <span>{data?.company || "N/A"}</span>
        </div>

        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <FaRocket className="text-blue-500 mr-2" />
          <span className="text-green-600">{data?.businessStage || "N/A"}</span>
        </div>

        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <FaDollarSign className="text-blue-500 mr-2" />
          <span className="text-yellow-600">{data?.fundingHistory || "N/A"}</span>
        </div>
      </div>

      <button
        onClick={handleEditClick}
        className="mt-4 w-full py-2 border border-gray-800 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md hover:scale-105 transition-transform"
      >
        Edit Profile
      </button>

      <ToastContainer />
    </div>
  );
};

export default EntrepreneurProfile;
