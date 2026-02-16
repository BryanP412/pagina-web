export function updateGrid(sidebarVisible) {
  const wrapper = document.getElementById('productsWrapper');
  const items = document.querySelectorAll('.product-item');

  if (!wrapper) return;

  wrapper.className = sidebarVisible
    ? 'col-lg-9 col-md-8'
    : 'col-lg-12';

  items.forEach(item => {
    item.classList.toggle('col-lg-3', sidebarVisible);
    item.classList.toggle('col-lg-2', !sidebarVisible);
  });
}
