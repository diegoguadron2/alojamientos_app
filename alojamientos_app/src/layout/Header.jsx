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
    <header className="bg-[#5C4B43] border-b border-[#A8BBC1]/30 px-6 py-2 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-6">
        <button 
          onClick={goToHome} 
          className="text-[#B5B7B1] hover:text-white transition-colors duration-200"
          title="Inicio"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {user && (
          <button
            onClick={goToFavorites}
            className="flex items-center text-[#B5B7B1] hover:text-white transition-colors duration-200 group"
            title="Mis favoritos"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-light opacity-90 group-hover:opacity-100 group-hover:text-white">Favoritos</span>
          </button>
        )}

        {isAdmin() && (
          <button
            onClick={goToAdmin}
            className="flex items-center text-[#B5B7B1] hover:text-white transition-colors duration-200 group"
            title="Panel de administración"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-light opacity-90 group-hover:opacity-100 group-hover:text-white">Admin</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-[#B5B7B1] text-xs font-light">
          Hola, {user?.username}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center text-[#B5B7B1] hover:text-white transition-colors duration-200 group"
          title="Cerrar sesión"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;