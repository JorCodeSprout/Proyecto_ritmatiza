/*
PETICIONES
========================
Ver canciones solicitadas --> GET - musica/sugerencias
Añadir a la playlist --> POST - musica/playlist/add
Elimiar de la playlist --> DELETE - musica/playlist/eliminar
Cancelar solicitud --> PUT - musica/sugerencias/cancelar
*/

import type { EstadoSolicitud } from "../types";

export const fetchSolicitudes = async (token: string) : Promise<EstadoSolicitud[]> => {
    try {
        const response = await fetch(`${URL}/musica/sugerencias`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if(!response.ok) {
            throw new Error(`Error al cargar las solicitudes que has realizado: ${response.status}`);
        }

        return await response.json();
    } catch(err) {
        console.error("Fallo al obtener las solicitudes: ", err);
        return [];
    }
}

