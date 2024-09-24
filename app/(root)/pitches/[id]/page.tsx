"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import CheckoutButton from '@/components/CheckoutButton';
import {
  FaBuilding,
  FaDollarSign,
  FaTag,
  FaInfoCircle,
  FaVideo,
  FaFileDownload,
  FaCalendarAlt,
  FaLinkedin,
} from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Pitch {
  id: number;
  title: string;
  description: string;
  fundingGoal?: number;
  videoUrl?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Entrepreneur {
  id: number;
  userId: number;
  company: string;
  businessStage: string;
  revenue: string;
  bio?: string;
  linkedinUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
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
        const response = await axios.get(`/api/opportunities/${id}`);
        if (response.status === 200 && response.data) {
          const { pitches, entrepreneur } = response.data;
          setPitches(pitches);
          setCommonDetails(entrepreneur);
        } else {
          throw new Error("Invalid response from API.");
        }
      } catch (err) {
        console.error("Error fetching pitches and profile:", err);
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
  if (pitches.length === 0)
    return <EmptyState message="No pitches found for this user." />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}`;
  };

  const handleCheckout = async (pitchId: number, amount: number, pitchTitle: string) => {
    const stripe = await stripePromise;
    if (!stripe) {
      toast.error('Stripe.js failed to load.');
      return;
    }

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100); // Assuming amount is in rands

    try {
      const response = await axios.post('/api/checkout', {
        pitchId,
        amount: amountInCents,
        pitchTitle,
      });

      if (response.status === 200) {
        const { id } = response.data;
        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) {
          toast.error(error.message);
        }
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      toast.error('Failed to start checkout');
      console.error('Error during checkout:', err);
    }
  };

  if (loading) return <Loader />;
  if (error) return <EmptyState message={error} />;

  return (
    <div className="p-8  space-y-8">
      {commonDetails && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-10  transition-transform duration-300 transform ">
          {commonDetails.imageUrl && (
            <div className="relative w-full h-60 md:h-80 overflow-hidden rounded-lg mb-8">
              <div className="relative w-full h-60 md:h-80 overflow-hidden rounded-lg mb-8">
                <img
                  src={commonDetails.imageUrl}
                  alt="Company Logo"
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end items-center text-white p-4">
                <div className="mb-2 h-20 overflow-auto bg-opacity-5 backdrop-blur-md bg-white  rounded-lg p-2">
                  {" "}
                  {/* Added blur and background */}
                  <p className="text-xs text-gray-100 dark:text-gray-300">
                    {commonDetails?.bio || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            <div className="flex items-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg transition-transform duration-300">
              <FaBuilding className="text-blue-600 dark:text-blue-300 mr-2 text-3xl" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Company:
                </h3>
                <p className="text-xs text-gray-800 dark:text-gray-300">
                  {commonDetails.company}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-100 dark:bg-purple-900 rounded-lg transition-transform duration-300">
              <FaTag className="text-purple-600 dark:text-purple-300 mr-2 text-3xl" />
              <div>
                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                  Stage:
                </h3>
                <p className="text-xs text-gray-800 dark:text-gray-300">
                  {commonDetails.businessStage}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-green-100 dark:bg-green-900 rounded-lg transition-transform duration-300">
              <FaDollarSign className="text-green-600 dark:text-green-300 mr-2 text-3xl" />
              <div>
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                  Annual Revenue:
                </h3>
                <p className="text-xs text-gray-800 dark:text-gray-300">
                  R
                  {new Intl.NumberFormat("en-ZA").format(
                    Number(commonDetails.revenue),
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg transition-transform duration-300">
              <FaLinkedin className="text-blue-600 dark:text-blue-300 mr-2 text-3xl" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  LinkedIn:
                </h3>
                <a
                  href={commonDetails.linkedinUrl}
                  className="text-xs text-blue-500 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {window.innerWidth < 640
                    ? "View Profile"
                    : commonDetails.linkedinUrl}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4">
            <button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-110">
              Connect with Entrepreneur
            </button>
          </div>
        </div>
      )}

      {pitches.map((pitch) => (
        <div
          key={pitch.id}
          className="bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md transition-transform duration-300 transform "
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {pitch.title}
          </h2>
          <h1 className="text-l font-bold text-green-800 dark:text-green-300 mb-4">
            Funding Goal: R
            {pitch.fundingGoal !== undefined
              ? new Intl.NumberFormat("en-ZA").format(pitch.fundingGoal)
              : "N/A"}
          </h1>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-700 dark:text-gray-200 text-xl mr-2" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Created At:</span>{" "}
                {formatDate(pitch.createdAt)}
              </div>
            </div>

            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-700 dark:text-gray-200 text-xl mr-2" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Last Updated At:</span>{" "}
                {formatDate(pitch.updatedAt)}
              </div>
            </div>
            <CheckoutButton
                  pitchId={pitch.id}
                  amount={pitch.fundingGoal || 0}
                  pitchTitle={pitch.title}
                  onClick={() => handleCheckout(pitch.id, pitch.fundingGoal || 0, pitch.title)}
                />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => handleExpand(pitch)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleExpand(pitch);
              }
            }}
            className="mt-4 cursor-pointer text-green-600 hover:text-green-700 transition-colors"
          >
            {expandedPitchId === pitch.id ? "▲ Show Less" : "▼ View More"}
          </div>

          {expandedPitchId === pitch.id && (
            <div className=" p-4 rounded-xl shadow-md border-t-2 border-gray-900 dark:border-gray-300 mt-4">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-300 whitespace-pre-line">
                {pitch.description}
              </p>

              {pitch.videoUrl && (
                <div className="mt-4 ">
                  <h3 className="font-semibold">Video Pitch:</h3>
                  <iframe
                    width="100%"
                    height="315"
                    src={pitch.videoUrl}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg  bg-white dark:bg-black"
                  />
                </div>
              )}

              {pitch.attachments && pitch.attachments.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Attachments:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-300">
                    {pitch.attachments.map((attachment, index) => (
                      <li key={index} className="flex items-center mt-1">
                        <FaFileDownload className="text-gray-600 dark:text-gray-200 mr-2" />
                        <a
                          href={attachment}
                          className="text-blue-500 dark:text-blue-400 hover:underline"
                          download
                        >
                          Download Attachment {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        theme="dark"
      />
    </div>
  );
};

export default EntrepreneurPitchesPage;
