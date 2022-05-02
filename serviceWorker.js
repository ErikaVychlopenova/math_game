

let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
    "./",
    "./style.css",
    "./manifest.json",
    "./script.js",
    "./images/favicon.ico",
    "./images/android/android-36x36.png",
    "./images/android/android-48x48.png",
    "./images/android/android-launchericon-72-72.png",
    "./images/android/android-launchericon-96-96.png",
    "./images/android/android-launchericon-144-144.png",
    "./images/android/android-launchericon-192-192.png",
    "./images/android/android-launchericon-512-512.png",
    "./images/ios/120.png",
    "./images/ios/180.png",
    "./serviceWorker.js"
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});