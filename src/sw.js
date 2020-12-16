import {precacheAndRoute} from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(self.__WB_MANIFEST);

// TODO: разобраться почему не регистрируется sw на страницах досок

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
            .catch(() => {
                if (event.request.mode === 'navigate') {
                    return new Response('offline');
                }
            }),
    );
});
