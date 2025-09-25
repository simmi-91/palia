import { useState, useEffect, type ReactElement } from "react";
import {
  googleLogout,
  useGoogleLogin,
  type TokenResponse,
} from "@react-oauth/google";

interface GoogleProfile {
  id?: string;
  email: string;
  verified_email?: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  locale?: string;
}

function GoogleAuth(): ReactElement {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const [profile, setProfile] = useState<GoogleProfile | null>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => setUser(codeResponse),
    onError: (error: unknown) => console.error("Login Failed:", error),
  });

  useEffect(() => {
    if (user?.access_token) {
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        }
      )
        .then(async (response) => {
          if (!response.ok)
            throw new Error(`Failed to fetch profile: ${response.status}`);
          const data: GoogleProfile = await response.json();
          setProfile(data);
        })
        .catch((err: unknown) => console.error(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = (): void => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
  );
}
export default GoogleAuth;
