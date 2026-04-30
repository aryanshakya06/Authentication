import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    DEFAULT_THEME,
    STORAGE_KEY,
    THEMES,
    getThemeById,
    isValidThemeId
} from "../styles/themes/index.js";

const ThemeContext = createContext(null);

const readInitialTheme = () => {
    if (typeof document !== "undefined") {
        const fromHtml = document.documentElement.getAttribute("data-theme");
        if (isValidThemeId(fromHtml)) return fromHtml;
    }
    if (typeof localStorage !== "undefined") {
        const fromStorage = localStorage.getItem(STORAGE_KEY);
        if (isValidThemeId(fromStorage)) return fromStorage;
    }
    return DEFAULT_THEME;
};

export const ThemeProvider = ({ children }) => {
    const [themeId, setThemeId] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", themeId);
        try {
            localStorage.setItem(STORAGE_KEY, themeId);
        } catch {
            // ignore storage failures (quota / privacy mode)
        }
    }, [themeId]);

    const setTheme = useCallback((id) => {
        if (!isValidThemeId(id)) return;
        setThemeId(id);
    }, []);

    const value = {
        themeId,
        setTheme,
        theme: getThemeById(themeId),
        themes: THEMES
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
};
