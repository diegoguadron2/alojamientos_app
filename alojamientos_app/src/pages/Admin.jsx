
import Header from '../layout/Header';

const Admin = ({ onLogout, userRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Panel de Administración
        </h1>
        {/* Aquí irá el CRUD de alojamientos */}
      </div>
    </div>
  );
};

export default Admin;