import type { ImageAsset } from '@/types';

/**
 * Fotografía de fondo del hero.
 *
 * Es el elemento LCP de la página, así que es la que más gana con `next/image`:
 * el archivo de `public/images/` nunca se sirve tal cual, sino reescalado y
 * recodificado al ancho real del dispositivo.
 *
 * Vive en `public/images/` y no en la raíz de `public/` porque `ImageAsset.src`
 * está tipado como `/images/${string}`: la carpeta no es una convención de
 * orden, es el contrato que impide declarar aquí una ruta que `next/image` no
 * vaya a poder optimizar.
 *
 * `width` y `height` son los del archivo —1659×948, proporción 7∶4— y no un
 * tamaño de diseño. El original mide eso, así que ese es el techo real de
 * resolución: pedirle más a `next/image` sólo produciría un reescalado hacia
 * arriba, más pesado y no más nítido.
 *
 * `blurDataURL` es una miniatura de 16 px de ancho en WebP, 98 bytes. Va
 * incrustada en el HTML, así que se pinta en el primer fotograma y cubre el
 * hueco mientras llega la imagen definitiva. Se regenera con la foto: si se
 * cambia una y no la otra, el desenfoque de entrada es el de la imagen vieja.
 */
export const heroBackground: ImageAsset = {
  src: '/images/hero-background.webp',
  width: 1659,
  height: 948,
  blurDataURL:
    'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAQCdASoQAAkAA4BaJQBOgCFK2GjD4AD+4Z/2/HSVbifO/iN6vUJI5n8J1/P6Fe4VG8Ok0rAipymEw1M/5SaGMBQNCC2GAuN8/KW5gAA=',
};
