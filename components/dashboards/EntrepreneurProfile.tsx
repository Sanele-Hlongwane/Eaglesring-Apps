"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

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

const businessStages = [
  "Idea",
  "Prototype",
  "Early Stage",
  "Growth",
  "Expansion",
  "Mature",
];

const EntrepreneurProfile: React.FC<EntrepreneurProfileProps> = ({
  data,
  onEdit,
}) => {
  const { user } = useUser();
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState<EntrepreneurProfile>(data || { id: 0 });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleEditClick = () => {
    router.push("/profile"); // Redirect to /profile
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <div className="w-full mx-auto mb-12 p-8 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-2xl rounded-lg ">
    
      <div className="flex items-center space-x-8 mb-12">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full border-8 border-gradient-to-r from-blue-500 to-green-500 shadow-2xl"
          />
        )}
        <div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white animate-pulse">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-2xl lg:text-3xl font-bold text-blue-700 italic">
            {data?.company || "Company Unavailable"}
          </p>
          <p className="mt-2 text-lg text-gray-500">6 Years of Experience</p>
        </div>
      </div>

      <div className="p-8 rounded-xl shadow-inner bg-white dark:bg-gray-900 border border-gray-500">
        <div className="space-y-6">
          <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
            <strong className="text-blue-500">Bio: </strong>
            {data?.bio || "N/A"}
          </p>
          <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
            <strong className="text-blue-500">Company: </strong>
            {data?.company || "N/A"}
          </p>
          <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
            <strong className="text-blue-500">Business Stage: </strong>
            <span className="text-gray-500">{data?.businessStage || "N/A"}</span>
          </p>
          <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
            <strong className="text-blue-500">Funding History: </strong>
            <span className="text-gray-500">{data?.fundingHistory || "N/A"}</span>
          </p>
        </div>
        <button
          onClick={handleEditClick} // Change to handleEditClick
          className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-gray-800 dark:gray-100 shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Edit Profile
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EntrepreneurProfile;
