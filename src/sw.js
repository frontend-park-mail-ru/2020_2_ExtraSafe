import {NetworkFirst, CacheFirst, NetworkOnly} from 'workbox-strategies';
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

registerRoute(
    /\/static\/files\/*/,
    new NetworkOnly(),
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
