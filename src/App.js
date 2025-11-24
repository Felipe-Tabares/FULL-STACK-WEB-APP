import React, { useState, useEffect } from 'react';
import './App.css';
// Importar el servicio de almacenamiento de datos
import {
  obtenerTareas as obtenerTareasLS,
  crearTarea as crearTareaLS,
  actualizarTarea as actualizarTareaLS,
  eliminarTarea as eliminarTareaLS
} from './services/localStorageService';
// El backend PHP/MySQL está disponible como referencia/backup

function App() {
  // Estados de React (Hooks)
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // useEffect se ejecuta cuando el componente se monta (equivalente a componentDidMount)
  useEffect(() => {
    cargarTareas();
  }, []);

  // Función para cargar todas las tareas
  const cargarTareas = async () => {
    setCargando(true);
    setError(null);
    
    try {
      // Simular un pequeño delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Obtener tareas
      const datos = obtenerTareasLS();
      
      // Ordenar por ID descendente (más recientes primero)
      const tareasOrdenadas = datos.sort((a, b) => b.id - a.id);
      
      setTareas(tareasOrdenadas);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Función para crear una nueva tarea
  const crearTarea = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      setError('El título no puede estar vacío');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Crear tarea
      const resultado = await crearTareaLS(titulo.trim());

      // Recargar todas las tareas para mantener el orden
      const todasLasTareas = obtenerTareasLS();
      setTareas(todasLasTareas.sort((a, b) => b.id - a.id));
      
      setTitulo(''); // Limpiar el input
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Función para alternar el estado de completada
  const toggleCompletada = async (id, completadaActual) => {
    setCargando(true);
    setError(null);

    try {
      // Actualizar tarea
      const tareaActualizada = await actualizarTareaLS(id, {
        completada: !completadaActual
      });

      // Actualizar la tarea en el estado
      setTareas(tareas.map(tarea => 
        tarea.id === id ? tareaActualizada : tarea
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Función para eliminar una tarea
  const eliminarTarea = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Eliminar tarea
      await eliminarTareaLS(id);

      // Eliminar la tarea del estado
      setTareas(tareas.filter(tarea => tarea.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Tareas</h1>
        <p>Gestiona tus tareas diarias de forma eficiente</p>
      </header>

      <main className="App-main">
        {/* Formulario para agregar tareas */}
        <section className="form-section" aria-label="Formulario de nueva tarea">
          <form onSubmit={crearTarea} className="tarea-form">
            <label htmlFor="titulo-input" className="sr-only">
              Título de la tarea
            </label>
            <input
              id="titulo-input"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Escribe una nueva tarea..."
              className="titulo-input"
              disabled={cargando}
              aria-required="true"
            />
            <button
              type="submit"
              className="btn-agregar"
              disabled={cargando || !titulo.trim()}
              aria-label="Agregar tarea"
            >
              {cargando ? 'Agregando...' : 'Agregar Tarea'}
            </button>
          </form>
        </section>

        {/* Mensaje de error */}
        {error && (
          <div className="mensaje-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {/* Lista de tareas */}
        <section className="tareas-section" aria-label="Lista de tareas">
          {cargando && tareas.length === 0 ? (
            <p className="mensaje-carga">Cargando tareas...</p>
          ) : tareas.length === 0 ? (
            <p className="mensaje-vacio">No hay tareas. ¡Agrega una nueva!</p>
          ) : (
            <ul className="tareas-lista" role="list">
              {tareas.map((tarea) => (
                <li key={tarea.id} className="tarea-item" role="listitem">
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => toggleCompletada(tarea.id, tarea.completada)}
                    id={`tarea-${tarea.id}`}
                    className="checkbox-tarea"
                    aria-label={`Marcar tarea "${tarea.titulo}" como ${tarea.completada ? 'pendiente' : 'completada'}`}
                  />
                  <label
                    htmlFor={`tarea-${tarea.id}`}
                    className={`tarea-titulo ${tarea.completada ? 'completada' : ''}`}
                  >
                    {tarea.titulo}
                  </label>
                  <button
                    onClick={() => eliminarTarea(tarea.id)}
                    className="btn-eliminar"
                    aria-label={`Eliminar tarea "${tarea.titulo}"`}
                    disabled={cargando}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Contador de tareas */}
        {tareas.length > 0 && (
          <footer className="App-footer">
            <p>
              Total: {tareas.length} | 
              Completadas: {tareas.filter(t => t.completada).length} | 
              Pendientes: {tareas.filter(t => !t.completada).length}
            </p>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;

// NOTAS EDUCATIVAS:
// - useState: Hook para manejar el estado del componente
// - useEffect: Hook para efectos secundarios (como cargar datos al montar)
// - React usa un DOM Virtual para optimizar las actualizaciones
// - Solo se re-renderizan los componentes cuyo estado cambió
// - Los datos se guardan automáticamente en el sistema de almacenamiento

