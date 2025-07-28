  import { useState } from 'react';
  import { Link } from 'react-router-dom';
  import '../assets/css/registro.css';
  import logo from '../assets/img/logo.png';
  import logoFooter from '../assets/img/logo_footer.png';

  const Registro = () => {
    const [formulario, setFormulario] = useState({
      nombres: '',
      apellidos: '',
      email: '',
      claveCorreo: '',
      cedula: '',
      password: '',
      confirmar: '',
      facultad: '',
    });

    const [errores, setErrores] = useState({});
    const [exito, setExito] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState({
      password: false,
      confirmar: false,
      claveCorreo: false,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormulario({ ...formulario, [name]: value });
      setErrores({ ...errores, [name]: '' });
    };

    const togglePassword = (campo) => {
      setMostrarPassword((prev) => ({
        ...prev,
        [campo]: !prev[campo],
      }));
    };

    const validar = () => {
      const nuevosErrores = {};
      const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;

      if (!formulario.nombres.trim()) {
        nuevosErrores.nombres = 'Ingrese sus nombres';
      } else if (!soloLetras.test(formulario.nombres)) {
        nuevosErrores.nombres = 'Solo letras permitidas';
      }

      if (!formulario.apellidos.trim()) {
        nuevosErrores.apellidos = 'Ingrese sus apellidos';
      } else if (!soloLetras.test(formulario.apellidos)) {
        nuevosErrores.apellidos = 'Solo letras permitidas';
      }

      if (!formulario.email.trim()) {
        nuevosErrores.email = 'Ingrese su correo';
      } else if (!formulario.email.toLowerCase().endsWith('@live.uleam.edu.ec')) {
        nuevosErrores.email = 'Solo correo institucional';
      }

      if (!formulario.claveCorreo.trim()) {
        nuevosErrores.claveCorreo = 'Ingrese contraseña de correo';
      } else if (formulario.claveCorreo.length < 6) {
        nuevosErrores.claveCorreo = 'Mínimo 6 caracteres';
      }

      if (!formulario.cedula.trim()) {
        nuevosErrores.cedula = 'Ingrese su cédula';
      } else if (!/^\d{10}$/.test(formulario.cedula)) {
        nuevosErrores.cedula = 'Cédula inválida (10 dígitos)';
      }

      if (!formulario.password.trim()) {
        nuevosErrores.password = 'Ingrese una contraseña';
      } else if (formulario.password.length < 8) {
        nuevosErrores.password = 'Mínimo 8 caracteres';
      }

      if (!formulario.confirmar.trim()) {
        nuevosErrores.confirmar = 'Confirme su contraseña';
      } else if (formulario.password !== formulario.confirmar) {
        nuevosErrores.confirmar = 'Las contraseñas no coinciden';
      }

      if (!formulario.facultad) {
        nuevosErrores.facultad = 'Seleccione su facultad';
      }

      setErrores(nuevosErrores);
      return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setExito('');

      if (validar()) {
        const nuevoUsuario = {
          id: Date.now(),
          nombres: formulario.nombres,
          apellidos: formulario.apellidos,
          nombre: `${formulario.nombres} ${formulario.apellidos}`,
          cedula: formulario.cedula,
          correo: formulario.email,
          claveCorreo: formulario.claveCorreo,
          password: formulario.password,
          facultad: formulario.facultad,
          administrador: false,
          libros: [],
          mensaje: "",
        };

        const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuariosGuardados.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

        setExito('✅ Registro exitoso. Redirigiendo...');
        
        setTimeout(() => {
          window.location.href = '/sesion';
        }, 2000);

        setFormulario({
          nombres: '',
          apellidos: '',
          email: '',
          claveCorreo: '',
          cedula: '',
          password: '',
          confirmar: '',
          facultad: '',
        });
      }
    };

    return (
      <>
        <header>
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Biblioteca ULEAM" className="logo-img" />
            </Link>
          </div>
          <nav>
            <Link to="/"><button className="nav-button">INICIO</button></Link>
            <Link to="/registro"><button className="nav-button">REGISTRARSE</button></Link>
            <Link to="/sesion"><button className="nav-button">ACCEDER</button></Link>
          </nav>
        </header>
        
        <section className="registro-section">
          <div className="registro-form-container">
            <form className="registro-form" onSubmit={handleSubmit} noValidate>
              <h2 className="registro-form-title">Crear Cuenta</h2>

              <div className="registro-form-group">
                <label htmlFor="nombres" className="registro-form-label">Nombres</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  className={`registro-form-input ${errores.nombres ? 'input-error' : ''}`}
                  value={formulario.nombres}
                  onChange={handleChange}
                  placeholder="Ej. Juan Carlos"
                />
                {errores.nombres && <span className="registro-error-message">{errores.nombres}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="apellidos" className="registro-form-label">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  className={`registro-form-input ${errores.apellidos ? 'input-error' : ''}`}
                  value={formulario.apellidos}
                  onChange={handleChange}
                  placeholder="Ej. Mera López"
                />
                {errores.apellidos && <span className="registro-error-message">{errores.apellidos}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="email" className="registro-form-label">Correo Institucional</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`registro-form-input ${errores.email ? 'input-error' : ''}`}
                  value={formulario.email}
                  onChange={handleChange}
                  placeholder="e1234567890@live.uleam.edu.ec"
                />
                {errores.email && <span className="registro-error-message">{errores.email}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="claveCorreo" className="registro-form-label">Contraseña del Correo</label>
                <div className="registro-password-wrapper">
                  <input
                    type={mostrarPassword.claveCorreo ? 'text' : 'password'}
                    id="claveCorreo"
                    name="claveCorreo"
                    className={`registro-form-input ${errores.claveCorreo ? 'input-error' : ''}`}
                    value={formulario.claveCorreo}
                    onChange={handleChange}
                    placeholder="Contraseña del correo"
                  />
                  <i
                    className={`fa ${mostrarPassword.claveCorreo ? 'fa-eye-slash' : 'fa-eye'} registro-password-toggle`}
                    onClick={() => togglePassword('claveCorreo')}
                  ></i>
                </div>
                {errores.claveCorreo && <span className="registro-error-message">{errores.claveCorreo}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="cedula" className="registro-form-label">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  className={`registro-form-input ${errores.cedula ? 'input-error' : ''}`}
                  value={formulario.cedula}
                  onChange={handleChange}
                  maxLength="10"
                  placeholder="10 dígitos"
                />
                {errores.cedula && <span className="registro-error-message">{errores.cedula}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="password" className="registro-form-label">Contraseña</label>
                <div className="registro-password-wrapper">
                  <input
                    type={mostrarPassword.password ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`registro-form-input ${errores.password ? 'input-error' : ''}`}
                    value={formulario.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <i
                    className={`fa ${mostrarPassword.password ? 'fa-eye-slash' : 'fa-eye'} registro-password-toggle`}
                    onClick={() => togglePassword('password')}
                  ></i>
                </div>
                {errores.password && <span className="registro-error-message">{errores.password}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="confirmar" className="registro-form-label">Confirmar Contraseña</label>
                <div className="registro-password-wrapper">
                  <input
                    type={mostrarPassword.confirmar ? 'text' : 'password'}
                    id="confirmar"
                    name="confirmar"
                    className={`registro-form-input ${errores.confirmar ? 'input-error' : ''}`}
                    value={formulario.confirmar}
                    onChange={handleChange}
                    placeholder="Repita su contraseña"
                  />
                  <i
                    className={`fa ${mostrarPassword.confirmar ? 'fa-eye-slash' : 'fa-eye'} registro-password-toggle`}
                    onClick={() => togglePassword('confirmar')}
                  ></i>
                </div>
                {errores.confirmar && <span className="registro-error-message">{errores.confirmar}</span>}
              </div>

              <div className="registro-form-group">
                <label htmlFor="facultad" className="registro-form-label">Facultad</label>
                <select
                  id="facultad"
                  name="facultad"
                  className={`registro-form-select ${errores.facultad ? 'input-error' : ''}`}
                  value={formulario.facultad}
                  onChange={handleChange}
                >
                  <option value="" disabled>Seleccione su facultad</option>
                  <option value="Ingeniería en TI">Ingeniería en TI</option>
                  <option value="Enfermería">Enfermería</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Educación Basica">Educación Basica</option>
                  <option value="Administración">Administración</option>
                </select>
                {errores.facultad && <span className="registro-error-message">{errores.facultad}</span>}
              </div>

              <button type="submit" className="registro-submit-button">Registrarse</button>
              {exito && <div className="registro-success-message">{exito}</div>}
            </form>
          </div>
        </section>

        <footer className="page-footer">
          <div className="footer-content">
            <div className="footer-section">
              <img src={logoFooter} alt="Logo ULEAM" className="footer-logo" />
              <nav className="footer-nav">
                <Link to="/" className="footer-link">Inicio</Link>
                <Link to="/registro" className="footer-link">Registrarse</Link>
                <Link to="/sesion" className="footer-link">Acceder</Link>
              </nav>
            </div>
            <div className="footer-section">
              <div className="contact-info">
                <h3 className="contact-title">Contacto</h3>
                <p className="contact-text">Av. Circunvalación Vía a San Mateo</p>
                <p className="contact-text">Email: <a href="mailto:incidencias.diit@uleam.edu.ec" className="contact-email">incidencias.diit@uleam.edu.ec</a></p>
              </div>
              <div className="social-media">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">© 2025 Universidad Laica Eloy Alfaro de Manabí</p>
          </div>
        </footer>
      </>
    );
  };

  export default Registro;