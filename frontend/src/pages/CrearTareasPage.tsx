import '../assets/styles/formulario_tareas.css';
import React from "react";
import CrearTarea from "../components/CrearTarea.tsx";
import Sidebar from '../components/Sidebar.tsx';

const CrearTareasPage: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div id="body">
                <CrearTarea />    
            </div>
        </>
    )
}

export default CrearTareasPage;