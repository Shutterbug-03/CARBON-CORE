"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface UserData {
    entity: {
        id: string;
        type: string;
        name: string;
        registrationId: string;
        location: { lat: number; lng: number; region: string };
        createdAt: Date;
    } | null;
    asset: {
        id: string;
        type: string;
        ownerId: string;
        description: string;
        metadata: Record<string, unknown>;
        boundAt: Date;
    } | null;
    isOnboarded: boolean;
    identityHash: string | null;
}

interface AppContextType {
    user: UserData;
    setUser: (user: UserData) => void;
    completeOnboarding: (entity: UserData["entity"], asset: UserData["asset"], hash: string) => void;
    logout: () => void;
}

const defaultUser: UserData = {
    entity: null,
    asset: null,
    isOnboarded: false,
    identityHash: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData>(() => {
        if (typeof window === "undefined") return defaultUser;
        const saved = localStorage.getItem("greenpe_user");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return defaultUser;
            }
        }
        return defaultUser;
    });

    const completeOnboarding = (entity: UserData["entity"], asset: UserData["asset"], hash: string) => {
        const newUser: UserData = { entity, asset, isOnboarded: true, identityHash: hash };
        setUser(newUser);
        localStorage.setItem("greenpe_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(defaultUser);
        localStorage.removeItem("greenpe_user");
    };

    return (
        <AppContext.Provider value={{ user, setUser, completeOnboarding, logout }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
}
