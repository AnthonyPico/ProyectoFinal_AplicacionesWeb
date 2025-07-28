  import '../assets/css/hero.css';
  import { Link } from 'react-router-dom';
  import logo from '../assets/img/logo.png';
  import logoBody from '../assets/img/logo_body.png';
  import logoFooter from '../assets/img/logo_footer.png';

  function Hero() {
    return (
      <>
        <header>
          <div className="logo">
            <img src={logo} alt="Newsflix Logo" className="logo-img" />
          </div>
          <nav>
            <Link to="/"><button>INICIO</button></Link>
            <Link to="/registro"><button>REGISTRARSE</button></Link>
            <Link to="/sesion"><button>ACCEDER</button></Link>
          </nav>
        </header>

        <div className="contenedor">
          <div className="logo-body">
            <img src={logoBody} alt="Logo Body" />
          </div>

          <div className="texto descripcion">
            <h1>Bienvenido al Sistema de Gestión de Biblioteca ULEAM</h1>
            <p>
              Esta plataforma ha sido diseñada para facilitar el acceso, consulta y administración del catálogo de libros,
              materiales académicos y recursos digitales de la Universidad Laica Eloy Alfaro de Manabí. Con una interfaz intuitiva
              y moderna, los usuarios podrán registrarse, acceder a sus cuentas, buscar títulos disponibles, reservar ejemplares
              y gestionar préstamos desde cualquier dispositivo con conexión a internet.
            </p>
            <p>
              El sistema busca optimizar los procesos bibliotecarios, reduciendo el tiempo de atención, mejorando la organización
              del inventario y asegurando la disponibilidad de los recursos. También proporciona estadísticas de uso, reportes 
              automáticos y funciones de notificación tanto para estudiantes como para el personal bibliotecario.
            </p>
            <p>
              Esta herramienta forma parte del compromiso de la ULEAM con la innovación educativa, garantizando un servicio más
              eficiente y accesible a toda la comunidad universitaria.
            </p>
          </div>
        </div>

        <footer>
          <div className="footer-container">
            <div className="footer-left">
              <img src={logoFooter} alt="Logo Biblioteca ULEAM" className="footer-logo" />
              <nav>
                <Link to="/">Inicio</Link>
                <Link to="/registro">Registrarse</Link>
                <Link to="/sesion">Acceder</Link>
              </nav>
            </div>

            <div className="footer-right">
              <div className="contact-info">
                <p><strong>Contactar</strong></p>
                <p>Av. Circunvalación Vía a San Mateo</p>
                <p>
                  Correo electrónico: 
                  <a href="mailto:incidencias.diit@uleam.edu.ec"> incidencias.diit@uleam.edu.ec</a>
                </p>
              </div>
              <div className="social-links">
                <a href="https://www.facebook.com" target="_blank" className="social-link" rel="noreferrer">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="https://www.twitter.com" target="_blank" className="social-link" rel="noreferrer">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com" target="_blank" className="social-link" rel="noreferrer">
                  <i className="fa-brands fa-instagram"></i>
                </a>
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

  export default Hero;