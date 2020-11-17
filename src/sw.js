import {precacheAndRoute} from 'workbox-precaching/precacheAndRoute';

console.log('this is my custom service worker');

precacheAndRoute(['/']);
precacheAndRoute(self.__WB_MANIFEST);
