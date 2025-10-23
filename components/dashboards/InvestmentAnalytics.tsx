// components/InvestmentAnalytics.tsx
import React from "react";

interface InvestmentAnalyticsProps {
  analytics: any; // Define the structure of your analytics data here
}

const InvestmentAnalytics: React.FC<InvestmentAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Investment Analytics</h2>
      {/* Render your analytics data here */}
      {analytics ? (
        <pre>{JSON.stringify(analytics, null, 2)}</pre>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default InvestmentAnalytics;
