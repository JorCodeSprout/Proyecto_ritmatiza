import React, { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthTypes";

// Duración de la sesión --> 30min
const DURACION = 30 * 60 * 1000;
const TOKEN_KEY = 'authToken';
const EXPIRACION_KEY = 'authExpiry';

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const isLogged = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storeExpirity = localStorage.getItem(EXPIRACION_KEY);
        const now = Date.now();

        if(storedToken && storeExpirity && now < Number(storeExpirity)) {
            setToken(storedToken);
        } else {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(EXPIRACION_KEY);
        }
    }, []);

    const login = (newToken: string, name: string) => {
        const expiryTime = Date.now() + DURACION;
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(EXPIRACION_KEY, expiryTime.toString());
        localStorage.setItem('userName', name);

        setToken(newToken);
        setUserName(name);
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRACION_KEY);
        setToken(null);
        setUserName(null);
    }

    useEffect(() => {
        if(isLogged) {
            const storedExpiry = localStorage.getItem(EXPIRACION_KEY);
            const timeExpiracion = Number(storedExpiry) - Date.now();

            if(timeExpiracion > 0) {
                const timer = setTimeout(() => {
                    alert('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión');
                    logout();
                }, timeExpiracion);

                return () => clearTimeout(timer);
            } else {
                logout();
            }
        }
    }, [isLogged]);

    const contextValue: AuthContextType = {isLogged, token, userName, login, logout};

    return (
        <AuthContext.Provider value={ contextValue }>
            {children}
        </AuthContext.Provider>
    )
}