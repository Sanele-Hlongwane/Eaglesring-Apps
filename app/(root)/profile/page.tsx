"use client";

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCamera, FaCheckCircle, FaUpload, FaTrash, FaPencilAlt, FaLinkedin, FaDollarSign } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import supabase from '@/lib/supabaseClient'; // Adjust based on your setup
import Loader from '@/components/Loader'; // Assume you have this component
import LoadingDots from '@/components/ui/LoadingDots'; // Assume you have this component

export default function EntrepreneurProfilePage() {
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

  const businessStages = ['Startup', 'Growth', 'Mature', 'Exit']; // Example stages

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/entrepreneur-profile');
        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
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
        toast.error('Failed to fetch profile.');
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
      // Delete previous image if a new one is set
      if (imageToDelete) {
        await deleteFile(imageToDelete);
      }

      // Save the new profile and image URL
      const res = await fetch('/api/entrepreneur-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, company, businessStage: selectedStage, linkedinUrl, revenue, imageUrl: tempImageUrl || imageUrl }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Profile updated successfully!');
        setProfile(data.entrepreneurProfile);
        setImageUrl(tempImageUrl || imageUrl);
        setTempImageUrl(null); // Clear temporary image URL
      }
    } catch (error) {
      toast.error('Failed to update profile.');
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
      setTempImageUrl(publicUrl); // Set the temporary image URL
      setImageToDelete(imageUrl); // Set the image to delete
      toast.info('Image uploaded successfully! Remember to save changes to update your image!');
    } catch (error) {
      toast.error('Failed to upload image.');
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg">
      <ToastContainer />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
            <FaPencilAlt className="text-blue-700 dark:text-blue-400" size={36} />
            <span>Your Profile</span>
          </h1>
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-40 h-40 bg-gray-200 dark:bg-gray-900 overflow-hidden rounded-lg">
                {tempImageUrl || imageUrl ? (
                    <img src={tempImageUrl || imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <FaCamera className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500" size={64} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-30"></div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-lg md:text-base sm:text-xs font-medium text-gray-800 dark:text-gray-300 flex items-center space-x-2">
                    <FaUpload className="text-blue-600 dark:text-blue-400" size={24} />
                    <span className="hidden sm:inline">Click on image to change it</span>
                    <span className="sm:hidden text-xs">Click image to change</span>
                  </label>
                  {isUploading && (
                    <p className="text-sm md:text-xs text-gray-600 dark:text-gray-400">
                      Uploading...
                    </p>
                  )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 p-3 border border-gray-300 dark:border-gray-600 w-full rounded-md bg-gray-100 dark:bg-gray-700"
                  rows={4}
                  required
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 p-3 border border-gray-300 dark:border-gray-600 w-full rounded-md bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="mt-2 p-3 border border-gray-300 dark:border-gray-600 w-full rounded-md bg-gray-100 dark:bg-gray-700"
                >
                  {businessStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="mt-2 p-3 border border-gray-300 dark:border-gray-600 w-full rounded-md bg-gray-100 dark:bg-gray-700"
                />
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center text-blue-600 dark:text-blue-400">
                    <FaLinkedin size={20} className="mr-2" />
                    View LinkedIn Profile
                  </a>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Revenue</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="mt-2 p-3 border border-gray-300 dark:border-gray-600 w-full rounded-md bg-gray-100 dark:bg-gray-700"
                />
                <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
                  <FaDollarSign size={20} className="mr-2" />
                  Current Revenue: ZAR {revenue}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funding History (Read-Only)</label>
                <textarea
                  value={fundingHistory}
                  readOnly
                  className="mt-2 p-3 border border-gray-300 dark:border-gray-600 w-full rounded-md bg-gray-100 dark:bg-gray-700"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className={`rounded-lg px-4 py-2 shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 transition-opacity duration-300 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? <LoadingDots /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
