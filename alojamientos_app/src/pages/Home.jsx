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
    <div className="min-h-screen bg-[#1E211A]">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#A8BBC1]">
          Bienvenido a Alojamientos App
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((acc) => (
            <div key={acc.id} className="bg-[#5C4B43] rounded-xl shadow-lg overflow-hidden relative border border-[#677683]">
              {user && (
                <div className="absolute top-3 right-3 z-10">
                  {isFavorite(acc.id) ? (
                    <span className="text-xl text-[#B5B7B1]" title="En favoritos">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddFavorite(acc.id)}
                      className="text-xl text-[#A8BBC1] hover:text-[#B5B7B1] transition-colors"
                      title="Agregar a favoritos"
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                      </svg>
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
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#B5B7B1]">{acc.title}</h3>
                <p className="text-[#A8BBC1] mb-3 text-sm leading-relaxed">{acc.description}</p>
                <p className="text-[#B5B7B1] font-bold text-xl mb-3">
                  ${acc.price_per_night} / noche
                </p>
                <p className="text-[#A8BBC1] text-sm">Publicado por: {acc.owner}</p>
                
                {user && !isFavorite(acc.id) && (
                  <button
                    onClick={() => handleAddFavorite(acc.id)}
                    className="bg-[#677683] text-[#B5B7B1] px-4 py-2 rounded-xl mt-4 w-full hover:bg-[#5C4B43] transition-colors duration-200 border border-[#A8BBC1]"
                  >
                    Agregar a Favoritos
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {accommodations.length === 0 && (
          <div className="text-center text-[#A8BBC1] mt-8">
            No hay alojamientos disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;