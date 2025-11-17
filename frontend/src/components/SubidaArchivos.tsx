import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { SubidaArchivosProps } from "../types";
import { enviarEntrega } from "../api/tareas";

const SubidaArchivos: React.FC<SubidaArchivosProps> = ({tarea_id, entregaSuccess, reenviar}) => {
    const {token} = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [nombreArchivo, setNombreArchivo] = useState<string | null >(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setNombreArchivo(e.target.files[0].name);
        } else {
            setNombreArchivo(null);
        }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const archivoASubir = fileInputRef.current?.files?.[0] || null;

        if(!archivoASubir || !token) {
            alert("Debes añadir un archivo para la entrega y estar autenticado");
            return;
        }

        setLoading(true);

        try {
            await enviarEntrega(tarea_id, archivoASubir, token);

            alert("Entrega subida. Pendiente de calificación");
            setNombreArchivo(null);
            await entregaSuccess();
        } catch (err) {
            alert(`Fallo al enviar la entrega: ${err instanceof Error ? err.message : "Error desconocido"}`);
        } finally {
            setLoading(false);
        }
    }

    const handleButtonClick = () => {
        if(reenviar) {
            fileInputRef.current?.click();
        } else {
            alert("No puedes modificar ni subir una nueva entrega para esta tarea");
        }
    }

    if(!reenviar) {
        return (
            <div className="entrega-form-disabled">
                <p style={{color: "red", fontWeight: "bold"}}>
                    Ya has enviado una entrega para esta tarea. No se permite reenviar o modificar.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="entrega-form">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                required 
                disabled={loading}
                style={{ display: 'none' }}
            />

            <button 
                type="button" 
                onClick={handleButtonClick} 
                disabled={loading}
                className="btn-seleccionar-archivo"
            >
                {nombreArchivo ? `Cambiar Archivo: ${nombreArchivo}` : "Seleccionar Archivo"}
            </button>

            {nombreArchivo && <p className="archivo-seleccionado">Archivo: {nombreArchivo}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Subiendo..." : "Subir entrega"}
            </button>
        </form>
    )
}

export default SubidaArchivos;