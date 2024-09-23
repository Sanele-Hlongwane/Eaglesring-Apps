"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaInfoCircle, FaTag, FaDollarSign, FaMoneyBillWave } from "react-icons/fa";
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
}

const AcceptedRequestsPage = () => {
  const [acceptedRequests, setAcceptedRequests] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const { toast } = useToast();

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
      setLoading(false); // Set loading to false after fetching
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

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
       <div className="absolute inset-0 pointer-events-none opacity-20">
        <FaLightbulb className="text-yellow-500 absolute top-16 left-20 text-[100px] rotate-12" />
        <FaShieldAlt className="text-blue-500 absolute top-1/3 right-10 text-[120px] rotate-6" />
        <FaComments className="text-green-500 absolute bottom-16 left-1/4 text-[80px] -rotate-12" />
        <FaUserTie className="text-red-500 absolute top-1/4 left-10 text-[90px] rotate-45" />
        <FaChartLine className="text-purple-500 absolute bottom-20 right-1/3 text-[110px] -rotate-6" />
        <FaRegGem className="text-pink-500 absolute bottom-1/4 left-2/3 text-[100px] rotate-12" />

        <FaHandsHelping className="text-yellow-400 absolute top-20 right-5 text-[90px] rotate-12" />
        <FaGlobe className="text-blue-400 absolute bottom-28 right-14 text-[100px] rotate-12" />
        <FaRocket className="text-red-400 absolute top-1/3 left-14 text-[80px] rotate-45" />
        <FaAward className="text-orange-500 absolute bottom-10 left-32 text-[120px] rotate-6" />
        <FaMedal className="text-green-400 absolute top-10 right-32 text-[110px] -rotate-12" />
      </div>
      {acceptedRequests.map((request) => {
        const user = request;

        return (
          <div
            key={user.id}
            className="relative bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl transition-transform transform"
          >
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md">
              {user.role}
            </div>

            <div className="flex flex-col items-center">
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-md object-cover"
                />
              )}

              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {user.email}
                </p>

                {user.role === "ENTREPRENEUR" && user.entrepreneurProfile && (
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl mb-6 border-t-4 border-blue-500 transition-transform transform hover:scale-105">
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
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg mb-4 border-t-2 border-gray-900 dark:border-gray-300">
                    <div className="flex items-center mb-1">
                      <FaInfoCircle className="text-gray-600 mr-1" />
                      <span className="font-bold">Investment Focus:</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-1">{user.investorProfile.investmentFocus}</p>

                    <div className="flex items-center mb-1">
                      <FaInfoCircle className="text-gray-600 mr-1" />
                      <span className="font-bold">Bio:</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-1">{user.investorProfile.bio}</p>

                    <div className="flex items-center mb-1">
                      <FaBuilding className="text-gray-600 mr-1" />
                      <span className="font-bold">Portfolio Companies:</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-1">
                      {user.investorProfile.portfolioCompanies.join(', ') || "None"}
                    </p>
                  </div>
                )}

                {user.role === "ENTREPRENEUR" && (
                  <a
                    href={`/pitches/${user.id}`} 
                    className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
                  >
                    View Pitches
                  </a>
                )}

                <a
                  href={`/chat/${user.id}`}
                  className="mt-4 ml-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
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
