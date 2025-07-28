import logo from '../assets/img/logo.png';
import logoFooter from '../assets/img/logo_footer.png';
import '../assets/css/libreria.css';
import { useEffect, useState } from 'react';

function Libreria() {
  const [librosAlquilados, setLibrosAlquilados] = useState([]);
  const [todosLosLibros, setTodosLosLibros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [rolUsuario, setRolUsuario] = useState(null);
  const [indice, setIndice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  useEffect(() => {
    const usuarioActualCorreo = localStorage.getItem('usuarioActual');
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.correo === usuarioActualCorreo);
    setLibrosAlquilados(usuario?.libros || []);

    const libros = JSON.parse(localStorage.getItem('libros')) || [];
    setTodosLosLibros(libros);

    const rol = localStorage.getItem('rolUsuario');
    setRolUsuario(rol);
  }, []);

  const siguiente = () => {
    if (indice < librosAlquilados.length - 1) setIndice(indice + 1);
  };

  const anterior = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const librosFiltrados = todosLosLibros.filter(libro =>
    libro.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  const mostrarModalConfirmacion = (libro) => {
    setLibroSeleccionado(libro);
    setShowModal(true);
  };

  const confirmarAlquiler = () => {
    if (!libroSeleccionado) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.find(l => l.id === libroSeleccionado.id)) {
      alert("Este libro ya está en el carrito.");
      setShowModal(false);
      return;
    }

    if (libroSeleccionado.stock <= 0) {
      alert("Este libro no tiene stock disponible.");
      setShowModal(false);
      return;
    }

    const hoy = new Date();
    const entrega = new Date();
    entrega.setDate(hoy.getDate() + 7);

    carrito.push({
      ...libroSeleccionado,
      dias: 7,
      fechaPedido: hoy.toISOString(),
      fechaEntrega: entrega.toISOString()
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar stock
    const actualizados = todosLosLibros.map(l =>
      l.id === libroSeleccionado.id ? { ...l, stock: l.stock - 1 } : l
    );
    localStorage.setItem('libros', JSON.stringify(actualizados));
    setTodosLosLibros(actualizados);

    alert("Libro agregado al carrito.");
    setShowModal(false);
  };

  return (
    <>
      {/* Header */}
      <header>
        <a href="/inicio"><img src={logo} alt="Logo" className="logo-img" /></a>

        {rolUsuario === 'admin' && (
          <div className="admin-buttons">
            <a href="/gestionar_usuarios" className="btn-admin">Gestionar Usuarios</a>
            <a href="/gestionar_libros" className="btn-admin">Gestionar Libros</a>
          </div>
        )}

        <div className="search-bar">
          <input type="text" placeholder="Buscar libros, autores, temas..." />
          <button><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div className="nav-icons">
          <a href="/libreria"><i className="fa-solid fa-book"></i></a>
          <a href="/perfil"><i className="fa-solid fa-user"></i></a>
          <a href="/carrito"><i className="fa-solid fa-cart-shopping"></i></a>
        </div>
      </header>

      {/* Modal */}
      {showModal && libroSeleccionado && (
        <div className="inicio-modal-overlay">
          <div className="inicio-modal">
            <h3>Confirmar Alquiler</h3>
            <p>¿Deseas alquilar el libro "{libroSeleccionado.titulo}"?</p>
            <div className="inicio-modal-buttons">
              <button onClick={() => setShowModal(false)} className="inicio-modal-cancel">Cancelar</button>
              <button onClick={confirmarAlquiler} className="inicio-modal-confirm">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <section className="slider-alquilados">
        <h2>Libros Alquilados</h2>
        {librosAlquilados.length > 0 ? (
          <div className="slider-container">
            <button onClick={anterior} disabled={indice === 0}>&lt;</button>
            <div className="libro-slide">
              <h4>{librosAlquilados[indice].titulo}</h4>
              <p>Días restantes: {librosAlquilados[indice].diasRestantes}</p>
              <p>Fecha de alquiler: {librosAlquilados[indice].fechaAlquiler}</p>
            </div>
            <button onClick={siguiente} disabled={indice === librosAlquilados.length - 1}>&gt;</button>
          </div>
        ) : <p>No has alquilado ningún libro aún.</p>}
      </section>

      <section className="todos-libros">
        <h2>Todos los Libros</h2>
        <input
          type="text"
          placeholder="Buscar libros..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-filtro"
        />
        <div className="libros-grid">
          {librosFiltrados.length > 0 ? librosFiltrados.map((libro, index) => (
            <div key={index} className="libro-card">
              <img src={libro.imagen} alt={libro.titulo} />
              <h4>{libro.titulo}</h4>
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Categoría:</strong> {libro.genero}</p>
              <p><strong>Stock:</strong> {libro.stock}</p>
              <button className="btn-alquilar" onClick={() => mostrarModalConfirmacion(libro)}>+ Alquilar</button>
            </div>
          )) : <p>No se encontraron libros.</p>}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-left">
            <img src={logoFooter} alt="Logo Biblioteca ULEAM" className="footer-logo" />
            <nav>
              <a href="/inicio">Inicio</a>
              <a href="/perfil">Perfil</a>
              <a href="/libreria">Mi Librería</a>
            </nav>
          </div>
          <div className="footer-right">
            <div className="contact-info">
              <p><strong>Contactar</strong></p>
              <p>Av. Circunvalación Vía a San Mateo</p>
              <p>
                Correo electrónico:
                <a href="mailto:incidencias.diit@uleam.edu.ec">incidencias.diit@uleam.edu.ec</a>
              </p>
            </div>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://www.twitter.com" target="_blank"><i className="fa-brands fa-twitter"></i></a>
              <a href="https://www.instagram.com" target="_blank"><i className="fa-brands fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Universidad Laica Eloy Alfaro de Manabí. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default Libreria;
