"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingDots from "@/components/ui/LoadingDots";
import AcceptedRequestsPage from "@/components/Accepted"; 
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { FaBuilding, FaInfoCircle, FaTag, FaDollarSign, FaCheckCircle, FaTimesCircle, FaTrashAlt } from "react-icons/fa";

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  entrepreneurProfile?: {
    company: string;
    bio: string;
    businessStage: string;
    revenue: string;
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

const OpportunitiesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received" | "accepted">("all"); // Added "accepted" tab
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/opportunities");
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
      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dataToDisplay.map((item: any) => (
            <div
              key={item.id}
              className="relative bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl transition-transform transform "
            >
              {/* Badge for Role */}
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
                {item.role}
              </div>
              
              <div className="flex flex-col items-center">
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
                    {item.status}
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
                    {item.email}
                  </p>
                  {item.entrepreneurProfile && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-4 border-t-2 border-gray-900 dark:border-gray-300">
                      <div className="flex items-center mb-2">
                        <FaBuilding className="text-gray-600 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Company:</h3>
                      </div>
                      <p className="text-gray-800 dark:text-gray-300 mb-2">{item.entrepreneurProfile.company}</p>
                      <div className="flex items-center mb-2">
                        <FaInfoCircle className="text-gray-600 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Bio:</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 mb-2">{item.entrepreneurProfile.bio}</p>
                      <div className="flex items-center mb-2">
                        <FaTag className="text-gray-600 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Business Stage:</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 mb-2">{item.entrepreneurProfile.businessStage}</p>
                      <div className="flex items-center mb-2">
                        <FaDollarSign className="text-gray-600 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Revenue:</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 mb-2">{item.entrepreneurProfile.revenue}</p>
                    </div>
                  )}
                  {item.investorProfile && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-4 border-t-2 border-gray-900 dark:border-gray-300">
                      <div className="flex items-center mb-2">
                        <FaDollarSign className="text-gray-600 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Investment Strategy:</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 mb-2">{item.investorProfile.investmentStrategy}</p>
                    </div>
                  )}
                </div>
                {activeTab === "all" && (
                  <button
                    onClick={() => sendFriendRequest(item.id)}
                    disabled={loadingId === item.id}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingId === item.id ? <LoadingDots /> : "Send Friend Request"}
                  </button>
                )}
                {(activeTab === "sent" || activeTab === "received") && item.status === "ACCEPTED" && (
                  <div className="p-4">
                    <h1 className="text-2xl font-bold">{item.title}</h1>
                    <a
                      href={`/pitches/${item.id}`}
                      className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
                    >
                      View Pitches
                    </a>
                    <a
                      href={`/chat/${item.id}`}
                      className="mt-4 ml-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
                    >
                      Message
                    </a>
                  </div>
                )}
                {(activeTab === "sent" || activeTab === "received") && (
                  <div className="mt-4 flex space-x-4">
                    {activeTab === "received" && item.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(item.id)}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
                        >
                          <FaCheckCircle className="inline mr-2" /> Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(item.id)}
                          className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
                        >
                          <FaTimesCircle className="inline mr-2" /> Decline
                        </button>
                      </>
                    )}
                    {activeTab === "sent" && item.status === "PENDING" && (
                      <button
                        onClick={() => handleDeleteRequest(item.id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
                      >
                        <FaTrashAlt className="inline mr-2" /> Delete
                      </button>
                    )}
                    {activeTab === "received" && item.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleRemoveRequest(item.id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
                      >
                        <FaTimesCircle className="inline mr-2" /> Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex items-center mb-6">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="ml-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">All Roles</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="investor">Investor</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} shadow-md`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-lg ${activeTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} shadow-md ml-2`}
        >
          Sent Requests
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-lg ${activeTab === "received" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} shadow-md ml-2`}
        >
          Received Requests
        </button>
        <button
          onClick={() => setActiveTab("accepted")}
          className={`px-4 py-2 rounded-lg ${activeTab === "accepted" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} shadow-md ml-2`}
        >
          Accepted
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default OpportunitiesPage;
