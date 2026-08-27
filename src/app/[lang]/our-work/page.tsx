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
 * que se ve en `app/`, que es donde alguien la va a buscar. El coste es que el
 * build genera también `/es/our-work` y devuelve 404, lo cual es correcto —esa
 * URL no existe en español— y además queda cubierto por la redirección
 * permanente de `next.config.ts`, que la manda al slug español.
 *
 * Todo el marcado está en `components/sections/GalleryPage`. Aquí sólo queda la
 * guarda de idioma.
 */

/** Único idioma que esta ruta sirve. El resto devuelve 404. */
const IDIOMA: Lang = 'en';

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
