    import logo from '../assets/img/logo.png';
    import logoFooter from '../assets/img/logo_footer.png';
    import '../assets/css/carrito.css';
    import { useState, useEffect, useRef } from 'react';

    function Carrito() {
      const [nombre, setNombre] = useState('');
      const [cedula, setCedula] = useState('');
      const [mostrarResumen, setMostrarResumen] = useState(false);
      const [carrito, setCarrito] = useState([]);
      const [resumenLibros, setResumenLibros] = useState([]);
      const [mostrarError, setMostrarError] = useState(false);
      const adminButtonsRef = useRef(null);

      useEffect(() => {
        const datos = JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(datos);
      }, []);

      // Ocultar botones si no es admin
      useEffect(() => {
        const rolUsuario = localStorage.getItem('rolUsuario');
        if (rolUsuario !== 'admin' && adminButtonsRef.current) {
          adminButtonsRef.current.style.display = 'none';
        }
      }, []);

      const cambiarDias = (id, dias) => {
        const nuevoCarrito = carrito.map(libro =>
          libro.id === id ? {
            ...libro,
            dias: Number(dias),
            fechaEntrega: new Date(new Date(libro.fechaPedido).getTime() + Number(dias) * 86400000).toISOString()
          } : libro
        );
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      };

      const quitarDelCarrito = (id) => {
        const libroQuitado = carrito.find(l => l.id === id);

        // Recuperar y actualizar stock
        const libros = JSON.parse(localStorage.getItem("libros")) || [];
        const actualizados = libros.map(l =>
          l.id === id ? { ...l, stock: l.stock + 1 } : l
        );
        localStorage.setItem("libros", JSON.stringify(actualizados));

        const nuevoCarrito = carrito.filter(l => l.id !== id);
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      };

      const cerrarResumen = () => {
        setMostrarResumen(false);
      };

      const handleConfirmar = () => {
        if (!nombre || !cedula || carrito.length === 0) {
          setMostrarError(true);
          return;
        }
        setMostrarError(false);
        setResumenLibros(carrito);
        setMostrarResumen(true);

        // Limpiar carrito después de confirmar
        localStorage.removeItem("carrito");
        setCarrito([]);
      };

      return (
        <>
          <header>
            <a href="/inicio"><img src={logo} alt="Logo" className="logo-img" /></a>
            <div className="admin-buttons" ref={adminButtonsRef}>
              <a href="/gestionar_usuarios" className="btn-admin">Gestionar Usuarios</a>
              <a href="/gestionar_libros" className="btn-admin">Gestionar Libros</a>
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Buscar libros, autores, temas..." />
              <button><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div className="nav-icons">
              <a href="/libreria"><i className="fa-solid fa-book"></i></a>
              <a href="/perfil"><i className="fa-solid fa-user"></i></a>
              <a><i className="fa-solid fa-cart-shopping"></i></a>
            </div>
          </header>

          <section className="carrito">
            <div className="carrito-header">
              <h2>Carrito de Compras</h2>
            </div>

            <div className="carrito-contenido">
              {carrito.length === 0 ? (
                <p>No hay libros en el carrito.</p>
              ) : (
                carrito.map((libro, index) => (
                  <div key={index} className="libro-carrito">
                    <img src={libro.imagen} alt={libro.titulo} />
                    <div className="info-libro">
                      <h4>{libro.titulo}</h4>
                      <p>Autor: {libro.autor}</p>
                      <p>Género: {libro.genero}</p>
                      <p>Stock reservado: 1</p>

                      <label>
                        Días (máx. 31):{" "}
                        <input
                          type="number"
                          value={libro.dias}
                          min={1}
                          max={31}
                          onChange={(e) => cambiarDias(libro.id, e.target.value)}
                        />
                      </label>

                      <button onClick={() => quitarDelCarrito(libro.id)} className="btn-quitar">
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="carrito-footer">
              <input
                type="text"
                id="nombre-estudiante"
                placeholder="Nombre del Estudiante"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                id="cedula-estudiante"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
              {mostrarError && (
                <span className="error-msg" id="mensaje-error">
                  Por favor completa todos los campos.
                </span>
              )}
              <button className="btn-confirmar" onClick={handleConfirmar}>Alquilar</button>
              <button className="btn-ver-carrito">Ver Carrito</button>
            </div>

            {mostrarResumen && (
              <div id="resumen-modal" className="modal">
                <div className="modal-contenido">
                  <span className="cerrar-modal" onClick={cerrarResumen}>&times;</span>
                  <h2>Resumen de Alquiler</h2>
                  <div id="resumen-detalles">
                    <p><strong>Nombre:</strong> {nombre}</p>
                    <p><strong>Cédula:</strong> {cedula}</p>
                    {resumenLibros.map((libro, index) => (
                      <div key={index} className="resumen-libro">
                        <p><strong>{libro.titulo}</strong></p>
                        <p>Días: {libro.dias}</p>
                        <p>Fecha Pedido: {new Date(libro.fechaPedido).toLocaleDateString()}</p>
                        <p>Fecha Entrega: {new Date(libro.fechaEntrega).toLocaleDateString()}</p>
                        <hr />
                      </div>
                    ))}
                  </div>
                  <div className="mensaje-final">
                    ✅ Alquiler completado exitosamente.<br />
                    Por favor, acérquese a la biblioteca para retirar los libros.
                  </div>
                </div>
              </div>
            )}
          </section>

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

    export default Carrito;
