import React from "react";
import { Link } from "react-router-dom";
import '../assets/styles/musica.css' 

const Musica: React.FC = () => {
    return (
        <div className='mainContentStyles logged-in-layout'>
            <div className='grid-container'>
                <div className="grid-item bloque-header">
                    <div className="header-content">
                        <h1>RITMATIZANDO ALUMNOS</h1>
                        <p><Link to="/perfil">Ve a tu perfil</Link> para ver el estado de tus sugerencias</p>
                    </div>
                </div>
                
                <div className="playlist-contenedor">
                    <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/4l1f3lTvE51CtwLa53KuGz?utm_source=generator" width="100%" height="450" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            </div>
        </div>
    );
}

export default Musica;