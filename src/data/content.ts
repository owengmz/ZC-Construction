import type { ContentByLang } from '@/types';
import { contentEn } from './content.en';
import { contentEs } from './content.es';

/**
 * Diccionario de contenidos indexado por idioma.
 *
 * Es la última pieza de la capa de datos y la que consume `LangContext` para
 * resolver `content` a partir de `lang`.
 *
 * El tipo `ContentByLang` es `Record<Lang, SiteContent>`, así que si algún día
 * se añade un idioma a la unión `Lang`, el compilador reclama aquí el archivo
 * de contenido correspondiente antes de dejar construir. Ese es el segundo
 * eslabón de la garantía: `SiteContent` obliga a traducir todas las claves de
 * un idioma, y este `Record` obliga a que exista el idioma entero.
 */
export const contentByLang: ContentByLang = {
  en: contentEn,
  es: contentEs,
};
