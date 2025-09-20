import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { accommodationService } from '../services/api';

const Admin = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    price_per_night: '',
    user_id: JSON.parse(localStorage.getItem('user'))?.id
  });

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = async () => {
    try {
      const response = await accommodationService.getAll();
      setAccommodations(response.data.records);
    } catch (error) {
      console.error('Error cargando alojamientos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        await accommodationService.update(editingId, formData);
        alert('Alojamiento actualizado exitosamente!');
      } else {
        await accommodationService.create(formData);
        alert('Alojamiento creado exitosamente!');
      }
      
      resetForm();
      await loadAccommodations(); 
    } catch (error) {
      alert(editingId ? 'Error actualizando alojamiento' : 'Error creando alojamiento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (accommodation) => {
    setEditingId(accommodation.id);
    setFormData({
      title: accommodation.title,
      description: accommodation.description,
      image_url: accommodation.image_url,
      price_per_night: accommodation.price_per_night,
      user_id: accommodation.user_id
    });
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este alojamiento?')) return;
    
    try {
      await accommodationService.delete(id);
      await loadAccommodations(); 
      alert('Alojamiento eliminado exitosamente!');
    } catch (error) {
      alert('Error eliminando alojamiento');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      price_per_night: '',
      user_id: JSON.parse(localStorage.getItem('user'))?.id
    });
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>
        
        <div id="form-section" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Editar Alojamiento' : 'Crear Nuevo Alojamiento'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
            <input
              type="url"
              placeholder="URL de la imagen"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Precio por noche"
              value={formData.price_per_night}
              onChange={(e) => setFormData({...formData, price_per_night: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Alojamiento'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Alojamientos Existentes</h2>
          <div className="grid gap-4">
            {accommodations.map((acc) => (
              <div key={acc.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{acc.title}</h3>
                    <p className="text-gray-600">{acc.description}</p>
                    <p className="text-green-600 font-bold">${acc.price_per_night}/noche</p>
                    {acc.image_url && (
                      <img 
                        src={acc.image_url} 
                        alt={acc.title}
                        className="w-32 h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(acc)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;