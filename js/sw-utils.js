// limpiarCache(cacheName, numeroItems => {
//     caches.open(cacheName).then(
//         cache => cache.keys().then(
//             keys => {
//                 if (keys.length > numeroItems) {
//                     console.log('se limpia caché sobrante de acuerdo al límite');
//                     cache.delete(keys[0]).then(limpiarCache(cacheName, numeroItems));
//                 }
//             }
//         ));
// })


function limpiarCache(cacheName, numeroItems){
    caches.open(cacheName).then(
        cache => cache.keys().then(
            keys => {
                if (keys.length > numeroItems) {
                    console.log('se limpia caché sobrante de acuerdo al límite');
                    cache.delete(keys[0]).then(limpiarCache(cacheName, numeroItems));
                }
            }
        ));
}
