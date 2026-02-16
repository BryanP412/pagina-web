import { productsData } from './data.js';

export function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;

  // Agrupar group -> category
  const grouped = {};

  productsData.forEach(p => {
    const group = p.group || 'otros';
    if (!grouped[group]) grouped[group] = {};
    grouped[group][p.category] = (grouped[group][p.category] || 0) + 1;
  });

  let html = `
    <div class="accordion bg-dark pb-3" id="categoryAccordion">
  `;

  let i = 0;

  Object.entries(grouped).forEach(([group, categories]) => {
    const collapseId = `collapse-${i}`;

    html += `
      <div class="accordion-item bg-dark border-0">
        <h2 class="accordion-header">
          <button class="accordion-button bg-dark text-white shadow-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#${collapseId}"
                  aria-expanded="true">
            ${capitalize(group)}
          </button>
        </h2>

        <div id="${collapseId}"
             class="accordion-collapse collapse show">
          <div class="accordion-body d-flex flex-column gap-2 pt-2 pb-2">
    `;

    Object.entries(categories).forEach(([cat, count]) => {
      html += `
       <button class="category-btn text-start border-0 bg-transparent"
        data-category="${cat}">
        ${capitalize(cat)}
        <span class="ms-1 text-secondary">(${count})</span>
      </button>

      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    i++;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function capitalize(text) {
  return text
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}
