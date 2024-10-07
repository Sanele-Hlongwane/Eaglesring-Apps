"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Investment {
  id: number;
  entrepreneurProfile: {
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

const InvestorInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get("/api/investments/investor");
        setInvestments(response.data);
      } catch (error) {
        setError("Unable to fetch investments.");
        console.error(error);
      }
    };

    fetchInvestments();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Investments</h1>
      <div>
        {investments.map((investment) => (
          <div key={investment.id} className="investment-card">
            {investment.entrepreneurProfile.imageUrl && (
              <Image
                src={investment.entrepreneurProfile.imageUrl}
                alt={`${investment.entrepreneurProfile.user.name}'s profile picture`}
                width={50}
                height={50}
              />
            )}
            <h2>{investment.investmentOpportunity.title}</h2>
            <p>{investment.investmentOpportunity.description}</p>
            <p>Entrepreneur: {investment.entrepreneurProfile.user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorInvestments;
