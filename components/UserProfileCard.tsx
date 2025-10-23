interface UserProfileCardProps {
  user: any;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div>
      <h2>User Details</h2>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Image URL:</strong> {user.imageUrl}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
};

export default UserProfileCard;
