import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from '../hooks/useAuth';
import "../assets/styles/Tareas.css";
import {useNavigate} from "react-router-dom";

type EstadoEntrega = "PENDIENTE" | "APROBADA" | "RECHAZADA";

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    recompensa: number;
    creador_id: number;
    estado_entrega?: EstadoEntrega;
    entrega_id?: number | null;
}

interface Entrega {
    id: number;
    ruta: string;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
    tarea: {
        id: number;
        titulo: string;
        recompensa: number;
    };
}

const API_URL = "https://ritmatiza.local/api"; 

const fetchTareas = async (profesorId: number | null, token: string | null): Promise<Tarea[]> => {
    let url: string;
    
    const headers: Record<string, string> = { 
        'Content-Type': 'application/json' 
    }; 

    if (token && profesorId) {
        url = `${API_URL}/tareas/profesor/${profesorId}`;
        headers['Authorization'] = `Bearer ${token}`; 
    } 
    else {
        url = `${API_URL}/tareas/ultimas`;
    }
    
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Error ${response.status} al cargar tareas: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fallo al obtener tareas:", error);
        return [];
    }
};

const fetchMisEntregas = async (token: string): Promise<Entrega[]> => {
    try {
        const response = await fetch(`${API_URL}/tareas/mis-entregas`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error al cargar mis entregas: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fallo al obtener mis entregas:", error);
        return [];
    }
};

const Tareas: React.FC = () => {
    const { isLogged, role, puntos, profesorId, token } = useAuth();
    const navigate = useNavigate();

    const [tareasDisponibles, setTareasDisponibles] = useState<Tarea[]>([]); 
    const [misEntregas, setMisEntregas] = useState<Entrega[]>([]);
    const [loading, setLoading] = useState(true);

    const handleCrearTarea = async () => {
        if(role !== "PROFESOR" && role !== "ADMIN") {
            alert("No tienes permisos para crear tareas");
            return;
        }

        navigate('/tareas/crear');
    }

    const loadTareasData = useCallback(async () => {
        setLoading(true);
        try {
            const tareas = await fetchTareas(profesorId, token);
            
            let entregas: Entrega[] = [];
            if (isLogged && token && role === 'ESTUDIANTE') {
                entregas = await fetchMisEntregas(token);
                setMisEntregas(entregas);
            }

            const tareasConEstado = tareas.map(tarea => {
                const entregaExistente = entregas.find(e => e.tarea.id === tarea.id);

                const estado: EstadoEntrega = entregaExistente ? (entregaExistente.estado as EstadoEntrega) : "PENDIENTE";
                
                return {
                    ...tarea,
                    estado_entrega: estado,
                    entrega_id: entregaExistente ? entregaExistente.id : null,
                };
            });
            setTareasDisponibles(tareasConEstado);

        } catch (error) {
            console.error("Fallo general al cargar datos de tareas:", error);
        } finally {
            setLoading(false);
        }
    }, [isLogged, role, profesorId, token]);
    
    const handleSubirEntrega = async (tareaId: number, archivo: File) => {
        if (!token) {
            console.error("No hay token de autenticación.");
            return;
        }

        const rutaArchivo = `uploads/${tareaId}_${archivo.name}`; 

        try {
            console.log(`Simulando POST a ${API_URL}/tareas/${tareaId}/entregar con ruta: ${rutaArchivo}`);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const nuevaEntrega: Entrega = { 
                id: Date.now(), 
                ruta: rutaArchivo, 
                estado: 'PENDIENTE', 
                tarea: { id: tareaId, titulo: "Tarea Simulado", recompensa: 0 }
            };

            setMisEntregas(prev => [nuevaEntrega, ...prev.filter(e => e.tarea.id !== tareaId)]);

            console.log(`Entrega subida con éxito: ${archivo.name}. Pendiente de calificación.`);
            
            await loadTareasData();

        } catch (error) {
            console.error("Fallo al subir entrega (simulado):", error);
            console.error(`Error: ${error instanceof Error ? error.message : 'No se pudo subir la entrega.'}`);
        }
    };


    useEffect(() => {
        loadTareasData();
    }, [loadTareasData]); 
    
    const getStatusClass = (status: Tarea['estado_entrega']) => {
        const normalizedStatus = (status || 'SIN ENTREGAR').toLowerCase().replace(' ', '-');
        return `estado-${normalizedStatus}`;
    };


    const renderContentByRole = () => {
        if (loading) {
            return <p>Cargando información de tareas...</p>;
        }
        
        const viewClass = role === 'ESTUDIANTE' ? 'tareas-estudiante-view' : 'tareas-profesor-admin-view';

        switch (role) {
            case 'ESTUDIANTE':
                return (
                    <div className={viewClass}>
                        <p className="puntos-actuales">
                            Puntos actuales: <strong>{puntos} 🎵</strong>
                        </p>
                        
                        <div className="tareas-seccion">
                            <h3>
                                {profesorId ? `✅ Tareas de tu Profesor (${profesorId})` : '📜 Tareas Globales Recientes'}
                            </h3>
                            <p>
                                {profesorId 
                                    ? 'Aquí puedes ver el estado de las últimas tareas de tu profesor.'
                                    : 'No tienes profesor asignado. Viendo las últimas tareas publicadas globalmente.'
                                }
                            </p>
                            <ListaTareasEstudiante tareas={tareasDisponibles} onSubirEntrega={handleSubirEntrega} getStatusClass={getStatusClass} />
                        </div>

                        <div className="tareas-seccion">
                            <h3>📥 Mis Entregas Recientes</h3>
                            <ListaMisEntregas entregas={misEntregas} getStatusClass={getStatusClass} />
                        </div>
                    </div>
                );
            case 'PROFESOR':
            case 'ADMIN':
                return (
                    <div className={viewClass}>
                        <div className="tareas-seccion">
                            <h3>📝 Creación de Tareas</h3>
                            <p>
                                Aquí se ubicaría el formulario para crear una nueva tarea.
                            </p>
                            <button className="btn-crear" onClick={handleCrearTarea}>
                                Crear Nueva Tarea
                            </button>
                        </div>
                        
                        <div className="tareas-seccion">
                            <h3>📊 Tareas Pendientes de Calificar</h3>
                            <p>
                                Aquí se listarían las tareas con entregas pendientes.
                            </p>
                        </div>
                        
                        <div className="tareas-seccion">
                            <h3>📋 Todas las Tareas</h3>
                            <p>Aquí se muestra el listado completo de tareas.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="vista-publica">
                        <h2>¡Bienvenido/a a Ritmatiza!</h2>
                        <p>Inicia sesión para gestionar tus tareas.</p>
                    </div>
                );
        }
    };


    return (
        <div className="tareas-page">

            <header className="tareas-header">
                <h1>
                    {role ? `Tareas - Panel de ${role}` : 'Tareas'}
                </h1>
            </header>

            <main className="tareas-main-content">
                <div className={role === 'ESTUDIANTE' ? 'tareas-estudiante-view' : 'tareas-profesor-admin-view'}>
                    {renderContentByRole()}
                </div>

                <div className="ultimas-tareas-global">
                    <h2>🔥 Últimas Tareas Publicadas (Global)</h2>
                    <ListaUltimasTareas tareas={tareasDisponibles} /> 
                </div>
            </main>
        </div>
    );
};

export default Tareas;

const ListaUltimasTareas: React.FC<{ tareas: Tarea[] }> = ({ tareas }) => (
    <>
    <ul className="lista-ultimas-ul">
        {tareas.length === 0 ? (
            <p>No hay tareas publicadas.</p>
        ) : (
            tareas.slice(0, 5).map(tarea => (
                <li key={tarea.id} className="ultima-tarea-item">
                    <h4>
                        <span>{tarea.titulo} </span>
                        <span className="recompensa">
                            <strong>{tarea.recompensa}</strong> 🎵
                        </span>
                    </h4>
                    <p>
                        {tarea.descripcion.substring(0, 70)}{tarea.descripcion.length > 70 ? '...' : ''}
                    </p>
                </li>
            ))
        )}
    </ul>
    </>
);


interface SubirEntregaBotonProps {
    tareaId: number;
    onSubirEntrega: (tareaId: number, archivo: File) => void; 
}

const SubirEntregaBoton: React.FC<SubirEntregaBotonProps> = ({ tareaId, onSubirEntrega }) => {
    const fileInputRef = useRef<HTMLInputElement>(null); 
    const acceptedTypes = ".pdf, .jpg, .jpeg, .png, .gif, .zip";

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                console.warn("El archivo es demasiado grande. El límite es 5MB.");
                event.target.value = ''; 
                return;
            }
            
            onSubirEntrega(tareaId, file);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); 
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept={acceptedTypes} 
            />
            
            <button 
                onClick={handleClick}
            >
                Subir Entrega
            </button>
        </>
    );
};


interface ListaTareasEstudianteProps {
    tareas: Tarea[];
    onSubirEntrega: (tareaId: number, archivo: File) => void;
    getStatusClass: (status: Tarea['estado_entrega']) => string; 
}

const ListaTareasEstudiante: React.FC<ListaTareasEstudianteProps> = ({ tareas, onSubirEntrega, getStatusClass }) => (
    <ul className="tarea-list">
        {tareas.length === 0 ? (
            <p>No hay tareas disponibles en este momento.</p>
        ) : (
            tareas.map(tarea => (
                <li key={tarea.id} className={`tarea-item-card ${getStatusClass(tarea.estado_entrega)}`}>
                    <div className="tarea-header">
                        <h4>{tarea.titulo}</h4>
                        <p className="recompensa">
                            Recompensa: <strong>{tarea.recompensa}</strong> 🎵
                        </p>
                    </div>
                    
                    <p className="tarea-descripcion">{tarea.descripcion}</p>
                    
                    <div className="estado-entrega">
                        <p>
                            Estado: 
                            <span>
                                {tarea.estado_entrega || 'SIN ENTREGAR'}
                            </span>
                        </p>
                        
                        {/* Solo muestra el botón si no está APROBADA */}
                        {tarea.estado_entrega !== 'APROBADA' && (
                            <SubirEntregaBoton tareaId={tarea.id} onSubirEntrega={onSubirEntrega} />
                        )}
                    </div>
                </li>
            ))
        )}
    </ul>
);

interface ListaMisEntregasProps {
    entregas: Entrega[];
    getStatusClass: (status: Tarea['estado_entrega']) => string; 
}

const ListaMisEntregas: React.FC<ListaMisEntregasProps> = ({ entregas, getStatusClass }) => (
    <ul className="entrega-list">
        {entregas.length === 0 ? (
            <p>Aún no has realizado ninguna entrega.</p>
        ) : (
            entregas.map(entrega => (
                <li key={entrega.id} className={`entrega-item-card ${getStatusClass(entrega.estado as Tarea['estado_entrega'])}`}>
                    <div className="entrega-header">
                        <h4>Tarea: {entrega.tarea.titulo}</h4>
                        <p className="recompensa">
                            Recompensa: <strong>{entrega.tarea.recompensa}</strong> 🎵
                        </p>
                    </div>
                    
                    <div className="estado-entrega">
                        <p>
                            <strong>Estado:</strong> 
                            <span>
                                {entrega.estado}
                            </span>
                        </p>
                    </div>
                    <p style={{marginTop: '10px'}}>Ruta: {entrega.ruta}</p>
                </li>
            ))
        )}
    </ul>
);