// components/InterestManagement.tsx
import { Card } from "@heroui/react";

interface Interest {
  id: number;
  pitchId: number;
  createdAt: string;
}

const InterestManagement: React.FC = () => {
  // Placeholder interests data
  const interests: Interest[] = [
    { id: 1, pitchId: 101, createdAt: new Date().toISOString() },
    // Add more interests as needed
  ];

  return <Card></Card>;
};

export default InterestManagement;
