import EmptyState from "@/components/EmptyState";

const ProfilesPage = () => {
 
  return (
    <div className="profiles-page">
        <EmptyState message="No profiles found." />
    </div>
  );
};

export default ProfilesPage;
