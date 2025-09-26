// context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { googleLogout, type TokenResponse } from "@react-oauth/google";

// --- Type Definitions (from GoogleAuth.tsx) ---

interface GoogleProfile {
  id?: string;
  email: string;
  name: string;
  given_name: string;
  picture: string;
}

interface AuthContextType {
  user: TokenResponse | null;
  profile: GoogleProfile | null;
  setUser: (token: TokenResponse | null) => void;
  logOut: () => void;
}

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

  // --- Profile Fetching ---

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
        .catch((err: unknown) => {
          console.error("Error fetching profile, logging out:", err);
          logOut();
        });
    } else {
      setProfile(null);
    }
  }, [user]);

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

  const contextValue: AuthContextType = { user, profile, setUser, logOut };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
