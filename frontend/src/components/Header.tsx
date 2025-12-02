import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../assets/styles/general.css';

// Usamos 30px consistente para todos los iconos y eliminamos el fill hardcodeado.
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
    </svg>
);

const AdminIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"><path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z"/></svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg { ...props }xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
        <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T763-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
    </svg>
);

const Header: React.FC = () => {
    const navigate = useNavigate();
    const {isLogged, logout, role} = useAuth();
    const location = useLocation();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    const handleNavLinkClick = () => {
        setIsMenuOpen(false);
    }

    const paginaLogin = location.pathname === '/login';
    const paginaRegister = location.pathname === '/register';

    const menuItems = [
        { id: 'inicio', name: 'Inicio', href: '/' },
        { id: 'acerca', name: 'Acerca de', href: '/acerca' },
        { id: 'contacto', name: 'Contacto', href: '/contacto' },
    ];

    const menuLinksAMostrar = menuItems;

    const iconFillColor = '#1a3a5a'; 

    return (
        <header className={isMenuOpen ? 'menu-open' : ''}>
            <Link to="/">
                <img 
                    src="../public/images/RITMATIZA.png"
                    alt="logo" 
                    title="logo"
                />
            </Link>

            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                {isMenuOpen ? <CloseIcon fill={iconFillColor}  className='cerrar_menu' /> : <MenuIcon fill={iconFillColor} />}
            </button>

            <nav className={`menu ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    {menuLinksAMostrar.map((item) => (
                        <li key={item.id} id={item.id}>
                            <NavLink to={item.href} onClick={handleNavLinkClick}>
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div id="acceso" className={isMenuOpen ? 'active' : ''}>
                {isLogged ? (
                    <>
                        <button onClick={handleLogout} className='cerrar'>
                            Cerrar sesión
                        </button>
                        <Link to='/perfil' title='Ver perfil' className='user-icon'>
                            {role === "ADMIN" ? (
                                <AdminIcon fill='#1a3a5a' />
                            ): (
                                <UserIcon fill='#1a3a5a' />
                            )}
                        </Link>
                    </>
                ) : (
                    <>
                    {!paginaLogin && ( 
                        <button onClick={() => { navigate('/login'); handleNavLinkClick(); }} id='iniciar_sesion'>
                            Iniciar sesión
                        </button>
                    )}
                    {!paginaRegister && (
                        <button onClick={() => { navigate('/register'); handleNavLinkClick(); }} className='registro_sesion'>
                            Registrarse
                        </button>
                    )}
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;