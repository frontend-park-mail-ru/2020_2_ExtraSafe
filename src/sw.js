import {NetworkFirst, CacheFirst} from 'workbox-strategies';
import {matchPrecache, precache} from 'workbox-precaching';
import {registerRoute, setDefaultHandler, setCatchHandler} from 'workbox-routing';

precache(self.__WB_MANIFEST);

registerRoute(
    ({request}) => request.destination === '',
    new NetworkFirst(),
);

registerRoute(
    ({request}) => request.destination === 'document',
    new NetworkFirst(),
);

setDefaultHandler(new CacheFirst());

setCatchHandler(({event}) => {
    switch (event.request.destination) {
    case 'document':
        return matchPrecache('/offline.html');
    default:
        return Response.error();
    }
});
