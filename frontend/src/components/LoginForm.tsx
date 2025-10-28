import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1/api';

// === ESTILOS ESPECÍFICOS DEL FORMULARIO ===
const formStyles: React.CSSProperties = {
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px #c5defa',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white', // Añadido para que el formulario destaque sobre whitesmoke
};

const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    marginBottom: '10px',
    width: '100%',
    maxWidth: '300px',
};

const inputBaseStyles: React.CSSProperties = {
    width: '100%',
    paddingLeft: '30px',
    height: '36px',
    boxSizing: 'border-box',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
};

const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    fill: '#999',
};

const submitButtonBaseStyles: React.CSSProperties = {
    width: '80%',
    height: '36px', // Ajustado a la altura del input
    border: 'none',
    cursor: 'pointer',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
};

const iniciarButtonStyles: React.CSSProperties = {
    ...submitButtonBaseStyles,
    backgroundColor: '#007bff',
    color: 'white',
    marginBottom: '12px',
};

const registroButtonStyles: React.CSSProperties = {
    ...submitButtonBaseStyles,
    backgroundColor: '#c5defa',
    color: '#007bff',
    marginBottom: '0',
};

const olvidadoStyles: React.CSSProperties = {
    width: '75%',
    textAlign: 'right',
    marginBottom: '12px',
    fontSize: '0.8rem',
};

const textStyles: React.CSSProperties = {
    color: 'grey',
    fontSize: '0.9rem',
    marginTop: '4px',
    marginBottom: '12px',
};

// SVG icons (convertidos a React components por claridad)
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
    </svg>
);

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
    </svg>
);

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLoginSuccess}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email: email,
                password: password,
            });

            const token = response.data.access_token;

            if(token) {
                localStorage.setItem('jwt_token', token);

                onLoginSuccess(token);
                navigate('/');
            }else {
                setError('Respuesta inválida del servidor')
            }            
        } catch(err) {
            if(axios.isAxiosError(err) && err.response && err.response.status === 401) {
                setError('Credenciales incorrectas. Inténtalo de nuevo');
            } else {
                setError('Error al conectar con el servidor.');
                console.error('Error de Login: ', err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form style={formStyles} onSubmit={handleSubmit}>
            <h2>Bienvenido</h2>
            <p style={textStyles}>Inicia sesión para solicitar una canción</p>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            {/* Input Correo */}
            <div style={inputContainerStyles}>
                <UserIcon style={iconStyles} fill="#999" />
                <input 
                    type="email" 
                    name="correo" 
                    id="correo" 
                    placeholder="Correo corporativo" 
                    style={inputBaseStyles}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                />
            </div>

            {/* Input Contraseña */}
            <div style={inputContainerStyles}>
                <LockIcon style={iconStyles} fill="#999" />
                <input 
                    type="password" 
                    name="clave" 
                    id="clave" 
                    placeholder="Contraseña" 
                    style={inputBaseStyles}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>

            {/* Enlace Olvidado */}
            <p style={olvidadoStyles}>
                <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
                    ¿Olvidaste tu contraseña?
                </a>
            </p>

            {/* Botón Iniciar Sesión (submit principal) */}
            <button 
                type="submit" 
                style={iniciarButtonStyles} 
                disabled={loading}
            >
                Iniciar sesión
            </button>

            <p style={textStyles}>¿No tienes una cuenta?</p>

            {/* Botón Registrarse (para navegar a registro) */}
            <button 
                type="button" // Cambiado a 'button' para evitar doble submit
                style={registroButtonStyles}
                onClick={() => navigate('/register')}
                disabled={loading}
            >
                Registrarse
            </button>
        </form>
    );
};

export default LoginForm;