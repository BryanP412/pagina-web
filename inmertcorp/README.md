# INMETCORPERU — Sitio Web

Sitio web estático de **INMETCORPERU**, empresa peruana (Lima, Los Olivos) especializada en:

- Puertas de garaje
- Estructuras metálicas
- Seguridad electrónica / control de accesos
- Acero inoxidable

> **Público objetivo de este README:** que cualquier modelo de IA (opencode) pueda leerlo y entender cómo funciona el proyecto, sus convenciones y cómo hacer cambios sin romper nada.

---

## 1. Resumen técnico

- **Stack:** HTML + CSS + JavaScript vanilla. **No hay build system, ni bundler, ni npm, ni framework backend.**
- Es una **PWA** (instalable, funciona offline tras la primera carga vía Service Worker).
- Librerías externas (todas por **CDN**):
  - Bootstrap 5.3.3 (CSS + JS bundle)
  - Bootstrap Icons 1.13.1
  - AOS 2.3.4 (animaciones on-scroll)
  - Google Fonts: `Inter` y `Oswald`
- **Hosting:** sitio estático (dominio de referencia: `inmetcorp.com.pe`). No hay configuración de servidor en el repo.
- No hay archivo `package.json`, ni tests, ni linter configurado. El código se sirve tal cual.

---

## 2. Estructura del proyecto

```
inmertcorp/
├── index.html              # Landing / página de inicio
├── catalogo.html           # Catálogo de productos (data-driven)
├── manifest.webmanifest    # Manifiesto PWA
├── sw.js                   # Service Worker (caché offline)
├── rename_images.py        # Script: renombra imágenes a la convención estándar
├── renombrar.bat           # Wrapper de Windows para ejecutar rename_images.py
├── css/
│   ├── styles.css          # Estilos generales (home + footer + carousel)
│   └── catalogo.css        # Estilos del catálogo (cards, filtros, sidebar)
├── js/
│   ├── data.js             # ⭐ FUENTE DE DATOS del catálogo (productos)
│   ├── render.js           # Pinta la grilla de productos
│   ├── filters-ui.js       # Genera el accordion de filtros de categorías
│   ├── filters.js          # Lógica de filtrado por categoría
│   ├── sidebar.js          # Mostrar/ocultar sidebar de filtros
│   ├── grid.js             # Ajusta anchos de columnas del grid
│   ├── product-offcanvas.js# Offcanvas de detalle de producto + WhatsApp
│   ├── main.js             # Punto de entrada del catálogo (imports)
│   └── pwa.js              # Registra el Service Worker
├── img/                    # Imágenes (convención por categoría, ver §5)
│   ├── nuevo/              # Logos y favicon (a.png, inmetcorp*.png)
│   ├── garaje/             # garaje1.jpg, garaje2.png, ...
│   ├── puertas/            # puertas1.jpg, ...
│   ├── coberturas metalicas/
│   ├── control de acceso/
│   ├── escaleras/
│   └── ... (imágenes sueltas usadas en index.html)
└── videos/                 # videos/mp4 usados en carousel y destacados
```

> `catalogo.html` carga `js/main.js` con `type="module"`, que a su vez importa los demás módulos. `index.html` solo usa Bootstrap, AOS y `js/pwa.js`.

---

## 3. Cómo funciona el catálogo

El catálogo es **100% data-driven**: los productos viven en `js/data.js` y el resto de módulos lo leen de ahí.

### `js/data.js` (fuente de datos)

Cada producto es un objeto `{ name, category }`. Se agrupa semánticamente usando `withGroup(group, items)`:

```js
export const productsData = [
  ...withGroup('puertas_metalicas', [
    { name: 'Puerta Metálica', category: 'puertas' },
    // ...
  ]),
];
```

- `group` → nombre del **título del accordion** en el sidebar (ej. *Puertas Metálicas*).
- `category` → **carpeta de imágenes** y **filtro fino** (ej. `puertas`, `garaje`, `control de acceso`).
- El **orden de los items dentro de una misma `category` define qué imagen le toca a cada producto** (ver §5). No reordenar sin revisar imágenes.

### Flujo de renderizado

1. `main.js` → en `DOMContentLoaded` llama a:
   - `renderProducts()` → `render.js`
   - `renderCategoryFilters()` → `filters-ui.js`
   - `initFilters()` → `filters.js`
   - `initSidebar()` → `sidebar.js` (toggle de visibilidad → `updateGrid()`)
   - importa `product-offcanvas.js`
2. `render.js` pinta cada producto como `.product-item[data-category=...]` con imagen, nombre y categoría.
3. `filters-ui.js` arma un accordion agrupando `group → category` con contador de productos por categoría.
4. `filters.js` alterna la clase `.product-hidden` sobre los `.product-item` según las categorías activas (multi-select). Llama a `AOS.refreshHard()` al filtrar.
5. `grid.js` cambia las clases de columna según el sidebar esté visible (`col-lg-9` con sidebar / `col-lg-12` sin sidebar).

### Detalle de producto (offcanvas)

Al hacer clic en una tarjeta, `product-offcanvas.js` abre un offcanvas de Bootstrap con:

- Imagen del producto (con fallback a `.png` si no existe `.jpg`)
- Categoría y descripción
- Botón **"Cotizar por WhatsApp"** → `https://wa.me/51981083023?text=...` con el nombre del producto y un link directo `https://<dominio>/catalogo.html?product=<slug>`

Funcionalidades de URL:

- `catalogo.html?product=<slug>` abre directamente ese producto (via `window.openProductFromSlug`).
- Usa `history.pushState/popstate` para que el botón **atrás** del navegador cierre el offcanvas.

---

## 4. PWA (offline / instalable)

- `manifest.webmanifest` → nombre, colores (tema `#111111`), ícono `img/nuevo/a.png`.
- `js/pwa.js` → registra `sw.js` al cargar la página.
- `sw.js` → precachea el `APP_SHELL` (HTML, CSS, JS, manifiesto, logo). Estrategia:
  - **HTML:** network-first (trata de actualizar; si no hay red, cae al caché).
  - **Resto:** cache-first.

> ⚠️ **IMPORTANTE al desplegar cambios:** subir la versión en **tres lugares** o los usuarios seguirán viendo la versión vieja:
> 1. Query string de CSS/JS en los HTML: `css/styles.css?v=1.0.5` → `?v=1.0.6`
> 2. Nombre del caché: `const CACHE_NAME = "inmetcorp-pwa-v1.0.5"` → `v1.0.6`
> 3. `manifest.webmanifest` si cambia algo del manifiesto.

---

## 5. Convención de imágenes (crítica)

La herramienta `rename_images.py` automatiza el renombrado a esta convención:

### Regla

```
img/<category>/<category><N>.<ext>
```

- `<category>` = valor de `category` en `data.js` (puede llevar espacios, ej. `coberturas metalicas`).
- `<N>` = número secuencial **por categoría** empezando en 1.
- La imagen del **N-ésimo producto** de cada categoría en `data.js` debe ser `img/<category>/<category><N>.jpg` (con fallback a `.png`).

### Cómo se resuelve la ruta

- `render.js`: contador incremental por `category` → `img/${category}/${category}${index}.jpg`.
- `product-offcanvas.js`: reconstruye la misma ruta buscando el índice del producto dentro de su categoría.
- Si el `.jpg` no existe, `onerror` cae al `.png` del mismo nombre.

### `rename_images.py`

Lee `img/`, y por cada subcarpeta renombra los archivos no conformes a `categoriaN.ext`, **ordenados por fecha de modificación (más antiguo → primero)**, continuando desde el último número existente. Ejecutar con `renombrar.bat` o `python rename_images.py`.

> ⚠️ Renombrar imágenes **puede romper la relación producto↔imagen**: copia de seguridad antes de ejecutar el script y verifica la correspondencia visual después.

---

## 6. Página de inicio (`index.html`)

Sin módulos JS propios (solo Bootstrap, AOS y `pwa.js`). Contiene:

- Navbar sticky con logo, email, WhatsApp y menú (offcanvas).
- Carousel (`fade`) con un **video** (`videos/f49b-...mp4`) y dos imágenes, overlay con título + botón "Ver catálogo".
- Sección "Nosotros".
- **Productos destacados** (cards con imágenes/videos).
- Sección **"Nuestros Servicios"** con 4 cards: Puertas de Garaje, Seguridad Electrónica, Estructuras Metálicas, Acero Inoxidable (cada una con botón de cotización por WhatsApp).
- Footer con dirección, email, redes sociales (Facebook, TikTok, WhatsApp, Maps) y copyright 2026.

### Datos de contacto (constantes en el sitio)

- WhatsApp: `+51 981 083 023` → `https://wa.me/51981083023`
- Email: `ventas@inmetcorp.com.pe`
- Dirección: `Av. Universitaria Mz 8 Lote 15 Laura Caller, Los Olivos`
- Redes: TikTok `@inmetcorperu.eirl`; Facebook enlaza `#` (placeholder).

---

## 7. Tareas comunes y gotchas

### Agregar un producto nuevo al catálogo

1. Añadir el objeto `{ name, category }` en `js/data.js` dentro del `withGroup` correspondiente.
2. Colocar su imagen en `img/<category>/` con el siguiente número libre de esa categoría.
3. Opcional: agregar la ruta del JS a `APP_SHELL` en `sw.js` (no es necesario si no cambias el código JS).
4. Subir la versión de caché + query strings (ver §4) para que el cambio se vea.

### Gotchas / reglas no escritas

- **El índice de la imagen depende del orden en `data.js`.** Duplicados o reordenamientos pueden apuntar a fotos incorrectas.
- **`slugify` es por nombre único:** `product-offcanvas.js` busca productos por `slugify(name)`. Dos productos con el mismo nombre (o que generen el mismo slug) romperían el link directo (`?product=...`).
- Las categorías con espacios generan rutas con espacios (`img/coberturas metalicas/...`); funciona en la mayoría de servidores estáticos, pero evita cambiar el valor de `category` sin renombrar también la carpeta de imágenes.
- El filtro es **multi-selección** (OR). El botón "Limpiar filtros" limpia todo.
- No existe backend ni base de datos: todo cambio de producto = editar `data.js` + subir imagen.

---

## 8. Cómo ver/ejecutar localmente

No requiere instalación. Opciones:

1. Abrir `index.html` directamente en el navegador (funciona, salvo el Service Worker por ruta `/sw.js`).
2. Servidor estático simple para probar PWA correctamente:
   ```bash
   # Python
   python -m http.server 8080
   # o con Node
   npx serve .
   ```
   Luego abrir `http://localhost:8080`.

---

## 9. Notas de estilo / diseño

- Fondo oscuro: `#161616` / `#111111`, texto blanco.
- Tipografías: `Oswald` para títulos (peso 300), `Inter` para el resto.
- Botones sociales con efecto glow al hover (ver `styles.css`).
- Animaciones con AOS (`data-aos="fade-up"`, `zoom-in`, etc.) inicadas con `AOS.init()`.
- Responsive con Bootstrap grid; textos/íconos de navbar se ocultan en pantallas pequeñas (`d-none d-md-inline`).