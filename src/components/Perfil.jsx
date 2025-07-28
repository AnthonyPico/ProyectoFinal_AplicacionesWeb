  import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import logo from '../assets/img/logo.png';
  import logoFooter from '../assets/img/logo_footer.png';
  import '../assets/css/perfil.css';

  function Perfil() {
    const navigate = useNavigate();
    const emailUsuario = localStorage.getItem('usuarioActual');

    const [usuario, setUsuario] = useState({
      nombres: '',
      apellidos: '',
      correo: '',
      claveCorreo: '',
      cedula: '',
      password: '',
      facultad: '',
      fotoPerfil: '',
    });

    const [modoEdicion, setModoEdicion] = useState(false);
    const [rolUsuario, setRolUsuario] = useState(null);

    useEffect(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioActual = usuarios.find(u => u.correo === emailUsuario);
      if (usuarioActual) {
        setUsuario(usuarioActual);
      }

      const rol = localStorage.getItem('rolUsuario');
      setRolUsuario(rol);
    }, [emailUsuario]);

    const guardarCambios = () => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const actualizados = usuarios.map(u =>
        u.correo === emailUsuario ? usuario : u
      );
      localStorage.setItem('usuarios', JSON.stringify(actualizados));
      alert('Cambios guardados correctamente.');
    };

    const handleEditarGuardar = () => {
      if (modoEdicion) {
        guardarCambios();
      }
      setModoEdicion(!modoEdicion);
    };

    const handleImagenCambio = (e) => {
      const archivo = e.target.files[0];
      if (!archivo) return;

      const lector = new FileReader();
      lector.onloadend = () => {
        const nuevaImagen = lector.result;
        const usuarioActualizado = { ...usuario, fotoPerfil: nuevaImagen };
        setUsuario(usuarioActualizado);

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const actualizados = usuarios.map(u =>
          u.correo === emailUsuario ? usuarioActualizado : u
        );
        localStorage.setItem('usuarios', JSON.stringify(actualizados));
      };
      lector.readAsDataURL(archivo);
    };

    const cerrarSesion = () => {
      localStorage.removeItem('usuarioActual');
      localStorage.removeItem('rolUsuario');
      navigate('/sesion'); // Cambia la ruta si usas otra para tu página principal
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
            <a><i className="fa-solid fa-cart-shopping"></i></a>
          </div>

          {/* Botón Cerrar Sesión */}
          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </header>

        {/* Sección Perfil */}
        <section className="perfil-usuario">
          <h2>Mi Perfil</h2>

          <div className="foto-perfil">
            <img
              src={usuario.fotoPerfil || 'https://via.placeholder.com/150'}
              alt="Foto de perfil"
            />
            {modoEdicion && (
              <input type="file" accept="image/*" onChange={handleImagenCambio} />
            )}
          </div>

          <div className="perfil-contenido">
            <div className="datos-usuario">
              <label>
                <strong>Nombres:</strong>
                <input
                  type="text"
                  value={usuario.nombres}
                  onChange={(e) => setUsuario({ ...usuario, nombres: e.target.value })}
                  disabled={!modoEdicion}
                />
              </label>

              <label>
                <strong>Apellidos:</strong>
                <input
                  type="text"
                  value={usuario.apellidos}
                  onChange={(e) => setUsuario({ ...usuario, apellidos: e.target.value })}
                  disabled={!modoEdicion}
                />
              </label>

              <label>
                <strong>Email:</strong>
                <input type="email" value={usuario.correo} disabled />
              </label>

              <label>
                <strong>Cédula:</strong>
                <input
                  type="text"
                  value={usuario.cedula}
                  onChange={(e) => setUsuario({ ...usuario, cedula: e.target.value })}
                  disabled={!modoEdicion}
                />
              </label>

              <label>
                <strong>Facultad:</strong>
                <input
                  type="text"
                  value={usuario.facultad}
                  onChange={(e) => setUsuario({ ...usuario, facultad: e.target.value })}
                  disabled={!modoEdicion}
                />
              </label>

              <label>
                <strong>Contraseña:</strong>
                <input
                  type="password"
                  value={usuario.password}
                  onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
                  disabled={!modoEdicion}
                />
              </label>

              <button onClick={handleEditarGuardar}>
                {modoEdicion ? 'Guardar Cambios' : 'Editar'}
              </button>
            </div>
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

  export default Perfil;
