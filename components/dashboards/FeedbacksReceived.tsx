// components/FeedbacksReceived.tsx
import { Card } from "@heroui/react";

interface Feedback {
  id: number;
  content: string;
  pitchId: number;
  createdAt: string;
}

interface FeedbacksReceivedProps {
  feedbacks: Feedback[];
}

const FeedbacksReceived: React.FC<FeedbacksReceivedProps> = ({ feedbacks }) => {
  return <Card></Card>;
};

export default FeedbacksReceived;
