 キャッシュ名とキャッシュ対象ファイルを定義
const CACHE_NAME = 'guess-number-pwa-v1';
const urlsToCache = [
  '',  ルートパス (index12.html)
  'index12.html',
  'httpscdn.tailwindcss.com',  Tailwind CDN
  'imgicon-192x192.png',  アイコン
  'imgicon-512x512.png',  アイコン
  'manifest.json'  マニフェストファイル
   必要に応じて他のCSSやJSファイルを追加
];

 Service Workerのインストール (初回アクセス時)
self.addEventListener('install', (event) = {
  console.log('[Service Worker] Install');
   キャッシュを開き、urlsToCacheに記載されたファイルを全て保存する
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) = {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

 Service Workerの有効化 (キャッシュのクリーンアップなど)
self.addEventListener('activate', (event) = {
  console.log('[Service Worker] Activate');
   古いキャッシュを削除する
  event.waitUntil(
    caches.keys().then((keyList) = {
      return Promise.all(keyList.map((key) = {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
   Service Workerをすぐに有効化し、ページを制御できるようにする
  return self.clients.claim();
});

 リソースのフェッチ (キャッシュ戦略の適用)
self.addEventListener('fetch', (event) = {
   キャッシュファースト戦略 キャッシュにあればキャッシュから、なければネットワークから取得
  event.respondWith(
    caches.match(event.request)
      .then((response) = {
         キャッシュにレスポンスがあればそれを返す
        if (response) {
          console.log('[Service Worker] Found in Cache', event.request.url);
          return response;
        }
         キャッシュになければネットワークリクエストを行う
        console.log('[Service Worker] Requesting from Network', event.request.url);
        return fetch(event.request);
      }
    )
  );
});