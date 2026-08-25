import type { SectionId } from '@/types';

/**
 * Orden de los enlaces de navegación, tanto en la barra de escritorio como en
 * el menú móvil.
 *
 * Es un array explícito y no `Object.keys(content.nav.links)` porque el orden
 * de las claves de un objeto no es un contrato del que fiarse para decidir qué
 * se ve primero en pantalla. El `Record<SectionId, string>` del contenido
 * garantiza que todas tengan etiqueta; este array decide en qué orden salen.
 *
 * Como `SectionId` coincide con el `id` del elemento en el DOM, el destino de
 * cada enlace se construye como `#${id}` sin poder escribir un ancla que no
 * exista.
 */
export const ORDEN_SECCIONES: readonly SectionId[] = [
  'hero',
  'services',
  'portfolio',
  'insurance',
  'contact',
];
