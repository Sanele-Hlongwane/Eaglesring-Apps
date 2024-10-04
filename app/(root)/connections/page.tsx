"use client";

import { useState, useEffect } from "react";
import AcceptedRequestsPage from "@/components/Accepted";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingDots from "@/components/ui/LoadingDots";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { FaBuilding, FaCheckCircle, FaInbox, FaInfoCircle, FaMoneyBillWave, FaPaperPlane, FaSearch, FaTag, FaTrashAlt, FaUsers } from "react-icons/fa";

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
  const [activeTab, setActiveTab] = useState<
    "all" | "sent" | "received" | "accepted"
  >("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<number | null>(null); // Loading state for buttons
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
    setLoadingId(receiverId);
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
      setLoadingId(null);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    setLoadingId(requestId);
    try {
      await axios.post(`/api/friend-requests/${requestId}/accept`);
      toast.success("Friend request accepted!");
      setLoadingId(null);
      refreshRequests();
    } catch (err) {
      toast.error("Failed to accept friend request");
      setLoadingId(null);
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    setLoadingId(requestId);
    try {
      await axios.post(`/api/friend-requests/${requestId}/reject`);
      toast.success("Friend request rejected!");
      setLoadingId(null);
      refreshRequests();
    } catch (err) {
      toast.error("Failed to reject friend request");
      setLoadingId(null);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    setLoadingId(requestId);
    try {
      await axios.delete(`/api/friend-requests/${requestId}/delete`);
      toast.success("Friend request deleted!");
      setLoadingId(null);
      refreshRequests();
    } catch (err) {
      toast.error("Failed to delete friend request");
      setLoadingId(null);
    }
  };

  const handleRemoveRequest = async (requestId: number) => {
    setLoadingId(requestId);
    try {
      await axios.delete(`/api/friend-requests/${requestId}/remove`);
      toast.success("Friend request removed!");
      setLoadingId(null);
      refreshRequests();
    } catch (err) {
      toast.error("Failed to remove friend request");
      setLoadingId(null);
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
        profile.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((profile) =>
      roleFilter
        ? profile.role.toLowerCase() === roleFilter.toLowerCase()
        : true,
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
      return (
        <EmptyState
          message={`No ${activeTab === "all" ? "profiles" : activeTab + " requests"} found`}
        />
      );
    };

    const togglePopup = (userId: number | null) => {
      setSelectedUserId(userId);
    };

    return (
      <div className="relative  ">
        <div className="grid gap-6 grid-cols-1 xm-grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
          {dataToDisplay.map((item: any) => (
            <div
              key={item.id}
              className={`relative bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-${item.role === "ENTREPRENEUR" ? "blue-600" : "green-600"} dark:border-${item.role === "ENTREPRENEUR" ? "blue-600" : "green-600"} rounded-xl p-6 shadow-xl transition-transform transform `}
            >
              {/* Badge for Role */}
              <div className={`absolute top-2 right-2 bg-${item.role === "ENTREPRENEUR" ? "blue-600" : "green-600"} text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md`}>
                {item.role}
              </div>
              <div className="flex  text-sm flex-col items-center">
                {item.imageUrl && (
                  <button
                    className={`w-28 h-28 rounded-full border-4 border-${item.role === "ENTREPRENEUR" ? "blue-600" : "green-600"} shadow-md object-cover cursor-pointer transition-transform hover:scale-105`}
                    onClick={() => togglePopup(item.id)}
                    tabIndex={0}
                    onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && togglePopup(item.id)}
                    aria-label={`View ${item.name}'s profile image`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </button>
                )}

                {isPopupVisible && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => togglePopup(null)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && togglePopup(null)} // Handle keyboard interaction
                  >
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-96 h-96 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                      <button
                        onClick={() => togglePopup(null)}
                        className="absolute top-0 right-0 text-white bg-red-900 bg-opacity-70 rounded-full p-2 m-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {item.name}
                  </h2>
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
                    {item.email}
                  </p>
                  {item.entrepreneurProfile && (
                    <div className={`bg-white dark:bg-gray-900 p-6 rounded-2xl mb-6 border-t-4 border-${item.role === "ENTREPRENEUR" ? "blue-600" : "green-600"} `}>
                      <div className="mb-2">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Company:
                        </h4>
                        <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                          <FaBuilding className="text-blue-500 mr-2" />
                          <span className="text-gray-800 dark:text-gray-300">
                            {item.entrepreneurProfile.company}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Bio:
                        </h4>
                        <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                          <FaInfoCircle className="text-blue-500 mr-2" />
                          <span className="text-gray-700 dark:text-gray-400">
                            {item.entrepreneurProfile.bio}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Business Stage:
                        </h4>
                        <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                          <FaTag className="text-blue-500 mr-2" />
                          <span className="text-gray-700 dark:text-gray-400">
                            {item.entrepreneurProfile.businessStage}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Revenue:
                        </h4>
                        <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                          <FaMoneyBillWave className="mr-2 text-green-600 dark:text-green-400" />
                          <span className="font-semibold">Funding Goal:</span>
                          <span className="text-green-700 text-bold dark:text-green-800">
                            R
                            {item.entrepreneurProfile.revenue
                              ? item.entrepreneurProfile.revenue
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.investorProfile && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        Investment Strategy:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.investmentStrategy}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        Investment Focus:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.investmentFocus}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        Bio:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.Bio}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        LinkedIn:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.linkedinUrl}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        Preferred Industries:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.preferredIndustries}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        Risk Tolerance:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.riskTolerance}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        Investment Amount Range:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {item.investorProfile.investmentAmountRange}
                      </p>
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
                          <FaPaperPlane className="inline-block mr-2" /> Send
                          Friend Request
                        </>
                      )}
                    </button>
                  )}
                  {activeTab === "received" && item.status === "PENDING" && (
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={() => handleAcceptRequest(item.id)}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                        disabled={loadingId === item.id}
                      >
                        {loadingId === item.id ? (
                          <LoadingDots />
                        ) : (
                          <span>Accept</span>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeclineRequest(item.id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                        disabled={loadingId === item.id}
                      >
                        {loadingId === item.id ? (
                          <LoadingDots />
                        ) : (
                          <span>Decline</span>
                        )}
                      </button>
                    </div>
                  )}

                  {(activeTab === "sent" || activeTab === "received") && (
                    <div className="mt-4 w-full text-gray-600 dark:text-gray-300">
                      <p>
                        Status:
                        <span
                          className={`font-semibold ${item.status === "PENDING" ? "text-yellow-600 dark:text-yellow-500" : item.status === "ACCEPTED" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
                        >
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
                          ? "bg-red-600 dark:bg-red-500 cursor-wait"
                          : "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400"
                      }`}
                      disabled={loadingId === item.id}
                    >
                      {loadingId === item.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <LoadingDots />
                        </div>
                      ) : (
                        <>
                          <FaTrashAlt className="inline-block mr-2" /> Cancel
                          Request
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
      <nav className="fixed inset-x-0 top-16 z-10 flex flex-col items-center space-y-4 bg-gray-200 dark:bg-gray-800 p-4 shadow-lg">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:space-x-8">
          {/* Navigation Links */}
          <div className="flex space-x-4 lg:space-x-6">
            <a
              href="#all"
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-md border border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 
                ${
                  activeTab === "all"
                    ? "text-gray-800 dark:text-gray-200 bg-opacity-90 shadow-lg shadow-blue-500/50"
                    : "text-gray-700 dark:text-gray-300 bg-opacity-80 hover:bg-gray-300 dark:hover:bg-gray-600"
                } focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300`}
            >
              <FaUsers className="inline-block mr-2" /> All Profiles
            </a>
            <a
              href="#sent"
              onClick={() => setActiveTab("sent")}
              className={`px-6 py-3 rounded-md border border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 
                ${
                  activeTab === "sent"
                    ? "text-gray-800 dark:text-gray-200 bg-opacity-90 shadow-lg shadow-blue-500/50"
                    : "text-gray-700 dark:text-gray-300 bg-opacity-80 hover:bg-gray-300 dark:hover:bg-gray-600"
                } focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300
                `}
            >
              <FaPaperPlane className="inline-block mr-2" /> Sent
            </a>
            <a
              href="#received"
              onClick={() => setActiveTab("received")}
              className={`px-6 py-3 rounded-md border border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 
                ${
                  activeTab === "received"
                    ? "text-gray-800 dark:text-gray-200 bg-opacity-90 shadow-lg shadow-blue-500/50"
                    : "text-gray-700 dark:text-gray-300 bg-opacity-80 hover:bg-gray-300 dark:hover:bg-gray-600"
                } focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300
              `}
            >
              <FaInbox className="inline-block mr-2" /> Received
            </a>
            <a
              href="#accepted"
              onClick={() => setActiveTab("accepted")}
              className={`px-6 py-3 rounded-md border border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 
                ${
                  activeTab === "accepted"
                    ? "text-gray-800 dark:text-gray-200 bg-opacity-90 shadow-lg shadow-blue-500/50"
                    : "text-gray-700 dark:text-gray-300 bg-opacity-80 hover:bg-gray-300 dark:hover:bg-gray-600"
                } focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300
              `}
            >
              <FaCheckCircle className="inline-block mr-2" /> Accepted
            </a>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4 w-full lg:w-auto mt-4 lg:mt-0">
            <div className="relative flex-1 mb-4 lg:mb-0">
              <input
                type="text"
                placeholder="Name or Email..."
                className="w-full p-3 border rounded-lg shadow-md focus:outline-none transition-all duration-300 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-3 border border-gray-500 rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            >
              <option value="">Filter by role</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
            </select>
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-10 m-10">{renderContent()}</div>
    </div>
  );
};

export default ProfilesPage;
