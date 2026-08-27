import type { ImageAsset } from '@/types';

/**
 * Fotografía de fondo del hero.
 *
 * Es la imagen más pesada del sitio (1,4 MB de origen) y el elemento LCP de la
 * página, así que es la que más gana con `next/image`: el archivo de
 * `public/images/` nunca se sirve tal cual, sino reescalado y recodificado al
 * ancho real del dispositivo.
 *
 * `blurDataURL` es una miniatura de 16 px de ancho en WebP, 76 bytes. Va
 * incrustada en el HTML, así que se pinta en el primer fotograma y cubre el
 * hueco mientras llega la imagen definitiva.
 */
export const heroBackground: ImageAsset = {
  src: '/fondo-hero.png',
  width: 2048,
  height: 1172,
  blurDataURL:
    'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAkAA4BaJZQCdAEN512KgAD+h2tiZaZ7hV0dnuAw8j30VNG8NVVuoCJ4XGYUaU/cAA==',
};
