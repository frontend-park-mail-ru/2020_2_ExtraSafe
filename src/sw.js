// import 'regenerator-runtime/runtime.js';
import {precacheAndRoute} from 'workbox-precaching';
// import {matchPrecache} from 'workbox-precaching';
// import {setCatchHandler} from 'workbox-routing';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate(),
);

registerRoute(
    ({request}) => request.destination === 'image',
    new StaleWhileRevalidate(),
);

// setCatchHandler(async ({event}) => {
//     if (event.request.destination === 'document') {
//         return matchPrecache('/offline.html');
//     }
//
//     return Response.error();
// });
