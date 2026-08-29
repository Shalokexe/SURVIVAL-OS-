const CACHE_NAME = 'survivalos-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest'];
const DB_NAME = 'survivalos-offline';
const STORE_NAME = 'pending-requests';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method === 'GET') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (new URL(request.url).pathname.startsWith('/api/')) {
    event.respondWith(networkOrQueue(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok && new URL(request.url).origin === self.location.origin) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return cache.match('/index.html');
    throw new Error('Offline and no cached response available');
  }
}

async function networkOrQueue(request) {
  try {
    return await fetch(request);
  } catch {
    await saveRequest(request);
    if ('sync' in self.registration) {
      await self.registration.sync.register('survivalos-sync');
    }
    return new Response(JSON.stringify({ queued: true, offline: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { autoIncrement: true });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveRequest(request) {
  const body = request.method === 'GET' ? null : await request.clone().text();
  const entry = {
    url: request.url,
    method: request.method,
    headers: Array.from(request.headers.entries()),
    body
  };
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).add(entry);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'survivalos-sync') event.waitUntil(replayRequests());
});

self.addEventListener('message', (event) => {
  if (event.data === 'sync-now') event.waitUntil(replayRequests());
});

async function replayRequests() {
  const database = await openDatabase();
  const entries = await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  for (const entry of entries) {
    try {
      await fetch(entry.url, {
        method: entry.method,
        headers: Object.fromEntries(entry.headers),
        body: entry.body || undefined
      });
      await removeFirstMatching(entry);
    } catch {
      break;
    }
  }
}

async function removeFirstMatching(entry) {
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return resolve();
      const value = cursor.value;
      if (value.url === entry.url && value.method === entry.method && value.body === entry.body) {
        cursor.delete();
        return resolve();
      }
      cursor.continue();
    };
    request.onerror = () => reject(request.error);
  });
}
