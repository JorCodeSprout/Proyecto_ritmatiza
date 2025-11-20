import React, { useState } from 'react';
import ActualizarUsuario from '../components/ActualizarPassword';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const DatosPersonales: React.FC = () => {
    const {user} = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    return (
        <div>
            <Sidebar/>
            <div id="body"  className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
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
                    <ActualizarUsuario
                        setError={setError}
                        setSuccess={setSuccess}
                    />
                )}
            </div>
        </div>
    );
}

export default DatosPersonales;