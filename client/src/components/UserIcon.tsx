import { Link } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";

const UserIcon = () => {
    const { profile, login } = useAuth();

    return (
        <>
            {profile ? (
                <div className="d-flex justify-content-end">
                    <Link to="/profile" title="Go to profile">
                        <img
                            alt={profile.givenName}
                            src={profile.picture}
                            className="rounded-circle border border-2 border-dark "
                            style={{ maxHeight: 50 }}
                            role="button"
                        />
                    </Link>
                    <div className=" mx-1 row d-none d-sm-inline align-content-center">
                        <div className="row fw-bold fs-5 ">{profile.givenName}</div>
                        <Link
                            to="/profile"
                            className="text-nowrap text-decoration-none p-0 text-dark"
                            activeProps={{ className: "fw-bold" }}>
                            Profile
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            login(credentialResponse.credential);
                        }}
                        onError={() => console.error("Login failed")}
                    />
                </>
            )}
        </>
    );
};
export default UserIcon;
