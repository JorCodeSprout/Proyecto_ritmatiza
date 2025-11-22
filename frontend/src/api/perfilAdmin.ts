/*
PETICIONES
===========================
Crear un nuevo usuario --> POST - usuario/crear
Obtener todos los profesores y admin --> GET - usuario/profesores
*/
import type { CrearUsuario, ProfesorAdmin } from "../types";

const URL = import.meta.env.VITE_API_URL;

export const fetchCrearUsuario = async (token: string | null, userData: CrearUsuario): Promise<CrearUsuario[]> => {
    try {
        const response = await fetch(`${URL}/usuario/crear`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.error || "Error al crear el usuario");
        }

        return data.user;
    } catch(err) {
        console.error(`Error al crear el usuario`, err);
        throw err;
    }
}

export const fetchProfesores = async (token: string | null): Promise<ProfesorAdmin[]> => {
    try {
        const response = await fetch(`${URL}/usuario/profesores`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.error || "Error al crear el usuario");
        }

        return data.profesores;
    } catch(err) {
        console.error(`Error al cargar los profesores`, err);
        throw err;
    }
}