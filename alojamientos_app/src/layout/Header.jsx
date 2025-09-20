import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("userRole");
  
  const isAdmin = () => {
    return userRole === "admin";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    window.location.reload();
    navigate("/login");
  };

  const goToHome = () => navigate("/");
  const goToAdmin = () => navigate("/admin");
  const goToFavorites = () => navigate("/favorites"); 

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={goToHome} className="text-2xl">🏠</button>

        {user && (
          <button
            onClick={goToFavorites}
            className="flex items-center text-pink-600 hover:text-pink-800"
          >
            <span className="text-xl">❤️</span>
            <span className="ml-1">Favoritos</span>
          </button>
        )}

        {isAdmin() && (
          <button
            onClick={goToAdmin}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="text-xl">✏️</span>
            <span className="ml-1">Admin</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Hola, {user?.username}</span>
        <button
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <span className="text-xl">🚪</span>
          <span className="ml-1">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;