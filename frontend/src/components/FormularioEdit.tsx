import type React from "react";
import type { EditarPropForm, EditarUsuario } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import styles from '../assets/styles/Actualizar.module.css'; 
import { fetchActualizarDatosAdmin } from "../api/perfilAdmin";

const DATOS_VACIOS = {
    email: '',
    email_confirmation: '',
    name: '',
    puntos: 0,
    role: ''
};

const ROLES = [
    "ESTUDIANTE",
    "PROFESOR",
    "ADMIN"
];

type Role = 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE';

const FormularioEdit: React.FC<EditarPropForm> = ({setError, setSuccess, id}) => {
    const {token, user} = useAuth();

    const [dataForm, setDataForm] = useState<Partial<EditarUsuario>>(DATOS_VACIOS);
    const [loading, setLoading] = useState(false);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setDataForm(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(null);        
    }

    const handleUpdateDatos = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!token) {
            setError("No tienes un token de autenticación válido");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const data: EditarUsuario = {};

        if(dataForm.email && dataForm.email_confirmation) {
            if(dataForm.email !== dataForm.email_confirmation) {
                setError("El email nuevo y la confirmación no coinciden");
                setLoading(false);
                return;
            }
            data.email = dataForm.email;
        }

        if(dataForm.name && dataForm.name.length >= 6) {
            data.name = dataForm.name;
        } else {
            setError("El nombre no ha pasado la verificación. Ha de tener mínimo 6 caracteres");
            return;
        }

        if(user?.role === "ADMIN" && dataForm.role !== "") {
            if(!ROLES.includes(dataForm.role as Role)) {
                setError("El rol indicado no es válido");
                return;
            }
            data.role = dataForm.role;
        } 

        const puntos = dataForm.puntos; // Mantenemos como string/number

        if (puntos !== undefined && puntos !== null && puntos !== 0) {
            const puntosNum = Number(puntos);
            if(isNaN(puntosNum) || !Number.isInteger(puntosNum) || puntosNum < 0) {
                setError("Los puntos han de ser un número entero positivo");
                setLoading(false);
                return;
            }
            data.puntos = puntosNum;
        }

        data.id = Number(id);

        try {
            await fetchActualizarDatosAdmin(token, data);

            setSuccess("Datos actualizados correctamente");
            // Limpiamos los campos del formulario
            setDataForm(DATOS_VACIOS);
        } catch(err) {
            console.log(data);
            
            const errMessage: string = (err as Error).message || "Error desconocido al intentar actualizar tus datos.";

            setError(errMessage);
        } finally {
            setLoading(false);
        }
    }

    if(!user) {
        return (
            <div className={styles.carga}>Cargando datos de usuario {id}...</div>
        );
    }

    return (
        <>
            <form onSubmit={handleUpdateDatos}>
                <h2 className={styles.titulo}>Actualizar Usuario</h2>
                <h3>ID {id}</h3>
                <div className={styles.input_container}>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder=" " 
                        value={dataForm.name || ''} 
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <label htmlFor="name">Nombre Completo</label>
                </div>

                <div className={styles.input_container}>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder=" " 
                        value={dataForm.email || ''} 
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <label htmlFor="email">Email Nuevo</label>
                </div>

                <div className={styles.input_container}>
                    <input 
                        type="email" 
                        name="email_confirmation" 
                        id="email_confirmation" 
                        placeholder=" " 
                        value={dataForm.email_confirmation || ''} 
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <label htmlFor="email_confirmation">Confirmar Email</label>
                </div>

                {user.role === "ADMIN" && (
                    <div className={styles.input_container}>
                        <label htmlFor="role"></label>
                        <select 
                            name="role" 
                            id="role" 
                            value={dataForm.role} 
                            onChange={handleChange} 
                            disabled={loading} 
                            required>

                            <option value="">SELECCIONAR ROL</option>
                            {ROLES.map(r => (
                                <option value={r} key={r}>{r}</option>
                            ))}

                        </select>
                    </div>
                )}

                <div className={styles.input_container}>
                    <input 
                        type="number" 
                        name="puntos" 
                        id="puntos" 
                        placeholder=" " 
                        value={dataForm.puntos || 0} 
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <label htmlFor="puntos">Puntos</label>
                </div>

                <button
                    type="submit"
                    id={styles.botonActualizar}
                    disabled={loading}
                >
                    {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
            </form>
        </>
    );
}

export default FormularioEdit;