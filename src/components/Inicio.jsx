  import { useEffect, useRef, useState } from 'react';
  import logo from '../assets/img/logo.png';
  import logoFooter from '../assets/img/logo_footer.png';
  import slider1 from '../assets/img/inicio/slider1.jpg';
  import slider2 from '../assets/img/inicio/slider2.jpg';
  import slider3 from '../assets/img/inicio/slider3.jpg';
  import slider4 from '../assets/img/inicio/slider4.jpg';
  import slider5 from '../assets/img/inicio/slider5.jpg';
  import libro1 from '../assets/img/inicio/libro1.jpg';
  import libro2 from '../assets/img/inicio/libro2.jpg';
  import libro3 from '../assets/img/inicio/libro3.jpg';
  import libro4 from '../assets/img/inicio/libro4.jpg';
  import '../assets/css/inicio.css';
  import { useNavigate } from 'react-router-dom';

  function Inicio() {
    const adminButtonsRef = useRef(null);
    const navigate = useNavigate();
    const [librosRecomendados, setLibrosRecomendados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedLibro, setSelectedLibro] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    // Inicializar contador del carrito
    useEffect(() => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setCartCount(carrito.length);
    }, []);

    // Verificar rol de admin
    useEffect(() => {
      const rolUsuario = localStorage.getItem('rolUsuario');
      if (rolUsuario !== 'admin' && adminButtonsRef.current) {
        adminButtonsRef.current.style.display = 'none';
      }
    }, []);

    // Efecto para el slider automático
    useEffect(() => {
      const container = document.querySelector('.slider-wrapper');
      if (!container) return;

      let animationFrameId;
      const speed = 0.5;

      const scroll = () => {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += speed;
        }
        animationFrameId = requestAnimationFrame(scroll);
      };

      scroll();

      return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Cargar libros recomendados
    useEffect(() => {
      const actualizarRecomendados = () => {
        const todosLosLibros = JSON.parse(localStorage.getItem("libros")) || [];
        const recomendados = todosLosLibros.filter(libro => libro.recomendado);
        setLibrosRecomendados(recomendados);
      };

      actualizarRecomendados();
      window.addEventListener('storage', actualizarRecomendados);

      return () => {
        window.removeEventListener('storage', actualizarRecomendados);
      };
    }, []);

    // Función para mostrar modal de confirmación
    const mostrarModalConfirmacion = (libro) => {
      setSelectedLibro(libro);
      setShowModal(true);
    };

    // Función para confirmar alquiler
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
      setCartCount(carrito.length); // Actualizar contador

      // Actualizar stock
      const todos = JSON.parse(localStorage.getItem("libros")) || [];
      const actualizados = todos.map(l =>
        l.id === selectedLibro.id ? { ...l, stock: l.stock - 1 } : l
      );
      localStorage.setItem("libros", JSON.stringify(actualizados));

      setShowModal(false);
      alert("Libro agregado al carrito.");
    };

    return (
      <>
        <header>
          <a href="/inicio">
            <img src={logo} alt="Logo" className="logo-img" />
          </a>

          {localStorage.getItem('rolUsuario') === 'admin' && (
            <div className="admin-buttons" ref={adminButtonsRef}>
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

        <section className="destacados-header">
          <h2>📚 Libros Destacados 📚</h2>
          <p className="descripcion-seccion">
            Explora las obras más populares entre nuestros estudiantes y recomendadas por especialistas académicos. ¡Tu próxima lectura te espera!
          </p>
        </section>

        <section className="slider-section">
          <div className="slider-wrapper">
            <div className="slider">
              {[slider1, slider2, slider3, slider4, slider5, slider1, slider2, slider3, slider4, slider5].map((img, idx) => (
                <img key={`slider-${idx}`} src={img} alt={`Libro ${idx + 1}`} />
              ))}
            </div>
          </div>
        </section>

  <section className="recomendaciones">
    <h2>Recomendaciones</h2>
    <p className="descripcion-seccion">
      Explora una selección curada de libros para cada facultad. ¡Encuentra tu próxima lectura favorita!
    </p>

    <div className="libros-container">
      {librosRecomendados.map(libro => (
        <div key={libro.id} className="libro">
          <img src={libro.imagen} alt={libro.titulo} />
          <h4>{libro.titulo}</h4>
          <p>{libro.autor}</p>
          <div className="estrellas">{libro.estrellas}</div>
          <span className="genero">{libro.genero}</span>
          <p className="stock">Stock: {libro.stock}</p>
          <div className="acciones">
            <button 
              className="btn-detalles" 
              onClick={() => navigate(`/detalles/${libro.id}`)}
            >
              Ver detalles
            </button>
            <button
              className="btn-alquilar"
              onClick={() => mostrarModalConfirmacion(libro)}
            >
              + Alquilar
            </button>
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
          <button 
            className="inicio-modal-cancel"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button 
            className="inicio-modal-confirm"
            onClick={confirmarAlquiler}
          >
            Confirmar
          </button>
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

  export default Inicio;