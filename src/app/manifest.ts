import type { MetadataRoute } from 'next';

import { IDIOMA_POR_DEFECTO } from '@/data/langs';
import { COLOR_TEMA, siteConfig } from '@/data/site';

/**
 * Manifiesto de aplicación web, servido en `/manifest.webmanifest`.
 *
 * Sustituye a `public/site.webmanifest`, que venía del generador de favicons
 * del sitio anterior con `name` y `short_name` VACÍOS: al instalar el sitio en
 * el escritorio o en la pantalla de inicio, el atajo se quedaba sin nombre y el
 * navegador acababa inventándolo a partir del `<title>`, que mide 63
 * caracteres. También declaraba `theme_color: '#ffffff'` en un sitio de tema
 * oscuro único, lo que pintaba de blanco la barra del navegador en Android.
 *
 * Se implementa como ruta y no como archivo estático por una razón concreta:
 * el nombre de la empresa y los colores ya existen en `data/site.ts` y en
 * `globals.css`. Un JSON suelto los duplicaría, y un manifiesto desactualizado
 * es de los errores que nadie ve hasta que alguien instala el sitio.
 *
 * Vive en la raíz de `app/` —fuera del segmento `[lang]`— porque el manifiesto
 * es uno solo para todo el dominio: no hay un manifiesto por idioma.
 */

/**
 * Fuerza la generación estática del manifiesto en el build.
 *
 * Sin esto, Next.js lo trata como ruta dinámica y lo ejecuta en cada petición.
 * El contenido es constante, así que se calcula una vez y se sirve como
 * archivo, igual que `/en` y `/es`.
 */
export const dynamic = 'force-static';

/**
 * Construye el manifiesto a partir de la configuración del sitio.
 *
 * @returns Manifiesto tipado; Next.js lo serializa a `/manifest.webmanifest`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.legalName,
    // El nombre corto aparece bajo el icono en la pantalla de inicio, donde
    // Android recorta alrededor de los 12 caracteres. "Zycor Construction LLC"
    // se vería como "Zycor Constr…", así que se abrevia a la marca.
    short_name: 'Zycor',

    /**
     * El manifiesto no tiene idioma de ruta: es un único archivo para todo el
     * dominio. Se declara el idioma por defecto del sitio y se usa su
     * descripción, que es la que verá quien instale el sitio con independencia
     * del idioma en el que estuviera navegando.
     */
    lang: IDIOMA_POR_DEFECTO,
    description:
      'Zycor Construction LLC — Expert Framing, Interior & Exterior Renovation and Roofing in New Jersey. Licensed & Insured.',

    /**
     * Se apunta a la raíz y no a `/en`: quien abra el sitio instalado pasa por
     * el middleware, que lo lleva a su idioma según la cookie que ya tenga
     * guardada. Fijar `/en` aquí congelaría el inglés para siempre en el atajo
     * de alguien que navega en español.
     */
    start_url: '/',

    // Heredado del sitio anterior. Es una landing de una sola página, así que
    // el modo de presentación apenas se nota; se conserva por paridad.
    display: 'standalone',

    background_color: COLOR_TEMA,
    theme_color: COLOR_TEMA,

    /**
     * Los dos iconos que pide Android: 192 px para la pantalla de inicio y
     * 512 px para la pantalla de bienvenida al abrir la aplicación instalada.
     * Ambos siguen en `public/`, servidos tal cual desde la raíz.
     */
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
