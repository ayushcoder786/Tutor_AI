import {createContext, useContext, useEffect, useState} from "react";
import { callApi } from "../api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [csrf, setCsrf] = useState("");
    const [user, setUser] = useState(null);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const csrf = localStorage.getItem("csrf");
        if (!csrf) {
            setLoading(false);
            return;
        }
        setCsrf(csrf);
        setLoading(true);
        callApi("GET", "/auth/rbac", null, null, loadData, csrf);
    }, []);

    const loadData = (data) =>{
        if (data?.status) 
        {
            setUser(data.user || null);
            setMenus(data.menus || []);
        } 
        else 
            logout();
        setLoading(false);
    };
    
    const login = (data) => {
        localStorage.setItem("csrf", data.token);
        setCsrf(data.token);
        setUser(data.user || null);
        setMenus(data.menus || []);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setMenus([]);
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem("csrf");
    };

    const value = {user, menus, csrf, loading, login, logout, isAuthenticated};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};