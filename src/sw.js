import {precacheAndRoute} from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(['/']);
precacheAndRoute(self.__WB_MANIFEST);

// TODO: разобраться почему не регистрируется sw на страницах досок
