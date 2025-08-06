const CACHE_NAME = 'socratic-tutor-cache-v1';
const urlsToCache = [
    '/', // Cache the root URL, which serves index.html
    '/index.html',
    '/manifest.json',
    // Add all icon paths here (you'll create these in Step 4)
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    // Add other assets if you have them, e.g., custom CSS, JS files
    // Note: Tailwind CSS CDN is external and won't be cached by this service worker directly.
    // For production, you might consider bundling Tailwind locally or using a different caching strategy.
];

// Install event: caches all specified assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: serves cached content when offline, or fetches from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).catch(() => {
                    // If network also fails, you might want to return a fallback page
                    // For now, it will just fail.
                    console.error('Fetch failed and no cache match for:', event.request.url);
                });
            })
    );
});

// Activate event: cleans up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
