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
 *      - `featured`  : `true` sólo si debe salir en la portada, y sólo en UNA
 *                      obra a la vez: la composición de la portada está
 *                      calculada para una sola ficha junto al panel de vídeo.
 *                      Marcar una segunda no rompe nada —la portada enseña la
 *                      primera— pero tampoco la muestra.
 *   3. No hace falta `copyId`: es para las tres obras migradas.
 *
 * `width` y `height` deben ser las dimensiones intrínsecas del archivo, no el
 * tamaño con el que se ve. Si se equivocan, `next/image` reserva un hueco de la
 * proporción incorrecta y la página da un salto al cargar la foto.
 *
 * ── Lo que queda del modelo anterior ──
 *
 * Este archivo sustituyó a `data/projects.ts`, que se borró en la limpieza
 * previa al merge junto con el tipo `Project`: ya no lo consumía nadie, porque
 * la portada y la galería leen las dos de aquí.
 *
 * Sobrevive la unión `ProjectId`, y no por descuido: la sostienen el `copyId`
 * de las tres entradas de abajo y el `Record<ProjectId, ProjectCopy>` de
 * `PortfolioContent.items`, que es donde viven los textos artesanales de esas
 * tres obras. Retirarla exige antes decidir qué pasa con esos textos, así que
 * es tarea aparte y no un cabo suelto de aquella.
 */
export const gallery: readonly GalleryEntry[] = [
  {
    id: 'framing-newark',
    category: 'framing',
    location: 'Newark, NJ',
    before: { src: '/images/framing.webp', width: 1200, height: 1600 },
    after: { src: '/images/roofing-finished.webp', width: 1200, height: 1600 },
    featured: false,
    copyId: 'framing-newark',
  },
  {
    id: 'roofing-trenton',
    category: 'roofing',
    location: 'Trenton, NJ',
    before: { src: '/images/roofing.webp', width: 1200, height: 1600 },
    after: { src: '/images/roofing-after.webp', width: 1200, height: 1600 },
    featured: false,
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
  /*
   * Porche cubierto: la obra que hoy abre la portada.
   *
   * Es la primera entrada sin `copyId`, o sea la primera que compone sus textos
   * con las plantillas del idioma en vez de tirar de `PortfolioContent.items`.
   * Sirve de ejemplo de cómo se añade una obra sin tocar los archivos de
   * contenido, que es para lo que se hizo así.
   *
   * Y es también el primer par con dos proporciones distintas: el «antes» es
   * vertical (3∶4) y el «después» apaisado (4∶3), porque en obra se fotografía
   * lo que cabe, no lo que cuadra. Las dimensiones de abajo son las reales del
   * archivo y no un redondeo: de ellas sale el reparto de columnas que hace que
   * las dos salgan enteras y al mismo alto, tanto aquí como en la portada.
   */
  {
    id: 'porch-addition',
    category: 'framing',
    location: 'New Jersey',
    before: { src: '/images/porch-addition-before.webp', width: 1200, height: 1600 },
    after: { src: '/images/porch-addition-after.webp', width: 1600, height: 1200 },
    featured: true,
  },
  /*
   * Cubierta de un garaje exento, con sus buhardillas.
   *
   * `featured: false` y no es un descuido: la portada enseña UNA obra, y esa
   * plaza la ocupa el porche de arriba. Esta se ve en la galería completa, que
   * es donde vive el catálogo entero.
   *
   * Las dos fotos son 4∶3, así que el reparto de columnas de la ficha les da
   * mitad y mitad. No hace falta hacer nada para eso: sale de las dimensiones.
   */
  {
    id: 'garage-roof',
    category: 'roofing',
    location: 'New Jersey',
    before: { src: '/images/garage-roof-before.webp', width: 1600, height: 1200 },
    after: { src: '/images/garage-roof-after.webp', width: 1600, height: 1200 },
    featured: false,
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
