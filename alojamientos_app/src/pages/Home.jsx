import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { accommodationService, favoriteService } from '../services/api';

const Home = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadAccommodations();
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadAccommodations = async () => {
    try {
      const response = await accommodationService.getAll();
      setAccommodations(response.data.records);
    } catch (error) {
      console.error('Error cargando alojamientos:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getByUser(user.id);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  };

  const isFavorite = (accommodationId) => {
    return favorites.some(fav => fav.accommodation_id === accommodationId);
  };

  const handleAddFavorite = async (accommodationId) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      await favoriteService.add(user.id, accommodationId);
      setFavorites([...favorites, { accommodation_id: accommodationId }]);
      alert('Agregado a favoritos!');
    } catch (error) {
      alert('Error agregando a favoritos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Bienvenido a Alojamientos App</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((acc) => (
            <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              {user && (
                <div className="absolute top-2 right-2">
                  {isFavorite(acc.id) ? (
                    <span className="text-2xl text-red-500" title="En favoritos">❤️</span>
                  ) : (
                    <button
                      onClick={() => handleAddFavorite(acc.id)}
                      className="text-2xl text-gray-400 hover:text-red-500 transition-colors"
                      title="Agregar a favoritos"
                    >
                      🤍
                    </button>
                  )}
                </div>
              )}
              
              {acc.image_url && (
                <img 
                  src={acc.image_url} 
                  alt={acc.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{acc.title}</h3>
                <p className="text-gray-600 mb-3">{acc.description}</p>
                <p className="text-green-600 font-bold text-xl mb-3">
                  ${acc.price_per_night} / noche
                </p>
                <p className="text-sm text-gray-500">Publicado por: {acc.owner}</p>
                
                {user && !isFavorite(acc.id) && (
                  <button
                    onClick={() => handleAddFavorite(acc.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full hover:bg-blue-700 transition-colors"
                  >
                    Agregar a Favoritos
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {accommodations.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No hay alojamientos disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;