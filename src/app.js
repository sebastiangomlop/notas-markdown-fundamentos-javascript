// SISTEMA DE NOTAS MARKDOWN

function generateId() {
  const timestamp = Date.now();
  return timestamp;
}

// --------------------------------------------
// FUNCIONES CRUD DE NOTAS
// --------------------------------------------

function createNote(content, title) {
  const trimmedContent = content.trim();
  if (trimmedContent === '') {
    return 'Error: El contenido no puede estar vacío.';
  }

  const noteId = generateId();
  const currentTime = Date.now();
  const noteTitle = title || 'Nota sin Título';
  const noteExcerpt = content.length > 100 ? `${content.slice(0, 100)}...` : content;

  const noteInfo = `
    ID: ${noteId} | Título: ${noteTitle} | Contenido: ${content} | Excerpt: ${noteExcerpt}
    | Creado: ${currentTime} | Actualizado: ${currentTime}
  `;

  return noteInfo;
}

function updateNote(noteId, newContent) {
  if (noteId === undefined || noteId === null || noteId === '') {
    return 'Error: ID Inválido';
  }

  const trimmedContent = newContent.trim();
  if (trimmedContent === '') {
    return 'Error: El contenido no puede estar vacío.';
  }

  const currentTime = Date.now();
  const noteTitle = title || 'Nota sin Título';
  const noteExcerpt = newContent.length > 100 ? `${newContent.slice(0, 100)}...` : newContent;

  const updateNoteInfo = `
    ID: ${noteId} | Título: ${noteTitle} | Contenido: ${newContent} | Excerpt: ${noteExcerpt}
    | Creado: ${currentTime} | Actualizado: ${currentTime}
  `;

  return updateNoteInfo;
}

function deleteNote(noteId) {
  if (noteId === undefined || noteId === null || noteId == '') {
    return 'Error: ID inválido';
  }

  const message = `Nota con ID: ${noteId}, fue eliminada`;

  return message;
}

function listNotes() {
  const message = 'Listando todas las notas disponibles';
  return message;
}

// Ejemplo 1: Crear una nota
console.log('=== CREAR NOTA ===');
const nota1 = createNote('# Mi primera nota\nEste es el contenido de mi primera nota en Markdown.');
console.log(nota1);

// Ejemplo 2: Crear nota con título personalizado
console.log('\n=== CREAR NOTA CON TÍTULO ===');
const nota2 = createNote('Contenido de la segunda nota', 'Nota Importante');
console.log(nota2);

// Ejemplo 3: Intentar crear nota vacía (validación)
console.log('\n=== VALIDACIÓN: NOTA VACÍA ===');
const notaVacia = createNote('   ');
console.log(notaVacia);
