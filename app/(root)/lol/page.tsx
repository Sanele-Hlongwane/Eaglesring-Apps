"use client";

import React, { useEffect, useState } from 'react';

interface Investment {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  pitchId: string;
  pitchTitle: string;
  userId: string;
  entrepreneurProfileId: string;
  investmentOpportunityId: string;
  investmentId: string;
  investmentOpportunity: {
    title: string;
    entrepreneurProfile: {
      company: string;
      name: string;
    };
  };
}

const InvestmentList: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch('/api/investment');
        if (!response.ok) {
          throw new Error('Failed to fetch investments');
        }

        const data = await response.json();
        setInvestments(data.investments);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Investments</h1>
      <ul>
        {investments.map((investment) => (
          <li key={investment.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="font-bold">{investment.title}</h2>
            <p>
              Amount Invested: R{(investment.amount / 100).toFixed(2)}
            </p>
            <p>
              Opportunity Title: {investment.investmentOpportunity.title}
            </p>
            <p>
              Entrepreneur: {investment.investmentOpportunity.entrepreneurProfile.name} - {investment.investmentOpportunity.entrepreneurProfile.company}
            </p>
            <p>
              Investment Date: {new Date(investment.createdAt).toLocaleDateString()}
            </p>
            <p>
              Pitch ID: {investment.pitchId}
            </p>
            <p>
              Pitch Title: {investment.pitchTitle}
            </p>
            <p>
              User ID: {investment.userId}
            </p>
            <p>
              Entrepreneur Profile ID: {investment.entrepreneurProfileId}
            </p>
            <p>
              Investment Opportunity ID: {investment.investmentOpportunityId}
            </p>
            <p>
              Investment ID: {investment.investmentId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvestmentList;

