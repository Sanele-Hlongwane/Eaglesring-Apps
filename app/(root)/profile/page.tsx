"use client";

import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaPencilAlt, FaLinkedin, FaUpload } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabaseClient";
import Loader from "@/components/Loader";
import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/use-toast";

export default function EntrepreneurProfilePage() {
  const { toast } = useToast();
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [businessStage, setBusinessStage] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [fundingHistory, setFundingHistory] = useState("");
  const [profile, setProfile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState("");
  const businessStages = ["Startup", "Growth", "Mature", "Exit"];
  const formattedRevenue = new Intl.NumberFormat().format(revenue);

  const handleSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "success",
    });
  };

  const handleErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleInfoToast = (message: string) => {
    toast({
      title: "Info",
      description: message,
      variant: "info",
    });
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/entrepreneur-profile");
        const data = await res.json();
        if (data.error) {
          handleErrorToast(data.error);
        } else {
          setBio(data.entrepreneurProfile?.bio || "");
          setCompany(data.entrepreneurProfile?.company || "");
          setBusinessStage(data.entrepreneurProfile?.businessStage || "");
          setSelectedStage(data.entrepreneurProfile?.businessStage || "");
          setLinkedinUrl(data.entrepreneurProfile?.linkedinUrl || "");
          setRevenue(data.entrepreneurProfile?.revenue || 0);
          setImageUrl(data.imageUrl || "");
          setFundingHistory(
            data.entrepreneurProfile?.fundingHistory || "No history",
          );
          setProfile(data.entrepreneurProfile);
        }
      } catch (error) {
        handleErrorToast("Failed to fetch profile.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setIsUploading(true);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("videos")
      .upload(path, file);
    setIsUploading(false);

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return urlData.publicUrl;
  };

  const deleteFile = async (path: string) => {
    const { error: deleteError } = await supabase.storage
      .from("videos")
      .remove([path]);
    if (deleteError) {
      throw new Error(`Failed to delete image: ${deleteError.message}`);
    }
  };

  const handleUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (imageToDelete) {
        await deleteFile(imageToDelete);
      }

      const res = await fetch("/api/entrepreneur-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          company,
          businessStage: selectedStage,
          linkedinUrl,
          revenue,
          imageUrl: tempImageUrl || imageUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        handleErrorToast(data.error);
      } else {
        handleSuccessToast("Profile updated successfully!");
        setProfile(data.entrepreneurProfile);
        setImageUrl(tempImageUrl || imageUrl);
        setTempImageUrl(null);
      }
    } catch (error) {
      handleErrorToast("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const filePath = `profile-images/${uuidv4()}_${file.name}`;
      const publicUrl = await uploadFile(file, filePath);
      setTempImageUrl(publicUrl);
      setImageToDelete(imageUrl);
      handleInfoToast(
        "Image uploaded successfully! Remember to save changes to update your image!",
      );
    } catch (error) {
      handleErrorToast("Failed to upload image.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white p-10">
    {isLoading ? (
      <Loader />
    ) : (
      <div className="max-w-7xl mx-auto shadow-2xl rounded-xl bg-gradient-to-b from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          <FaPencilAlt className="inline-block text-green-600 dark:text-green-400 mr-3" />
          Your Business Profile
        </h1>
        <form onSubmit={handleUpdate} className="space-y-12">
        <div className="flex flex-col items-center">
          <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-2xl rounded-lg flex items-center justify-center">
            {tempImageUrl || imageUrl ? (
              <img
                src={tempImageUrl || imageUrl}
                alt="Profile"
                className="h-full w-auto object-cover rounded-lg"
              />
            ) : (
              <FaCamera
                className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
                size={80}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
              id="imageUpload"
            />
          </div>
          <div className="text-black mt-5">
            {isUploading && <LoadingDots />}
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="bio"
                className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                rows={5}
                required
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company's name"
                className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="businessStage"
                className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
              >
                Business Stage
              </label>
              <select
                id="businessStage"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                required
              >
                {businessStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="linkedinUrl"
                className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
              >
                LinkedIn URL
              </label>
              <input
                type="url" // Change input type to 'url' for better validation
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your_profile"
                className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                pattern="https?://(www\.)?linkedin\.com/in/[^ ]+" // Updated regex pattern for LinkedIn URLs
                required // Ensure the field is required
              />
              <span className="text-sm text-red-500 mt-1 hidden" id="urlError">
                Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/your_profile).
              </span>
              
              {/* Conditionally render the "View Profile" link */}
              {linkedinUrl && (
                <div className="mt-3">
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="revenue"
                className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
              >
                Revenue
              </label>
              <div className="mt-3 relative">
                <input
                  type="text"
                  id="revenue"
                  value={formattedRevenue}
                  onChange={(e) => setRevenue(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                  placeholder="Annual revenue"
                  className="p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500 pl-10"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  R
                </span>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="fundingHistory"
                className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
              >
                Funding History (Read Only)
              </label>
              <textarea
                id="fundingHistory"
                readOnly
                value={fundingHistory}
                onChange={(e) => setFundingHistory(e.target.value)}
                placeholder="Describe your funding history..."
                className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`inline-flex items-center px-6 py-3 text-base font-medium text-white ${isSaving ? "bg-gray-500" : "bg-green-600"} rounded-lg shadow-lg transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-400`}
              disabled={isSaving}
            >
              {isSaving ? <LoadingDots /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
        )}
    </div>
  );
}
