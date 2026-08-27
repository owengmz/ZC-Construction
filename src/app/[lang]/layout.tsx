import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Oswald, Work_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { LangProvider } from '@/context/LangContext';
import { contentByLang } from '@/data/content';
import { esLang, IDIOMAS } from '@/data/langs';
import { COLOR_TEMA, siteConfig } from '@/data/site';

import '../globals.css';

/**
 * Las tres familias del rediseño, servidas por `next/font`.
 *
 * `next/font/google` descarga los archivos en tiempo de build y los sirve desde
 * el propio dominio: no hay petición a fonts.gstatic.com en tiempo de ejecución
 * y por tanto no hay salto de estilo ni fuga de IP del visitante a un tercero.
 * Sustituyen a los cuatro `@font-face` de Inter y Montserrat que había en
 * `globals.css`, escritos a mano.
 *
 * `variable` expone cada familia como custom property, que es lo que consumen
 * los tokens `--font-heading`, `--font-body` y `--font-mono`. Así ningún
 * componente nombra una fuente concreta: si mañana cambia la tipografía, se
 * cambia aquí y en los tres tokens, no en veinte CSS Modules.
 *
 * Se declaran fuera del componente a propósito: `next/font` exige que la
 * llamada sea estática para poder resolverla en el build.
 */
const oswald = Oswald({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-oswald',
});

const workSans = Work_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-work-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

/**
 * Layout raíz de cada idioma.
 *
 * Es el layout raíz de verdad —el que renderiza `<html>` y `<body>`— y no
 * `app/layout.tsx`, que ya no existe. El motivo es que el atributo `lang` del
 * `<html>` tiene que salir correcto del servidor, y sólo se conoce dentro del
 * segmento `[lang]`. Con un layout por encima, `<html lang>` estaría fijado
 * antes de saber en qué idioma se va a renderizar la página.
 *
 * Quien entra por `/` no llega aquí directamente: lo redirige `middleware.ts`.
 */

interface LangLayoutProps {
  readonly children: ReactNode;
  /**
   * En Next.js 15 los parámetros de ruta llegan como promesa, de ahí el `await`
   * en los componentes de abajo.
   *
   * Se tipa como `string` y no como `Lang` a propósito: el enrutador entrega
   * literalmente lo que hay en la URL, y eso puede ser `/fr` o `/../algo`.
   * Prometer `Lang` aquí sería mentirle al compilador; el estrechamiento se
   * hace con la guarda `esLang`.
   */
  readonly params: Promise<{ lang: string }>;
}

/**
 * Declara las rutas a prerenderizar en el build: `/en` y `/es`.
 *
 * Junto con `dynamicParams = false`, hace que ambas salgan como HTML estático
 * y que cualquier otro idioma devuelva 404 en lugar de intentar renderizarse.
 */
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

/**
 * Ajustes del viewport y del `<head>` que no dependen del idioma.
 *
 * En Next.js 15 `themeColor` y `colorScheme` viajan en su propio export y no en
 * `metadata`: son directivas de presentación del navegador, no descripción del
 * documento. Ninguno de los dos existía en el sitio anterior.
 *
 *  - `themeColor` tiñe la barra del navegador en Android y la barra de estado
 *    en iOS; sin él, el sistema pinta blanco sobre un sitio negro.
 *  - `colorScheme: 'dark'` declara que el sitio SÓLO tiene tema oscuro. El
 *    navegador lo usa para pintar en oscuro los controles nativos —los del
 *    formulario de contacto y las barras de desplazamiento—, que hasta ahora
 *    salían claros sobre fondo negro.
 */
export const viewport: Viewport = {
  themeColor: COLOR_TEMA,
  colorScheme: 'dark',
};

/**
 * Metadatos por idioma.
 *
 * Cubre las tres familias de etiquetas del `<head>`: identidad del documento
 * (título, descripción), enrutado por idioma (`canonical` y `hreflang`, que
 * sólo tienen sentido porque cada idioma vive en su propia URL) e iconos y
 * previsualización al compartir.
 *
 * @param params Parámetros de ruta con el idioma.
 * @returns Metadatos del documento en el idioma correspondiente.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!esLang(lang)) return {};

  const { meta } = contentByLang[lang];

  /**
   * Imagen de compartición en el formato que espera la Metadata API.
   *
   * Se declara una vez y se reutiliza en Open Graph y en Twitter: el sitio
   * anterior repetía la misma URL en dos etiquetas, con el riesgo de cambiar
   * una y olvidar la otra.
   */
  const ogImage = {
    url: siteConfig.ogImage.src,
    width: siteConfig.ogImage.width,
    height: siteConfig.ogImage.height,
    alt: meta.ogImageAlt,
  };

  return {
    metadataBase: new URL(siteConfig.url),
    title: meta.title,
    description: meta.description,

    /**
     * Iconos servidos desde `public/`, tal y como los dejó el generador de
     * favicons del sitio anterior. No se usa la convención de archivo de
     * Next.js (`app/icon.png`, `app/apple-icon.png`) a propósito: obligaría a
     * mover los archivos dentro de `app/` y a renombrarlos, y aquí el objetivo
     * es que los mismos bytes que hoy están en producción sigan sirviéndose en
     * las mismas URLs.
     *
     * `favicon.ico` contiene tres resoluciones (16, 32 y 48 px) y es el que
     * usan los navegadores de escritorio; los PNG son el respaldo moderno.
     */
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      // Icono del atajo en la pantalla de inicio de iOS, que no lee el
      // manifiesto: Safari sólo mira esta etiqueta.
      apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
    alternates: {
      canonical: `/${lang}`,
      /**
       * `hreflang` para que los buscadores sepan que ambas URLs son la misma
       * página en dos idiomas, y no contenido duplicado. `x-default` marca a
       * dónde mandar a quien no encaje en ninguno de los dos.
       */
      languages: {
        'en-US': '/en',
        'es-US': '/es',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `/${lang}`,
      locale: meta.ogLocale,
      /**
       * Declara la existencia de la otra versión lingüística. Facebook y
       * LinkedIn lo usan para servir la tarjeta en el idioma del lector cuando
       * pueden; el sitio anterior sólo lo declaraba desde el inglés, porque no
       * tenía una URL española que anunciar.
       */
      alternateLocale: lang === 'en' ? 'es_US' : 'en_US',
      siteName: siteConfig.legalName,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: [ogImage],
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  // Red de seguridad además de `dynamicParams = false`, y a la vez lo que
  // convierte `string` en `Lang` para el resto de la función.
  if (!esLang(lang)) notFound();

  return (
    /**
     * Las tres clases de `next/font` van en el `<html>` para que las custom
     * properties de familia existan en el ámbito raíz, que es donde
     * `globals.css` las lee al definir `--font-heading`, `--font-body` y
     * `--font-mono`. Puestas en el `<body>` funcionarían igual para el
     * contenido, pero no para nada que se pinte fuera de él.
     */
    <html lang={lang} className={`${oswald.variable} ${workSans.variable} ${plexMono.variable}`}>
      <body>
        <LangProvider lang={lang}>
          {/*
           * Barra, pie y botón flotante viven aquí desde que el sitio tiene más
           * de una ruta: la galería completa (`/[lang]/our-work`) necesita la
           * misma envoltura que la portada. Estaban en `page.tsx` con una nota
           * que anticipaba exactamente este movimiento.
           */}
          <Navbar />
          {children}
          <Footer />
          <WhatsAppFab />
        </LangProvider>
      </body>
    </html>
  );
}
