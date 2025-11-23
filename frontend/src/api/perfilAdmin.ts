/*
PETICIONES
===========================
Crear un nuevo usuario --> POST - usuario/crear
Obtener todos los profesores y admin --> GET - usuario/profesores
Mostrar los usuarios --> GET - usuario/all
*/
import type { CrearUsuario, ProfesorAdmin, RespuestaObtenerUsuarios } from "../types";

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

export const fetchUsuarios = async (token: string | null) : Promise<RespuestaObtenerUsuarios> => {
    try {
        if(!token) {
            throw new Error("Token de autenticación no proporcionado");
        }

        const response = await fetch(`${URL}/usuario/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `Error al obtener los usuarios: ${response.statusText}`);
        }

        const data: RespuestaObtenerUsuarios = await response.json();
        return data;
    } catch(err) {
        console.error("Error al cargar los usuarios");
        throw err;
    }
}