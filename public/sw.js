const CACHE_NAME = "knc-26.05.31.2251";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-192.png",
  "./assets/icons/maskable-512.png",
  "./assets/original-1999/monster.png",
  "./assets/original-1999/shadow.png",
  "./assets/original-1999/kryvavitsa.png",
  "./assets/original-1999/wall.png",
  "./assets/original-1999/exit.png",
  "./assets/original-1999/intro-sz.png",
  "./assets/original-1999/title-composite.png",
  "./assets/windows-2003/place.gif",
  "./assets/windows-2003/wall.gif",
  "./assets/windows-2003/exit.gif",
  "./assets/windows-2003/monster.gif",
  "./assets/windows-2003/kryvavitsa.gif",
  "./assets/windows-2003/shadow-1.gif",
  "./assets/windows-2003/shadow-2.gif",
  "./assets/windows-2003/shadow-3.gif",
  "./assets/windows-2003/shadow-4.gif",
  "./assets/windows-2003/shadow-5.gif"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

          return Promise.resolve(false);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse !== undefined) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok && new URL(event.request.url).origin === self.location.origin) {
            const responseForCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseForCache));
          }

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }

          return Response.error();
        });
    })
  );
});