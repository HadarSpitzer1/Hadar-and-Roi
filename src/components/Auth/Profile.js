import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <div className="profile-section">
        {user?.picture && (
          <img
            src={user.picture}
            alt={user?.name}
            className="profile-image"
          />
        )}
        <span className="profile-name">{user?.name}</span>
      </div>
    )
  );
};

export default Profile;