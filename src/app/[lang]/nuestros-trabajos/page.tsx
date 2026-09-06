import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GalleryPage, metadatosGaleria } from '@/components/sections/GalleryPage';
import type { Lang } from '@/types';

/**
 * Galería completa, versión española: `/es/nuestros-trabajos`.
 *
 * Gemela de `app/[lang]/our-work/page.tsx`, que sirve el inglés. Las dos
 * delegan en el mismo componente, así que lo único duplicado es esta guarda de
 * seis líneas; el marcado existe una sola vez.
 *
 * El nombre de esta carpeta tiene que coincidir con `routeSlugs.ourWork.es` de
 * `data/routes.ts`. Es la única atadura del sistema que el compilador no puede
 * verificar —el enrutador de Next.js se configura con el sistema de archivos,
 * no con tipos—, así que renombrar una cosa obliga a renombrar la otra en el
 * mismo commit.
 */

/** Único idioma que esta ruta sirve. El resto devuelve 404. */
const IDIOMA: Lang = 'es';

/**
 * Restringe el prerenderizado a `/es/nuestros-trabajos`.
 *
 * Gemelo del de `our-work`; el porqué está allí. En resumen: sin él se hereda
 * el del layout, que devuelve los dos idiomas, y el build fabricaba una página
 * `/en/nuestros-trabajos` que la redirección permanente nunca deja alcanzar.
 *
 * @returns La única combinación de parámetros que esta ruta prerenderiza.
 */
export function generateStaticParams() {
  return [{ lang: IDIOMA }];
}

interface GaleriaProps {
  readonly params: Promise<{ lang: string }>;
}

/**
 * Metadatos de la galería en español.
 *
 * @param params Parámetros de ruta con el idioma.
 * @returns Metadatos del documento, o vacío si el idioma no es el de esta ruta.
 */
export async function generateMetadata({ params }: GaleriaProps): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== IDIOMA) return {};

  return metadatosGaleria(IDIOMA);
}

export default async function GaleriaEs({ params }: GaleriaProps) {
  const { lang } = await params;

  // Descarta `/en/nuestros-trabajos`, que el layout considera una ruta válida
  // porque su idioma lo es, pero cuyo slug no corresponde a ese idioma.
  if (lang !== IDIOMA) notFound();

  return <GalleryPage lang={IDIOMA} />;
}
