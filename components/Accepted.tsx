"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaInfoCircle, FaTag, FaDollarSign } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import EmptyState from "@/components/EmptyState";

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
    }
  };

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  if (acceptedRequests.length === 0) {
    return <EmptyState message={"No accepted requests found."} />;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {acceptedRequests.map((request) => {
        const user = request; // Directly use the fetched request data

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
                        <FaDollarSign className="text-blue-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-400">
                          R{user.entrepreneurProfile.revenue?.toLocaleString() || "N/A"}
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
                    href={`/pitches/${user.id}`} // Use user.id to navigate to pitches
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
