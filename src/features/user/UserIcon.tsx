import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

const UserIcon = () => {
  const { user, profile, logOut } = useAuth();
  //console.log(user, profile);

  const alertLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logOut();
    }
  };
  return (
    <>
      {profile ? (
        <div className="d-flex justify-content-end">
          <div>
            <img
              alt={profile.given_name ? profile.given_name : profile.name}
              src={profile.picture}
              className="rounded-circle border border-2 border-dark "
              style={{ maxHeight: 50 }}
              role="button"
              onClick={() => alertLogout()}
              title="Click to log out"
            />
          </div>
          <div className=" mx-2 row ">
            <div className="row fw-bold fs-5">
              {profile?.given_name ? profile?.given_name : profile.name}
            </div>
            <Link
              to="/profile"
              className="text-nowrap text-decoration-none p-0 text-dark"
              activeProps={{ className: "fw-bold" }}
            >
              Profile
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Link
            to="/login"
            className="px-2 m-1  text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
            activeProps={{ className: "text-white bg-dark fw-bold" }}
          >
            Login
          </Link>
        </>
      )}
    </>
  );
};

export default UserIcon;
