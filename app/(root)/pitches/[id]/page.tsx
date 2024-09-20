"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { FaBuilding, FaDollarSign, FaTag, FaInfoCircle, FaVideo, FaFileDownload, FaCalendarAlt, FaLinkedin } from "react-icons/fa";

interface Pitch {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Entrepreneur {
  id: number; // Unique identifier for the entrepreneur
  userId: number; // Reference to the user ID
  company: string; // Name of the company
  businessStage: string; // Current stage of the business (e.g., startup, growth, etc.)
  revenue: string; // Revenue information (could be a string or number depending on your data)
  bio?: string; // Optional biography of the entrepreneur
  linkedinUrl?: string; // Optional LinkedIn URL
  imageUrl?: string; // Optional URL for the entrepreneur's image
  createdAt: string; // Timestamp for when the profile was created
  updatedAt: string; // Timestamp for when the profile was last updated
}



const EntrepreneurPitchesPage = () => {
  const { id } = useParams();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [commonDetails, setCommonDetails] = useState<Entrepreneur | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPitchesAndProfile = async () => {
      if (!id) {
        console.error("User ID is not defined.");
        setError("Invalid user ID.");
        return;
      }
  
      setLoading(true);
      try {
        console.log(`Fetching pitches and profile for entrepreneur with user ID: ${id}`);
  
        const response = await axios.get(`/api/opportunities/${id}`);
  
        if (response.status === 200 && response.data) {
          console.log('Fetched entrepreneur and pitches:', response.data);
          
          // Extract pitches and entrepreneur profile from the response data
          const { pitches, entrepreneur } = response.data;
  
          // Set the pitches state
          setPitches(pitches);
          
          // Set the entrepreneur profile state
          setCommonDetails(entrepreneur); // Ensure you have a state for commonDetails
        } else {
          console.error('Invalid response from API:', response);
          throw new Error("Invalid response from API.");
        }
      } catch (err) {
        console.error('Error fetching pitches and profile:', err);
        setError("Failed to fetch pitches and profile");
        toast.error("Failed to fetch pitches and profile");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPitchesAndProfile();
  }, [id]);
  
  

  const handleExpand = (pitch: Pitch) => {
    setExpandedPitchId(expandedPitchId === pitch.id ? null : pitch.id);
  };

  if (loading) return <Loader />;
  if (error) return <EmptyState message={error} />;
  if (pitches.length === 0) return <EmptyState message="No pitches found for this user." />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    })}`;
  };

  return (
    <div className="p-6 space-y-6">
      {commonDetails && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-12 shadow-2xl relative overflow-hidden transition-colors duration-700">

          {/* Full-Width Image with Interactive Overlay */}
          {commonDetails.imageUrl && (
            <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg mb-8 group">
              <img
                src={commonDetails.imageUrl}
                alt="Company Logo"
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-center items-center text-white p-4">
                <div className="text-center">
                  <h2 className="text-3xl md:text-2xl font-extrabold mb-2 transition-transform duration-500 transform group-hover:-translate-y-2">
                    {commonDetails.company}
                  </h2>
                  <p className="text-sm md:text-xl bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-70 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2">
                    {commonDetails.businessStage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Data Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            <div className="flex items-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-pink-100 dark:hover:from-indigo-900 dark:hover:to-pink-900">
              <FaBuilding className="text-indigo-600 dark:text-indigo-300 mr-4 text-4xl transform transition-transform duration-500 hover:rotate-6" />
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Company:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-400">
                  {commonDetails.company}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-800 dark:via-cyan-800 dark:to-blue-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-teal-100 hover:to-blue-100 dark:hover:from-teal-900 dark:hover:to-blue-900">
              <FaTag className="text-teal-600 dark:text-teal-300 mr-4 text-4xl transform transition-transform duration-500 hover:rotate-6" />
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Stage:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-400">
                  {commonDetails.businessStage}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Additional Data Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            <div className="flex items-center bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 dark:from-green-800 dark:via-yellow-800 dark:to-red-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-green-100 hover:to-red-100 dark:hover:from-green-900 dark:hover:to-red-900">
              <FaDollarSign className="text-green-600 dark:text-green-300 mr-4 text-4xl transform transition-transform duration-500 hover:scale-125" />
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Revenue:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-400">
                  {commonDetails.revenue}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900">
              <FaLinkedin className="text-blue-600 dark:text-blue-300 mr-4 text-4xl transform transition-transform duration-500 hover:scale-125" />
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  LinkedIn:
                </h3>
                <a
                  href={commonDetails.linkedinUrl}
                  className="text-lg text-blue-500 dark:text-blue-400 hover:underline hover:text-blue-400 transition-all duration-300"
                >
                  {commonDetails.linkedinUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Animated Blue Button */}
          <div className="flex items-center justify-center mt-12">
            <button className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform duration-500 transform hover:scale-110 hover:shadow-2xl">
              Connect with Entrepreneur
            </button>
          </div>
        </div>
      )}

      {pitches.map((pitch) => (
        <div
          key={pitch.id}
          className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
        >
         <h2 className="text-3xl md:text-2xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">{pitch.title}</h2>
          <p className="text-lg md:text-xl mb-6 text-gray-800 dark:text-gray-300">{pitch.description}</p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl mr-4" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Created At:</h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{formatDate(pitch.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl mr-4" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Last Updated At:</h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{formatDate(pitch.updatedAt)}</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleExpand(pitch)}
            className="mt-4 cursor-pointer text-green-600 hover:text-green-700 transition-colors"
          >
            {expandedPitchId === pitch.id ? "▲ Show Less" : "▼ View More"}
          </div>

          {expandedPitchId === pitch.id && (
            <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-xl shadow-lg border-t-2 border-gray-900 dark:border-gray-300 mt-4">
              {pitch.videoUrl && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaVideo className="text-gray-600 mr-2 text-xl md:text-xl" />
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Video:</h3>
                  </div>
                  <video
                    src={pitch.videoUrl}
                    controls
                    className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
                    style={{ maxHeight: '500px' }}
                  >
                      <track 
                        src="captions_en.vtt" 
                        kind="captions" 
                        srcLang="en" 
                        label="English captions"
                        default
                      />
                      Your browser does not support the video tag.
                    </video>
                </div>
              )}
              
              {pitch.attachments && pitch.attachments.length > 0 && (
                <div className="flex flex-col space-y-2">
                  {pitch.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-400 underline"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <ToastContainer />
    </div>
  );
};

export default EntrepreneurPitchesPage;
