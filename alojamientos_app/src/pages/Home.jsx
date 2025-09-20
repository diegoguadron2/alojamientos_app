import Header from '../layout/Header';

const Home = ({ onLogout, userRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Bienvenido a Alojamientos App
        </h1>
        {/* Aquí irá la lista de alojamientos */}
      </div>
    </div>
  );
};

export default Home;