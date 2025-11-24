// localStorageService.js
// Servicio para manejar las tareas en Local Storage
// Simula las operaciones CRUD usando localStorage del navegador

const STORAGE_KEY = 'tareas-app';

// Función auxiliar para obtener el siguiente ID disponible
const getNextId = () => {
  const tareas = obtenerTareas();
  if (tareas.length === 0) return 1;
  const maxId = Math.max(...tareas.map(t => t.id));
  return maxId + 1;
};

// CREATE - Crear una nueva tarea
export const crearTarea = (titulo) => {
  try {
    // Validar que el título no esté vacío
    if (!titulo || !titulo.trim()) {
      throw new Error('El título no puede estar vacío');
    }

    // Obtener las tareas actuales
    const tareas = obtenerTareas();
    
    // Crear la nueva tarea
    const nuevaTarea = {
      id: getNextId(),
      titulo: titulo.trim(),
      completada: false,
      creada_en: new Date().toISOString(),
      actualizada_en: new Date().toISOString()
    };

    // Agregar la nueva tarea al principio del array
    const nuevasTareas = [nuevaTarea, ...tareas];
    
    // Guardar en Local Storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasTareas));
    
    // Retornar la tarea creada (simulando respuesta de API)
    return Promise.resolve({
      mensaje: 'Tarea creada exitosamente',
      ...nuevaTarea
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// READ - Obtener todas las tareas
export const obtenerTareas = () => {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    
    // Si no hay datos, retornar array vacío
    if (!datos) {
      return [];
    }

    // Parsear el JSON almacenado
    const tareas = JSON.parse(datos);
    
    // Validar que sea un array
    if (!Array.isArray(tareas)) {
      // Si no es un array, limpiar y retornar vacío
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return tareas;
  } catch (error) {
    console.error('Error al leer tareas del Local Storage:', error);
    // En caso de error, limpiar y retornar array vacío
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

// READ BY ID - Obtener una tarea específica
export const obtenerTareaPorId = (id) => {
  const tareas = obtenerTareas();
  return tareas.find(tarea => tarea.id === id);
};

// UPDATE - Actualizar una tarea
export const actualizarTarea = (id, datosActualizacion) => {
  try {
    const tareas = obtenerTareas();
    const indice = tareas.findIndex(t => t.id === id);

    if (indice === -1) {
      throw new Error('Tarea no encontrada');
    }

    // Actualizar la tarea
    const tareaActualizada = {
      ...tareas[indice],
      ...datosActualizacion,
      actualizada_en: new Date().toISOString()
    };

    // Si se está actualizando el título, validar que no esté vacío
    if (datosActualizacion.titulo !== undefined) {
      if (!datosActualizacion.titulo || !datosActualizacion.titulo.trim()) {
        throw new Error('El título no puede estar vacío');
      }
      tareaActualizada.titulo = datosActualizacion.titulo.trim();
    }

    // Reemplazar la tarea en el array
    tareas[indice] = tareaActualizada;

    // Guardar en Local Storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));

    return Promise.resolve(tareaActualizada);
  } catch (error) {
    return Promise.reject(error);
  }
};

// DELETE - Eliminar una tarea
export const eliminarTarea = (id) => {
  try {
    const tareas = obtenerTareas();
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
      throw new Error('Tarea no encontrada');
    }

    // Filtrar la tarea eliminada
    const nuevasTareas = tareas.filter(t => t.id !== id);

    // Guardar en Local Storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasTareas));

    return Promise.resolve({
      mensaje: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// Función auxiliar para limpiar todas las tareas (útil para testing/reset)
export const limpiarTodasLasTareas = () => {
  localStorage.removeItem(STORAGE_KEY);
  return Promise.resolve({ mensaje: 'Todas las tareas han sido eliminadas' });
};

// Función para exportar tareas a JSON (útil para backup)
export const exportarTareas = () => {
  const tareas = obtenerTareas();
  const json = JSON.stringify(tareas, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tareas-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Función para importar tareas desde JSON
export const importarTareas = (jsonString) => {
  try {
    const tareasImportadas = JSON.parse(jsonString);
    
    if (!Array.isArray(tareasImportadas)) {
      throw new Error('El archivo no contiene un array de tareas válido');
    }

    // Validar estructura básica de las tareas
    const tareasValidas = tareasImportadas.filter(tarea => {
      return tarea.titulo && typeof tarea.titulo === 'string';
    });

    // Guardar en Local Storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareasValidas));

    return Promise.resolve({
      mensaje: `${tareasValidas.length} tareas importadas exitosamente`,
      tareas: tareasValidas
    });
  } catch (error) {
    return Promise.reject(new Error('Error al importar tareas: ' + error.message));
  }
};

// NOTAS EDUCATIVAS:
// - localStorage es una API del navegador para almacenar datos localmente
// - Los datos persisten incluso después de cerrar el navegador
// - localStorage solo almacena strings, por eso usamos JSON.stringify/parse
// - La capacidad máxima es típicamente 5-10MB por dominio
// - Los datos son específicos del dominio y navegador
// - localStorage es síncrono (bloquea el hilo principal)
// - Para datos sensibles, usar sessionStorage o cookies seguras

