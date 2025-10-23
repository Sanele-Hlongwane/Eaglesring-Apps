// components/UpcomingEvents.tsx
import { Card } from "@nextui-org/react";

interface Event {
  id: number;
  title: string;
  date: string;
}

const UpcomingEvents: React.FC = () => {
  // Placeholder events data
  const events: Event[] = [
    { id: 1, title: "Investment Summit", date: new Date().toISOString() },
    // Add more events as needed
  ];

  return <Card></Card>;
};

export default UpcomingEvents;
