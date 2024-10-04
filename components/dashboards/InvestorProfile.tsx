"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLightbulb, FaLinkedin, FaBriefcase, FaShieldAlt, FaMoneyBillWave, FaEdit } from "react-icons/fa";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

// Define the structure of the profile object
interface InvestorProfile {
  bio: string;
  investmentStrategy: string;
  linkedinUrl: string;
  preferredIndustries: string[];
  riskTolerance: string;
  investmentAmountRange: string[];
  imageUrl?: string; // Profile picture URL
}

const formatAmount = (amount: string) => {
  if (!amount) return "Not specified";
  return "R" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function InvestorProfileCard() {
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/investor-profile");
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        toast.error("Failed to fetch profile.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const handleOutsideClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // For mouse click events
    if ('clientX' in e) {
      console.log("Mouse click event triggered");
      // You can handle mouse event logic here (e.g., closing the modal)
      setIsPopupOpen(false);
    }
  
    // For keyboard events (Enter or Space)
    if ('key' in e && (e.key === 'Enter' || e.key === ' ')) {
      console.log("Keyboard event triggered");
      // Handle keyboard event logic here (e.g., closing the modal)
      setIsPopupOpen(false);
    }
  };
  

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-700 rounded-3xl p-10 w-full m-5 border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="focus:outline-none"
            aria-label="View profile picture"
          >
            <img
              src={profile?.imageUrl || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 border-4 border-gray-300 dark:border-gray-600 cursor-pointer rounded-full object-cover"
            />
          </button>
        </div>

        {isPopupOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 popup-overlay"
            onClick={(e) => handleOutsideClick(e)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleOutsideClick(e)}
          >
            <div className="relative">
              <img
                src={profile?.imageUrl || "/default-profile.png"}
                alt="Profile"
                className="w-96 h-96 object-cover rounded-lg shadow-lg"
              />
              <Button
                className="absolute top-4 right-4 text-red-600 dark:text-red-400 text-2xl"
                onClick={() => setIsPopupOpen(false)}
                title="Close"
              >
                &times;
              </Button>
            </div>
          </div>
        )}

        <h3 className="text-4xl font-serif font-semibold text-gray-800 mb-4 dark:text-gray-200">
          {profile?.bio || "Investor Profile"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg ">
            <FaLightbulb className="text-blue-600 mr-3 w-8 h-8" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                Investment Strategy:
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {profile?.investmentStrategy || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg ">
            <FaLinkedin className="text-blue-600 mr-3 w-8 h-8" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">LinkedIn:</p>
              <a
                href={profile?.linkedinUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline transition duration-200 dark:text-blue-400"
              >
                {profile?.linkedinUrl || "Not specified"}
              </a>
            </div>
          </div>

          <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg ">
            <FaBriefcase className="text-blue-600 mr-3 w-8 h-8" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">Preferred Industries:</p>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.preferredIndustries.length
                  ? profile.preferredIndustries.join(", ")
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg ">
            <FaShieldAlt className="text-blue-600 mr-3 w-8 h-8" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">Risk Tolerance:</p>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.riskTolerance || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg ">
            <FaMoneyBillWave className="text-blue-600 mr-3 w-8 h-8" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">Investment Amount Range:</p>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.investmentAmountRange.length
                  ? profile.investmentAmountRange.map(amount => formatAmount(amount)).join(" - ")
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <Button
          className="mt-6 w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg py-3 flex items-center justify-center hover: transition duration-200"
          onClick={() => {
            router.push("/investor-profile");
          }}
        >
          <FaEdit className="mr-2" /> Edit Profile
        </Button>
      </div>
    </div>
  );
}
