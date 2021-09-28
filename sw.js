const CACHE_NAME = 'firstpwa';
var urlsToCache = [
	'/',
	'/index.html',
];

self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
})

self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheName != CACHE_NAME){	
						console.log("ServiceWorker: cache " + cacheName + " dihapus");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
})

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request, {cacheName:CACHE_NAME})
      .then(function(response) {
        if (response) {
          return response;
        }
  
        var fetchRequest = event.request.clone();
  
        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200) {
              return response;
            }
  
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
  
            return response;
          }
        );
      })
    );
  });

  self.addEventListener('activate', function(event) {
    console.log('Aktivasi service worker baru');
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME && cacheName.startsWith("hehe")) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });