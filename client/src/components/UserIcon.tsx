import { Link } from "@tanstack/react-router";
import { useGoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";
import type { ExtendedTokenResponse } from "../app/types/userTypes";

const UserIcon = () => {
  const { profile, setUser } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse as ExtendedTokenResponse),
    onError: (error: unknown) => console.error("Login Failed:", error),
    scope: "openid email profile",
  });

  return (
    <>
      {profile ? (
        <div className="d-flex justify-content-end">
          <Link to="/profile" title="Go to profile">
            <img
              alt={profile.given_name}
              src={profile.picture}
              className="rounded-circle border border-2 border-dark "
              style={{ maxHeight: 50 }}
              role="button"
            />
          </Link>
          <div className=" mx-1 row d-none d-sm-inline align-content-center">
            <div className="row fw-bold fs-5 ">{profile.given_name}</div>
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
          <button
            className="btn btn-light rounded-pill border border-dark text-nowrap  align-content-center"
            onClick={() => login()}
          >
            <i className="bi bi-person-circle"></i>
            <span className="d-none d-sm-inline ps-1">Login</span>
          </button>
        </>
      )}
    </>
  );
};
export default UserIcon;
