"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaInfoCircle, FaTag, FaDollarSign, FaMoneyBillWave, FaLinkedin, FaChartPie, FaBullseye, FaUser } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import {
  FaLightbulb,
  FaCrown,
  FaLeaf,
  FaShieldAlt,
  FaComments,
  FaUserTie,
  FaChartLine,
  FaRegGem,
  FaHandsHelping,
  FaGlobe,
  FaRocket,
  FaAward,
  FaMedal,
} from "react-icons/fa";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  entrepreneurProfile?: EntrepreneurProfile | null;
  investorProfile?: InvestorProfile | null;
}

interface EntrepreneurProfile {
  company: string;
  bio: string;
  businessStage: string;
  revenue: number | null;
}

interface InvestorProfile {
  investmentFocus: string;
  bio: string;
  portfolioCompanies: string[];
  investmentStrategy: string;
  linkedinUrl: string;
  preferredIndustries: string;
  riskTolerance: string;
  investmentAmountRange: number | null;
}

const AcceptedRequestsPage = () => {
  const [acceptedRequests, setAcceptedRequests] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const togglePopup = (userId: number | null) => {
    setSelectedUserId(userId);
  };

  const fetchAcceptedRequests = async () => {
    try {
      const { data } = await axios.get("/api/opportunities/accepted");
      setAcceptedRequests(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch accepted requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (acceptedRequests.length === 0) {
    return <EmptyState message={"No accepted requests found."} />;
  }

  function formatInvestmentRange(range: number | null): string {
    if (!range) {
      return 'N/A';
    }
  
    const formattedRange = range.toLocaleString('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).replace('ZAR', 'R');
  
    return formattedRange;
  }
  
  

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {acceptedRequests.map((request) => {
        const user = request;
        const isEntrepreneur = user.role === "ENTREPRENEUR";
        const cardColor = isEntrepreneur ? "blue-600" : "green-600";
        const cardRoleBg = isEntrepreneur ? "blue-600" : "green-600";
        const cardColorHover = isEntrepreneur ? "blue" : "green";

        return (
          <div
            key={user.id}
            className={`relative bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-${cardColor} dark:border-${cardColor} rounded-xl p-6 shadow-xl transition-transform transform`}
          >
            <div className={`absolute top-2 right-2 bg-${cardRoleBg} text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md`}>
              {user.role}
            </div>

            <div className="flex flex-col items-center">
            {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className={`w-28 h-28 rounded-full border-4 border-${cardRoleBg} shadow-md object-cover cursor-pointer transition-transform hover:scale-105`}
                  onClick={() => togglePopup(user.id)} // Pass user ID to togglePopup
                />
              )}

              {/* Popup Modal for selected user */}
              {selectedUserId === user.id && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                  title="Close"
                  onClick={() => togglePopup(null)} 
                >
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      title="View full image"
                      alt={user.name}
                      className={`w-96 h-96 rounded-full border-4 border-${cardRoleBg} shadow-lg object-cover`}
                    />
                    <button
                      onClick={() => togglePopup(null)} 
                      className="absolute top-0 right-0 text-gray-100 bg-red-800 bg-opacity-70 rounded-full p-2 m-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {user.email}
                </p>

                {user.role === "ENTREPRENEUR" && user.entrepreneurProfile && (
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl mb-6 border-t-4 border-blue-500 ">
                    <div className="mb-2">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Company:</h4>
                      <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                        <FaBuilding className="text-blue-500 mr-2" />
                        <span className="text-gray-800 dark:text-gray-300">{user.entrepreneurProfile.company}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Bio:</h4>
                      <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                        <FaInfoCircle className="text-blue-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-400">{user.entrepreneurProfile.bio}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Business Stage:</h4>
                      <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                        <FaTag className="text-blue-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-400">{user.entrepreneurProfile.businessStage}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Revenue:</h4>
                      <div className="flex items-center border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                        <FaMoneyBillWave className="text-blue-500 mr-2" />
                        <span className="text-green-700 dark:text-green-800">
                          R{user.entrepreneurProfile.revenue
                            ? user.entrepreneurProfile.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {user.role === "INVESTOR" && user.investorProfile && (
                  <div className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl mb-6 border-t-4 border-${cardRoleBg} dark:border-${cardRoleBg}`}>
                    <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <FaChartPie className="text-green-600 dark:text-green-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Investment Focus</h3>
                        <p className="text-gray-700 dark:text-gray-400">{user.investorProfile.investmentFocus}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FaUser className="text-green-600 dark:text-green-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Bio</h3>
                        <p className="text-gray-700 dark:text-gray-400">{user.investorProfile.bio}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FaBullseye className="text-green-600 dark:text-green-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Investment Strategy</h3>
                        <p className="text-gray-700 dark:text-gray-400">{user.investorProfile.investmentStrategy}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FaLinkedin className="text-blue-600 dark:text-blue-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">LinkedIn</h3>
                        <a href={user.investorProfile.linkedinUrl} className="text-blue-600 dark:text-blue-400 underline">
                          {user.investorProfile.linkedinUrl}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FaBuilding className="text-green-600 dark:text-green-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Preferred Industries</h3>
                        <p className="text-gray-700 dark:text-gray-400">{user.investorProfile.preferredIndustries}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FaShieldAlt className="text-green-600 dark:text-green-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Risk Tolerance</h3>
                        <p className="text-gray-700 dark:text-gray-400">{user.investorProfile.riskTolerance}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FaMoneyBillWave className="text-green-600 dark:text-green-400 text-2xl" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Investment Amount Range</h3>
                        <p className="text-gray-700 dark:text-gray-400">
                          {formatInvestmentRange(user.investorProfile.investmentAmountRange)}
                        </p>
                      </div>
                    </div>
                  </div>

                  </div>
                )}
                {user.role === "ENTREPRENEUR" && (
                  <a
                    href={`/pitches/${user.id}`} 
                    className={`mt-4 bg-${cardRoleBg} text-white py-2 px-4 rounded-lg shadow-md hover:bg-${cardColorHover}-700`}
                  >
                    View Pitches
                  </a>
                )}

                <a
                  href={`/chat/${user.id}`}
                  className={`mt-4 ml-4 bg-${cardColor} text-white py-2 px-4 rounded-lg shadow-md hover:bg-${cardColorHover}-700`}
                >
                  Message
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AcceptedRequestsPage;
