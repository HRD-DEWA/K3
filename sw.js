// Service worker K3 Dewasutratex: program tetap bisa dibuka tanpa internet.
// Saat ada internet, versi terbaru diambil otomatis; tanpa internet, dipakai salinan terakhir.
const CACHE = "k3-dst-v7-19";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const net = fetch(req, { cache: "no-cache" }).then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; });
  const timeout = new Promise(res => setTimeout(res, 4000));
  e.respondWith(Promise.race([net, timeout]).then(r => r || Promise.reject()).catch(() =>
    caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html")).then(r => r || net)));
});
