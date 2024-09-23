"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaSearch,
  FaSpinner,
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
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received">(
    "all",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users");
        setProfiles(response.data);
      } catch (err) {
        setError("Failed to fetch profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (activeTab === "sent" || activeTab === "received") {
      const fetchRequests = async () => {
        setLoading(true);
        try {
          const sentResponse = await axios.get("/api/friend-requests/sent");
          const receivedResponse = await axios.get(
            "/api/friend-requests/received",
          );
          setSentRequests(sentResponse.data);
          setReceivedRequests(receivedResponse.data);
        } catch (err) {
          setError("Failed to fetch friend requests");
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }
  }, [activeTab]);

  const sendFriendRequest = async (receiverId: number) => {
    setButtonLoading((prev) => ({ ...prev, [receiverId]: true }));
    try {
      await axios.post("/api/send-friend-request", { receiverId });
      toast.success("Friend request sent!");
      refreshProfiles();
    } catch (err) {
      toast.error("Failed to send friend request");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [receiverId]: false }));
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    setButtonLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`/api/friend-requests/${requestId}/accept`);
      toast.success("Friend request accepted!");
      refreshRequests();
    } catch (err) {
      toast.error("Failed to accept friend request");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    setButtonLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`/api/friend-requests/${requestId}/reject`);
      toast.success("Friend request rejected!");
      refreshRequests();
    } catch (err) {
      toast.error("Failed to reject friend request");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    setButtonLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.delete(`/api/friend-requests/${requestId}/delete`);
      toast.success("Friend request deleted!");
      refreshRequests();
    } catch (err) {
      toast.error("Failed to delete friend request");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const refreshProfiles = async () => {
    const response = await axios.get("/api/users");
    setProfiles(response.data);
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

  // Helper to check if a profile exists in sent or received requests
  const isInRequests = (profileId: number) => {
    return (
      sentRequests.some((request) => request.receiverId === profileId) ||
      receivedRequests.some((request) => request.senderId === profileId)
    );
  };

  // Filter profiles based on search, role filter, and exclude users in sent/received requests when on "all" tab
  const filteredProfiles = profiles
    .filter(
      (profile) =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((profile) => (roleFilter ? profile.role === roleFilter : true))
    .filter((profile) =>
      activeTab === "all" ? !isInRequests(profile.id) : true,
    );

  return (
    <div className="profiles-page">
      <ToastContainer />
      {/* Tab Navigation */}
      <div className="tabs">
        <button onClick={() => setActiveTab("all")}>All Profiles</button>
        <button onClick={() => setActiveTab("sent")}>Sent Requests</button>
        <button onClick={() => setActiveTab("received")}>
          Received Requests
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ENTREPRENEUR">Entrepreneur</option>
          <option value="INVESTOR">Investor</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? <Loader /> : null}

      {/* Profile List */}
      {filteredProfiles.length > 0 ? (
        filteredProfiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            {/* Profile Info */}
            <img src={profile.imageUrl} alt={profile.name} />
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <p>{profile.role}</p>
            {/* Conditionally render request buttons based on active tab */}
            {activeTab === "all" && (
              <button
                disabled={buttonLoading[profile.id]}
                onClick={() => sendFriendRequest(profile.id)}
              >
                {buttonLoading[profile.id] ? (
                  <FaSpinner className="spinner" />
                ) : (
                  "Send Friend Request"
                )}
              </button>
            )}
          </div>
        ))
      ) : (
        <EmptyState message="No profiles found." />
      )}
    </div>
  );
};

export default ProfilesPage;
