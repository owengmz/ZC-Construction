'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { contentByLang } from '@/data/content';
import type { Lang, LangContextValue, LangCookieName } from '@/types';

/**
 * Contexto de idioma: pone `lang` y su contenido a disposición de todo el árbol.
 *
 * Con el idioma en la ruta, este proveedor ya NO descubre el idioma: lo recibe
 * resuelto desde el servidor, que lo lee del segmento `[lang]`. Eso elimina el
 * parpadeo de la versión anterior —que arrancaba en inglés y corregía en un
 * efecto— porque el HTML sale del servidor ya en el idioma correcto.
 *
 * Sustituye a `legacy/assets/js/lang-toggle.js`, que duplicaba cada texto en el
 * HTML dentro de `.lang-en` / `.lang-es` y ocultaba uno por CSS. Aquí sólo
 * existe en el DOM el idioma activo.
 */

/**
 * Cookie donde se recuerda el idioma para poder redirigir `/` en visitas
 * posteriores. La escribe este proveedor y la lee el middleware.
 */
const NOMBRE_COOKIE: LangCookieName = 'zc-lang';

/** Un año en segundos: la preferencia de idioma no caduca en una sesión. */
const CADUCIDAD_COOKIE_SEGUNDOS = 60 * 60 * 24 * 365;

/**
 * El valor por defecto es `null` y no un objeto de relleno a propósito: así
 * `useLang()` distingue "no hay proveedor por encima" de "hay proveedor", y
 * avisa con un error claro en vez de renderizar contenido sin explicación.
 */
const LangContext = createContext<LangContextValue | null>(null);

interface LangProviderProps {
  /** Idioma resuelto en el servidor a partir del segmento de ruta `[lang]`. */
  readonly lang: Lang;
  readonly children: ReactNode;
}

/**
 * Proveedor de idioma. Lo monta el layout de `[lang]`, una vez por ruta.
 *
 * @param lang Idioma de la ruta actual.
 * @param children Árbol que consumirá el idioma.
 */
export function LangProvider({ lang, children }: LangProviderProps) {
  /**
   * Deja constancia del idioma que se está viendo.
   *
   * No cambia nada de esta página: sirve para la siguiente visita a `/`, donde
   * el middleware lee esta cookie para redirigir sin preguntar. Se escribe en
   * un efecto porque `document.cookie` no existe durante el render de servidor.
   *
   * `SameSite=Lax` basta: la cookie sólo se consulta en navegación de primer
   * nivel dentro del propio sitio, nunca en peticiones de terceros.
   */
  useEffect(() => {
    document.cookie = `${NOMBRE_COOKIE}=${lang}; path=/; max-age=${CADUCIDAD_COOKIE_SEGUNDOS}; SameSite=Lax`;
  }, [lang]);

  /**
   * El valor se memoiza porque un objeto literal nuevo en cada render
   * obligaría a re-renderizar a todos los consumidores aunque el idioma no
   * hubiera cambiado.
   */
  const valor = useMemo<LangContextValue>(
    () => ({ lang, content: contentByLang[lang] }),
    [lang],
  );

  return <LangContext.Provider value={valor}>{children}</LangContext.Provider>;
}

/**
 * Acceso al idioma activo y a su contenido ya resuelto.
 *
 * @returns Idioma actual y contenido correspondiente.
 * @throws Si se llama fuera de `<LangProvider>`.
 */
export function useLang(): LangContextValue {
  const contexto = useContext(LangContext);

  if (contexto === null) {
    throw new Error(
      'useLang() debe usarse dentro de <LangProvider>. Comprueba que el proveedor envuelve el árbol en app/[lang]/layout.tsx.',
    );
  }

  return contexto;
}
