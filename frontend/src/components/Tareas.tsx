/*
TODO
=============== 
1.- Mostrar todas las tareas creadas
2.- Mostrar todas las tareas creadas por un profesor específico
3.- Mostrar las entregas realizadas en las tareas por un profesor (Primero hay que ir a backend a corregir el método que las recoge)
4.- Botón para crear tareas
5.- Botón para aprobar entrega
6.- Botón para suspender entrega
7.- Ventana distinta para cada rol

PETICIONES
===========================
Listar tareas --> GET - /tareas
Entregar --> POST - /tareas/id_tarea/entregar
Ver mis entregas --> GET - /tareas/mis-entregas
Últimas tareas creadas --> GET - /tareas/ultimas

profesores o admin
---------------------------
Crear --> POST - /tareas/crear
Ver entregas --> GET - /tareas/id_tarea/entregas (Obtener el id de todas las entregas que tengan el creador_id del profesor o admin logueado)
Calificar --> POST /entregas/entrega_id/calificar
*/

import type React from "react";
import type { Entrega, EstadoEntrega, Tarea } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import "../assets/styles/Tareas.css";

const URL = import.meta.env.VITE_API_URL;

const fetchTareasByProfesor = async (profesor_id: number | null, token: string | null): Promise<Tarea[]> => {
    let url: string;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if(token && profesor_id) {
        url = `${URL}/tareas/profesor/${profesor_id}`;
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        url = `${URL}/tareas/ultimas`;
    }

    try {
        const response = await fetch(url, {headers});
        if(!response.ok) {
            throw new Error(`Error al cargar las tareas. ${response.statusText}`);
        }

        return await response.json();
    } catch(err) {
        console.error("Fallo al obtener las tareas: ", err);
        return[];        
    }
} 

const fetchTodasTareas = async (token: string | null): Promise<Tarea[]> => {
    try {
        const response = await fetch(`${URL}/tareas/ultimas`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });


        if(!response.ok) {
            throw new Error(`Error al cargar las tareas: ${response.statusText}`);
        }

        return await response.json();
    } catch(err) {
        console.error("Fallo al obtener las tareas: ", err);
        return[];        
    }
}

const fetchMisEntregas = async (token: string) : Promise<Entrega[]> => {
    try {
        const response = await fetch(`${URL}/tareas/mis-entregas`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            throw new Error(`Error al cargar las entregas que has realizado: ${response.statusText}`);
        }

        return await response.json();
    } catch(err) {
        console.error("Fallo al obtener las entregas: ", err);
        return [];
    }
}

const fetchTodasEntregas = async (token: string, profesor_id: number) : Promise<Entrega[]> => {
    try {
        const response = await fetch(`${URL}/tareas/${profesor_id}/entregas`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });


        if(!response.ok) {
            throw new Error(`Error al cargar las entregas: ${response.statusText}`);
        }

        return await response.json();
    } catch(err) {
        console.error("Fallo al obtener las entregas: ", err);
        return[];        
    }
}

const Tareas: React.FC = () => {
    const {isLogged, role, puntos, profesorId, id, token} = useAuth();
    const navigate = useNavigate();

    const [tareasDisponibles, setTareasDisponibles] = useState<Tarea[]>([]);
    const [entregas, setEntregas] = useState<Entrega[]>([]);
    const [misEntregas, setMisEntregas] = useState<Entrega[]>([]);

    const [loading, setLoading] = useState(true);

    const handleCrearTarea = async () => {
        if(role !== "PROFESOR" && role !== "ADMIN") {
            alert("No tienes permisos suficientes para crear una tarea.");
            return;
        }

        navigate("/tareas/crear");
    }

    const handleSubirEntrega = async (tarea_id:number, archivo: File) => {
        if(!token) {
            alert("Debes iniciar sesión para realizar una entrega");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const response = await fetch(`${URL}/tareas/${tarea_id}/entregar`, {
                method:'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if(!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Error al subir la entrega. Status ${response.statusText}`);
            }

            const nuevaEntrega: Entrega = await response.json();
            setMisEntregas(prev => [nuevaEntrega, ...prev.filter(e => e.tarea_id !== tarea_id)]);

            alert("Entrega subida con éxito: " + archivo.name);

            await loadTareas();
            await loadEntregas();
        } catch(err) {
            console.error(`Error al subir la tarea: ${err}`);            
        } finally {
            setLoading(false);
        }
    }

    const SubidaArchivos: React.FC<{tarea_id: number}> = ({tarea_id}) => {
        const [archivo, setArchivo] = useState<File | null>(null);

        const fileInputRef = useRef<HTMLInputElement>(null); 

        const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
            if(e.target.files && e.target.files.length > 0) {
                setArchivo(e.target.files[0]);
            } else {
                setArchivo(null);
            }
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if(archivo) {
                handleSubirEntrega(tarea_id, archivo);
            } else {
                alert("Por favor, selecciona un archivo.");
            }
        }

        const handleCustomButtonClick = () => {
            const inputElement = fileInputRef.current;
        
            if (inputElement) {
                inputElement.focus();

                setTimeout(() => {
                    inputElement.click();
                }, 0); 
            }
        }

        return (
            <form onSubmit={handleSubmit} className="entrega-form">
                
                <input type="file" name="archivo" id="archivo" onChange={handleFile} required ref={fileInputRef} accept=".pdf, image/jpeg, image/png," style={{ display: 'none' }} />
                
                <div className="custom-file-upload">
                    <button type="button" onClick={handleCustomButtonClick} className="btn-elegir-archivo-custom">
                        Elegir archivo
                    </button>
                    
                    <span className="file-status">
                        {archivo ? archivo.name : "No se ha seleccionado ningún archivo"}
                    </span>
                </div>

                <button type="submit" disabled={!archivo || loading} >
                    {loading ? "Subiendo..." : "Subir entrega"}
                </button>
            </form>
        );
    }

    const calificar = async (entrega_id: number, estado: "APROBADA" | "RECHAZADA", token: string) => {
        try {
            const response = await fetch(`${URL}/entregas/${entrega_id}/calificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({estado})
            });

            if(!response.ok) {
                throw new Error("Error al calificar la entrega");
            }
            return response.json();
        } catch(err) {
            console.error(`No se ha podido calificar la entrega: ${err}`);
            throw err;
        }
    }

    const handleCalificar = async (entrega_id: number, estado: "APROBADA" | "RECHAZADA") => {
        if(!token) {
            alert("Debes estar autenticado para poder calificar una tarea.");
            return;
        }

        try {
            setLoading(true);
            await calificar(entrega_id, estado, token);
            alert(`Entrega ${entrega_id} marcada como ${estado}`);
            await loadEntregas();
        } catch(err) {
            console.error(`Error al actualizar la entrega: ${err}`);
        } finally {
            setLoading(false);
        }
    }

    const loadEntregas = useCallback(async () => {
        setLoading(true);

        try {
            let entregas: Entrega[] = [];

            if(isLogged && token) {
                if(role === "ESTUDIANTE") {
                    entregas = await fetchMisEntregas(token);
                    setMisEntregas(entregas);
                } else {
                    if(id !== null) {
                        entregas = await fetchTodasEntregas(token, id);
                        setEntregas(entregas);
                    }
                }
            } else {
                throw new Error("Has de estar logueado para ver las entregas");
            }
        } catch(err) {
            console.error("Fallo al cargar las tareas: ", err);
        } finally {
            setLoading(false);
        }
    }, [isLogged, role, id, token]);

    const loadTareas = useCallback(async () => {        
        let fetchedTareas: Tarea[];

        if(role === "PROFESOR" || role === "ADMIN") {
            fetchedTareas = await fetchTodasTareas(token);
        } else {
            fetchedTareas = await fetchTareasByProfesor(profesorId, token);
        }
        setTareasDisponibles(fetchedTareas);
    }, [profesorId, token, role]);

    useEffect(() => {
        loadTareas();

        if(isLogged) {
            loadEntregas();
        } else {
            setEntregas([]);
            setMisEntregas([]);
            setLoading(false);
        }
    }, [isLogged, loadEntregas, loadTareas]);
    
    const getEstadoEntrega = (tarea_id: number) => {
        return misEntregas.find(e => e.tarea_id === tarea_id);
    }

    const TareaCard: React.FC<{tarea: Tarea}> = ({tarea}) => {
        const entrega = getEstadoEntrega(tarea.id);
        const colores = (estado: EstadoEntrega) => {
            switch(estado) {
                case "APROBADA": return "green";
                case "RECHAZADA": return "red";
                default: return "orange";
            }
        };

        return (
            <div className="tarea-card" key={tarea.id}>
                <h4>{tarea.titulo}</h4>
                <p><strong>Descripción: </strong>{tarea.descripcion}</p>
                <p><strong>Recompensa: </strong>{tarea.recompensa} 🌟</p>

                {isLogged && role === "ESTUDIANTE" && (
                    <div className="entrega-info">
                        {entrega 
                            ? (
                                <>
                                    <p>
                                        <strong>Estado de tu entrega: </strong>
                                        <span style={{color: colores(entrega.estado)}}>{entrega.estado} ({entrega.ruta})</span>
                                    </p>
                                    <SubidaArchivos tarea_id={tarea.id} />
                                </>    
                            )
                            : (
                                <SubidaArchivos tarea_id={tarea.id} />
                            )
                        }
                    </div>
                )}
            </div>
        );
    };

    const ContinidoNoLogueado: React.FC = () => {
        return (
            <>
                <div className="tareas-seccion">
                    <h3>📜 Últimas tareas generadas</h3>
                    <p>Estas son las últimas tareas visibles para todos:</p>

                    {tareasDisponibles.length > 0 
                        ? (
                            <div className="lista-tareas">
                                {tareasDisponibles.map(tarea => (
                                    <div className="tarea-card" key={tarea.id}>
                                        <h4>{tarea.titulo}</h4>
                                        <p><strong>Descripción:</strong> {tarea.descripcion}</p>
                                        <p><strong>Puntos: </strong>{tarea.recompensa}🌟</p>
                                    </div>
                                ))}
                            </div>
                        )
                        : (
                            <p>No hay tareas disponibles en este momento.</p>
                        )
                    }
                </div>
            </>
        );
    }

    const ContendioEstudiante: React.FC = () => {
        return (    
            <>
                <h2>Panel de ESTUDIANTE</h2>
                <hr />
                <p className="puntos-actuales">
                    Puntos actuales: <strong style={{color: "#fff"}}>{puntos} 🌟</strong>
                </p>

                <div className="tareas-seccion">
                    <h3>
                        {profesorId 
                            ? "✅Tareas de tu profesor" 
                            : "📜Tareas generales"
                        }
                    </h3>
                    <p>
                        {profesorId 
                            ? "Aquí puedes ver el estado de las tareas de tu profesor y subir entregas" 
                            : "No tienes ningún profesor asignado. Viendo las últimas tareas publicadas."
                        }
                    </p>

                    {tareasDisponibles.length > 0
                        ? (
                            <div className="lista-tareas">
                                {tareasDisponibles.map(tarea => (<TareaCard key={tarea.id} tarea={tarea} />))}
                            </div>
                        )
                        : (
                            <p>No hay tareas disponibles en este momento</p>
                        )
                    }
                </div>

                <div className="seccion-entregas-corregir">
                    <h3>Entregas realizadas</h3>
                    {misEntregas.length > 0
                        ? (
                            <div className="lista-entregas">
                                {misEntregas.map(entrega => (
                                    <div key={entrega.id} className="enterga-item">
                                        <h4>Tarea: {entrega.tarea_titulo}</h4>
                                        <p>
                                            <strong>Archivo:</strong> {entrega.ruta}
                                        </p>
                                        <p style={{color: 
                                            entrega.estado === "PENDIENTE" ? "orange"
                                            : entrega.estado === "APROBADA" ? "green"
                                            : "red"
                                        }}>
                                            <strong style={{color: "black"}}>Estado:</strong> {entrega.estado}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )
                        : (
                            <p>No has realizado ninguna entrega todavía.</p>
                        )
                    }
                </div>
            </>
        );
    }

    const ContenidoAdminProfesor = () => {
        return (
            <>
                <h2>Panel de PROFESOR</h2>
                <hr />
                <div className="acciones-profesor">
                    <button onClick={handleCrearTarea} className="btn-crear">
                        ➕ Crear nueva tarea
                    </button>
                </div>

                <div className="seccion-entregas-corregir">
                    <h3>Entregas pendientes de calificar</h3>
                    {entregas.length > 0
                        ? (
                            <div className="lista-entregas">
                                {entregas.map(entrega => (
                                    <div key={entrega.id} className="enterga-item">
                                        <h4>Tarea: {entrega.tarea_titulo}</h4>
                                        <p>
                                            <strong>Estudiante ID:</strong> {entrega.estudiante_id}
                                        </p>
                                        <p>
                                            <strong>Archivo:</strong> {entrega.ruta}
                                        </p>
                                        <p style={{color: 
                                            entrega.estado === "PENDIENTE" ? "orange"
                                            : entrega.estado === "APROBADA" ? "green"
                                            : "red"
                                        }}>
                                            <strong style={{color: "black"}}>Estado:</strong> {entrega.estado}
                                        </p>
                                        <div className="acciones-calificacion">
                                            <button onClick={() => handleCalificar(entrega.id, "APROBADA")} className="btn-aprobar">✅ Aprobar</button>
                                            <button onClick={() => handleCalificar(entrega.id, "RECHAZADA")} className="btn-suspender">❌ Suspender</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                        : (
                            <p>No hay entregas pendientes para calificar.</p>
                        )
                    }
                </div>
                <hr />
                <div className="seccion-tareas-creadas">
                    <h3>Tareas disponibles actualmente</h3>
                    {tareasDisponibles.length > 0 
                        ? (
                            <div className="lista-tareas">
                                {tareasDisponibles.map(tarea => (
                                    <div key={tarea.id} className="tarea-card">
                                        <h4>{tarea.titulo}</h4>
                                        <p>Puntos: {tarea.recompensa} 🌟</p>
                                    </div>
                                ))}
                            </div>
                        )
                        : (
                            <p>No has creado ninguna tarea todavía</p>
                        )
                    }
                </div>
            </>
        );
    }

    const contenidoSegunRole = () => {
        if(loading) {
            return <p>Cargando información de tareas y entregas...</p>
        }

        if(!isLogged) {
            return <ContinidoNoLogueado />;
        }

        switch(role) {
            case "ESTUDIANTE":
                return <ContendioEstudiante />
            case "ADMIN":
            case "PROFESOR":
                return <ContenidoAdminProfesor />
            default:
                return <ContinidoNoLogueado />
        }
    }

    return (
        <div className="tareas-container">
            <h1>Gestión de Tareas</h1>
            <hr />
            {contenidoSegunRole()}
        </div>
    );
}

export default Tareas;