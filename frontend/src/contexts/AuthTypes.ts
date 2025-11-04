import { createContext } from "react";

interface User {
    email: string;
    name: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN'; 
    puntos: number;
    profesor_id: number | null; 
}

export interface AuthContextType {
    isLogged: boolean;
    token: string | null;
    userName: string | null;
    puntos: number | null;
    profesorId: User["profesor_id"];

    login: (newToken: string, user: User) => void; 
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);