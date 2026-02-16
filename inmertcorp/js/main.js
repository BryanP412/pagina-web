import { renderProducts } from './render.js';
import { renderCategoryFilters } from './filters-ui.js';
import { initFilters } from './filters.js';
import { initSidebar } from './sidebar.js';
import { updateGrid } from './grid.js';
import './product-offcanvas.js';






document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCategoryFilters();
  initFilters();

  initSidebar(visible => {
    updateGrid(visible);
  });

  // 🔥 NUEVO: abrir producto si viene en URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('product');

  if (slug && window.openProductFromSlug) {
    window.openProductFromSlug(slug);
  }
});