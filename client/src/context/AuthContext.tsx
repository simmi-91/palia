// context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { googleLogout, type TokenResponse } from "@react-oauth/google";
import type {
  AuthContextType,
  GoogleProfile,
  RegistrationData,
} from "../app/types/userTypes";

// --- Context and Hook ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<TokenResponse | null>(null);
  const [profile, setProfile] = useState<GoogleProfile | null>(null);

  // --- Persistence and Initialization ---

  useEffect(() => {
    const storedUser = localStorage.getItem("googleAuthUser");
    if (storedUser) {
      // Note: A real app should validate token expiration here
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  const setUser = (token: TokenResponse | null) => {
    setUserState(token);
    if (token) {
      localStorage.setItem("googleAuthUser", JSON.stringify(token));
    } else {
      localStorage.removeItem("googleAuthUser");
    }
  };

  // --- Logout Function ---

  const logOut = (): void => {
    googleLogout();
    setUser(null); // This clears both state and local storage
    setProfile(null);
    try {
      const currentPath = window.location.pathname;
      if (currentPath.endsWith("/profile")) {
        const target = currentPath.replace(/\/profile$/, "/");
        window.location.assign(target);
      }
    } catch (_) {
      // no-op if window is unavailable (e.g., SSR)
    }
  };

  // --- Profile Fetching, DB Check, and Registration Logic ---

  useEffect(() => {
    if (user?.access_token) {
      const checkAndRegisterUser = async () => {
        try {
          const profileResponse = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          );
          if (!profileResponse.ok) {
            throw new Error(
              `Failed to fetch profile: ${profileResponse.status}`
            );
          }

          const googleProfile: GoogleProfile = await profileResponse.json();

          const checkResponse = await fetch(
            import.meta.env.VITE_BASEURL + "/api/users/check",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: googleProfile.email }),
            }
          );

          const checkData: { exists: boolean } = await checkResponse.json();

          if (checkData.exists) {
            setProfile(googleProfile);
            console.log("User successfully logged in and is registered.");
          } else {
            const shouldRegister = window.confirm(
              `The email ${googleProfile.email} is not registered. Do you want to register now?`
            );

            if (shouldRegister) {
              // 3. User Registers: Send data including the Google ID
              const registrationData: RegistrationData = {
                id: googleProfile.id,
                email: googleProfile.email,
                given_name: googleProfile.given_name,
                picture: googleProfile.picture,
              };

              const registerResponse = await fetch(
                import.meta.env.VITE_BASEURL + "/api/users/register",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(registrationData),
                }
              );

              const registerResult: { success: boolean; message?: string } =
                await registerResponse.json();

              if (registerResult.success) {
                setProfile(googleProfile);
                console.log("Registration successful!");
              } else {
                console.error("Registration failed:", registerResult.message);
                logOut();
              }
            } else {
              // Registration declined: Log out to clear state/token
              console.log("Registration declined by user. Logging out.");
              logOut();
            }
          }
        } catch (err) {
          console.error("Authentication/Registration Flow Failed:", err);
          logOut();
        }
      };

      checkAndRegisterUser();
    } else {
      setProfile(null);
    }
  }, [user]);

  const contextValue: AuthContextType = { user, profile, setUser, logOut };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
