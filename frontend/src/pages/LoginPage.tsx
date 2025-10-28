import React, { useCallback } from 'react';
import Layout from '../components/Layout'; // Asume que tienes este componente
import LoginForm from '../components/LoginForm';

const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1, 
};

const LoginPage: React.FC = () => {
    const handleLoginSuccess = useCallback(() => {
        // Aquí podrías guardar el token en un contexto global o en el estado de la aplicación
        console.log("Login exitoso. Token recibido:")
    }, []);

    return (
        // Usamos el Layout para envolver la página con Header y Footer
        <Layout>
            <div style={mainContentStyles}>
                <LoginForm onLoginSuccess={handleLoginSuccess}/>
            </div>
        </Layout>
    );
};

export default LoginPage;