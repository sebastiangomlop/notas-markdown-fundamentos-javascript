const state = {
  likes: 0,
  isHovering: false,
};

function getStatusMessage() {
  if (state.likes === 0) {
    return 'Aún no hay likes. Haz clic en Me gusta';
  }
  if (state.likes === 1) {
    return 'Tienes 1 like';
  }
  return `${state.likes} likes`;
}

function render() {
  const status = document.querySelector('#status');
  const btnReset = document.querySelector('#btn-reset');
  const hoverZone = document.querySelector('#hover-zone');
  const hoverPill = document.querySelector('#hover-pill');
  const hoverTitle = document.querySelector('#hover-title');
  const hoverText = document.querySelector('#hover-text');

  status.textContent = getStatusMessage();
  btnReset.disabled = state.likes === 0;
  btnReset.style.opacity = state.likes === 0 ? '0.55' : '1';

  hoverZone.classList.toggle('is-hover', state.isHovering);
  hoverPill.textContent = state.isHovering ? 'Hovering...' : 'mouse: fuera';
  hoverTitle.textContent = state.isHovering ? 'Hover detectado' : 'Pasa el mouse aquí';
  hoverText.textContent = state.isHovering
    ? 'Este cambio se disparó por mouseenter'
    : 'Cuando entras/sales cambiamos una clase y el texto';
}

function setupEventHandlers() {
  const btnLike = document.querySelector('#btn-like');
  const btnReset = document.querySelector('#btn-reset');
  const hoverZone = document.querySelector('#hover-zone');

  btnLike.addEventListener('click', () => {
    state.likes++;
    render();
  });

  btnReset.addEventListener('click', () => {
    state.likes = 0;
    render();
  });

  hoverZone.addEventListener('mouseenter', () => {
    state.isHovering = true;
    render();
  });

  hoverZone.addEventListener('mouseleave', () => {
    state.isHovering = false;
    render();
  });
}

function setupKeyboardLike() {
  document.addEventListener('keydown', (event) => {
    if (event.key?.toLocaleLowerCase() != "l") return;
    state.likes++;
    render();
  });
}
  
setupEventHandlers();
setupKeyboardLike();
render();