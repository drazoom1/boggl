// 오프라인 셸 캐시 — 앱 화면·supabase-js 를 폰에 저장해 인터넷 없이도 열린다
const C = 'patrol-v20';
const ASSETS = ['./', './index.html', './report.html', './map.png', './manifest.json', './icon-192.png', './icon-512.png', 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'];
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(C).then((c) => c.addAll(ASSETS).catch(() => {}))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.hostname.endsWith('supabase.co')) return;                 // 데이터 요청은 캐시하지 않음
  // 셸: 네트워크 우선, 실패하면 캐시 (새 버전 배포 시 자동 갱신)
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, {ignoreSearch: true}).then((r) => r || caches.match('./index.html'))));
});
