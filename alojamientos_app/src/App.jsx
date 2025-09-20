import { useState, useEffect } from "react"; // ← IMPORTACIÓN NECESARIA
import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Register } from "./auth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import useAuth from "./hooks/useAuth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("userRole");

    if (user) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // Función para manejar login exitoso
  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserRole(user.role);
  };

  // Función para logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.reload();
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} userRole={userRole} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
