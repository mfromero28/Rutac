# Ruta C Conecta

Plataforma de conexión empresarial de la Cámara de Comercio de Santa Marta.

## Estructura del proyecto

```
ruta-c-conecta/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← Toda la app (componentes + lógica)
│   ├── main.jsx       ← Punto de entrada React
│   ├── index.css      ← Reset global
│   └── App.css        ← Estilos adicionales (opcional)
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .gitignore
```

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin (Cámara) | camara@rutac.gov.co | Camara2026! |
| Emprendedor | (crear cuenta nueva) | (la que registres) |

## Correr localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

## Desplegar en Vercel

### Opción A — Desde GitHub (recomendado)

1. Sube esta carpeta a un repositorio GitHub
2. Ve a [vercel.com](https://vercel.com) → "Add New Project"
3. Importa el repositorio
4. Vercel detecta Vite automáticamente
5. Haz clic en **Deploy**

### Opción B — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Opción B — Arrastrar carpeta

1. Ejecuta `npm run build` → genera carpeta `dist/`
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Arrastra la carpeta `dist/` al área de deploy

## Variables de entorno

No se requieren variables de entorno. Todo funciona con `localStorage` del navegador.

## Build para producción

```bash
npm run build
# Genera: dist/
```

## Notas técnicas

- **Sin backend**: datos guardados en `localStorage`
- **Sin base de datos**: usuarios registrados persisten en el navegador
- **Datos reales**: 300 empresas del SII + clústeres reales del Magdalena embebidos
- **Fuente**: DM Sans (Google Fonts, cargada desde index.html)
