import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 
import '../assets/styles/general.css';

interface LayoutProps {
    children: React.ReactNode;
    includeFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, includeFooter = true }) => {
    return (
        <div id='body'>
            <Header />

            <main>
                {children}
            </main>

            {includeFooter && <Footer />}
        </div>
    );
}

export default Layout;