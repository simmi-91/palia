// GoogleAuth.tsx

import { type ReactElement } from "react";
import { useGoogleLogin } from "@react-oauth/google";
// Import the custom hook
import { useAuth } from "../context/AuthContext";

function GoogleAuth(): ReactElement {
  // Use the state and functions from the context
  const { profile, setUser, logOut } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error: unknown) => console.error("Login Failed:", error),
  });

  return (
    <div>
      <h2>Google Login</h2>
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.given_name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        // Call the login function
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
  );
}
export default GoogleAuth;
