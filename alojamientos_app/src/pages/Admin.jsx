import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { accommodationService } from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

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
    <div className="min-h-screen bg-[#1E211A]">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#A8BBC1]">
          Panel de Administración
        </h1>
        
        <div id="form-section" className="bg-[#5C4B43] p-6 rounded-xl shadow-lg mb-8 border border-[#677683]">
          <h2 className="text-xl font-semibold mb-4 text-[#B5B7B1]">
            {editingId ? 'Editar Alojamiento' : 'Crear Nuevo Alojamiento'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Título"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-[#677683] border-[#A8BBC1] text-[#B5B7B1] placeholder-[#A8BBC1] focus:ring-2 focus:ring-[#A8BBC1] focus:border-[#A8BBC1] rounded-xl"
              required
            />
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-[#677683] border border-[#A8BBC1] text-[#B5B7B1] placeholder-[#A8BBC1] rounded-xl focus:ring-2 focus:ring-[#A8BBC1] focus:border-[#A8BBC1] resize-none"
              rows="3"
              required
            />
            <Input
              type="url"
              placeholder="URL de la imagen"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="bg-[#677683] border-[#A8BBC1] text-[#B5B7B1] placeholder-[#A8BBC1] focus:ring-2 focus:ring-[#A8BBC1] focus:border-[#A8BBC1] rounded-xl"
            />
            <Input
              type="number"
              placeholder="Precio por noche"
              value={formData.price_per_night}
              onChange={(e) => setFormData({...formData, price_per_night: e.target.value})}
              className="bg-[#677683] border-[#A8BBC1] text-[#B5B7B1] placeholder-[#A8BBC1] focus:ring-2 focus:ring-[#A8BBC1] focus:border-[#A8BBC1] rounded-xl"
              required
            />
            
            <div className="flex space-x-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="flex-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#B5B7B1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingId ? 'Actualizando...' : 'Creando...'}
                  </div>
                ) : editingId ? 'Actualizar' : 'Crear Alojamiento'}
              </Button>
              
              {editingId && (
                <Button
                  type="button"
                  onClick={cancelEdit}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#B5B7B1]">Alojamientos Existentes</h2>
          <div className="grid gap-4">
            {accommodations.map((acc) => (
              <div key={acc.id} className="bg-[#5C4B43] p-5 rounded-xl shadow-lg border border-[#677683]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#B5B7B1]">{acc.title}</h3>
                    <p className="text-[#A8BBC1] text-sm mt-1">{acc.description}</p>
                    <p className="text-[#B5B7B1] font-bold text-lg mt-2">${acc.price_per_night}/noche</p>
                    {acc.image_url && (
                      <img 
                        src={acc.image_url} 
                        alt={acc.title}
                        className="w-32 h-24 object-cover rounded-lg mt-3 border border-[#677683]"
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(acc)}
                      className="bg-[#677683] text-[#B5B7B1] px-3 py-2 rounded-xl hover:bg-[#5C4B43] transition-colors border border-[#A8BBC1]"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="bg-[#677683] text-[#B5B7B1] px-3 py-2 rounded-xl hover:bg-[#5C4B43] transition-colors border border-[#A8BBC1]"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
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