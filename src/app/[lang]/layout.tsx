import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { LangProvider } from '@/context/LangContext';
import { contentByLang } from '@/data/content';
import { esLang, IDIOMAS } from '@/data/langs';
import { siteConfig } from '@/data/site';

import '../globals.css';

/**
 * Layout raíz de cada idioma.
 *
 * Es el layout raíz de verdad —el que renderiza `<html>` y `<body>`— y no
 * `app/layout.tsx`, que ya no existe. El motivo es que el atributo `lang` del
 * `<html>` tiene que salir correcto del servidor, y sólo se conoce dentro del
 * segmento `[lang]`. Con un layout por encima, `<html lang>` estaría fijado
 * antes de saber en qué idioma se va a renderizar la página.
 *
 * Quien entra por `/` no llega aquí directamente: lo redirige `middleware.ts`.
 */

interface LangLayoutProps {
  readonly children: ReactNode;
  /**
   * En Next.js 15 los parámetros de ruta llegan como promesa, de ahí el `await`
   * en los componentes de abajo.
   *
   * Se tipa como `string` y no como `Lang` a propósito: el enrutador entrega
   * literalmente lo que hay en la URL, y eso puede ser `/fr` o `/../algo`.
   * Prometer `Lang` aquí sería mentirle al compilador; el estrechamiento se
   * hace con la guarda `esLang`.
   */
  readonly params: Promise<{ lang: string }>;
}

/**
 * Declara las rutas a prerenderizar en el build: `/en` y `/es`.
 *
 * Junto con `dynamicParams = false`, hace que ambas salgan como HTML estático
 * y que cualquier otro idioma devuelva 404 en lugar de intentar renderizarse.
 */
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

/**
 * Metadatos por idioma.
 *
 * Es la pieza de la Metadata API que el enrutado por idioma obliga a adelantar:
 * las etiquetas `canonical` y `hreflang` sólo tienen sentido cuando cada idioma
 * vive en su propia URL. El resto de metadatos (iconos, manifiesto, verificación)
 * queda para la Etapa 3.
 *
 * @param params Parámetros de ruta con el idioma.
 * @returns Metadatos del documento en el idioma correspondiente.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!esLang(lang)) return {};

  const { meta } = contentByLang[lang];

  return {
    metadataBase: new URL(siteConfig.url),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      /**
       * `hreflang` para que los buscadores sepan que ambas URLs son la misma
       * página en dos idiomas, y no contenido duplicado. `x-default` marca a
       * dónde mandar a quien no encaje en ninguno de los dos.
       */
      languages: {
        'en-US': '/en',
        'es-US': '/es',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `/${lang}`,
      locale: meta.ogLocale,
      siteName: siteConfig.legalName,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  // Red de seguridad además de `dynamicParams = false`, y a la vez lo que
  // convierte `string` en `Lang` para el resto de la función.
  if (!esLang(lang)) notFound();

  return (
    <html lang={lang}>
      <body>
        <LangProvider lang={lang}>{children}</LangProvider>
      </body>
    </html>
  );
}
