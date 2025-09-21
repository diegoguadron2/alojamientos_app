import { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, loading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) errors.username = 'El nombre de usuario es requerido';
    if (!formData.email.trim()) errors.email = 'El email es requerido';
    if (!formData.password) errors.password = 'La contraseña es requerida';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      onRegisterSuccess?.(result.user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E211A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#A8BBC1]">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-[#B5B7B1]">Crea tu cuenta para comenzar</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Nombre de usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              error={formErrors.username}
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              error={formErrors.email}
            />
            
            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              error={formErrors.password}
            />
            
            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              error={formErrors.confirmPassword}
            />
          </div>

          {error && (
            <div className="bg-[#5C4B43] border border-[#677683] text-[#B5B7B1] px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            variant="primary"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#B5B7B1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </div>
            ) : (
              "Crear Cuenta"
            )}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#A8BBC1] hover:text-[#B5B7B1] text-sm transition-colors duration-200"
            >
              ¿Ya tienes cuenta? <span className="font-semibold text-[#A8BBC1] hover:text-[#B5B7B1]">Inicia sesión aquí</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;