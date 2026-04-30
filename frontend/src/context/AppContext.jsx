import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";
import { toast } from "react-toastify";
import { showError } from "../lib/errors.js";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    async function fetchUser() {
        try {
            const { data } = await api.get("/api/v1/me");
            setUser(data.user);
            setIsAuth(true);
        } catch {
            setUser(null);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }

    async function logoutUser(navigate) {
        try {
            const { data } = await api.post("/api/v1/logout");
            toast.success(data.message);
            setIsAuth(false);
            setUser(null);
            if (navigate) navigate("/");
        } catch (err) {
            showError(err);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AppContext.Provider value={{ setIsAuth, isAuth, user, setUser, loading, logoutUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const AppData = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("AppData must be used within an AppProvider");
    return context;
};
