  import { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import logo from '../assets/img/logo.png';
  import logoFooter from '../assets/img/logo_footer.png';
  import '../assets/css/detalles.css';

  function DetalleLibro() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [libro, setLibro] = useState(null);
    const [recomendados, setRecomendados] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [esAdmin, setEsAdmin] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedLibro, setSelectedLibro] = useState(null);

    useEffect(() => {
      const rol = localStorage.getItem('rolUsuario');
      setEsAdmin(rol === 'admin');
    }, []);

    useEffect(() => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setCartCount(carrito.length);
    }, []);

    useEffect(() => {
      const librosGuardados = JSON.parse(localStorage.getItem('libros')) || [];
      const libroSeleccionado = librosGuardados.find(libro => String(libro.id) === id);
      setLibro(libroSeleccionado);

      const recomendados = librosGuardados.filter(libro => libro.recomendado);
      setRecomendados(recomendados);
    }, [id]);

    const mostrarModalConfirmacion = (libro) => {
      setSelectedLibro(libro);
      setShowModal(true);
    };

    const confirmarAlquiler = () => {
      if (!selectedLibro) return;

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const existe = carrito.find(item => item.id === selectedLibro.id);

      if (existe) {
        alert("Este libro ya está en el carrito.");
        setShowModal(false);
        return;
      }

      if (selectedLibro.stock <= 0) {
        alert("Este libro no tiene stock disponible.");
        setShowModal(false);
        return;
      }

      const hoy = new Date();
      const entrega = new Date();
      entrega.setDate(hoy.getDate() + 7);

      carrito.push({
        ...selectedLibro,
        dias: 7,
        fechaPedido: hoy.toISOString(),
        fechaEntrega: entrega.toISOString()
      });

      localStorage.setItem("carrito", JSON.stringify(carrito));
      setCartCount(carrito.length);

      const todos = JSON.parse(localStorage.getItem("libros")) || [];
      const actualizados = todos.map(l =>
        l.id === selectedLibro.id ? { ...l, stock: l.stock - 1 } : l
      );
      localStorage.setItem("libros", JSON.stringify(actualizados));

      setShowModal(false);
      alert("Libro agregado al carrito.");
    };

    if (!libro) return <p style={{ padding: '2rem' }}>Cargando libro...</p>;

    return (
      <>
        <header>
          <a href="/inicio"><img src={logo} alt="Logo" className="logo-img" /></a>

          {esAdmin && (
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
            <a onClick={() => navigate('/carrito')} className="cart-icon">
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </a>
          </div>
        </header>

        <section className="detalle-libro">
          <div className="detalle-container">
            <div className="portada">
              <img src={libro.imagen} alt={libro.titulo} />
            </div>

            <div className="detalle-info">
              <h3>{libro.titulo}</h3>
              <p className="especialidad">{libro.genero}</p>
              <div className="estrellas">⭐⭐⭐⭐☆</div>
              <p className="autor">{libro.autor}</p>
              <p className="descripcion">{libro.descripcion}</p>
            </div>

            <div className="detalle-alquilar">
              <button className="btn-alquilar" onClick={() => mostrarModalConfirmacion(libro)}>+ Alquilar</button>
              <h4>Información del producto</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>Editorial:</strong> {libro.editorial}</li>
                <li><strong>ISBN:</strong> {libro.isbn}</li>
                <li><strong>Idioma:</strong> {libro.idioma}</li>
                <li><strong>Páginas:</strong> {libro.paginas}</li>
                <li><strong>Encuadernación:</strong> {libro.encuadernacion}</li>
                <li><strong>Lanzamiento:</strong> {libro.lanzamiento}</li>
                <li><strong>Año edición:</strong> {libro.anio}</li>
                <li><strong>Plaza:</strong> {libro.plaza}</li>
                <li><strong>Alto:</strong> {libro.alto}</li>
                <li><strong>Ancho:</strong> {libro.ancho}</li>
                <li><strong>Grueso:</strong> {libro.grueso}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="recomendaciones">
          <h2>Recomendaciones</h2>
          <p className="descripcion-seccion">
            Explora una selección curada de libros recomendados. ¡Encuentra tu próxima lectura favorita!
          </p>

          <div className="libros-container">
            {recomendados.map(libro => (
              <div key={libro.id} className="libro">
                <img src={libro.imagen} alt={libro.titulo} />
                <h4>{libro.titulo}</h4>
                <p>{libro.autor}</p>
                <div className="estrellas">{libro.estrellas}</div>
                <span className="genero">{libro.genero}</span>
                <p className="stock">Stock: {libro.stock}</p>
                <div className="acciones">
                  <button className="btn-detalles" onClick={() => navigate(`/detalles/${libro.id}`)}>Ver detalles</button>
                  <button className="btn-alquilar" onClick={() => mostrarModalConfirmacion(libro)}>+ Alquilar</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showModal && (
          <div className="inicio-modal-overlay">
            <div className="inicio-modal">
              <h3>Confirmar Alquiler</h3>
              <p>¿Estás seguro que deseas alquilar "{selectedLibro?.titulo}"?</p>
              <div className="inicio-modal-buttons">
                <button className="inicio-modal-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="inicio-modal-confirm" onClick={confirmarAlquiler}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

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

  export default DetalleLibro;
