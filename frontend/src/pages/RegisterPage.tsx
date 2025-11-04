import React, { useCallback } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1, 
};

const RegisterPage: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = useCallback((apiToken: string, userName: string) => {
        console.log("Login exitoso. Nombre del usuario: ", userName)
        login(apiToken, userName);
        navigate('/');
    }, [login, navigate]);

    return (<Layout>
            <div style={mainContentStyles}>
                <RegisterForm registroExitoso={handleLoginSuccess}/>
            </div>
        </Layout>
    );
};

export default RegisterPage;