const CACHE_NAME = "inmetcorp-pwa-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/catalogo.html",
  "/manifest.webmanifest",
  "/a.png",
  "/css/styles.css",
  "/css/catalogo.css",
  "/js/main.js",
  "/js/data.js",
  "/js/render.js",
  "/js/filters.js",
  "/js/filters-ui.js",
  "/js/grid.js",
  "/js/sidebar.js",
  "/js/product-offcanvas.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // 🔥 IMPORTANTE: solo cachear http/https
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});