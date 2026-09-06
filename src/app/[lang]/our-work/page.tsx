import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GalleryPage, metadatosGaleria } from '@/components/sections/GalleryPage';
import type { Lang } from '@/types';

/**
 * Galería completa, versión inglesa: `/en/our-work`.
 *
 * El español no vive aquí sino en `app/[lang]/nuestros-trabajos`, porque el
 * segmento de la URL se traduce. La URL es texto visible —se lee en la barra,
 * se copia en un mensaje, aparece en los resultados de búsqueda— y un sitio
 * que se presenta en español con una dirección en inglés se lee como una
 * traducción a medias.
 *
 * Dos carpetas hermanas en lugar de una regla de reescritura en
 * `next.config.ts`: así la correspondencia entre URL y archivo sigue siendo la
 * que se ve en `app/`, que es donde alguien la va a buscar.
 *
 * Todo el marcado está en `components/sections/GalleryPage`. Aquí sólo queda la
 * guarda de idioma.
 */

/** Único idioma que esta ruta sirve. El resto devuelve 404. */
const IDIOMA: Lang = 'en';

/**
 * Restringe el prerenderizado a `/en/our-work`.
 *
 * Sin esto se hereda el `generateStaticParams` del layout, que devuelve los dos
 * idiomas, y el build gastaba una página entera en `/es/our-work` para acabar
 * llamando a `notFound()`. Nadie la veía nunca —la redirección permanente de
 * `next.config.ts` intercepta esa URL antes—, así que era trabajo de build sin
 * destinatario.
 *
 * Declarándolo aquí, el segmento genera la única combinación que sirve. La
 * guarda de `notFound()` de abajo se queda igualmente: cubre el caso de que
 * alguien alcance la ruta sin pasar por la redirección.
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
 * Metadatos de la galería en inglés.
 *
 * @param params Parámetros de ruta con el idioma.
 * @returns Metadatos del documento, o vacío si el idioma no es el de esta ruta.
 */
export async function generateMetadata({ params }: GaleriaProps): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== IDIOMA) return {};

  return metadatosGaleria(IDIOMA);
}

export default async function GaleriaEn({ params }: GaleriaProps) {
  const { lang } = await params;

  // `dynamicParams = false` del layout ya limita `lang` a 'en' | 'es'; esto
  // descarta además la combinación válida pero equivocada, `/es/our-work`.
  if (lang !== IDIOMA) notFound();

  return <GalleryPage lang={IDIOMA} />;
}
