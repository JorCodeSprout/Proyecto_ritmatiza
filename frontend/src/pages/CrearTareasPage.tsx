import '../assets/styles/formulario_tareas.css';
import React from "react";
import Layout from "../components/Layout.tsx";
import CrearTarea from "../components/CrearTarea.tsx";

const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1,
};


const CrearTareasPage: React.FC = () => {
    return (
        <Layout>
            <div style={mainContentStyles}>
                <CrearTarea/>
            </div>
        </Layout>
    )
}

export default CrearTareasPage;