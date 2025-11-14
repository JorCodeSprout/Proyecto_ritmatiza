import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
    </svg>
);


const Header: React.FC = () => {
    const navigate = useNavigate();
    const {isLogged, logout} = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const paginaLogin = location.pathname === '/login';
    const paginaRegister = location.pathname === '/register';

    const menuItems = [
        { id: 'inicio', name: 'Inicio', href: '/', requiresAuth: false },
        { id: 'musica', name: 'Playlist', href: '/musica', requiresAuth: true },
        { id: 'acerca', name: 'Acerca de', href: '/acerca', requiresAuth: false },
        { id: 'contacto', name: 'Contacto', href: '/contacto', requiresAuth: false },
    ];

    const menuLinksAMostrar = menuItems.filter(enlace => !enlace.requiresAuth || isLogged);

    return (
        <header>
            {/* Logo */}
            <Link to="/">
                <img 
                    src="../public/images/RITMATIZA.png"
                    alt="logo" 
                    title="logo"
                />
            </Link>

            {/* Menú de Navegación */}
            <nav className='menu'>
                <ul>
                    {menuLinksAMostrar.map((item) => (
                        <li key={item.id} id={item.id}>
                            <NavLink to={item.href} className={({isActive}) => (isActive ? 'marcado' : '')}>
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Botones de Acceso */}
            <div id="acceso">
                {isLogged ? (
                    <>
                        <button onClick={handleLogout} className='cerrar'>
                            Cerrar sesión
                        </button>
                        <Link to='/me' title='Ver perfil' className='user-icon'>
                            <UserIcon  fill='#1a3a5a' />
                        </Link>
                    </>
                ) : (
                    <>
                    {!paginaLogin && ( 
                        <button onClick={() => navigate('/login')} className='iniciar'>
                            Iniciar sesión
                        </button>
                    )}
                    {!paginaRegister && (
                        <button onClick={() => navigate('/register')}  className='registro'>
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