# San Diego Bucket List 2026

Bucket list interactiva del viaje a San Diego (May 29 → Jun 3, 2026). Mapa con Leaflet + checklist con persistencia en `localStorage`. Sin build, todo estático.

## Estructura

```
san-diego-bucket-list/
├── index.html       # Markup + carga Leaflet desde CDN
├── styles.css       # Estilos (mobile-first, 2 columnas desktop ≥900px)
├── data.js          # SECTIONS[] — items con lat/lng, tags, descripciones
├── app.js           # Render, mapa, markers, toggle done, localStorage
└── README.md
```

Editar el contenido = editar `data.js`. Cada item tiene `id`, `name`, `desc`, `tags[]`, `lat`, `lng`, y opcionalmente `zoom` (default 15) y `recommended: true`.

## Correr localmente

Cualquier servidor estático sirve. La forma más rápida:

```bash
cd ~/san-diego-bucket-list
python3 -m http.server 8000
# abre http://localhost:8000
```

Abrir `index.html` directo con `file://` también funciona — los tiles de CARTO cargan sin problema.

## Deploy a GitHub Pages

1. Crear el repo en GitHub (no inicializar con README, ya hay uno):

   ```bash
   gh repo create san-diego-bucket-list --public --source=. --remote=origin --push
   ```

   o manualmente:
   ```bash
   git remote add origin git@github.com:<tu-usuario>/san-diego-bucket-list.git
   git push -u origin main
   ```

2. En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`**.

3. Esperar ~30s. El sitio queda en `https://<tu-usuario>.github.io/san-diego-bucket-list/`.

No hace falta build, action, ni configuración extra — son tres archivos estáticos en raíz.

## Persistencia

El estado de la checklist vive en `localStorage` bajo la key `sd-bucket-list-v1`. Es un objeto `{ [itemId]: true }`. Para borrar todo: botón **Reset** en el header o `localStorage.removeItem('sd-bucket-list-v1')` en consola.

## Interacción

- **Click en una card** → el mapa hace `flyTo` a esa ubicación y abre el popup del marker.
- **Click en el círculo de la izquierda de una card** → marca como completado (persistido).
- **Click en un marker del mapa** → resalta la card y hace scroll a ella.
