import { createContext } from "react";

export interface User {
    id: number | null;
    email: string;
    name: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN' | '';
    puntos: number;
    profesor_id: number | null; 
}

export interface AuthContextType {
    id: User['id'];
    email: User['email'] | null;
    userName: User['name'] | null;
    role: User['role'] | null;
    puntos: User['puntos'] | null;
    profesorId: User["profesor_id"] | null;
    
    isLogged: boolean;
    token: string | null;
    loadingAuth: boolean;
    
    login: (newToken: string, user: Omit<User, 'role'> & { role: User['role'] }) => void;
    logout: () => void;
    
    setUserData: (newUserData: Partial<Omit<User, 'email' | 'id'>>) => void; 
}
export const AuthContext = createContext<AuthContextType | null>(null);