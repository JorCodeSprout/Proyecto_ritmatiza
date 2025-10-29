import React, { useCallback } from 'react';
import Layout from '../components/Layout'; // Asume que tienes este componente
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/formulario_inicio.css'

const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1, 
};

const LoginPage: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = useCallback((apiToken: string, userName: string) => {
        console.log("Login exitoso. Nombre del usuario: ", userName)
        login(apiToken, userName);
        navigate('/');
    }, [login, navigate]);

    return (<Layout>
            <div style={mainContentStyles}>
                <LoginForm onLoginSuccess={handleLoginSuccess}/>
            </div>
        </Layout>
    );
};

export default LoginPage;