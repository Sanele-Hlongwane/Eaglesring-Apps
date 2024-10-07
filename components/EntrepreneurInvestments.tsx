"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Investment {
  id: number;
  investorProfile: {
    id: number;
    imageUrl: string | null;
    user: {
      name: string;
    };
  };
  investmentOpportunity: {
    id: number;
    title: string;
    description: string;
  };
}

const EntrepreneurInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get("/api/investments/entrepreneur");
        setInvestments(response.data);
      } catch (error) {
        setError("Unable to fetch investments.");
        console.error(error);
      }
    };

    fetchInvestments();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200">Investments in My Opportunities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {investments.map((investment) => (
          <div 
            key={investment.id} 
            className="investment-card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition transform hover:scale-105 hover:shadow-xl"
          >
            {investment.investorProfile.imageUrl && (
              <Image
                src={investment.investorProfile.imageUrl}
                alt={`${investment.investorProfile.user.name}'s profile picture`}
                width={50}
                height={50}
                className="rounded-full mb-4 border border-gray-300 dark:border-gray-600"
              />
            )}
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">{investment.investmentOpportunity.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{investment.investmentOpportunity.description}</p>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">Investor: {investment.investorProfile.user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntrepreneurInvestments;