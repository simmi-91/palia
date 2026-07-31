import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { googleLogout } from "@react-oauth/google";

import type { AuthContextType, GoogleProfile, AuthSession } from "../app/types/userTypes";

import { useInventory } from "../hooks/useInventory";

// --- Configuration ---
const LOCAL_STORAGE_KEY = "palia_auth_session";

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
    const [authSession, setAuthSession] = useState<AuthSession | null>(null);
    const [profile, setProfile] = useState<GoogleProfile | null>(null);

    // --- Token Refresh Function ---

    const login = async (idToken: string | undefined) => {
        if (!idToken) return null;
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const session = await response.json();

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
            setAuthSession(session);
            setProfile(session.profile);

            return session;
        } catch (error) {
            console.error("Failed to login. ", error);
            return null;
        }
    };

    // --- Persistence and Initialization ---

    useEffect(() => {
        const initializeAuth = async () => {
            const storedSession = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (!storedSession) return;

            try {
                const session = JSON.parse(storedSession);

                if (session.expiresAt && Date.now() < session.expiresAt) {
                    setAuthSession(session);
                    setProfile(session.profile);
                } else {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                }
            } catch {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        };

        initializeAuth();
    }, []);

    // --- Logout Function ---
    const logOut = (): void => {
        googleLogout();
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setAuthSession(null);
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

    // --- Inventory hook ---
    const { inventory, loadInventory, updateInventoryAmount, bulkUpdateInventory } =
        useInventory(profile);

    useEffect(() => {
        if (profile) {
            loadInventory();
        }
    }, [profile, loadInventory]);

    const contextValue: AuthContextType = {
        profile,
        authSession,
        login,
        logOut,
        inventory,
        loadInventory,
        updateInventoryAmount: (item) => updateInventoryAmount(item),
        bulkUpdateInventory,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
