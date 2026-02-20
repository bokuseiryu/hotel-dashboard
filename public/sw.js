// Service Worker for Hotel Dashboard PWA
const CACHE_NAME = 'hotel-dashboard-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// フェッチ時にキャッシュを優先、なければネットワーク
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // chrome-extension:// や非HTTP(S)プロトコルはスキップ
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API呼び出しはネットワーク優先
  if (event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return new Response(JSON.stringify({ error: 'オフライン' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 静的アセットはキャッシュ優先
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache).catch((err) => {
            // キャッシュ失敗を無視（chrome-extension等）
            console.log('Cache put failed:', err);
          });
        });
        return response;
      }).catch(() => {
        // ネットワークエラー時はキャッシュから返す試み
        return caches.match(event.request);
      });
    })
  );
});
