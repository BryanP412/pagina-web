export function initFilters() {
  const buttons = document.querySelectorAll('.category-btn[data-category]');
  const clearBtn = document.getElementById('clearFilters');

  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.category === 'all') {
        buttons.forEach(b => b.classList.remove('active'));
        showAllProducts();
        return;
      }

      btn.classList.toggle('active');
      applyFilters();
    });
  });

  clearBtn?.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    showAllProducts();
  });

  function applyFilters() {
    const activeCategories = [...buttons]
      .filter(b =>
        b.classList.contains('active') &&
        b.dataset.category !== 'all'
      )
      .map(b => b.dataset.category);

    document.querySelectorAll('.product-item').forEach(item => {
      const category = item.dataset.category;

      if (
        activeCategories.length === 0 ||
        activeCategories.includes(category)
      ) {
        item.classList.remove('product-hidden');
      } else {
        item.classList.add('product-hidden');
      }
    });

    // 🔥 FIX AOS
    if (window.AOS) {
      AOS.refreshHard();
    }
  }


function showAllProducts() {
  document.querySelectorAll('.product-item')
    .forEach(item => item.classList.remove('product-hidden'));
}
}
