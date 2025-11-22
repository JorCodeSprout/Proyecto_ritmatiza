import type React from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import FormularioCreacion from "../components/FormularioCreacion";
import { fetchProfesores } from "../api/perfilAdmin";
import { useCallback, useEffect, useState } from "react";
import type { ProfesorAdmin } from "../types";

const Usuarios: React.FC = () => {
    const {user, token} = useAuth();

    const [profesores, setProfesores] = useState<ProfesorAdmin[]>([]);
    
    const loadProfesores = useCallback(async () => {
        if(!token) {
            return;
        }

        try {
            const data = await fetchProfesores(token);
            setProfesores(data);
        } catch(err) {
            console.error("Error al cargar los profesores: ", err);
            throw err;
        } 
    }, [token]);

    useEffect(() => {
        loadProfesores();
    }, [loadProfesores]);

    return (
        <div>
            <Sidebar/>
            <div id="body">
                {user?.role === "ADMIN" && (
                    <>
                        <div className='formularios'>
                            <div>
                                <FormularioCreacion adminToken={token} profesores={profesores} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Usuarios;