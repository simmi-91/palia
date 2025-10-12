import { useAuth } from "../context/AuthContext";
import { Link } from "@tanstack/react-router";

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
        <div className="col">profile: {profile.given_name}</div>
        <div className="col">
          <button onClick={() => alertLogout()}> Log out</button>
        </div>
      </div>

      <hr />

      <div>
        <Link
          to="/paliatracker"
          className="text-decoration-none border rounded-5 border-dark bg-info p-2"
          style={{ color: "inherit" }}
        >
          Import data from PaliaTracker.com
        </Link>
      </div>
    </div>
  );
};
export default ProfilePage;
