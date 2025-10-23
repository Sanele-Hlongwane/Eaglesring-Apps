// components/ProfileOverview.tsx
import { Card } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

const ProfileOverview: React.FC = () => {
  const { user } = useUser();

  return <Card></Card>;
};

export default ProfileOverview;
