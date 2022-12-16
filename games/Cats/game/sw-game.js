var cacheName = '105.3.117-master';
var offlineUrl = '/offline.html';
// our fake endpoint to store data
const SHARED_DATA_ENDPOINT = '/store-data-service-worker';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(
                [
                    offlineUrl,
                ]
            );
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                // Return the offline page
                return caches.match(offlineUrl);
            })
        );
    } else if (event.request.url.match(SHARED_DATA_ENDPOINT)) {
        if (event.request.method === 'POST') {
            event.request.json().then(body => {
                caches.open(SHARED_DATA_ENDPOINT).then(function(cache) {
                    cache.put(SHARED_DATA_ENDPOINT, new Response(JSON.stringify(body)));
                });
            });
            return new Response('{}');
        } else {

            event.respondWith(
                caches.open(SHARED_DATA_ENDPOINT).then(function(cache) {
                    return cache.match(SHARED_DATA_ENDPOINT).then(function(response) {
                        return response || new Response('{}');
                    }) || new Response('{}');
                })
            );
        }

    } else {
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});
  