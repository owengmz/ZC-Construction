import type { Project, ProjectId } from '@/types';

/**
 * Datos estructurales de la galería antes/después de "Nuestros Trabajos".
 *
 * El emparejamiento de fotos reproduce exactamente el del sitio actual. Los
 * nombres de archivo cambiaron al migrarlos a `public/images/` (se eliminaron
 * los espacios, que obligaban a codificar la URL), pero el contenido es el
 * mismo byte a byte:
 *
 *   framing.webp                    -> framing.webp
 *   techado.webp                    -> roofing-finished.webp
 *   roofing.webp                    -> roofing.webp
 *   roofing01.webp                  -> roofing-after.webp
 *   remodelacion interior.webp      -> renovation-interior-before.webp
 *   remodelacion despues.webp       -> renovation-interior-after.webp
 *
 * El orden del array define el orden del lightbox: al aplanarlo en pares
 * (antes, después) se obtienen los índices 0..5 que el sitio actual fija a
 * mano con el atributo `data-index` en el HTML.
 */
export const projects = [
  {
    id: 'framing-newark',
    before: { src: '/images/framing.webp', width: 1200, height: 1600 },
    after: { src: '/images/roofing-finished.webp', width: 1200, height: 1600 },
  },
  {
    id: 'roofing-trenton',
    before: { src: '/images/roofing.webp', width: 1200, height: 1600 },
    after: { src: '/images/roofing-after.webp', width: 1200, height: 1600 },
  },
  {
    id: 'renovation-jersey-city',
    before: { src: '/images/renovation-interior-before.webp', width: 1200, height: 1600 },
    after: { src: '/images/renovation-interior-after.webp', width: 1200, height: 1600 },
  },
] as const satisfies readonly Project[];

/**
 * Misma comprobación de cobertura que en `services.ts`: si se añade un
 * `ProjectId` y se olvida la entrada correspondiente aquí, el proyecto tendría
 * textos traducidos pero ninguna tarjeta que los muestre, y esta línea deja
 * de compilar.
 */
type ProyectosPresentes = (typeof projects)[number]['id'];
type AfirmarCobertura<T extends true> = T;
export type _CoberturaProyectos = AfirmarCobertura<
  [Exclude<ProjectId, ProyectosPresentes>] extends [never] ? true : false
>;
