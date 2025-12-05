import React from "react";
import type { EntregasProfProps } from "../types";
import styles from '../assets/styles/Entregas.module.css';
import { useAuth } from "../hooks/useAuth";

const URL = import.meta.env.VITE_API_URL;

const fetchDescargarEntrega = async (entrega_id: number, token: string|null) => {
    if(!token) {
        alert("Error: Token de autenticación no disponible. Por favor, inicia sesión");
        return;
    }

    try {
        const response = await fetch(`${URL}/entregas/${entrega_id}/descargar`, {
            headers : {
                'Authorization': `Bearer ${token}`
            }
        });

        if(!response.ok) {
            const contentType = response.headers.get("content-type");
            let errMessage = `Error ${response.status}: ${response.statusText || 'Respuesta vacía'}`;

            if(contentType && contentType.includes("application/json")) {
                const errData = await response.json().catch(() => ({}));
                errMessage = errData.error || errData.message || errMessage;
            }

            throw new Error(`Error al descargar el archivo: ${errMessage}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const contenido = response.headers.get('Content-Disposition');
        let filename = `entrega_${entrega_id}.zip`;

        if(contenido) {
            const filenameMatch = contenido.match(/filename="?(.+)"?$/);

            if(filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1].replace(/["']/g, '');
            }
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch(err) {
        console.error("Fallo al descargar la entrega: ", err);
        if(err instanceof Error) {
            alert(err.message);
        } else {
            alert("Ocurrió un error desconocido durante la descarga");
        }
    }
}

const EntregasProfesorAdmin: React.FC<EntregasProfProps> = ({ entregasPendientes, handleCalificar }) => {
    const {token} = useAuth();

    return (
        <div className={styles.seccionEntregas}>
            <h3>Entregas pendientes de calificar</h3>
            {entregasPendientes.length > 0
                ? (
                    <div className={styles.listaEntregas}>
                        {entregasPendientes.map(entrega => (
                            <div key={entrega.id} className={`${styles.enterga_item} ${styles[`estado_${entrega.estado.toLowerCase()}`]}`}>
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
                                <div className={styles.acciones_calificacion}>
                                    <button onClick={() => fetchDescargarEntrega(entrega.id, token)} className={styles.btn_descargar}>⬇️ Descargar</button>
                                    <button onClick={() => handleCalificar(entrega.id, "APROBADA")} className={styles.btn_aprobar}> ✅ Aprobar</button>
                                    <button onClick={() => handleCalificar(entrega.id, "RECHAZADA")} className={styles.btn_suspender}>❌ Suspender</button>
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
    );
};

export default EntregasProfesorAdmin;