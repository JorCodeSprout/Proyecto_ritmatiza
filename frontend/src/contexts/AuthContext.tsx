import React, { useState, useEffect } from 'react';
import { AuthContext, type AuthContextType } from "./AuthTypes.ts"; 

const initialAuthState: Omit<AuthContextType, 'login' | 'logout' | 'setUserData'> = {
    id: null,
    email: null,
    userName: null,
    role: null,
    puntos: null,
    profesorId: null,
    isLogged: false,
    token: null,
    loadingAuth: true,
};

const storageKey = 'userAuthData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState(initialAuthState);

    useEffect(() => {
        const loadInitialState = () => {
            try {
                const storedData = localStorage.getItem(storageKey);
                if (storedData) {
                    const { token, ...userData } = JSON.parse(storedData);
                    
                    if (token) {
                        setAuthState(prev => ({
                            ...prev,
                            ...userData,
                            token,
                            isLogged: true,
                        }));
                    }
                }
            } catch (error) {
                console.error("Error al cargar el estado de autenticación:", error);
                localStorage.removeItem(storageKey);
            } finally {
                setAuthState(prev => ({ ...prev, loadingAuth: false }));
            }
        };

        loadInitialState();
    }, []);

    const login: AuthContextType['login'] = (newToken, user) => {
        const fullData = { 
            id: user.id,
            email: user.email,
            userName: user.name,
            role: user.role,
            puntos: user.puntos,
            profesorId: user.profesor_id,
            token: newToken 
        };
        
        setAuthState(prev => ({
            ...prev,
            ...fullData,
            isLogged: true,
            loadingAuth: false,
        }));
        
        localStorage.setItem(storageKey, JSON.stringify(fullData));
    };

    const logout: AuthContextType['logout'] = () => {
        setAuthState({
            ...initialAuthState,
            loadingAuth: false,
        });
        localStorage.removeItem(storageKey);
    };

    const setUserData: AuthContextType['setUserData'] = (newUserData) => {
        setAuthState(prev => {
            const newState = { 
                ...prev, 
                ...newUserData,
                role: newUserData.role !== undefined ? newUserData.role : prev.role,
            };

            const { ...dataToStore } = newState; 
            localStorage.setItem(storageKey, JSON.stringify(dataToStore));
            
            return newState;
        });
    };

    const contextValue: AuthContextType = {
        ...authState,
        login,
        logout,
        setUserData,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};