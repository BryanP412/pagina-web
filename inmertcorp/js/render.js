import { productsData } from './data.js';


export function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const counters = {}; // contador por categoría

  grid.innerHTML = productsData.map((p, index) => {
    const delay = index * 100;

    counters[p.category] = (counters[p.category] || 0) + 1;
    const imgIndex = counters[p.category];

    const imgPath = `img/${p.category}/${p.category}${imgIndex}.jpg`;

    return `
      <div class="product-item col-6 col-sm-6 col-md-4 col-lg-3"
           data-category="${p.category}">
        <div class="product-card bg-dark border-0"
          data-aos="zoom-in"
          data-aos-duration="800"
          data-aos-delay="${delay}"
          data-aos-once="true"
          onclick='openProduct("${p.name}", "${imgPath}")'>


          <img 
            src="${imgPath}"
            onerror="this.onerror=null;this.src='img/${p.category}/${p.category}${imgIndex}.png';"
            alt="${p.name}"
          >

          <div class="product-info">
            <div class="product-title">
              <h5>${p.name}</h5>
            </div>

            <div class="product-footer">
              <div class="border-bottom border-secondary w-100 mb-2"></div>
              <span class="product-category">${capitalize(p.category)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
