  import { useEffect, useRef, useState } from 'react';
  import logo from '../assets/img/logo.png';
  import logoFooter from '../assets/img/logo_footer.png';
  import { FaPaperPlane, FaUserSlash } from "react-icons/fa";
  import '../assets/css/gestionar_usuario.css';
  import { useLocation } from "react-router-dom";

  const usuariosIniciales = [
    {
      id: 1,
      nombre: "Anthony Jordano Pico Baque",
      cedula: "1350468367",
      correo: "e1350468367@live.uleam.edu.ec",
      administrador: true,
      libros: [
        { titulo: "Fundamentos de Programación", diasRestantes: 4, fechaAlquiler: "26/05/2025" },
        { titulo: "Circuitos Eléctricos I", diasRestantes: 2, fechaAlquiler: "28/05/2025" }
      ],
      mensaje: ""
    },
    {
      id: 2,
      nombre: "Ana Lucia Torres Velazquez",
      cedula: "1350826481",
      correo: "e1350826481@live.uleam.edu.ec",
      administrador: false,
      libros: [
        { titulo: "Anatomía Humana", diasRestantes: 3, fechaAlquiler: "25/05/2025" },
        { titulo: "Fisiología Médica", diasRestantes: 1, fechaAlquiler: "27/05/2025" }
      ],
      mensaje: ""
    },
  ];

  function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const adminButtonsRef = useRef(null);
    const location = useLocation();
    
    // Estados para los modales
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(''); // 'admin' o 'delete'

    useEffect(() => {
      try {
        const data = JSON.parse(localStorage.getItem("usuarios"));
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
          setUsuarios(usuariosIniciales);
        }
      } catch (error) {
        console.error("Error cargando usuarios del localStorage:", error);
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
        setUsuarios(usuariosIniciales);
      }
    }, []);

    const handleFiltro = (e) => setFiltro(e.target.value.toLowerCase());

    const openAdminModal = (user) => {
      setSelectedUser(user);
      setActionType('admin');
      setShowAdminModal(true);
    };

    const openDeleteModal = (user) => {
      setSelectedUser(user);
      setActionType('delete');
      setShowDeleteModal(true);
    };

    const closeModal = () => {
      setShowAdminModal(false);
      setShowDeleteModal(false);
      setSelectedUser(null);
    };

    const confirmAction = () => {
      if (actionType === 'admin' && selectedUser) {
        const actualizados = usuarios.map(user =>
          user.id === selectedUser.id ? { ...user, administrador: !user.administrador } : user
        );
        setUsuarios(actualizados);
        localStorage.setItem("usuarios", JSON.stringify(actualizados));
      } else if (actionType === 'delete' && selectedUser) {
        const actualizados = usuarios.filter(user => user.id !== selectedUser.id);
        setUsuarios(actualizados);
        localStorage.setItem("usuarios", JSON.stringify(actualizados));
      }
      closeModal();
    };

    const enviarAviso = (id, mensaje) => {
      alert(`Mensaje enviado al usuario ${id}:\n${mensaje}`);
      const actualizados = usuarios.map(user =>
        user.id === id ? { ...user, mensaje: "" } : user
      );
      setUsuarios(actualizados);
    };

    const actualizarMensaje = (id, nuevoMensaje) => {
      const actualizados = usuarios.map(user =>
        user.id === id ? { ...user, mensaje: nuevoMensaje } : user
      );
      setUsuarios(actualizados);
    };

    const usuariosFiltrados = usuarios.filter(user =>
      `${user.nombre} ${user.cedula} ${user.correo}`.toLowerCase().includes(filtro)
    );

    return (
      <>
        <header>
          <a href="/inicio">
            <img src={logo} alt="Logo" className="logo-img" />
          </a>

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

        <h2>Panel de Gestión de Usuarios</h2>
        <p className="descripcion-admin">
          Aquí podrás visualizar qué libros han alquilado, enviarles avisos, asignarles el rol de administrador o eliminarlos del sistema.
        </p>

        <input
          type="text"
          className="buscador-usuarios"
          placeholder="🔍 Buscar usuario por nombre, cédula o correo"
          value={filtro}
          onChange={handleFiltro}
        />

        {usuariosFiltrados.map(user => (
          <div className="usuario-card" key={user.id}>
            <div className="info-usuario">
              <h3>{user.nombre}</h3>
              <p><i className="fa-regular fa-id-card"></i> {user.cedula}</p>
              <p><i className="fa-regular fa-envelope"></i> {user.correo}</p>
            </div>

  <div className="libros-alquilados">
    <p><strong>Libros Alquilados</strong></p>
    <ul>
      {user.libros.map((libro, idx) => (
        <li key={idx}>
          <span>{libro.titulo}</span>
          <span>{libro.diasRestantes} días restantes (Alquilado: {libro.fechaAlquiler})</span>
        </li>
      ))}
    </ul>
  </div>

            <div className="acciones-usuario">
              <label>
                <input
                  type="checkbox"
                  checked={user.administrador}
                  onChange={() => openAdminModal(user)}
                />
                Administrador
              </label>
              <textarea
                placeholder="Escribir mensaje de aviso..."
                value={user.mensaje}
                onChange={(e) => actualizarMensaje(user.id, e.target.value)}
              />
              <div className="botones-usuario">
                <button className="btn-aviso" onClick={() => enviarAviso(user.id, user.mensaje)}>
                  <FaPaperPlane /> Enviar Aviso
                </button>
                <button className="btn-eliminar" onClick={() => openDeleteModal(user)}>
                  <FaUserSlash /> Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Modal para confirmar cambio de rol */}
        {showAdminModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h3>Confirmar cambio de rol</h3>
              <p>
                ¿Estás seguro de {selectedUser.administrador ? 'quitarle' : 'asignarle'} el rol de ADMINISTRADOR a {selectedUser.nombre}?
              </p>
              <div className="modal-buttons">
                <button className="btn-cancelar" onClick={closeModal}>Cancelar</button>
                <button className="btn-confirmar" onClick={confirmAction}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para confirmar eliminación */}
        {showDeleteModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h3>Confirmar eliminación</h3>
              <p>
                ¿Estás seguro de eliminar permanentemente al usuario {selectedUser.nombre}?
                <br />
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
              <div className="modal-buttons">
                <button className="btn-cancelar" onClick={closeModal}>Cancelar</button>
                <button className="btn-confirmar" onClick={confirmAction}>Eliminar</button>
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

  export default GestionUsuarios;