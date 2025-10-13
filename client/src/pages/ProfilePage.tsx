import { useAuth } from "../context/AuthContext";
import { Link } from "@tanstack/react-router";

const ProfilePage = () => {
  const { profile, logOut } = useAuth();
  if (!profile) {
    //window.location.href = window.location.origin + "/palia/";
    return;
  }
  const alertLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logOut();
    }
  };
  const isAdmin = profile?.isAdmin;

  return (
    <div className="container p-2">
      <div className="row py-1">
        <div className="col">Logget inn som: {profile.given_name}</div>
        <div className="col-6 col-sm-3 col-lg-2">
          <div className=" float-end">
            <button onClick={() => alertLogout()}> Log out</button>
          </div>
        </div>
      </div>
      <div className="row py-1">
        <div className="col">
          <div className="col">Info from Google:</div>
          <div className="col">Name: {profile.given_name}</div>
          <div className="col">Email: {profile.email}</div>
        </div>
      </div>

      <hr />

      <div className="row py-1">
        <div className="col d-flex">
          <Link
            to="/paliatracker"
            className="text-decoration-none border rounded-5 border-dark bg-info p-2 text-center m-1"
            style={{ color: "inherit" }}
          >
            Import data from PaliaTracker.com
          </Link>
        </div>
      </div>

      <hr />

      {isAdmin && (
        <div className="row py-1">
          <div className="col">
            user is admin - display edit options for content
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
