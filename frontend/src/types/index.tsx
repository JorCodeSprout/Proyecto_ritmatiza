export type EstadoSugerencia = "APROBADA" | "SUSPENDIDA" | "PENDIENTE";
export type EstadoEntrega = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';


export interface User {
    id: number;
    email: string;
    name: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN';
    puntos: number;
    profesor_id: number | null;
}


export interface LoginFormProps {
    onLoginSuccess: (token: string, user: User) => void; 
}

export interface RegisterFormProps {
    registroExitoso: (token: string, user: User) => void;
}

export interface NuevaTarea {
    titulo: string;
    descripcion: string;
    recompensa: number;
    reenviar: boolean;
}

export interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    recompensa: number;
    creador_id: number | null;
    estado_entrega?: EstadoEntrega;
    entrega_id?: number | null;
}

export interface SongItem {
    id: string;
    name: string;
    external_urls: {
        spotify: string;
    };
    album: {
        name: string;
        images: {
            url: string;
        }[];
    };
    artists: {
        name: string;
    }[];
};

export interface Entrega {
    id: number;
    ruta: string;
    estado?: EstadoEntrega;
    tarea: {
        id: number;
        titulo: string;
        recompensa: number;
    };
}