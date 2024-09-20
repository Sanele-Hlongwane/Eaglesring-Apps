"use client";

import { useState, useEffect } from "react";
import AcceptedRequestsPage from "@/components/Accepted"; 
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingDots from "@/components/ui/LoadingDots"
import {
  FaUser,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaSearch,
  FaInbox,
  FaBuilding,
  FaDollarSign,
  FaTag,
  FaInfoCircle,
} from "react-icons/fa";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  entrepreneurProfile?: {
    company: string;
    bio: string;
  };
  investorProfile?: {
    investmentStrategy: string;
  };
}

interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender: Profile;
  receiver: Profile;
}

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received" |  "accepted">("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<number | null>(null); // Loading state for buttons
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users");
        const shuffledProfiles = response.data.sort(() => Math.random() - 0.5);
        setProfiles(shuffledProfiles);
      } catch (err) {
        setError("Failed to fetch profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Fetch sent and received requests based on active tab
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        if (activeTab === "sent") {
          const response = await axios.get("/api/friend-requests/sent");
          setSentRequests(response.data);
        } else if (activeTab === "received") {
          const response = await axios.get("/api/friend-requests/received");
          setReceivedRequests(response.data);
        }
      } catch (err) {
        setError("Failed to fetch friend requests");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== "all" && activeTab !== "accepted") {
      fetchRequests();
    }
  }, [activeTab]);

  const sendFriendRequest = async (receiverId: number) => {
    setLoadingId(receiverId); // Set loading state for button
    try {
      await axios.post("/api/send-friend-request", { receiverId });
      toast.success("Friend request sent!");
      if (activeTab === "all") {
        const response = await axios.get("/api/users");
        // Shuffle profiles to randomize the collection
        const shuffledProfiles = response.data.sort(() => Math.random() - 0.5);
        setProfiles(shuffledProfiles);
      }
    } catch (err) {
      toast.error("Failed to send friend request");
    } finally {
      setLoadingId(null); // Reset loading state for button
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await axios.post(`/api/friend-requests/${requestId}/accept`);
      toast.success('Friend request accepted!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await axios.post(`/api/friend-requests/${requestId}/reject`);
      toast.success('Friend request rejected!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to reject friend request');
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    try {
      await axios.delete(`/api/friend-requests/${requestId}/delete`);
      toast.success('Friend request deleted!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to delete friend request');
    }
  };

  const handleRemoveRequest = async (requestId: number) => {
    try {
      await axios.delete(`/api/friend-requests/${requestId}/remove`);
      toast.success('Friend request removed!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to remove friend request');
    }
  };

  const refreshRequests = async () => {
    if (activeTab === "sent") {
      const response = await axios.get("/api/friend-requests/sent");
      setSentRequests(response.data);
    } else if (activeTab === "received") {
      const response = await axios.get("/api/friend-requests/received");
      setReceivedRequests(response.data);
    }
  };

  const filteredProfiles = profiles
    .filter(
      (profile) =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((profile) =>
      roleFilter ? profile.role.toLowerCase() === roleFilter.toLowerCase() : true
    );

  const renderContent = () => {
    if (loading) return <Loader />;

    if (activeTab === "accepted") {
      return <AcceptedRequestsPage />;
    }

    const dataToDisplay =
      activeTab === "all"
        ? filteredProfiles
        : activeTab === "sent"
        ? sentRequests
        : receivedRequests;

    if (dataToDisplay.length === 0) {
      return <EmptyState message={`No ${activeTab === "all" ? "profiles" : activeTab + " requests"} found`} />;
    }

    return (
      <div className="space-y-6 text-xs">
        <div className="grid gap-6 grid-cols-1 xm-grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {dataToDisplay.map((item: any) => (
            <div
              key={item.id}
              className="relative bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl transition-transform transform "
            >
            {/* Badge for Role */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
              {item.role}
            </div>
          <div className="flex  text-sm flex-col items-center">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-md object-cover"
              />
            )}
            <div className="mt-4 text-center">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {item.name}
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
                {item.email}
              </p>
              {item.entrepreneurProfile && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-4 border-t-2 border-gray-900 dark:border-gray-300">
              <div className="flex items-center mb-2">
                <FaBuilding className="text-gray-600 mr-2" />
                <h3 className="text-smfont-bold text-gray-900 dark:text-gray-100">Company:</h3>
              </div>
              <p className="text-gray-800 dark:text-gray-300 mb-2">{item.entrepreneurProfile.company}</p>
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-gray-600 mr-2" />
                <h3 className="text-smfont-bold text-gray-900 dark:text-gray-100">Bio:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-2">{item.entrepreneurProfile.bio}</p>
              <div className="flex items-center mb-2">
                <FaTag className="text-gray-600 mr-2" />
                <h3 className="text-smfont-bold text-gray-900 dark:text-gray-100">Business Stage:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-2">{item.entrepreneurProfile.businessStage}</p>
              <div className="flex items-center">
                <FaDollarSign className="text-gray-600 mr-2" />
                <h3 className="text-smfont-bold text-gray-900 dark:text-gray-100">Revenue:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400">{item.entrepreneurProfile.revenue}</p>
            </div>
          )}
                {item.investorProfile && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Investment Strategy:</p>
                    <p className="text-gray-700 dark:text-gray-300">{item.investorProfile.investmentStrategy}</p>
                  </div>
                )}
                {activeTab === "all" && (
                  <button
                    onClick={() => sendFriendRequest(item.id)}
                    className="mt-4 bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-400 transition-colors relative"
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? (
                      <LoadingDots />
                    ) : (
                      <>
                        <FaPaperPlane className="inline-block mr-2" /> Send Friend Request
                      </>
                    )}
                  </button>
                )}
                {activeTab === "received" && item.status === "PENDING" && (
                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleAcceptRequest(item.id)}
                      className="bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-400 transition-colors relative"
                      disabled={loadingId === item.id}
                    >
                      {loadingId === item.id ? (
                        <LoadingDots />
                      ) : (
                        <>
                          <FaCheckCircle className="inline-block mr-2" /> Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(item.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors relative"
                      disabled={loadingId === item.id}
                    >
                      {loadingId === item.id ? (
                        <LoadingDots />
                      ) : (
                        <>
                          <FaTimesCircle className="inline-block mr-2" /> Decline
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveRequest(item.id)}
                      className="bg-red-600 dark:bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 dark:hover:bg-red-400 transition-colors relative"
                      disabled={loadingId === item.id}
                    >
                      {loadingId === item.id ? (
                        <LoadingDots />
                      ) : (
                        <>
                          <FaTrashAlt className="inline-block mr-2" /> Remove Request
                        </>
                      )}
                    </button>
                  </div>
                )}
                {(activeTab === 'sent' || activeTab === 'received') && (
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    <p>Status: 
                      <span className={`font-semibold ${item.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-500' : item.status === 'ACCEPTED' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {item.status}
                      </span>
                    </p>
                  </div>
                )}
                {activeTab === "sent" && (
                  <button
                    onClick={() => handleDeleteRequest(item.id)}
                    className={`mt-4 py-2 px-4 rounded-lg shadow-md text-white transition-colors relative ${
                      loadingId === item.id
                        ? 'bg-red-600 dark:bg-red-500 cursor-wait'
                        : 'bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400'
                    }`}
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingDots />
                      </div>
                    ) : (
                      <>
                        <FaTrashAlt className="inline-block mr-2" /> Cancel Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    );
  };

  return (
    <div className="container mx-auto p-6">
  <nav className="fixed inset-x-0 top-16 z-10 flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 p-4 shadow-lg">
    <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:space-x-8">
      {/* Navigation Links */}
      <div className="flex space-x-4 lg:space-x-6">
        <a
          href="#all"
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaUsers className="inline-block mr-2" /> All Profiles
        </a>
        <a
          href="#sent"
          onClick={() => setActiveTab("sent")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "sent"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaPaperPlane className="inline-block mr-2" /> Sent
        </a>
        <a
          href="#received"
          onClick={() => setActiveTab("received")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "received"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaInbox className="inline-block mr-2" /> Received
        </a>
        <a
          href="#accepted"
          onClick={() => setActiveTab("accepted")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "accepted"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaCheckCircle className="inline-block mr-2" /> Accepted
        </a>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row lg:space-x-4 w-full lg:w-auto mt-4 lg:mt-0">
        <div className="relative flex-1 mb-4 lg:mb-0">
          <input
            type="text"
            placeholder="Search profiles..."
            className="w-full p-3 border rounded-lg shadow-md focus:outline-none transition-all duration-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 border border-gray-500 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Filter by role</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="investor">Investor</option>
        </select>
      </div>
    </div>
  </nav>

  {/* Adding padding to avoid content being hidden under the fixed navbar */}
   <div className="pt-40 pb-10 m-10">
    {renderContent()}
  </div>
</div>

  
  );
};

export default ProfilesPage;
