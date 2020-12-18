import {StaleWhileRevalidate, NetworkFirst} from 'workbox-strategies';
import {matchPrecache, precache} from 'workbox-precaching';
import {registerRoute, setDefaultHandler, setCatchHandler} from 'workbox-routing';

precache(self.__WB_MANIFEST);

registerRoute(
    ({request}) => request.destination === '',
    new NetworkFirst(),
);

setDefaultHandler(new StaleWhileRevalidate());

setCatchHandler(({event}) => {
    switch (event.request.destination) {
    case 'document':
        return matchPrecache('/offline.html');
    default:
        return Response.error();
    }
});
