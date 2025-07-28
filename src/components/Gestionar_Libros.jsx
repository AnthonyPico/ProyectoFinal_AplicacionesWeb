    import logo from '../assets/img/logo.png';
    import logoFooter from '../assets/img/logo_footer.png';
    import '../assets/css/gestionar_libros.css';
    import  { useEffect, useState } from "react";
    import { useRef } from 'react'; // asegúrate de tener esto





    function GestionLibros() {
        const adminButtonsRef = useRef(null);

      const [libros, setLibros] = useState([]);
      const [mostrarModal, setMostrarModal] = useState(false);
      const [busqueda, setBusqueda] = useState("");
      
      const [formulario, setFormulario] = useState({
        
        
        titulo: "",
        autor: "",
        fecha: "",
        genero: "",
        imagen: "",
        estrellas: 3,
        stock: 1,
        descripcion: "",
        recomendado: false  // <-- nuevo campo

        
      });
      const [errores, setErrores] = useState({});
      const [libroEditando, setLibroEditando] = useState(null);


      useEffect(() => {
        const data = JSON.parse(localStorage.getItem("libros"));
        if (data) setLibros(data);
      }, []);

      useEffect(() => {
        localStorage.setItem("libros", JSON.stringify(libros));
      }, [libros]);

      const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
          const reader = new FileReader();
          reader.onload = () => {
            setFormulario({ ...formulario, imagen: reader.result });
          };
          if (files[0]) reader.readAsDataURL(files[0]);
        } else {
          setFormulario({ ...formulario, [name]: value });
        }
      };




      const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.titulo.trim()) nuevosErrores.titulo = "Ingresa el título.";
        if (!formulario.autor.trim()) nuevosErrores.autor = "Ingresa el autor.";
        if (!/^\d{4}$/.test(formulario.fecha)) nuevosErrores.fecha = "Año inválido (ej: 2020).";
        if (!formulario.genero.trim()) nuevosErrores.genero = "Ingresa el género.";
        if (!formulario.imagen) nuevosErrores.imagen = "Selecciona una imagen.";
        if (!formulario.descripcion.trim()) nuevosErrores.descripcion = "Agrega una descripción.";
        if (!formulario.stock || formulario.stock < 1) nuevosErrores.stock = "Stock inválido.";
        if (!formulario.estrellas || formulario.estrellas < 1 || formulario.estrellas > 5)
          nuevosErrores.estrellas = "Estrellas entre 1 y 5.";

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
      };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validarFormulario()) return;

      if (libroEditando) {
        const librosActualizados = libros.map((l) =>
          l.id === libroEditando.id ? { ...formulario, id: libroEditando.id } : l
        );
        setLibros(librosActualizados);
      } else {
        const nuevoLibro = {
          ...formulario,
          id: Date.now(),
        };
        setLibros([...libros, nuevoLibro]);
      }

      // Limpiar formulario y cerrar modal
      resetFormulario();
      setMostrarModal(false);
    };

    // Función auxiliar para resetear el formulario
    const resetFormulario = () => {
      setFormulario({
        titulo: "",
        autor: "",
        fecha: "",
        genero: "",
        imagen: "",
        estrellas: 3,
        stock: 1,
        descripcion: "",
        recomendado: false,
      });
      setLibroEditando(null); // Importante: resetear el libro en edición
    };


      const handleEliminar = (id) => {
        if (confirm("¿Eliminar este libro?")) {
          setLibros(libros.filter((libro) => libro.id !== id));
        }
      };
    const handleEditar = (libro) => {
      setFormulario({
        ...libro,
        recomendado: libro.recomendado ?? false // Si no existe, lo pone en false
      });
      setLibroEditando(libro);
      setMostrarModal(true);
    };


      const librosFiltrados = libros.filter((libro) =>
        `${libro.titulo} ${libro.autor} ${libro.genero}`.toLowerCase().includes(busqueda.toLowerCase())
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

            <h2>Gestión de Libros</h2>
            <p>Sube, edita o elimina libros del sistema. Usa el buscador para filtrar.</p>

            <div className="barra-superior">
              <input
                type="text"
                placeholder="Buscar libro por título, autor o género..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button onClick={() => setMostrarModal(true)}>
                <i className="fa fa-plus" /> Subir Nuevo Libro
              </button>
            </div>

            <div className="grid-libros">
              {librosFiltrados.map((libro) => (
                <div key={libro.id} className="libro-card">
                  <img src={libro.imagen} alt={libro.titulo} />
                  <div className="info-libro">
                    <h3>{libro.titulo}</h3>
                    <p><strong>Autor:</strong> {libro.autor}</p>
                    <p><strong>Fecha:</strong> {libro.fecha}</p>
                    <p><strong>Género:</strong> {libro.genero}</p>
                    <p><strong>Estrellas:</strong> {libro.estrellas}</p>
                    <p><strong>Stock:</strong> {libro.stock}</p>
                    <p>{libro.descripcion}</p>
                  </div>
                  <div className="acciones-libro">
                    <button onClick={() => handleEditar(libro)}>
      <i className="fa fa-pen" /> Editar
    </button>
                    <button onClick={() => handleEliminar(libro.id)}><i className="fa fa-trash" /> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
      

          {mostrarModal && (
            <div className="modal-libro">
              <div className="modal-contenido">
    <span 
      onClick={() => {
        resetFormulario();
        setMostrarModal(false);
      }} 
      className="librocerrar-modal"
    >
      <i className="fa-solid fa-xmark"></i>
    </span>
            

    <h3>Subir Nuevo Libro</h3>
                <form onSubmit={handleSubmit}>
                  <input name="titulo" value={formulario.titulo} onChange={handleInputChange} placeholder="Título" />
                  {errores.titulo && <span>{errores.titulo}</span>}

                  <input name="autor" value={formulario.autor} onChange={handleInputChange} placeholder="Autor" />
                  {errores.autor && <span>{errores.autor}</span>}

                  <input name="fecha" value={formulario.fecha} onChange={handleInputChange} placeholder="Año (ej: 2020)" />
                  {errores.fecha && <span>{errores.fecha}</span>}

                  <input name="genero" value={formulario.genero} onChange={handleInputChange} placeholder="Género" />
                  {errores.genero && <span>{errores.genero}</span>}

      <div className="form-group">
      <label>Stock:</label>
      <input 
        name="stock" 
        type="number" 
        value={formulario.stock} 
        onChange={handleInputChange} 
        placeholder="Cantidad en stock" 
        min="1"
      />
      {errores.stock && <span className="error-message">{errores.stock}</span>}
    </div>

    <div className="form-group">
      <label>Calificación (Estrellas):</label>
      <input 
        name="estrellas" 
        type="number" 
        value={formulario.estrellas} 
        onChange={handleInputChange} 
        placeholder="Estrellas (1-5)" 
        min="1" 
        max="5"
      />
      {errores.estrellas && <span className="error-message">{errores.estrellas}</span>}
    </div>
                  <textarea name="descripcion" value={formulario.descripcion} onChange={handleInputChange} placeholder="Información del producto" />
                  {errores.descripcion && <span>{errores.descripcion}</span>}

                  <input name="imagen" type="file" accept="image/*" onChange={handleInputChange} />
                  {errores.imagen && <span>{errores.imagen}</span>}

                  {formulario.imagen && (
                    <div className="preview-img">
                      <img src={formulario.imagen} alt="Preview" />
                    </div>
                  )}

                  <label>
      <input
        type="checkbox"
        name="recomendado"
        checked={formulario.recomendado}
        onChange={(e) =>
          setFormulario({ ...formulario, recomendado: e.target.checked })
        }
      />
      ¿Es un libro recomendado?
    </label>


    <button type="submit">{libroEditando ? "Guardar Cambios" : "Subir"}</button>
                </form>
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

    export default GestionLibros;
