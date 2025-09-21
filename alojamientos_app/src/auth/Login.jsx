import { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      onLoginSuccess(result.user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E211A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#A8BBC1]">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-[#B5B7B1]">Ingresa a tu cuenta para continuar</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
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
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#B5B7B1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#A8BBC1] hover:text-[#B5B7B1] text-sm transition-colors duration-200"
            >
              ¿No tienes cuenta? <span className="font-semibold text-[#A8BBC1] hover:text-[#B5B7B1]">Regístrate aquí</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;