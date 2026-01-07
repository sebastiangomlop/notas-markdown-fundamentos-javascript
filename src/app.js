// ============================================
// SISTEMA DE NOTAS MARKDOWN
// ============================================

const STORAGE_KEY = 'markdown-notes';
let currentNoteId = null;

// --------------------------------------------
// UTILIDADES DE TEXTO
// --------------------------------------------

/**
 * Extrae el título de una nota desde su contenido
 * @param {string} content - Contenido de la nota
 * @returns {string} Título derivado del contenido
 */
function deriveTitle(content) {
  if (content === '' || content === null || content === undefined) {
    return 'Sin título';
  }

  const cleanContent = content.trim();

  if (cleanContent === '') {
    return 'Sin título';
  }

  let firstLine = '';
  let foundNewLine = false;

  for (let i = 0; i < cleanContent.length; i = i + 1) {
    const char = cleanContent[i];

    if (char === '\n') {
      foundNewLine = true;
      break;
    }

    firstLine = firstLine + char;
  }

  if (firstLine.trim() === '') {
    return 'Sin título';
  }

  if (firstLine.length > 50) {
    firstLine = firstLine.slice(0, 50) + '...';
  }

  return firstLine.trim();
}

/**
 * Extrae un resumen corto del contenido de la nota
 * @param {string} content - Contenido de la nota
 * @param {number} maxLen - Longitud máxima del resumen (opcional)
 * @returns {string} Resumen del contenido
 */
function deriveExcerpt(content, maxLen) {
  if (content === '' || content === null || content === undefined) {
    return '';
  }

  let maxLength = maxLen;
  if (maxLength === undefined || maxLength === null) {
    maxLength = 100;
  }

  const cleanContent = content.trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  const excerpt = cleanContent.slice(0, maxLength) + '...';

  return excerpt;
}

// --------------------------------------------
// GENERACIÓN DE ID ÚNICO
// --------------------------------------------

/**
 * Genera un ID único basado en la fecha actual
 * @returns {number} Timestamp en milisegundos desde 1970
 */
function generateId() {
  const timestamp = Date.now();
  return timestamp;
}

// --------------------------------------------
// FUNCIONES CRUD DE NOTAS
// --------------------------------------------

/**
 * Crea un objeto de nota con el contenido proporcionado
 * @param {string} content - Contenido de la nota
 * @param {string} title - Título de la nota (opcional)
 * @returns {Object|null} Objeto de nota o null si hay error
 */
function createNote(content, title) {
  const trimmedContent = content.trim();

  if (trimmedContent === '') {
    return null;
  }

  const noteId = generateId();

  const currentTime = Date.now();

  let noteTitle = title;
  if (noteTitle === undefined || noteTitle === null || noteTitle === '') {
    noteTitle = deriveTitle(content);
  }

  const noteExcerpt = deriveExcerpt(content, 100);

  const note = {
    id: noteId,
    content: content,
    title: noteTitle,
    excerpt: noteExcerpt,
    createdAt: currentTime,
    updatedAt: currentTime,
    favorite: false,
  };

  return note;
}

/**
 * Garda las notas en LocalStorage
 * @param {Array} notes - Array de notas a guardar
 */
function saveToStorage(notes) {
  if (notes === undefined || notes === null) {
    console.error('No se pueden guardar notas: Datos inválidos');
    return;
  }
  const notesJSON = JSON.stringify(notes);
  localStorage.setItem(STORAGE_KEY, notesJSON);
}

/**
 * Carga las notas desde localStorage
 * @returns {Array} Array de notas o array vacío si no hay datos
 */
function loadFromStorage() {
  const notesJSON = localStorage.getItem(STORAGE_KEY);

  if (notesJSON === null || notesJSON === undefined) {
    return [];
  }

  let notes = [];
  const parsedNotes = JSON.parse(notesJSON);

  if (Array.isArray(parsedNotes)) {
    note = parsedNotes;
  }

  return notes;
}

/**
 * Crea un store que persiste automáticamente en localStorage
 * @returns {Object} Store con métodos para gestionar notas
 */
function createPersistentNotesStore() {
  let notes = loadFromStorage();

  /**
   * Agrega una nueva nota y la persiste en localStorage
   * @param {string} content - Contenido de la nota
   * @param {string} [title] - Título opcional de la nota
   * @returns {Object} Resultado de la operación
   */
  function addNote(content, title) {
    if (content === undefined || content === null || content.trim() === '') {
      return { success: false, message: 'El contenido no puede estar vacío' };
    }

    const newNote = createNote(content, title);

    if (newNote === null) {
      return { success: false, message: 'Error al crear la nota' };
    }

    notes.push(newNote);
    saveToStorage(notes);

    return { success: true, note: newNote };
  }

  /**
   * Obtiene todas las notas
   * @returns {Array} Copia del array de notas
   */
  function getAllNotes() {
    const notesCopy = notes.map(function (note) {
      return { ...note };
    });

    return notesCopy;
  }

  /**
   * Obtiene una nota por su ID
   * @param {number} noteId - ID de la nota a buscar
   * @returns {Object|null} Nota encontrada o null si no existe
   */
  function getNoteById(noteId) {
    const foundNote = notes.find(function (note) {
      return note.id === noteId;
    });

    if (foundNote === undefined) {
      return null;
    }

    return { ...foundNote };
  }

  /**
   * Actualiza una nota existente
   * @param {number} noteId - ID de la nota a actualizar
   * @param {Object} updates - Campos a actualizar
   * @param {string} [updates.content] - Nuevo contenido
   * @param {string} [updates.title] - Nuevo título
   * @param {boolean} [updates.favorite] - Estado de favorito
   * @returns {Object} Resultado de la operación
   */
  function updateNote(noteId, updates) {
    if (noteId === undefined || noteId === null) {
      return { success: false, message: 'ID inválido' };
    }

    const noteToUpdate = notes.find(function (note) {
      return note.id === noteId;
    });

    if (noteToUpdate === undefined) {
      return { success: false, message: 'Nota no encontrada' };
    }

    if (updates.content !== undefined) {
      const trimmedContent = updates.content.trim();

      if (trimmedContent === '') {
        return { success: false, message: 'El contenido no puede estar vacío' };
      }

      noteToUpdate.content = updates.content;
      noteToUpdate.title = deriveTitle(updates.content);
      noteToUpdate.excerpt = deriveExcerpt(updates.content, 100);
    }

    if (updates.title !== undefined && updates.title !== '') {
      noteToUpdate.title = updates.title;
    }

    if (updates.favorite !== undefined) {
      noteToUpdate.favorite = updates.favorite;
    }

    noteToUpdate.updatedAt = Date.now();
    saveToStorage(notes);

    return { success: true, note: { ...noteToUpdate } };
  }

  /**
   * Elimina una nota por su ID
   * @param {number} noteId - ID de la nota a eliminar
   * @returns {Object} Resultado de la operación
   */
  function deleteNote(noteId) {
    if (noteId === undefined || noteId === null) {
      return { success: false, message: 'ID inválido' };
    }

    const initialLength = notes.length;

    notes = notes.filter(function (note) {
      return note.id !== noteId;
    });

    if (notes.length === initialLength) {
      return { success: false, message: 'Nota no encontrada' };
    }

    saveToStorage(notes);

    return { success: true, message: 'Nota eliminada exitosamente' };
  }

  /**
   * Busca notas por texto en título o contenido
   * @param {string} query - Texto a buscar
   * @returns {Array} Notas que coinciden con la búsqueda
   */
  function searchNotes(query) {
    if (query === undefined || query === null || query.trim() === '') {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    const results = notes.filter(function (note) {
      const normalizedTitle = note.title.toLowerCase();
      const normalizedContent = note.content.toLowerCase();

      const matchesTitle = normalizedTitle.includes(normalizedQuery);
      const matchesContent = normalizedContent.includes(normalizedQuery);

      return matchesTitle || matchesContent;
    });

    return results.map(function (note) {
      return { ...note };
    });
  }

  /**
   * Obtiene las notas ordenadas por fecha de actualización
   * @returns {Array} Notas ordenadas de más reciente a más antigua
   */
  function getNotesOrderedByDate() {
    const notesCopy = notes.map(function (note) {
      return { ...note };
    });

    notesCopy.sort(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });

    return notesCopy;
  }

  /**
   * Obtiene las notas marcadas como favoritas
   * @returns {Array} Notas favoritas
   */
  function getFavoriteNotes() {
    const favorites = notes.filter(function (note) {
      return note.favorite === true;
    });

    return favorites.map(function (note) {
      return { ...note };
    });
  }

  /**
   * Obtiene el número total de notas
   * @returns {number} Cantidad de notas
   */
  function getNotesCount() {
    return notes.length;
  }

  return {
    addNote: addNote,
    getAllNotes: getAllNotes,
    getNoteById: getNoteById,
    updateNote: updateNote,
    deleteNote: deleteNote,
    searchNotes: searchNotes,
    getNotesOrderedByDate: getNotesOrderedByDate,
    getFavoriteNotes: getFavoriteNotes,
    getNotesCount: getNotesCount,
  };
}

/**
 * Muestra el editor y el preview
 */
function showEditorAndPreview() {
  const editorSection = document.querySelector('#editor-section');
  const previewSection = document.querySelector('#preview-section');

  editorSection.style.display = 'flex';
  previewSection.style.display = 'flex';
}

/**
 * Oculta el editor y el preview
 */
function hideEditorAndPreview() {
  const editorSection = document.querySelector('#editor-section');
  const previewSection = document.querySelector('#preview-section');

  editorSection.style.display = 'none';
  previewSection.style.display = 'none';
}

/**
 * Renderiza la lista de notas en el DOM
 * @param {Array} notes - Array de notas a rederizar
 */
function renderNoteList(notes) {
  const container = document.querySelector('#note-list');

  if (!container) {
    return;
  }

  // Limpiar el contenedor
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Mostrar estado vacío si no hay notas
  if (!Array.isArray(notes) || notes.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No hay notas aún. Crea una nota para empezar.';
    container.appendChild(emptyState);
    return;
  }

  // Renderizar cada nota
  notes.forEach(function (note) {
    const item = document.createElement('div');
    item.className = 'note-item';
    item.dataset.id = String(note.id);

    const titleEl = document.createElement('h3');
    titleEl.className = 'note-title';
    titleEl.textContent = note.title || deriveTitle(note.content);

    const excerptEl = document.createElement('p');
    excerptEl.className = 'note-excerpt';
    excerptEl.textContent = note.excerpt || deriveExcerpt(note.content, 100);

    const dateEl = document.createElement('time');
    dateEl.className = 'note-date';
    const timestamp = note.updatedAt || note.createdAt || Date.now();
    dateEl.textContent = new Date(timestamp).toLocaleString();

    item.appendChild(titleEl);
    item.appendChild(excerptEl);
    item.appendChild(dateEl);

    // Marcar nota activa comparando su id con currentNoteId
    if (String(note.id) === String(currentNoteId)) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'true');
    }

    container.appendChild(item);
  });
}

/**
 * Renderizar el editor con el contenido de una nota
 * @param {Object|null} nota - Nota a renderizar o null para el editor vacío.
 */

/**
 * Renderizar el Preview del contenido markdown
 * @param {string} content - Contenido markdown a renderizar
 */
