import type { GalleryEntry, ProjectCopy, SiteContent } from '@/types';

/**
 * Catálogo de obras de la galería completa.
 *
 * Esta lista está pensada para que la mantenga el dueño del negocio, no quien
 * escribe el código. Añadir una obra terminada es copiar el último bloque,
 * cambiar los seis campos y guardar: no hay que tocar TypeScript, ni los
 * archivos de idioma, ni acordarse de ningún identificador que haya que
 * declarar en otro sitio. El razonamiento completo está en el comentario de
 * `GalleryEntry`, en `types/index.ts`.
 *
 * ── Cómo añadir una obra ──
 *
 *   1. Copiar las dos fotos a `public/images/` (antes y después).
 *   2. Añadir un bloque al final del array con:
 *      - `id`        : identificador propio, en minúsculas y con guiones.
 *                      Basta con que no se repita: `techado-paterson-2026`.
 *      - `category`  : 'framing' | 'renovation' | 'roofing' | 'other'.
 *      - `location`  : ciudad y estado tal cual se leen: 'Paterson, NJ'.
 *      - `before` / `after` : ruta y dimensiones REALES del archivo.
 *      - `featured`  : `true` sólo si debe salir en la portada.
 *   3. No hace falta `copyId`: es para las tres obras migradas.
 *
 * `width` y `height` deben ser las dimensiones intrínsecas del archivo, no el
 * tamaño con el que se ve. Si se equivocan, `next/image` reserva un hueco de la
 * proporción incorrecta y la página da un salto al cargar la foto.
 *
 * ── Sobre `data/projects.ts` ──
 *
 * Este archivo lo sustituye. Aquel sigue en el repositorio a petición expresa,
 * pero ya no lo consume nadie: la portada y la galería leen los dos de aquí.
 * Cuando se dé por cerrada la migración, `projects.ts`, el tipo `Project` y la
 * unión `ProjectId` se pueden borrar; lo único que habrá que resolver antes es
 * el `copyId` de las tres entradas de abajo, que apunta a `ProjectId`.
 */
export const gallery: readonly GalleryEntry[] = [
  {
    id: 'framing-newark',
    category: 'framing',
    location: 'Newark, NJ',
    before: { src: '/images/framing.webp', width: 1200, height: 1600 },
    after: { src: '/images/roofing-finished.webp', width: 1200, height: 1600 },
    featured: true,
    copyId: 'framing-newark',
  },
  {
    id: 'roofing-trenton',
    category: 'roofing',
    location: 'Trenton, NJ',
    before: { src: '/images/roofing.webp', width: 1200, height: 1600 },
    after: { src: '/images/roofing-after.webp', width: 1200, height: 1600 },
    featured: true,
    copyId: 'roofing-trenton',
  },
  {
    id: 'renovation-jersey-city',
    category: 'renovation',
    location: 'Jersey City, NJ',
    before: { src: '/images/renovation-interior-before.webp', width: 1200, height: 1600 },
    after: { src: '/images/renovation-interior-after.webp', width: 1200, height: 1600 },
    featured: false,
    copyId: 'renovation-jersey-city',
  },
];

/**
 * Separador entre servicio y ubicación en la etiqueta de la ficha.
 *
 * Es una raya (—) con espacios, no un guion: reproduce el formato que ya
 * tenían escrito a mano las etiquetas de `PortfolioContent.items`
 * ("Framing — Newark, NJ"), de modo que las obras compuestas y las tres
 * migradas se leen exactamente igual.
 */
const SEPARADOR_ETIQUETA = ' — ';

/**
 * Sustituye los marcadores `{category}` y `{location}` de una plantilla.
 *
 * Mínima a propósito: no es un motor de plantillas, son dos reemplazos. Se
 * escribe aquí en vez de traer una dependencia porque el sitio no necesita
 * nada más, y una interpolación de plantilla nativa no sirve: el texto viene
 * de los archivos de contenido en tiempo de ejecución, no del código.
 *
 * @param plantilla Texto con los marcadores, tal como llega del idioma activo.
 * @param categoria Etiqueta del servicio, ya traducida.
 * @param ubicacion Ciudad y estado.
 * @returns La plantilla con los dos marcadores resueltos.
 */
function interpolar(plantilla: string, categoria: string, ubicacion: string): string {
  return plantilla.replace('{category}', categoria).replace('{location}', ubicacion);
}

/**
 * Resuelve los textos visibles de una entrada en el idioma activo.
 *
 * Dos caminos, y el orden importa:
 *
 *  1. Si la entrada declara `copyId`, gana el texto artesanal de
 *     `PortfolioContent.items`. Son las tres obras migradas, cuyos textos
 *     alternativos describen lo que se ve en cada foto ("Bathroom stripped to
 *     the studs with plumbing rough-in"), algo que ninguna plantilla puede
 *     igualar.
 *  2. Si no, se compone: la etiqueta a partir del servicio traducido y la
 *     ubicación, y los textos alternativos a partir de las plantillas del
 *     idioma. Genérico pero correcto, y sobre todo: automático.
 *
 * Devuelve un `ProjectCopy` —el mismo tipo que consume `ProjectCard`— para que
 * la ficha no tenga que saber de cuál de los dos caminos vino su texto.
 *
 * @param entrada Obra de la galería.
 * @param content Contenido completo del idioma activo.
 * @returns Etiqueta y textos alternativos listos para la ficha.
 */
export function textosDeEntrada(entrada: GalleryEntry, content: SiteContent): ProjectCopy {
  if (entrada.copyId !== undefined) {
    return content.portfolio.items[entrada.copyId];
  }

  const categoria = content.contact.form.serviceOptions[entrada.category];

  return {
    label: `${categoria}${SEPARADOR_ETIQUETA}${entrada.location}`,
    beforeAlt: interpolar(content.gallery.beforeAltTemplate, categoria, entrada.location),
    afterAlt: interpolar(content.gallery.afterAltTemplate, categoria, entrada.location),
  };
}
