import type { Metadata } from 'next';

import { contentByLang } from '@/data/content';
import { rutaDePagina } from '@/data/routes';
import type { Lang } from '@/types';

import { GalleryGrid } from './GalleryGrid';
import styles from './GalleryPage.module.css';

/**
 * Galería completa de trabajos.
 *
 * Vive en un componente y no directamente en un `page.tsx` porque la página
 * existe DOS veces —`app/[lang]/our-work` y `app/[lang]/nuestros-trabajos`, una
 * por idioma, ya que el segmento de la URL se traduce—. Cada carpeta aporta
 * sólo su guarda de idioma y sus metadatos; el marcado está aquí una única vez.
 *
 * Es componente de servidor. El único trozo que baja al navegador es
 * `GalleryGrid`, que necesita estado para el filtro; la cabecera se renderiza
 * en el servidor y no cuesta un byte de JavaScript.
 *
 * No lleva el panel de vídeo de la portada, y es deliberado: esa pieza es el
 * gancho del teaser y pierde su carácter si se repite en la página a la que el
 * teaser lleva.
 */

interface GalleryPageProps {
  /** Idioma ya validado por la página que monta este componente. */
  readonly lang: Lang;
}

/**
 * Metadatos de la galería, comunes a las dos rutas.
 *
 * Se exportan desde aquí y no se escriben en cada `page.tsx` para que el
 * `hreflang` no pueda quedar descuadrado: ambas páginas declaran exactamente el
 * mismo par de alternativas, cada una calculada con `rutaDePagina`.
 *
 * A diferencia del esqueleto anterior, ya no lleva `robots: noindex`. Aquel
 * `noindex` estaba puesto porque la página prometía una galería y entregaba una
 * lista; ahora cumple lo que promete y puede indexarse.
 *
 * @param lang Idioma de la página.
 * @returns Metadatos del documento.
 */
export function metadatosGaleria(lang: Lang): Metadata {
  const { gallery, meta } = contentByLang[lang];
  const ruta = rutaDePagina('ourWork', lang);

  return {
    title: gallery.meta.title,
    description: gallery.meta.description,
    alternates: {
      canonical: ruta,
      /**
       * Cada idioma apunta al slug REAL del otro. Es el motivo por el que
       * `routeSlugs` existe: escrito a mano, un `/es/our-work` en esta lista
       * mandaría a los buscadores a una redirección en lugar de a la página.
       */
      languages: {
        'en-US': rutaDePagina('ourWork', 'en'),
        'es-US': rutaDePagina('ourWork', 'es'),
        'x-default': rutaDePagina('ourWork', 'en'),
      },
    },
    openGraph: {
      type: 'website',
      title: gallery.meta.title,
      description: gallery.meta.description,
      url: ruta,
      locale: meta.ogLocale,
      alternateLocale: lang === 'en' ? 'es_US' : 'en_US',
    },
  };
}

/**
 * Cabecera de la galería y su rejilla filtrable.
 *
 * @param lang Idioma de la página.
 * @returns La página completa, sin la envoltura de barra y pie, que aporta el
 *          layout de idioma.
 */
export function GalleryPage({ lang }: GalleryPageProps) {
  const content = contentByLang[lang];

  return (
    <main className={styles.pagina}>
      <header className={styles.cabecera}>
        {/*
         * El rótulo superior es un marcador de expediente, así que va en
         * monoespaciada y en ember, igual que los "01/02/03" de las fichas de
         * servicio. No es un subtítulo: no describe la página, la cataloga.
         */}
        <p className={styles.eyebrow}>{content.gallery.eyebrow}</p>

        {/*
         * Título e introducción se reutilizan de la sección de portada en vez
         * de escribir copia nueva. Es la misma promesa dicha en el mismo sitio
         * del documento; duplicarla en otras palabras sólo daría dos textos que
         * mantener sincronizados a mano.
         */}
        <h1 className={styles.titulo}>{content.portfolio.sectionTitle}</h1>
        <div className={styles.filete} />
        <p className={styles.intro}>{content.portfolio.intro}</p>
      </header>

      <GalleryGrid />
    </main>
  );
}
