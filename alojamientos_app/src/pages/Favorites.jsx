import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { favoriteService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false); 
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && !hasLoaded) {
      loadFavorites();
    }
  }, [user, hasLoaded]); 

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteService.getByUser(user.id);
      
      let favoritesData = [];
      
      if (Array.isArray(response.data)) {
        favoritesData = response.data;
      } else if (response.data && Array.isArray(response.data.records)) {
        favoritesData = response.data.records;
      } else if (response.data && Array.isArray(response.data.data)) {
        favoritesData = response.data.data;
      }
      
      setFavorites(favoritesData || []);
      setHasLoaded(true); 
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setFavorites([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (accommodationId) => {
    try {
      await favoriteService.remove(user.id, accommodationId);
      setFavorites(favorites.filter(fav => fav.accommodation_id !== accommodationId));
      alert('Eliminado de favoritos!');
    } catch (error) {
      alert('Error eliminando de favoritos');
      console.error('Error:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (loading && !hasLoaded) {
    return (
      <div className="min-h-screen bg-[#1E211A]">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-[#A8BBC1]">Cargando favoritos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E211A]">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#A8BBC1]">
          Mis Favoritos
        </h1>
        
        {!favorites || favorites.length === 0 ? (
          <div className="text-center text-[#A8BBC1] mt-8">
            No tienes favoritos aún
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-[#5C4B43] rounded-xl shadow-lg overflow-hidden relative border border-[#677683]">
                {fav.image_url && (
                  <img 
                    src={fav.image_url} 
                    alt={fav.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 text-[#B5B7B1]">{fav.title}</h3>
                  <p className="text-[#A8BBC1] mb-3 text-sm leading-relaxed">{fav.description}</p>
                  <p className="text-[#B5B7B1] font-bold text-xl mb-4">
                    ${fav.price_per_night} / noche
                  </p>
                  
                  <button
                    onClick={() => handleRemoveFavorite(fav.accommodation_id)}
                    className="bg-[#677683] text-[#B5B7B1] px-4 py-2 rounded-xl w-full hover:bg-[#5C4B43] transition-colors duration-200 border border-[#A8BBC1] flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Eliminar de Favoritos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;