import type React from "react";
import type { PanelProfesor } from "../types";

const ContenidoAdminProfesor: React.FC<PanelProfesor> = ({tareasDisponibles, entregas, handleCrearTarea, handleCalificar}) => {
    const entregasPendientes = entregas.filter(entrega => entrega.estado === "PENDIENTE");

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
                {entregasPendientes.length > 0
                    ? (
                        <div className="lista-entregas">
                            {entregasPendientes.map(entrega => (
                                <div key={entrega.id} className={`enterga-item estado-${entrega.estado.toLowerCase()}`}>
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

export default ContenidoAdminProfesor;