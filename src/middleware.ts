import { NextResponse, type NextRequest } from 'next/server';

import { esLang, IDIOMA_POR_DEFECTO } from '@/data/langs';
import type { Lang, LangCookieName } from '@/types';

/**
 * Redirección de la raíz al idioma que corresponda.
 *
 * Con el idioma en la ruta, `/` deja de ser una página: es una bifurcación
 * hacia `/en` o `/es`. Esa decisión tiene que tomarse en el servidor, antes de
 * enviar HTML, porque es la única forma de que el visitante no vea primero un
 * idioma y después otro.
 *
 * Sólo `/` pasa por aquí (ver `config.matcher` al final). `/en` y `/es` se
 * sirven como HTML estático prerenderizado, sin ejecutar nada.
 */

const NOMBRE_COOKIE: LangCookieName = 'zc-lang';

/**
 * Deduce el idioma de la cabecera `Accept-Language`.
 *
 * Los navegadores envían las preferencias ya ordenadas por prioridad, así que
 * basta recorrerlas y quedarse con la primera que sepamos servir. Se compara
 * sólo la subetiqueta primaria: `es-419`, `es-MX` y `es` son todos español a
 * efectos de este sitio.
 *
 * @param cabecera Valor bruto de `Accept-Language`, o `null` si no viene.
 * @returns El idioma detectado, o `null` si ninguno coincide.
 */
function idiomaDeCabecera(cabecera: string | null): Lang | null {
  if (cabecera === null) return null;

  for (const parte of cabecera.split(',')) {
    // Cada parte es del tipo "es-MX;q=0.8": se descarta el factor q y la región
    const etiqueta = parte.split(';')[0]?.trim().toLowerCase() ?? '';
    const primaria = etiqueta.split('-')[0] ?? '';
    if (esLang(primaria)) return primaria;
  }

  return null;
}

/**
 * Resuelve a qué idioma mandar a quien entra por `/`.
 *
 * Orden de preferencia: lo que el visitante eligió explícitamente en una
 * visita anterior (cookie), después lo que declara su navegador, y por último
 * el idioma por defecto del sitio.
 *
 * @param request Petición entrante.
 * @returns Idioma de destino.
 */
function resolverIdioma(request: NextRequest): Lang {
  const cookie = request.cookies.get(NOMBRE_COOKIE)?.value;
  if (esLang(cookie)) return cookie;

  return idiomaDeCabecera(request.headers.get('accept-language')) ?? IDIOMA_POR_DEFECTO;
}

export function middleware(request: NextRequest) {
  const destino = request.nextUrl.clone();
  destino.pathname = `/${resolverIdioma(request)}`;

  // Redirección temporal (307) y no permanente: el destino depende de la
  // preferencia de cada visitante, así que no debe quedar cacheada en el
  // navegador ni en intermediarios como si fuera una regla fija del sitio.
  return NextResponse.redirect(destino, 307);
}

export const config = {
  /** Sólo la raíz exacta. El resto de rutas no ejecuta middleware. */
  matcher: '/',
};
