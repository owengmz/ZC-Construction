# Zycor Construction LLC — Landing Page

Landing page bilingüe (EN/ES) para **Zycor Construction LLC**, constructora especializada en Framing, Interior & Exterior Renovation y Roofing en New Jersey, USA.

## Stack

- HTML5 semántico
- Tailwind CSS local + PostCSS + Autoprefixer
- JavaScript vanilla con módulos ES
- Vite como servidor de desarrollo y builder
- GSAP para animaciones y ScrollTrigger
- Tipografía local: Montserrat + Inter en WOFF2
- SVG inline para iconos + SVG locales para redes sociales
- Formspree para envío de formulario de contacto
- Deploy: GitHub + Vercel

## Instalación local

```bash
git clone https://github.com/owengmz/ZC-Construction.git
cd zc-construction
npm install
npm run dev
```

Luego abrir `index.html` en el navegador o usar el servidor de desarrollo de Vite.

## Scripts disponibles

- `npm run dev` — inicia el modo de desarrollo con hot reload
- `npm run build` — genera la versión de producción en `dist/`
- `npm run preview` — sirve el build de producción localmente

## Build para producción

```bash
npm run build
```

Genera una versión lista para deploy en la carpeta `dist/`.

## Estructura del proyecto

```
zc-construction/
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
├── public/
│   └── site.webmanifest
├── dist/                ← build de producción generado
├── assets/
│   ├── css/
│   │   ├── input.css    ← fuente Tailwind
│   │   └── main.css     ← CSS compilado
│   ├── fonts/           ← tipografías WOFF2 locales
│   ├── icons/           ← SVGs locales de redes sociales
│   ├── images/
│   │   └── services/    ← fotos de servicios
│   └── js/
│       ├── animations/  ← animaciones GSAP por sección
│       ├── contact-form.js
│       ├── lang-toggle.js
│       ├── lightbox.js
│       ├── main.js
│       ├── mobile-menu.js
│       ├── warranty-modal.js
│       └── whatsapp-fab.js
├── README.md
└── .gitignore
```

## Funcionalidades principales

- Página responsive con menú móvil
- Toggle de idioma EN/ES con persistencia en localStorage
- Zoom lightbox para galería de imágenes
- Botón flotante de WhatsApp con opciones desplegables
- Modal de garantía con cierre por overlay y Escape
- Formulario de contacto que envía a Formspree
- Animaciones de entrada y scroll con GSAP

## Contacto del cliente

- WhatsApp Owner: +1 (504) 644-1551
- WhatsApp Partner: +1 (609) 205-0407
- Instagram: [@zycorconstruction](https://www.instagram.com/zycorconstruction)
- Facebook: [Zycor Construction](https://www.facebook.com/share/14fTeMFDBA5/)
