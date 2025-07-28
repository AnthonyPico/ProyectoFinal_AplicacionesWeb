  // App.jsx
  import { Routes, Route } from 'react-router-dom'; // 👈 solo Routes y Route
  import Hero from './components/Hero';
  import Sesion from './components/Sesion';
  import Registro from './components/Registro';
  import Recuperacion from './components/Recuperacion'; // ✅ nuevo
  import Inicio from './components/Inicio'; // ✅ nuevo
  import GestionUsuarios from './components/Gestionar_Usuario';
  import GestionLibros from './components/Gestionar_Libros';
  import DetalleLibro from './components/Detalles';
  import Carrito from './components/Carrito';
  import Perfil from './components/Perfil';
  import Libreria from './components/Libreria';

  function App() {

    return (
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/sesion" element={<Sesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperacion" element={<Recuperacion />} /> {/* ✅ nueva ruta */}
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/gestionar_usuarios" element={<GestionUsuarios />} />
        <Route path="/gestionar_libros" element={<GestionLibros />} />
      <Route path="/detalles/:id" element={<DetalleLibro />} />
      <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
              <Route path="/libreria" element={<Libreria />} />

      </Routes>
    );
  }

  export default App;
