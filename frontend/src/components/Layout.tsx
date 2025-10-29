import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 
import '../assets/styles/general.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div id='body'>
            <Header />

            <main>
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default Layout;