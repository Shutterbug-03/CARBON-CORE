"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("greenpe_theme") as Theme | null;
        if (saved === "light" || saved === "dark") {
            setThemeState(saved);
            document.documentElement.className = saved;
        } else {
            document.documentElement.className = "dark";
        }
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem("greenpe_theme", t);
        document.documentElement.className = t;
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Safe default for SSR / prerender
        return { theme: "dark" as const, setTheme: () => { }, toggleTheme: () => { } };
    }
    return context;
}
