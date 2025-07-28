  import { useState } from 'react';
  import '../assets/css/recuperacion.css';
  import { Link, useNavigate } from 'react-router-dom';
  import logo from '../assets/img/logo.png';
  import logoFooter from '../assets/img/logo_footer.png';

  const Recuperacion = () => {
    const [formData, setFormData] = useState({
      correo: '',
      claveCorreo: '',
      nueva: '',
      confirmar: ''
    });

    const [errores, setErrores] = useState({});
    const [mensajeExito, setMensajeExito] = useState('');
    const navigate = useNavigate();


    const dominioInstitucional = /@live\.uleam\.edu\.ec$/;

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrores({});
    setMensajeExito('');

    const nuevosErrores = {};

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.correo === formData.correo.trim());

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo institucional es obligatorio.';
    } else if (!dominioInstitucional.test(formData.correo)) {
      nuevosErrores.correo = 'Debe ingresar un correo institucional válido.';
    } else if (!usuario) {
      nuevosErrores.correo = 'El correo no está registrado.';
    }

    if (!formData.claveCorreo.trim()) {
      nuevosErrores.claveCorreo = 'La contraseña del correo es obligatoria.';
    } else if (usuario && formData.claveCorreo !== usuario.claveCorreo) {
      nuevosErrores.claveCorreo = 'La contraseña del correo es incorrecta.';
    }

    if (!formData.nueva.trim()) {
      nuevosErrores.nueva = 'Debe ingresar una nueva contraseña.';
    }

    if (!formData.confirmar.trim()) {
      nuevosErrores.confirmar = 'Debe confirmar la nueva contraseña.';
    } else if (formData.nueva !== formData.confirmar) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // ✅ Actualizar la contraseña en el usuario encontrado
    const nuevosUsuarios = usuarios.map(u => {
      if (u.correo === formData.correo.trim()) {
        return { ...u, password: formData.nueva.trim() };
      }
      return u;
    });

    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
    setMensajeExito('✅ Contraseña actualizada correctamente.');

    setTimeout(() => {
      navigate('/sesion');
    }, 2000);
  };


    return (
      <>
        <header>
          <div className="logo">
            <img src={logo} alt="Logo Biblioteca ULEAM" className="logo-img" />
          </div>
          <nav>
            <Link to="/"><button>INICIO</button></Link>
            <Link to="/registro"><button>REGISTRARSE</button></Link>
            <Link to="/sesion"><button>ACCEDER</button></Link>
          </nav>
        </header>

          <div className="form-container">
            <form className="registro-form" onSubmit={handleSubmit} noValidate>
              <h2>Recuperar Contraseña</h2>

              <label htmlFor="correo">Correo institucional</label>
              <input type="email" id="correo" value={formData.correo} onChange={handleChange} placeholder="correo@uleam.edu.ec" />
              {errores.correo && <div className="mensaje-error">{errores.correo}</div>}

              <label htmlFor="claveCorreo">Contraseña del correo institucional</label>
              <input type="password" id="claveCorreo" value={formData.claveCorreo} onChange={handleChange} placeholder="Contraseña actual del correo" />
              {errores.claveCorreo && <div className="mensaje-error">{errores.claveCorreo}</div>}

              <label htmlFor="nueva">Nueva contraseña</label>
              <input type="password" id="nueva" value={formData.nueva} onChange={handleChange} placeholder="Nueva contraseña" />
              {errores.nueva && <div className="mensaje-error">{errores.nueva}</div>}

              <label htmlFor="confirmar">Confirmar nueva contraseña</label>
              <input type="password" id="confirmar" value={formData.confirmar} onChange={handleChange} placeholder="Confirmar nueva contraseña" />
              {errores.confirmar && <div className="mensaje-error">{errores.confirmar}</div>}

              <button type="submit">Restablecer contraseña</button>

              {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

              <div className="login-links">
                <Link to="/sesion">¿Ya la recuperaste? Iniciar sesión</Link>
              </div>
            </form>
          </div>

        <footer>
          <div className="footer-container">
            <div className="footer-left">
              <img src={logoFooter} alt="Logo Footer" className="footer-logo" />
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
                  Correo electrónico: <a href="mailto:incidencias.diit@uleam.edu.ec">incidencias.diit@uleam.edu.ec</a>
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
  };

  export default Recuperacion;
