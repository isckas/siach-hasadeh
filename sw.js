/* Offline support for the shul screen and site.
   - The app files are saved on the device the first time the page loads.
   - Each later load tries the network first (so updates arrive), and falls back
     to the saved copy when there is no connection or it is too slow.
   - Firestore keeps its own offline copy of the content, so it is not touched here. */
var VERSION = 'shul-v4';
var SHELL = [
  './',
  'index.html',
  'app.js',
  'styles.css',
  'firebase-config.js',
  'vendor/hebcal-core-6.14.4.min.js',
  'vendor/qrcode-generator-1.4.4.js',
  'vendor/firebase-app-compat-10.14.1.js',
  'vendor/firebase-auth-compat-10.14.1.js',
  'vendor/firebase-firestore-compat-10.14.1.js',
  'seed/state.json',
  'seed/flyer-1.jpg',
  'seed/flyer-2.jpg'
];
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
var NET_TIMEOUT = 4000;

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      return c.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION && k.indexOf('shul-') === 0; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function networkFirst(req, fallbackUrl) {
  return caches.open(VERSION).then(function (cache) {
    return new Promise(function (resolve) {
      var done = false;
      var fromCache = function () {
        return cache.match(req, { ignoreSearch: true }).then(function (hit) {
          return hit || (fallbackUrl ? cache.match(fallbackUrl) : null);
        });
      };
      var timer = setTimeout(function () {
        fromCache().then(function (hit) { if (hit && !done) { done = true; resolve(hit); } });
      }, NET_TIMEOUT);
      fetch(req, { cache: 'no-cache' }).then(function (res) {
        if (res && res.ok) { cache.put(req, res.clone()).catch(function () {}); }
        if (!done) { done = true; clearTimeout(timer); resolve(res); }
      }).catch(function () {
        clearTimeout(timer);
        fromCache().then(function (hit) {
          if (!done) { done = true; resolve(hit || new Response('', { status: 504, statusText: 'offline' })); }
        });
      });
    });
  });
}

function cacheFirst(req) {
  return caches.open(VERSION).then(function (cache) {
    return cache.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) { cache.put(req, res.clone()).catch(function () {}); }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (FONT_HOSTS.indexOf(url.hostname) >= 0) { e.respondWith(cacheFirst(req)); return; }
  if (url.origin !== self.location.origin) return; /* Firebase, Google sign-in: leave alone */
  if (req.mode === 'navigate') { e.respondWith(networkFirst(req, 'index.html')); return; }
  e.respondWith(networkFirst(req));
});
