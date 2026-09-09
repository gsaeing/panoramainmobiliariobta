/**
 * Memoria sin internet para celulares.
 * Explica: guarda la app para abrirla como aplicacion en iPhone y Android.
 */
const CACHE = 'panorama-v1';
const FILES = ['./index.html', './styles.css', './app.js', './manifest.json', './firebase-config.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
