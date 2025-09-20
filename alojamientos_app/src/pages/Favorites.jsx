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
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Cargando favoritos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mis Favoritos</h1>
        
        {!favorites || favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No tienes favoritos aún
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {fav.image_url && (
                  <img 
                    src={fav.image_url} 
                    alt={fav.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{fav.title}</h3>
                  <p className="text-gray-600 mb-3">{fav.description}</p>
                  <p className="text-green-600 font-bold text-xl mb-3">
                    ${fav.price_per_night} / noche
                  </p>
                  
                  <button
                    onClick={() => handleRemoveFavorite(fav.accommodation_id)}
                    className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition-colors"
                  >
                    🗑️ Eliminar de Favoritos
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