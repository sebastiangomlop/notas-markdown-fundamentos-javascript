const API_URL = 'https://api.escuelajs.co/api/v1/products';
const gridProductos = document.querySelector('#grid-productos');
const statusElement = document.querySelector('#status');

function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue} 65% 45%)`;
}

function createPlaceholderSvg(title) {
  const color = getColorFromString(title);
  const initial = title.charAt(0).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="${color}"/>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="80" font-family="Arial">${initial}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getLoremFlickrUrl(title) {
  const keyword = title.trim().replace(/\s+/g, ',');
  return `https://loremflickr.com/400/300/${encodeURIComponent(keyword)}`;
}

function handleImageError(event, product) {
  const img = event.target;
  const stage = img.dataset.fallbackStage || 'api';

  if (stage === 'api') {
    const currentIndex = Number(img.dataset.imageIndex || 0);
    const nextIndex = currentIndex + 1;

    if (nextIndex < product.images.length) {
      img.src = getImageUrl(product.images[nextIndex]);
      img.dataset.imageIndex = String(nextIndex);
      return;
    }

    img.dataset.fallbackStage = 'loremflickr';
    img.src = getLoremFlickrUrl(product.title);
    return;
  }

  if (stage === 'loremflickr') {
    img.dataset.fallbackStage = 'placeholder';
    img.src = createPlaceholderSvg(product.title);
    return;
  }

  img.onerror = null;
}

function getImageUrl(rawImage) {
  if (Array.isArray(rawImage) && rawImage.length > 0) {
    return getImageUrl(rawImage[0]);
  }

  if (typeof rawImage !== 'string') {
    return '';
  }

  const trimmed = rawImage.trim();

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      return getImageUrl(parsed);
    } catch {
      return trimmed.slice(1, -1).replace(/^["']|["']$/g, '');
    }
  }

  return trimmed.replace(/^["']|["']$/g, '');
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'card';

  const image = document.createElement('img');
  image.className = 'product-image';
  image.src = getImageUrl(product.images[0]);
  image.dataset.imageIndex = '0';
  image.dataset.fallbackStage = 'api';
  image.onerror = (event) => handleImageError(event, product);
  image.alt = product.title;
  image.loading = 'lazy';
  image.referrerPolicy = 'no-referrer';

  const header = document.createElement('div');
  header.className = 'card-header';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = product.title.charAt(0).toUpperCase();
  avatar.style.backgroundColor = getColorFromString(product.title);
  avatar.setAttribute('aria-hidden', 'true');

  const title = document.createElement('h3');
  title.textContent = product.title;

  header.append(avatar, title);

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `$${product.price}`;

  const description = document.createElement('p');
  description.className = 'muted';
  description.textContent = product.description;

  const button = document.createElement('button');
  button.className = 'btn btn-comprar';
  button.textContent = 'Comprar';
  button.addEventListener('click', () => {
    alert(`Agregaste al carrito: ${product.title}`);
  });

  card.append(image, header, price, description, button);
  return card;
}

async function loadProducts() {
  statusElement.textContent = 'Cargando productos...';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const products = await response.json();

    if (products.length === 0) {
      statusElement.textContent = 'No hay productos disponibles.';
      return;
    }

    statusElement.textContent = '';
    gridProductos.innerHTML = '';

    products.slice(0, 20).forEach((product) => {
      const card = createProductCard(product);
      gridProductos.append(card);
    });
  } catch (error) {
    statusElement.textContent = 'No se pudieron cargar los productos.';
    console.error('Error al cargar productos:', error);
  }
}

function setupProductosButton() {
  const btnProductos = document.querySelector('#btn-productos');

  if (btnProductos === null) {
    return;
  }

  btnProductos.addEventListener('click', () => {
    document.querySelector('#productos').scrollIntoView({ behavior: 'smooth' });
  });
}

const opiniones = [
  {
    id: 'op-1',
    nombre: 'María',
    rating: 5,
    comentario: 'Llegó rápido y la calidad es excelente.',
    fecha: '2025-01-10',
  },
  {
    id: 'op-2',
    nombre: 'Carlos',
    rating: 4,
    comentario: 'Buen producto. El empaque podría mejorar.',
    fecha: '2025-01-22',
  },
  {
    id: 'op-3',
    nombre: 'Luisa',
    rating: 5,
    comentario: 'Muy cómodo. Compraría de nuevo.',
    fecha: '2025-02-03',
  },
  {
    id: 'op-4',
    nombre: 'Oscar',
    rating: 5,
    comentario: 'Muy cómodo. Compraría de nuevo.',
    fecha: '2025-02-03',
  },
   {
    id: 'op-5',
    nombre: 'Sebastian',
    rating: 5,
    comentario: 'Muy rico. Repetiria la experiencia.',
    fecha: '2025-02-03',
  },
];


function createOpinionElement(opinion) {
  const article = document.createElement('article');
  article.classList.add('opinion');
  article.dataset.id = opinion.id;

  const header = document.createElement('header');
  const meta = document.createElement('div');
  meta.classList.add('meta');

  const nombre = document.createElement('strong');
  nombre.textContent = opinion.nombre;

  const rating = document.createElement('span');
  rating.textContent = `★ ${opinion.rating}/5`;

  meta.appendChild(nombre);
  meta.appendChild(rating);

  const fecha = document.createElement('small');
  fecha.classList.add('muted');
  fecha.textContent = opinion.fecha;

  header.appendChild(meta);
  header.appendChild(fecha);

  const comentario = document.createElement('p');
  comentario.textContent = opinion.comentario;

  article.appendChild(header);
  article.appendChild(comentario);

  return article;
}

function renderOpinions(list) {
  const contenedor = document.querySelector('#opiniones');
  if (contenedor === null) {
    console.error('No se encontró el contenedor #opiniones');
    return;
  }
  contenedor.replaceChildren();

  list.forEach((opinion) => {
    const el = createOpinionElement(opinion);
    contenedor.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupProductosButton();
  renderOpinions(opiniones);
});