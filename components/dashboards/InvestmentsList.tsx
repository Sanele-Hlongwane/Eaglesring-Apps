import React from "react";

interface Investment {
  id: number;
  amount: number;
  entrepreneurProfileId: string;
}

interface InvestmentsListProps {
  investments: Investment[];
  onDelete: (id: number) => void;
}

const InvestmentsList: React.FC<InvestmentsListProps> = ({
  investments,
  onDelete,
}) => (
  <div className="w-full max-w-3xl mx-auto mb-8">
    <h2 className="text-2xl font-semibold mb-4">Your Investments:</h2>
    <ul className="list-disc pl-5">
      {investments.map((investment) => (
        <li key={investment.id} className="mb-2">
          {investment.amount} in {investment.entrepreneurProfileId}
          <button
            onClick={() => onDelete(investment.id)}
            className="ml-4 text-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default InvestmentsList;
