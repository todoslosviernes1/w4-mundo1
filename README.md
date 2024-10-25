
# PWA 

Un ejemplo de PWA. para ejecutarlo: [https://jolugama.github.io/miPWA/index.html](https://jolugama.github.io/miPWA/index.html)


## Desde localhost

```console
npm install
```

```console
npm run serve
```

Hay que cambiar el archivo manifest.json, donde pone "start_url": "miPWA/", cambiarlo a "start_url": "index.html".
Esto está así para que funcione desde github, o desde cualquier web, que nunca se instala en la propia raiz / y siempre está dentro de alguna carpeta.

