import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { googleLogout } from "@react-oauth/google";

import type {
  AuthContextType,
  GoogleProfile,
  ExtendedTokenResponse,
} from "../app/types/userTypes";

import { useInventory } from "../hooks/useInventory";

// --- Configuration ---
const TOKEN_LIFETIME_DAYS = 10;
const TOKEN_LIFETIME_MS = TOKEN_LIFETIME_DAYS * 24 * 60 * 60 * 1000;

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
  const [user, setUserState] = useState<ExtendedTokenResponse | null>(null);
  const [profile, setProfile] = useState<GoogleProfile | null>(null);

  // --- Token Refresh Function ---

  const refreshAccessToken = async (
    refreshToken: string
  ): Promise<ExtendedTokenResponse | null> => {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const tokenData = await response.json();
      return {
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
        refresh_token: refreshToken, // Keep the original refresh token
      } as ExtendedTokenResponse;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  // --- API Call with Auto-Refresh ---

  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!user?.access_token) {
      throw new Error("No access token available");
    }

    // Add authorization header
    const authHeaders = {
      ...options.headers,
      Authorization: `Bearer ${user.access_token}`,
    };

    let response = await fetch(url, { ...options, headers: authHeaders });

    // If token is invalid, try to refresh and retry once
    if (response.status === 401 && user.refresh_token) {
      console.log("Access token invalid, refreshing...");
      const refreshedToken = await refreshAccessToken(user.refresh_token);

      if (refreshedToken) {
        setUser(refreshedToken); // Update stored token
        // Retry the request with new token
        const newAuthHeaders = {
          ...options.headers,
          Authorization: `Bearer ${refreshedToken.access_token}`,
        };
        response = await fetch(url, { ...options, headers: newAuthHeaders });
      } else {
        // Refresh failed, log out user
        logOut();
        throw new Error("Authentication failed");
      }
    }

    return response;
  };

  // --- Persistence and Initialization ---

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("googleAuthUser");
      if (storedUser) {
        const userWithTimestamp = JSON.parse(storedUser);
        const { issuedAt, ...userToken } = userWithTimestamp;

        const expirationTime = issuedAt + TOKEN_LIFETIME_MS;
        const now = Date.now();

        if (now < expirationTime) {
          setUserState(userToken);
        } else if (userToken.refresh_token) {
          console.log("Access token expired, attempting refresh...");
          const refreshedToken = await refreshAccessToken(
            userToken.refresh_token
          );

          if (refreshedToken) {
            console.log("Token refreshed successfully");
            setUser(refreshedToken);
          } else {
            console.log("Token refresh failed. Logging out.");
            logOut();
          }
        } else {
          console.log(
            "Token expired and no refresh token available. Logging out."
          );
          logOut();
        }
      }
    };

    initializeAuth();
  }, []);

  const setUser = (token: ExtendedTokenResponse | null) => {
    setUserState(token);
    if (token) {
      localStorage.setItem(
        "googleAuthUser",
        JSON.stringify({ ...token, issuedAt: Date.now() })
      );
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
          const profileResponse = await makeAuthenticatedRequest(
            `https://www.googleapis.com/oauth2/v1/userinfo`,
            {
              headers: {
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
            import.meta.env.VITE_API_URL + "/users/check",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: googleProfile.email }),
            }
          );

          const checkData: { exists: boolean; isAdmin?: boolean } =
            await checkResponse.json();
          if (checkData.exists) {
            setProfile({
              ...googleProfile,
              isAdmin: checkData.isAdmin || false,
            });
          } else {
            const shouldRegister = window.confirm(
              `The email ${googleProfile.email} is not registered. Do you want to register now?`
            );

            if (shouldRegister) {
              // User Registers: Send data including the Google ID
              const GoogleProfile: GoogleProfile = {
                id: googleProfile.id,
                email: googleProfile.email,
                given_name: googleProfile.given_name,
                picture: googleProfile.picture,
              };

              const registerResponse = await fetch(
                import.meta.env.VITE_API_URL + "/users/register",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(GoogleProfile),
                }
              );

              const registerResult: {
                success: boolean;
                message?: string;
                user?: { isAdmin: boolean };
              } = await registerResponse.json();

              if (registerResult.success) {
                setProfile({
                  ...googleProfile,
                  isAdmin: registerResult.user?.isAdmin || false,
                });
                window.location.href =
                  window.location.origin + "/palia/profile";
              } else {
                console.error("Registration failed:", registerResult.message);
                logOut();
              }
            } else {
              // Registration declined: Log out to clear state/token
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

  // --- Inventory hook ---
  const {
    inventory,
    loadInventory,
    updateInventoryAmount,
    bulkUpdateInventory,
  } = useInventory(profile);

  useEffect(() => {
    if (profile) {
      loadInventory();
    }
  }, [profile, loadInventory]);

  const contextValue: AuthContextType = {
    user,
    profile,
    setUser,
    logOut,
    makeAuthenticatedRequest,
    inventory,
    loadInventory,
    updateInventoryAmount: (item) => updateInventoryAmount(item),
    bulkUpdateInventory,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
