"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabaseClient";
import Loader from "@/components/Loader";
import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/use-toast";

export default function InvestorProfilePage() {
  const [bio, setBio] = useState("");
  const [investmentStrategy, setInvestmentStrategy] = useState(""); // New state variable
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]); // New state variable for preferred industries
  const [riskTolerance, setRiskTolerance] = useState(""); // New state variable for risk tolerance
  const [investmentAmountRange, setInvestmentAmountRange] = useState<number[]>([]); // New state variable for investment amount range
  const [profile, setProfile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);



  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/investor-profile");
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          setBio(data.bio || "");
          setInvestmentStrategy(data.investmentStrategy || ""); // Set investmentStrategy
          setLinkedinUrl(data.linkedinUrl || "");
          setImageUrl(data.imageUrl || "");
          setPreferredIndustries(data.preferredIndustries || []); // Set preferredIndustries
          setRiskTolerance(data.riskTolerance || ""); // Set riskTolerance
          setInvestmentAmountRange(data.investmentAmountRange || []); // Set investmentAmountRange
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

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setIsUploading(true);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(path, file);
    setIsUploading(false);

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return urlData.publicUrl;
  };

  const deleteFile = async (path: string) => {
    const { error: deleteError } = await supabase.storage
      .from("profile-images")
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

      const res = await fetch("/api/investor-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          investmentStrategy, // Updated field
          linkedinUrl,
          imageUrl: tempImageUrl || imageUrl,
          preferredIndustries, // Updated field
          riskTolerance, // Updated field
          investmentAmountRange, // Updated field
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Profile updated successfully!");
        setProfile(data.investorProfile);
        setImageUrl(tempImageUrl || imageUrl);
        setTempImageUrl(null);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
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
      toast.info("Image uploaded successfully! Remember to save changes to update your image!");
    } catch (error) {
      
      toast.info("Image uploaded successfully! Remember to save changes to update your image!");
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
              Profile
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
                  htmlFor="investmentStrategy"
                  className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
                >
                  Investment Strategy
                </label>
                <input
                  type="text"
                  id="investmentStrategy"
                  value={investmentStrategy}
                  onChange={(e) => setInvestmentStrategy(e.target.value)}
                  placeholder="Your investment strategy"
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="linkedinUrl"
                  className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
                >
                  LinkedIn URL
                </label>
                <input
                  type="url" 
                  id="linkedinUrl"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your_profile"
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                  pattern="https?://(www\.)?linkedin\.com/in/[^ ]+" 
                  required 
                />
                <span className="text-sm text-red-500 mt-1 hidden" id="urlError">
                  Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/your_profile).
                </span>
                
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
              <div>
                <label
                  htmlFor="preferredIndustries"
                  className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
                >
                  Preferred Industries
                </label>
                <div className="flex items-center mt-3">
                  <input
                    type="text"
                    id="preferredIndustries"
                    value={preferredIndustries.join(", ")} // Convert array to string for input
                    onChange={(e) =>
                      setPreferredIndustries(e.target.value.split(",").map((industry) => industry.trim()))
                    }
                    placeholder="Comma-separated list of industries"
                    className="p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPreferredIndustries([])} // Clear the input field
                    className="ml-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="riskTolerance"
                  className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
                >
                  Risk Tolerance
                </label>
                <select
                  id="riskTolerance"
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                >
                  <option value="" disabled>Select your risk tolerance</option>
                  <option value="very_low">Very Low</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="very_high">Very High</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="investmentAmountRange"
                  className="block text-lg font-semibold text-gray-900 dark:text-gray-300"
                >
                  Investment Amount Range
                </label>
                <div className="flex items-center mt-3">
                  <input
                    type="text"
                    id="investmentAmountRange"
                    value={investmentAmountRange
                      .map((amount) =>
                        `R${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`
                      )
                      .join(", ")}
                    onChange={(e) => {
                      const amounts = e.target.value.split(",").map((amount) =>
                        Number(amount.trim().replace(/R|\s/g, '')) 
                      ).filter(amount => !isNaN(amount)); 

                      if (amounts.length <= 2) {
                        setInvestmentAmountRange(amounts);
                      }
                    }}
                    placeholder="e.g., R1 000, R50 000"
                    className="p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setInvestmentAmountRange([])}
                    className="ml-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-opacity duration-300 ${isSaving ? "opacity-70" : "hover:opacity-90"}`}
                disabled={isSaving}
              >
                {isSaving ? < LoadingDots /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
