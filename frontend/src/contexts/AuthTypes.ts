import { createContext } from "react";

export interface AuthContextType {
    isLogged: boolean;
    token: string | null;
    userName: string | null;
    login: (newToken: string, name: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);