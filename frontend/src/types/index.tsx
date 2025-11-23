export type EstadoSugerencia = "APROBADA" | "SUSPENDIDA" | "PENDIENTE";
export type EstadoEntrega = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
export type EstadoSolicitud = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface User {
    email: string;
    name: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN';
    puntos: number;
    profesor_id: number | null;
}

export interface ProfesorAdmin {
    id: number;
    email: string;
    name: string;
    role: "PROFESOR" | "ADMIN";
}

export interface UsuarioActualizado {
    email?: string;
    email_confirmation?: string;
    current_email?: string;
    password?: string;
    password_confirmation?: string;
    current_password?: string;
}

export interface CrearUsuario {
    email: string;
    name: string;
    password: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN';
    puntos?: number;
    profesor_id: number | null;
}

export interface CrearUsuarioAdminProps {
    profesores?: ProfesorAdmin[];
    adminToken: string | null;
}

export interface UsuarioAdmin {
    id: number;
    name: string;
    email: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN'; // Utiliza el tipo 'role' ya definido
    puntos: number;
    profesor_id: number | null;
}

export interface UsuarioProfesor {
    id: number;
    name: string;
    email: string;
    puntos: number;
}

export interface RespuestaObtenerUsuarios {
    usuarios: UsuarioAdmin[] | UsuarioProfesor[];
}

export interface LayoutProps {
    children: React.ReactNode;
    includeFooter?: boolean;
}

export interface MenuItem {
    id: string;
    name: string;
    href: string;
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
    fecha: string;
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
    reenviar: boolean;
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
    estado: EstadoEntrega;
    estudiante_id?: number;
    tarea_id:  number;
    tarea_titulo: string;
    tarea_recompensa: number;
}

export interface SugerenciasCanciones {
    id: number;
    id_spotify_cancion: string;
    artista: string;
    titulo: string;
    sugerencia_por_id?: number;
    estado: EstadoSolicitud;
}

export interface SubidaArchivosProps {
    tarea_id: number;
    entregaSuccess: () => Promise<void>;
    reenviar: boolean;
}

export interface EntregasProps {
    misEntregas: Entrega[];
}

export interface EntregasProfProps {
    entregasPendientes: Entrega[];
    handleCalificar: (id: number, estado: "APROBADA" | "RECHAZADA") => void;
} 

export interface PanelEstudiante {
    puntos: number | null;
    profesor_id: number | null;
    tareasDisponibles: Tarea[];
    misEntregas: Entrega[];
    reloadEntregas: () => Promise<void>;
}

export interface PanelProfesor {
    tareasDisponibles: Tarea[];
    entregas: Entrega[];
    handleCrearTarea: () => void;
    handleCalificar: (entrega_id: number, estado: "APROBADA" | "RECHAZADA") => Promise<void>;
}

export interface PanelNoLogueado {
    tareasDisponibles: Tarea[];
}

export interface ActualizarPropForm {
    setError: (message: string | null) => void;
    setSuccess: (message: string | null) => void;
}

export interface Profesor {
    nombre: string;
    email: string;
}