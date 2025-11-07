import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import AcercaDePage from "./pages/AcercaDePage";
import ContactoPage from "./pages/ContactoPage";
import TareasPage from "./pages/TareasPage";
import CrearTareasPage from "./pages/CrearTareasPage.tsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/acerca" element={<AcercaDePage/>} />
          <Route path="/contacto" element={<ContactoPage/>} />
          <Route path="/tareas" element={<TareasPage/>} />
          <Route path="/tareas/crear" element={<CrearTareasPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}