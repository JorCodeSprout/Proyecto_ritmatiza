import type React from "react";
import Sidebar from "../components/Sidebar";
import SugerenciaCard from "../components/SugerenciaCard";
import styles from "../assets/styles/Sugerencias.module.css";

const Sugerencias: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div id="body">
                <div className={styles.contenedor}>
                    <SugerenciaCard />
                </div>
            </div>
        </>
    )
}

export default Sugerencias;