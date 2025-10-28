import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 

interface LayoutProps {
    children: React.ReactNode;
}

// Estilos que replican el body CSS
const mainWrapperStyles: React.CSSProperties = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    width: '100vw',
    minHeight: '100vh',
    margin: '0',
    padding: '0', // Eliminamos padding del wrapper ya que el header/footer ya tienen
    boxSizing: 'border-box',
    backgroundColor: 'whitesmoke',
    display: 'flex',
    flexDirection: 'column',
};

// Estilos para el contenido principal
const mainContentStyles: React.CSSProperties = {
    flex: 1, // Permite que el contenido ocupe el espacio restante
    padding: '0 20px', // Aplicamos aquí el padding horizontal que tenía el body
    boxSizing: 'border-box',
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={mainWrapperStyles}>
            <Header />

            <main style={mainContentStyles}>
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default Layout;