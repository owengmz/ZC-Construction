import { IDIOMAS } from './langs';
import type { Lang, SectionId } from '@/types';

/**
 * Mapa de rutas del sitio, con el segmento de cada página en cada idioma.
 *
 * Hasta que existió la galería, el idioma sólo cambiaba el PREFIJO de la URL
 * (`/en/...` frente a `/es/...`) y el resto del camino era idéntico, así que
 * bastaba con interpolar `lang`. La galería rompió eso: es `/en/our-work` en
 * inglés y `/es/nuestros-trabajos` en español, porque la URL es texto visible
 * —se lee en la barra, se copia en un mensaje, sale en los resultados de
 * búsqueda— y un sitio que se presenta en español con una dirección en inglés
 * se lee como una traducción a medias.
 *
 * Este módulo es la ÚNICA fuente de esa correspondencia, y de ahí su forma.
 * Depende sólo de `Lang` e `IDIOMAS`, igual que `langs.ts`, para que puedan
 * importarlo tanto un componente de cliente como el enrutador.
 */

/**
 * Páginas del sitio.
 *
 * Es una unión cerrada y no un `string` a propósito: es el mismo mecanismo que
 * `Record<ServiceId, ServiceCopy>` aplica al contenido, trasladado al enrutado.
 * Añadir un miembro aquí hace que `routeSlugs`, más abajo, deje de compilar
 * hasta declarar su segmento en LOS DOS idiomas.
 *
 * Eso no es celo de tipos: es la corrección de un fallo real. El selector de
 * idioma se escribió cuando el sitio tenía una sola página y mandaba siempre a
 * `/en` o `/es`; al aparecer la galería, cambiar de idioma desde
 * `/en/our-work` devolvía al visitante a la portada española y nada avisó.
 * Con esta unión, una tercera página no puede volver a quedarse fuera del
 * selector en silencio.
 */
export type PageRoute = 'home' | 'ourWork';

/**
 * Segmento de cada página en cada idioma, sin barras.
 *
 * La portada es la cadena vacía porque su URL es el propio prefijo de idioma
 * (`/en`), sin segmento detrás. `rutaDePagina` se encarga de que eso no
 * produzca una barra final suelta.
 *
 * Los valores de las páginas con segmento tienen que coincidir EXACTAMENTE con
 * los nombres de las carpetas de `app/[lang]/`, y con las reglas de
 * `redirects()` de `next.config.ts`. Es la única atadura del sistema que el
 * compilador no puede verificar —el enrutador de Next.js se configura con el
 * sistema de archivos, no con tipos—, así que renombrar un segmento obliga a
 * renombrar la carpeta y la redirección en el mismo commit.
 */
export const routeSlugs: Record<PageRoute, Record<Lang, string>> = {
  home: { en: '', es: '' },
  ourWork: { en: 'our-work', es: 'nuestros-trabajos' },
};

/**
 * Ruta absoluta de una página en el idioma indicado.
 *
 * @param pagina Página de destino.
 * @param lang Idioma de destino.
 * @returns Ruta con prefijo de idioma: `/es/nuestros-trabajos`, o `/es` para
 *          la portada.
 */
export function rutaDePagina(pagina: PageRoute, lang: Lang): string {
  const slug = routeSlugs[pagina][lang];
  return slug === '' ? `/${lang}` : `/${lang}/${slug}`;
}

/**
 * Ancla de una sección de la portada, con el idioma por delante.
 *
 * Existe porque las cinco secciones del sitio viven todas en la portada, y sus
 * enlaces se escribían como anclas relativas (`#services`). Eso funcionaba
 * cuando el sitio era una única página; desde `/en/our-work`, un `#services`
 * no navega a ninguna parte: se queda en `/en/our-work#services`, que es una
 * URL válida sin ninguna sección que mostrar.
 *
 * Se tipa `seccion` como `SectionId` y no como `string` porque esa unión son
 * exactamente los `id` que existen en el DOM de la portada: así no se puede
 * construir un enlace a un ancla que no lleva a ninguna parte.
 *
 * @param seccion Identificador de la sección, que coincide con su `id` en el DOM.
 * @param lang Idioma activo.
 * @returns Ruta absoluta a la portada con el ancla: `/en#services`.
 */
export function anclaDeSeccion(seccion: SectionId, lang: Lang): string {
  return `${rutaDePagina('home', lang)}#${seccion}`;
}

/**
 * Deduce en qué página está el visitante a partir del camino de la URL.
 *
 * Compara el camino sin el prefijo de idioma contra los segmentos de TODOS los
 * idiomas, no sólo el activo: así `/en/our-work` y `/es/nuestros-trabajos`
 * responden los dos `'ourWork'`, que es justo lo que necesita el selector de
 * idioma para saltar de uno a otro.
 *
 * Ante un camino desconocido devuelve `'home'` en lugar de fallar. Es la
 * decisión correcta para quien la llama: el selector de idioma prefiere mandar
 * a la portada del otro idioma antes que romperse en una URL que no reconoce.
 *
 * @param pathname Camino de la URL actual, tal como lo entrega `usePathname()`.
 * @returns La página correspondiente, o `'home'` si no se reconoce.
 */
export function paginaDeRuta(pathname: string): PageRoute {
  const segmentos = pathname.split('/').filter(Boolean);

  // El primer segmento es el idioma; el resto identifica la página.
  const resto = segmentos.slice(1).join('/');

  const paginas = Object.keys(routeSlugs) as PageRoute[];
  const encontrada = paginas.find((pagina) =>
    IDIOMAS.some((idioma) => routeSlugs[pagina][idioma] === resto),
  );

  return encontrada ?? 'home';
}
