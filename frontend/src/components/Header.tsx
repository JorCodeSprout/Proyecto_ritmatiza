import React from 'react';
import { useNavigate } from 'react-router-dom';
// Si usas React Router, necesitarías usar 'Link' en lugar de 'a' y 'useNavigate' en los botones

// === ESTILOS ===
const headerStyles: React.CSSProperties = {
    padding: '10px 20px',
    borderBottom: '2px solid #c5defa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'whitesmoke', // Aunque tu CSS no lo define, 'body' lo sugiere
};

const logoImageStyles: React.CSSProperties = {
    height: '50px',
};

const navMenuStyles: React.CSSProperties = {
    flex: 1, 
    display: 'flex',
    justifyContent: 'center',
};

const ulStyles: React.CSSProperties = {
    display: 'flex',
    listStyle: 'none',
    gap: '30px',
    margin: '0',
    padding: '0',
};

// Estilos base para los enlaces (simulando :hover con estado)
const linkBaseStyles: React.CSSProperties = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    transition: 'color 0.3s',
};

const accesoStyles: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
};

// Estilos base para los botones
const buttonBaseStyles: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'background-color 0.3s, color 0.3s', // Añadimos transición para hover
};

const iniciarButtonStyles: React.CSSProperties = {
    ...buttonBaseStyles,
    backgroundColor: '#007bff',
    color: 'white',
};

const registroButtonStyles: React.CSSProperties = {
    ...buttonBaseStyles,
    backgroundColor: '#c5defa',
    color: '#007bff',
};
// === FIN ESTILOS ===


const Header: React.FC = () => {
    const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const menuItems = [
        { id: 'inicio', name: 'Inicio', href: '/' },
        { id: 'tareas', name: 'Tareas', href: '/tareas' },
        { id: 'musica', name: 'Música y Playlist', href: '/musica' },
        { id: 'acerca', name: 'Acerca de', href: '/acerca' },
        { id: 'contacto', name: 'Contacto', href: '/contacto' },
    ];

    return (
        <header style={headerStyles}>
            {/* Logo */}
            <a href="/">
                <img 
                    src="../public/images/RITMATIZA.png"
                    alt="logo" 
                    title="logo"
                    style={logoImageStyles}
                />
            </a>

            {/* Menú de Navegación */}
            <nav style={navMenuStyles}>
                <ul style={ulStyles}>
                    {menuItems.map((item) => (
                        <li key={item.id} id={item.id}>
                            <a 
                                href={item.href} 
                                style={{
                                    ...linkBaseStyles,
                                    // Simula el hover: cambia color si el ratón está encima
                                    color: hoveredLink === item.id ? '#007bff' : '#333'
                                }}
                                onMouseEnter={() => setHoveredLink(item.id)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Botones de Acceso */}
            <div id="acceso" style={accesoStyles}>
                <button 
                    style={iniciarButtonStyles}
                    onClick={() => navigate('/login')}
                >
                    Iniciar sesión
                </button>
                <button 
                    style={registroButtonStyles}
                    onClick={() => navigate('/register')}
                >
                    Registrarse
                </button>
            </div>
        </header>
    );
}

export default Header;