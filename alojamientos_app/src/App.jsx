import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Login, Register } from "./auth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import useAuth from "./hooks/useAuth";
import Favorites from "./pages/Favorites";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("userRole");

    if (user) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserRole(user.role);
  };

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
              <Login
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => navigate("/register")} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register onSwitchToLogin={() => navigate("/login")} />
            ) : (
              <Navigate to="/" replace />
            )
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
        <Route
          path="/favorites"
          element={
            isAuthenticated ? (
              <Favorites onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
 
      </Routes>
    </div>
  );
}

export default App;
