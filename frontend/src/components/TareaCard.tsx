import { useState } from "react";
import SubidaArchivos from "./SubidaArchivos";
import type { Entrega, Tarea } from "../types";

const TareaCard: React.FC<{tarea: Tarea, reloadEntregas?: () => Promise<void>, entregaActual?: Entrega | null}> = ({tarea, reloadEntregas, entregaActual}) => {
    // Debido a la posibilidad de que la descripción ocupe más de 500 caracteres se añade un botón para ver más información
    const max_length = 200;

    const [expandido, setExpandido] = useState(false);

    const mostrarTodo = expandido || tarea.descripcion.length <= max_length;
    const descripcion = mostrarTodo 
        ? tarea.descripcion
        : tarea.descripcion.substring(0, max_length) + '...';

    const handleCambiar = () => {
        setExpandido(!expandido);
    }

    const mostrarBoton = tarea.descripcion.length > max_length;
    
    const mostrarEntregas = !!reloadEntregas;

    const puedeReenviar: boolean = !entregaActual || (tarea.reenviar && entregaActual.estado !== "APROBADA");

    return (
        <div className="tarea-card" key={tarea.id}>
            <h4>{tarea.titulo}</h4>
            <p><strong>Descripción: </strong>{descripcion}</p>
            {mostrarBoton && (
                <button onClick={handleCambiar} id="mostrarMas">{expandido ? 'Ver menos' : 'Ver más'}</button>
            )}
            <p><strong>Recompensa: </strong>{tarea.recompensa} 🌟</p>

            {mostrarEntregas && (
                <div className="entrega-info">
                    <SubidaArchivos  tarea_id={tarea.id} entregaSuccess={reloadEntregas} reenviar={puedeReenviar} />
                </div>
            )}
        </div>
    );
};

export default TareaCard;