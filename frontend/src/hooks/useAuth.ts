import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../contexts/AuthTypes";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('Error: "useAuth" no puede acceder al contexto de autenticación.');
    } 
    return context;
}