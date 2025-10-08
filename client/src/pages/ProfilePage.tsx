import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { profile, logOut } = useAuth();
  if (!profile) {
    window.location.href = window.location.origin + "/palia/";
    return;
  }

  const alertLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logOut();
    }
  };

  return (
    <div className="container p-2">
      <div className="row">
        <div className="col">profile:{profile.given_name}</div>
        <div className="col">
          <button onClick={() => alertLogout()}> Log out</button>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
