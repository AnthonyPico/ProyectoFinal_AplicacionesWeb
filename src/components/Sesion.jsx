import '../assets/css/sesion.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import logoFooter from '../assets/img/logo_footer.png';

const Sesion = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const validar = () => {
    const erroresTemp = {};
    const dominioInstitucional = /@live\.uleam\.edu\.ec$/;

    if (!email.trim()) {
      erroresTemp.email = 'El correo es obligatorio.';
    } else if (!dominioInstitucional.test(email.trim())) {
      erroresTemp.email = 'Debe usar un correo institucional de ULEAM.';
    }

    if (!password.trim()) {
      erroresTemp.password = 'La contraseña es obligatoria.';
    }

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const usuario = usuarios.find(
      (u) => u.correo === email.trim() && u.password === password.trim()
    );

    if (usuario) {
      const rol = usuario.administrador ? 'admin' : 'normal';
      localStorage.setItem('usuarioActual', usuario.correo);
      localStorage.setItem('rolUsuario', rol);
      navigate('/inicio');
    } else {
      setErrores({ password: 'Correo o contraseña incorrectos.' });
    }
  };

  return (
    <>
      <header className="sesion-header">
        <div className="sesion-logo">
          <Link to="/">
            <img src={logo} alt="Newsflix Logo" className="sesion-logo-img" />
          </Link>
        </div>
        <nav className="sesion-nav">
          <Link to="/"><button className="sesion-nav-button">INICIO</button></Link>
          <Link to="/registro"><button className="sesion-nav-button">REGISTRARSE</button></Link>
          <Link to="/sesion"><button className="sesion-nav-button">ACCEDER</button></Link>
        </nav>
      </header>

      <main className="sesion-main">
        <div className="sesion-form-container">
          <form className="sesion-form" onSubmit={handleSubmit} noValidate>
            <h2 className="sesion-form-title">Iniciar Sesión</h2>

            <div className="sesion-form-group">
              <label htmlFor="login-email" className="sesion-form-label">Correo Institucional</label>
              <input
                type="email"
                id="login-email"
                name="email"
                className={`sesion-form-input ${errores.email ? 'sesion-input-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errores.email && <div className="sesion-mensaje-error">{errores.email}</div>}
            </div>

            <div className="sesion-form-group">
              <label htmlFor="login-password" className="sesion-form-label">Contraseña</label>
              <input
                type="password"
                id="login-password"
                name="password"
                className={`sesion-form-input ${errores.password ? 'sesion-input-error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errores.password && <div className="sesion-mensaje-error">{errores.password}</div>}
            </div>

            <button type="submit" className="sesion-submit-button">Ingresar</button>

            <div className="sesion-form-links">
              <Link to="/registro" className="sesion-form-link">¿No tienes cuenta? Regístrate</Link>
              <Link to="/recuperacion" className="sesion-form-link">¿Olvidaste tu contraseña?</Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="sesion-footer">
        <div className="sesion-footer-container">
          <div className="sesion-footer-left">
            <img src={logoFooter} alt="Logo Biblioteca ULEAM" className="sesion-footer-logo" />
            <nav className="sesion-footer-nav">
              <Link to="/" className="sesion-footer-link">Inicio</Link>
              <Link to="/registro" className="sesion-footer-link">Registrarse</Link>
              <Link to="/sesion" className="sesion-footer-link">Acceder</Link>
            </nav>
          </div>

          <div className="sesion-footer-right">
            <div className="sesion-contact-info">
              <p className="sesion-contact-title"><strong>Contactar</strong></p>
              <p className="sesion-contact-text">Av. Circunvalación Vía a San Mateo</p>
              <p className="sesion-contact-text">
                Correo electrónico:{' '}
                <a href="mailto:incidencias.diit@uleam.edu.ec" className="sesion-contact-email">
                  incidencias.diit@uleam.edu.ec
                </a>
              </p>
            </div>
            <div className="sesion-social-links">
              <a href="https://www.facebook.com" target="_blank" className="sesion-social-link" rel="noreferrer">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" className="sesion-social-link" rel="noreferrer">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" className="sesion-social-link" rel="noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="sesion-footer-bottom">
          <p className="sesion-copyright">© 2025 Universidad Laica Eloy Alfaro de Manabí. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default Sesion;