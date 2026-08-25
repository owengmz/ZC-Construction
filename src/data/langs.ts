import type { Lang } from '@/types';

/**
 * Idiomas soportados, en orden de presentación, y la guarda de tipo asociada.
 *
 * Vive en su propio archivo —y no junto al diccionario de `content.ts`— porque
 * el middleware necesita validar el idioma de una URL en el runtime del edge.
 * Si importara `content.ts` arrastraría los dos archivos de contenido enteros
 * al bundle del middleware, unos 30 KB de texto para resolver una redirección.
 * Este módulo no depende de nada.
 */
export const IDIOMAS: readonly Lang[] = ['en', 'es'];

/** Idioma de partida, igual que en el sitio actual. */
export const IDIOMA_POR_DEFECTO: Lang = 'en';

/**
 * Comprueba si un valor desconocido es un idioma soportado.
 *
 * Necesaria en dos frentes donde el valor llega como `string` sin garantías:
 * el segmento `[lang]` de la URL, que puede ser cualquier cosa que alguien
 * escriba en la barra de direcciones, y la cookie de preferencia, que puede
 * estar manipulada o ser residuo de una versión anterior.
 *
 * @param valor Valor a comprobar.
 * @returns `true` si es un idioma soportado, estrechando el tipo a `Lang`.
 */
export function esLang(valor: unknown): valor is Lang {
  return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor);
}
