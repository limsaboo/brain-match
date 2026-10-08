/* 오프라인 캐시 (앱 파일만 저장, 사용자 데이터는 저장하지 않음) */
var CACHE = 'kbm-v15-6';
var FILES = ['./', './index.html', './privacy.html', './terms.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') { return; }
  /* 네트워크 우선: 온라인이면 항상 최신 파일, 오프라인이면 저장본 */
  e.respondWith(fetch(e.request).then(function (r) {
    var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }).catch(function () { });
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
