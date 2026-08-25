import type { Service, ServiceId } from '@/types';

/**
 * Datos estructurales de los tres servicios principales.
 *
 * Aquí no hay ni un solo texto visible: títulos y descripciones viven en
 * `content.en.ts` / `content.es.ts`, indexados por el mismo `id` que se usa
 * abajo. Este archivo sólo responde a "qué imagen, qué marcador y qué ancho
 * ocupa cada tarjeta".
 *
 * El orden del array es el orden de renderizado, y coincide con el del grid
 * asimétrico del sitio actual: Estructuras (8 columnas) y Remodelación (4)
 * comparten la primera fila; Techado ocupa las 12 de la segunda.
 */
export const services = [
  {
    id: 'framing',
    marker: '01',
    image: { src: '/images/framing.webp', width: 1200, height: 1600 },
    layout: 'wide',
  },
  {
    id: 'renovation',
    marker: '02',
    // Única foto del sitio con proporción distinta (9:16 en vez de 3:4);
    // se conserva tal cual porque el recorte lo resuelve el CSS con object-fit.
    image: { src: '/images/renovation.webp', width: 900, height: 1600 },
    layout: 'narrow',
  },
  {
    id: 'roofing',
    marker: '03',
    image: { src: '/images/roofing.webp', width: 1200, height: 1600 },
    layout: 'full',
  },
] as const satisfies readonly Service[];

/**
 * Comprobación en tiempo de compilación de que el array cubre TODOS los
 * servicios declarados en `ServiceId`.
 *
 * Es el complemento estructural de la garantía que dan los `Record<ServiceId,
 * …>` del contenido: aquellos aseguran que cada servicio tenga textos en los
 * dos idiomas, y esta comprobación asegura que además exista la tarjeta.
 * Sin ella se podría traducir un servicio que nunca se renderiza.
 *
 * Funciona gracias a `as const satisfies`: `satisfies` valida cada objeto
 * contra `Service` sin ensanchar los tipos, así que `[number]['id']` conserva
 * los literales realmente presentes en lugar de degradarse a `ServiceId`.
 * Los corchetes de `[Exclude<…>] extends [never]` evitan que el condicional
 * se distribuya sobre la unión.
 */
type ServiciosPresentes = (typeof services)[number]['id'];
type AfirmarCobertura<T extends true> = T;
export type _CoberturaServicios = AfirmarCobertura<
  [Exclude<ServiceId, ServiciosPresentes>] extends [never] ? true : false
>;
