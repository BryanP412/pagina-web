function slugify(text) {
  return text
    .toString()
    .normalize("NFD") // quitar tildes
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // espacios a -
    .replace(/[^\w\-]+/g, "") // quitar caracteres raros
    .replace(/\-\-+/g, "-"); // evitar dobles -
}


function setImageWithFallback(imgEl, basePath) {
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = basePath.replace('.jpg', '.png');
  };
  imgEl.src = basePath;
}

const offcanvasEl = document.getElementById('productOffcanvas');
const offcanvasInstance = new bootstrap.Offcanvas(offcanvasEl);

// 🔹 Cerrar con botón atrás del navegador
window.addEventListener("popstate", () => {
  if (offcanvasEl.classList.contains('show')) {
    offcanvasInstance.hide();
  }
});

// 🔹 Cuando se cierra manualmente (X o swipe)
offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
  if (history.state?.productOpen) {
    history.back();
  }
});

import { productsData } from './data.js';

window.openProduct = function (productName, imgPath) {

  const product = productsData.find(p => p.name === productName);
  if (!product) return;

  const slug = slugify(product.name);

  document.getElementById('productTitle').textContent = product.name;
  document.getElementById('productCategory').textContent =
    product.category.toUpperCase();

  const imgEl = document.getElementById('productImage');
  setImageWithFallback(imgEl, imgPath); // 👈 volvemos a usar la ruta real

  document.getElementById('productDescription').textContent =
    product.description || 
    'Producto fabricado a medida según requerimientos del cliente.';

  const productUrl =
    `${window.location.origin}/catalogo.html?product=${slug}`;

  const message = encodeURIComponent(
    `Hola, quisiera una cotización sobre:\n` +
    `${product.name}\n\n` +
    `Link del producto:\n${productUrl}`
  );

  document.getElementById('productWhatsapp').href =
    `https://wa.me/51981083023?text=${message}`;

  offcanvasInstance.show();

  history.pushState({ productOpen: true }, "", `?product=${slug}`);
};

window.openProductFromSlug = function (slug) {
  const product = productsData.find(
    p => slugify(p.name) === slug
  );

  if (!product) return;

  // reconstruimos imgPath igual que en render
  const sameCategory = productsData.filter(
    p => p.category === product.category
  );

  const index =
    sameCategory.findIndex(p => p.name === product.name) + 1;

  const imgPath =
    `img/${product.category}/${product.category}${index}.jpg`;

  window.openProduct(product.name, imgPath);
};