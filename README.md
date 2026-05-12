# Zycor Construction LLC — Landing Page

Landing page bilingüe (EN/ES) para **Zycor Construction LLC**, constructora especializada en Framing, Interior & Exterior Renovation y Roofing en New Jersey, USA.

## Stack

- HTML5 semántico
- Tailwind CSS (instalación local via npm)
- JavaScript vanilla (sin dependencias)
- Google Fonts: Montserrat + Inter
- Iconos: SVG inline (Heroicons) + archivos SVG locales para redes sociales
- Deploy: GitHub + Vercel

## Instalación local

```bash
git clone https://github.com/owengmz/ZC-Construction.git
cd zycor-construction
npm install
npm run dev        # watch mode — recarga CSS al guardar
```

Abrir `index.html` en el navegador o usar Live Server en VS Code.

## Build para producción

```bash
npm run build
```

Genera `assets/css/main.css` minificado listo para deploy.

## Estructura

```
zc-construction/
├── index.html
├── package.json
├── tailwind.config.js
├── .gitignore
├── README.md
├── CONTEXTO_PROYECTO.md
└── assets/
    ├── css/
    │   ├── input.css        ← fuente Tailwind
    │   └── main.css         ← CSS compilado
    ├── js/
    │   ├── lang-toggle.js   ← toggle EN/ES
    │   ├── whatsapp-fab.js  ← FAB desplegable WhatsApp
    │   └── mobile-menu.js   ← menú hamburguesa
    ├── images/
    │   └── services/        ← Logo.webp + fotos de servicios
    └── icons/               ← SVGs de redes sociales
```

## Contacto del cliente

- WhatsApp Owner: +1 (504) 644-1551
- WhatsApp Partner: +1 (609) 205-0407
- Instagram: [@zycorconstruction](https://www.instagram.com/zycorconstruction)
- Facebook: [Zycor Construction](https://www.facebook.com/share/14fTeMFDBA5/)
