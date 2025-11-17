import type { Entrega, PanelEstudiante } from "../types";
import TareaCard from "./TareaCard";

const ContendioEstudiante: React.FC<PanelEstudiante> = ({puntos, profesor_id, tareasDisponibles, misEntregas, reloadEntregas}) => {
    return (    
        <>
            <h2>Panel de ESTUDIANTE</h2>
            <hr />
            <p className="puntos-actuales">
                Puntos actuales: <strong style={{color: "#fff"}}>{puntos} 🌟</strong>
            </p>

            <div className="tareas-seccion">
                <h3>
                    {profesor_id 
                        ? "✅Tareas de tu profesor" 
                        : "📜Tareas generales"
                    }
                </h3>
                <p>
                    {profesor_id 
                        ? "Aquí puedes ver el estado de las tareas de tu profesor y subir entregas" 
                        : "No tienes ningún profesor asignado. Viendo las últimas tareas publicadas."
                    }
                </p>

                {tareasDisponibles.length > 0
                    ? (
                        <div className="lista-tareas">
                            {tareasDisponibles.map(tarea => {
                                const entregaActual: Entrega | undefined = misEntregas.find(entrega => entrega.tarea_id === tarea.id);

                                return (<TareaCard key={tarea.id} tarea={tarea} reloadEntregas={reloadEntregas} entregaActual={entregaActual || null} />)}
                            )}
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
                                <div key={entrega.id} className={`enterga-item estado-${entrega.estado.toLowerCase()}`}>
                                    <h4>Tarea: {entrega.tarea_titulo}</h4>
                                    <p>
                                        <strong>Archivo:</strong> {entrega.ruta}
                                    </p>
                                    <p style={{color: 
                                        entrega.estado === "PENDIENTE" ? "orange"
                                        : entrega.estado === "APROBADA" ? "green"
                                        : "red"
                                    }}>
                                        <strong style={{color: "black"}}>Estado:</strong> {entrega.estado === "RECHAZADA" ? "SUSPENSA" : entrega.estado}
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

export default ContendioEstudiante;