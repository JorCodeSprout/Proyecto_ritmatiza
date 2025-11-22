import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import AcercaDePage from "./pages/AcercaDePage";
import ContactoPage from "./pages/ContactoPage";
import CrearTareasPage from "./pages/CrearTareasPage.tsx";
import MusicPage from "./pages/MusicPage.tsx";
import DatosPersonales from "./pages/DatosPersonales.tsx";
import Perfil from "./pages/Perfil.tsx";
import EntregasPage from "./pages/EntregasPage.tsx";
import Politica from "./pages/Politica.tsx";
import Usuarios from "./pages/Usuarios.tsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/terms" element={<Politica />} />
          <Route path="/acerca" element={<AcercaDePage/>} />
          <Route path="/contacto" element={<ContactoPage/>} />
          <Route path="/tareas/crear" element={<CrearTareasPage/>} />
          <Route path="/musica" element={<MusicPage/>} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/datosPersonales" element={<DatosPersonales />} />
          <Route path="/entregas" element={<EntregasPage />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}