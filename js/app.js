var url= window.location.href;
var swLocation = '/miPWA/sw.js';
// si estamos en localhost
if (navigator.serviceWorker) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        swLocation = '/sw.js';
    }
    navigator.serviceWorker.register(swLocation);
}
