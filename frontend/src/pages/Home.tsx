import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1, 
};

const Home: React.FC = () => {
    const {isLogged, userName} = useAuth();
    const navigate = useNavigate();

    const bienvenido = isLogged 
        ? `Bienvenido a RITMATIZA ${userName}`
        : `Bienvenido a Ritmatiza. Inicia sesión para empezar.`;
    return (
        <Layout>
            <div style={mainContentStyles}>
                <h1>{bienvenido}</h1>
                {isLogged 
                    ? (
                    <p>Explora tus tareas y playlist personalizadas.</p>
                    )
                    : (
                        <button onClick={() => navigate('/login')} className='iniciar'>
                            Ir a iniciar sesión
                        </button>
                    )
                }
            </div>
        </Layout>
    );
}

export default Home;