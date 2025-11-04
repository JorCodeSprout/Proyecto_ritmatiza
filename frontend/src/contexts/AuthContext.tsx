import React, { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthTypes";

// Definición de la interfaz User para el tipado local (se recomienda importarla si están en archivos separados)
interface User {
    email: string;
    name: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN'; 
    puntos: number; 
    profesor_id: number | null; 
}

// Duración de la sesión --> 30min
const DURACION = 30 * 60 * 1000;
const TOKEN_KEY = 'authToken';
const EXPIRACION_KEY = 'authExpiry';
const USER_NAME_KEY = 'userName';
const USER_POINTS_KEY = 'userPuntos'; 

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [puntos, setPuntos] = useState<number | null>(null);
    const [profesorId, setProfesorId] = useState<number | null>(null);
    const isLogged = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedExpiry = localStorage.getItem(EXPIRACION_KEY);
        const storedUserName = localStorage.getItem(USER_NAME_KEY);
        const storedPuntos = localStorage.getItem(USER_POINTS_KEY); 
        const now = Date.now();

        if(storedToken && storedExpiry && now < Number(storedExpiry)) {
            setToken(storedToken);
            setUserName(storedUserName);
            setPuntos(storedPuntos ? Number(storedPuntos) : 0);
        } else {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(EXPIRACION_KEY);
            localStorage.removeItem(USER_NAME_KEY);
            localStorage.removeItem(USER_POINTS_KEY);
        }
    }, []);

    const login = (newToken: string, user: User) => {
        const expiryTime = Date.now() + DURACION;
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(EXPIRACION_KEY, expiryTime.toString());
        localStorage.setItem(USER_NAME_KEY, user.name);
        localStorage.setItem(USER_POINTS_KEY, user.puntos.toString()); 

        setToken(newToken);
        setUserName(user.name);
        setPuntos(user.puntos);
        setProfesorId(user.profesor_id)
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRACION_KEY);
        localStorage.removeItem(USER_NAME_KEY);
        localStorage.removeItem(USER_POINTS_KEY); 
        setToken(null);
        setUserName(null);
        setPuntos(null);
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

    const contextValue: AuthContextType = {isLogged, token, userName, puntos, profesorId, login, logout};

    return (
        <AuthContext.Provider value={ contextValue }>
            {children}
        </AuthContext.Provider>
    )
}