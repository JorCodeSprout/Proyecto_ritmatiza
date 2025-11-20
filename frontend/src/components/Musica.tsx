import React from "react";
import styles from '../assets/styles/Musica.module.css' 
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

const Musica: React.FC = () => {
    const {user} = useAuth();

    if(user?.role === "ESTUDIANTE") {
        return (
            <>
                <Sidebar />
                <div id="body">
                    <div className={styles.permiso_denegado}>
                        <h2>No tienes permiso para estar aquí</h2>
                        <Link to="/datosPersonales">Vuelve a tu perfil</Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div id="body">
            <div className={styles.grid_container}>
                <div className={styles.grid_item}>
                    <div className={styles.header_content}>
                        <h1>RITMATIZANDO ALUMNOS</h1>
                    </div>
                </div>
                
                <div className="playlist_contenedor">
                    <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/4l1f3lTvE51CtwLa53KuGz?utm_source=generator" width="90%" height="500" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            </div>
        </div>
    );
}

export default Musica;