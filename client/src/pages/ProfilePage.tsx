import { useAuth } from "../context/AuthContext";
import { Link } from "@tanstack/react-router";

const ProfilePage = () => {
  const { profile, logOut } = useAuth();
  if (!profile) {
    return (
      <div className="container p-2">
        <div className="row py-1">Not logged in</div>
      </div>
    );
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
        <div className="col">Logged in as: {profile.given_name}</div>
        <div className="col-12 col-sm-6 col-lg-2">
          <div className=" float-end">
            {/*isAdmin && (
              <Link
                to="/admin"
                className="btn btn-info border rounded-2 border-dark m-2"
                style={{ color: "inherit" }}
              >
                Admin
              </Link>
            )*/}
            <button
              className="btn btn-primary border rounded-2 border-dark"
              onClick={() => alertLogout()}
            >
              Log out
            </button>
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
          <div className="col"></div>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
