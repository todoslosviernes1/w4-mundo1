// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;


function limpiarCache(cacheName, numeroItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > numeroItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numeroItems));
                    }
                });
        });
}

self.addEventListener('install', e => {
    const cacheProm = caches.open(CACHE_STATIC_NAME).then(cache => {
        return cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/img/main.jpg',
            '/js/app.js',
            '/img/no-image.png'
        ]);
    });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(
        cache => cache.add('https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css')
    );
    e.waitUntil(Promise.all([cacheProm, cacheInmutable]));

});



self.addEventListener('fetch', e => {
    // // 1- Cache Only
    // // caches busca todos los cachés del mismo dominio. Para ello hay que registrar todo en el evento install.
    // e.respondWith(caches.match(e.request));


    // // 2- Cache with Network Fallback
    // Busca primero en recurso en el cache, si no lo encuentra, busca en internet.

    // const respuesta = caches.match(e.request).then(res => {
    //         // si existe en la caché, devuelve el recurso de la cache
    //         if (res) return res;
    //         // No existe el archivo en cache. Hay que buscarlo en internet
    //         console.log('No existe en el cacheado', e.request.url);
    //         return fetch(e.request).then(newResp => {
    //             // abro caché y...
    //             caches.open(CACHE_DYNAMIC_NAME)
    //             .then(cache => {
                        // limpiarCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);

                        // // para evitar un error de chrome-extension.
                        // if (!/^https?:$/i.test(new URL(e.request.url).protocol)) return;
    //                     cache.put(e.request, newResp);
    //                 });
    //             return newResp.clone();
    //         });
    //     });
    // e.respondWith(respuesta);


    // // 3- Network with cache fallback
    // const respuesta = fetch(e.request).then(res => {
    //     // si no está cacheada, lo busca de internet
    //     if (!res) return caches.match(e.request);
    //     caches.open(CACHE_DYNAMIC_NAME)
    //         .then(cache => {
    //             limpiarCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);

    //             // para evitar un error de chrome-extension.
    //             if (!/^https?:$/i.test(new URL(e.request.url).protocol)) return;
    //             cache.put(e.request, res);
    //         });
    //     return res.clone();
    // }).catch(err => {
    //     return caches.match(e.request);
    // });
    // e.respondWith(respuesta);


    // // 4- Cache with network update
    // // Muestra lo que se tiene en cache, para ser más rápido, y 
    // // guarda de internet el nuevo cacheado, por lo que siempre
    // //  estaremos viendo una vs antigua, pero de una forma más rápida 
    // //  al estar ya cacheada.
    // if ( e.request.url.includes('bootstrap') ) {
    //     return e.respondWith( caches.match( e.request ) );
    // }

    // // Busca y abre el cache estático
    // const respuesta = caches.open( CACHE_STATIC_NAME ).then( cache => {
    //     // e.request --> va a internet. El fech se hará despues del return
    //     // ya que tarda más en recuperar los nuevos datos.
    //     fetch( e.request ).then( newRes => 
    //             // cachea el recurso
    //             cache.put( e.request, newRes ));
    //             // retorna el cacheado anterior
    //     return cache.match( e.request );
    // });
    // e.respondWith( respuesta );


    // 5- Cache & Network Race
    // Compite entre lo cacheado y lo que encuentra en internet simultáneamente,
    //  muestra quien sea la más rápida.
    const respuesta = new Promise((resolve, reject) => {
        let isRejected = false; // es rechazada?
        const failedOnce = () => { //falla una vez
            if (isRejected) {
                // si no encuentra una imagen, pongo una por defecto
                if (/\.(png|jpg)$/i.test(e.request.url)) {
                    resolve(caches.match('/img/no-image.png'));
                } else {
                    reject('No se encontro respuesta');
                }
            } else {
                isRejected = true;
            }
        };
        
        // busca en internet
        fetch(e.request).then(res => {
            res.ok ? resolve(res) : failedOnce();
        }).catch(failedOnce);

        // busca en caché
        caches.match(e.request).then(res => {
            res ? resolve(res) : failedOnce();
        }).catch(failedOnce);
    });
    e.respondWith(respuesta);


});