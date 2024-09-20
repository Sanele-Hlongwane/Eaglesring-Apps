"use client";

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCamera, FaPencilAlt, FaLinkedin, FaUpload } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import supabase from '@/lib/supabaseClient';
import Loader from '@/components/Loader';
import LoadingDots from '@/components/ui/LoadingDots';
import { useToast } from "@/components/ui/use-toast";

export default function EntrepreneurProfilePage() {
  const { toast } = useToast();
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [businessStage, setBusinessStage] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [revenue, setRevenue] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [fundingHistory, setFundingHistory] = useState('');
  const [profile, setProfile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState('');
  const businessStages = ['Startup', 'Growth', 'Mature', 'Exit'];

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
        const res = await fetch('/api/entrepreneur-profile');
        const data = await res.json();
        if (data.error) {
          handleErrorToast(data.error);
        } else {
          setBio(data.entrepreneurProfile?.bio || '');
          setCompany(data.entrepreneurProfile?.company || '');
          setBusinessStage(data.entrepreneurProfile?.businessStage || '');
          setSelectedStage(data.entrepreneurProfile?.businessStage || '');
          setLinkedinUrl(data.entrepreneurProfile?.linkedinUrl || '');
          setRevenue(data.entrepreneurProfile?.revenue || 0);
          setImageUrl(data.imageUrl || '');
          setFundingHistory(data.entrepreneurProfile?.fundingHistory || 'No history');
          setProfile(data.entrepreneurProfile);
        }
      } catch (error) {
        handleErrorToast('Failed to fetch profile.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setIsUploading(true);
    const { data: uploadData, error: uploadError } = await supabase.storage.from('videos').upload(path, file);
    setIsUploading(false);

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return urlData.publicUrl;
  };

  const deleteFile = async (path: string) => {
    const { error: deleteError } = await supabase.storage.from('videos').remove([path]);
    if (deleteError) {
      throw new Error(`Failed to delete image: ${deleteError.message}`);
    }
  };

  const handleUpdate = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (imageToDelete) {
        await deleteFile(imageToDelete);
      }

      const res = await fetch('/api/entrepreneur-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio, company, businessStage: selectedStage, linkedinUrl, revenue, imageUrl: tempImageUrl || imageUrl
        }),
      });

      const data = await res.json();
      if (data.error) {
        handleErrorToast(data.error);
      } else {
        handleSuccessToast('Profile updated successfully!');
        setProfile(data.entrepreneurProfile);
        setImageUrl(tempImageUrl || imageUrl);
        setTempImageUrl(null);
      }
    } catch (error) {
      handleErrorToast('Failed to update profile.');
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
      handleInfoToast('Image uploaded successfully! Remember to save changes to update your image!');
    } catch (error) {
      handleErrorToast('Failed to upload image.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-gray-100 dark:from-gray-800 dark:to-gray-600 p-10">
      <ToastContainer />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto shadow-2xl rounded-xl bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-800 dark:to-gray-600 p-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
            <FaPencilAlt className="inline-block text-green-600 dark:text-green-400 mr-3" />
            Edit Your Profile
          </h1>
          <form onSubmit={handleUpdate} className="space-y-12">
            <div className="flex flex-col items-center">
            <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-xl">
              {tempImageUrl || imageUrl ? (
                <img
                  src={tempImageUrl || imageUrl}
                  alt="Profile"
                  className="w-full h-full object-contain"
                />
              ) : (
                <FaCamera className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500" size={80} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
            </div>

              <div className="text-black mt-5">
              {isUploading && <LoadingDots />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company's name"
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Business Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                >
                  {businessStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn profile"
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                />
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center text-blue-600 dark:text-blue-400">
                    <FaLinkedin size={20} className="mr-2" />
                    View LinkedIn Profile
                  </a>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Revenue (in ZAR)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  placeholder="Annual revenue"
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Funding History</label>
                <textarea
                  value={fundingHistory}
                  onChange={(e) => setFundingHistory(e.target.value)}
                  placeholder="Detail your funding history..."
                  className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSaving}
                className="mt-4 w-full inline-flex items-center justify-center px-8 py-3 border border-gray-500 dark:border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:bg-green-600 dark:hover:bg-green-700"
           >
                {isSaving ? <LoadingDots/> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
