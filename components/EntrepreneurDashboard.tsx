"use client";

import React, { useEffect, useState } from "react";

interface InvestmentOpportunity {
  id: number;
  title: string;
  description?: string;
  amount?: number;
}

interface EntrepreneurProfile {
  bio?: string;
  company?: string;
  businessStage?: string;
  fundingHistory?: string;
  linkedinUrl?: string;
  imageUrl?: string;
  revenue?: number;
  investmentOpportunities?: InvestmentOpportunity[];
}

const EntrepreneurProfile: React.FC = () => {
  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/entrepreneur-profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        // Optionally handle the error
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {profile.imageUrl && (
        <img
          src={profile.imageUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
      )}
      <h1 className="text-2xl font-bold">{profile.company}</h1>
      <p>{profile.bio}</p>
      <p>
        <strong>Business Stage:</strong> {profile.businessStage}
      </p>
      <p>
        <strong>Funding History:</strong> {profile.fundingHistory}
      </p>
      <p>
        <strong>LinkedIn:</strong>{" "}
        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
          {profile.linkedinUrl}
        </a>
      </p>
      <p>
        <strong>Revenue:</strong> {profile.revenue}
      </p>
      <h2 className="text-xl font-semibold mt-4">Investment Opportunities</h2>
      <ul>
        {profile.investmentOpportunities?.map((opp) => (
          <li key={opp.id} className="mb-2 p-2 border rounded">
            <h3 className="text-lg font-medium">{opp.title}</h3>
            {opp.description && <p>{opp.description}</p>}
            {opp.amount && (
              <p>
                <strong>Amount:</strong> {opp.amount}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntrepreneurProfile;
