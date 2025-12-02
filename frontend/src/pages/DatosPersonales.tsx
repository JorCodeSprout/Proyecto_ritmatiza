import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import ActualizarPassword from '../components/ActualizarPassword';
import ActualizarEmail from '../components/ActualizarEmail';
import MostrarProfesor from '../components/MostrarProfesor';
import styles from "../assets/styles/Perfil.module.css";
import MostrarPuntos from '../components/MostrarPuntos';

const DatosPersonales: React.FC = () => {
    const {user} = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    return (
        <div>
            <Sidebar/>
            <div id="body">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                        {success}
                    </div>
                )}

                {user?.role !== "ADMIN" && (
                    <>
                        <div className={styles.formularios}>
                            <div>
                                <ActualizarEmail setError={setError} setSuccess={setSuccess} />
                            </div>

                            <div>
                                <ActualizarPassword setError={setError} setSuccess={setSuccess}/>
                            </div>
                        </div>
                    {user?.role !== "PROFESOR" && (
                        <div className={styles.tarjetas}>
                            <div className={styles.tarjeta_profesor}>
                                <MostrarProfesor />
                            </div>

                            <div className={styles.tarjeta_puntos}>
                                <MostrarPuntos />
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DatosPersonales;