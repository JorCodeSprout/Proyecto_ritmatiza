import React, { useCallback } from 'react';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/formulario_inicio.css'

// Se asume que esta interfaz se define aquí o se importa de useAuth
interface User {
    email: string;
    name: string;
    role: 'ESTUDIANTE' | 'PROFESOR' | 'ADMIN';
    puntos: number;
    profesor_id: number | null; // El ID del profesor viene aquí
}


const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1, 
};

const LoginPage: React.FC = () => {
    // Se accede a la función 'login' del hook de autenticación
    const {login} = useAuth();
    const navigate = useNavigate();

    // Callback que se ejecuta tras el login exitoso en el LoginForm
    const handleLoginSuccess = useCallback((apiToken: string, user: User) => {
        console.log("Login exitoso. Nombre del usuario: ", user)
        
        // La función 'login' del hook recibe el objeto 'user' completo (incluido profesor_id)
        login(apiToken, user); 
        navigate('/');
    }, [login, navigate]);

    return (
        <Layout>
            <div style={mainContentStyles}>
                <LoginForm onLoginSuccess={handleLoginSuccess}/>
            </div>
        </Layout>
    );
};

export default LoginPage;